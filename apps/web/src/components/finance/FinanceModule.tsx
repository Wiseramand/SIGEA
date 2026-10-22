import React, { useState, useMemo } from 'react';
import {
  formatAOA,
  FeePaymentStatus,
  FeeItem
} from '@sigea/shared';
import { useCases } from '../../context/CasesContext';
import { MOCK_USERS, MOCK_CLIENTS, MOCK_CASE_METRICS } from '../../data/mockData';
import { AddExpenseModal } from './AddExpenseModal';
import { AddFeeModal } from './AddFeeModal';
import { InvoiceReceiptModal } from './InvoiceReceiptModal';
import { AddPaymentModal } from '../cases/AddPaymentModal';
import {
  BadgeDollarSign,
  Plus,
  Receipt,
  FileText,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Briefcase,
  AlertTriangle,
  Printer,
  CheckCircle2
} from 'lucide-react';

interface FinanceModuleProps {
  onSelectCase?: (caseId: string) => void;
}

type TabType = 'PROFITABILITY' | 'FEES' | 'EXPENSES';
type PeriodFilter = 'ALL' | 'MONTH' | 'QUARTER' | 'YEAR';

export const FinanceModule: React.FC<FinanceModuleProps> = ({ onSelectCase }) => {
  const { cases, fees, expenses, markExpenseReimbursed } = useCases();

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('PROFITABILITY');

  // Filters State
  const [period, setPeriod] = useState<PeriodFilter>('ALL');
  const [selectedClientId, setSelectedClientId] = useState<string>('ALL');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('ALL');
  const [selectedLawyerId, setSelectedLawyerId] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddFeeOpen, setIsAddFeeOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedFeeForInvoice, setSelectedFeeForInvoice] = useState<FeeItem | null>(null);
  const [selectedFeeForPayment, setSelectedFeeForPayment] = useState<FeeItem | null>(null);

  // 1. Filtered Fees
  const filteredFees = useMemo(() => {
    return fees.filter((f) => {
      if (selectedClientId !== 'ALL' && f.clientId !== selectedClientId) return false;
      if (selectedCaseId !== 'ALL' && f.caseId !== selectedCaseId) return false;
      if (selectedStatus !== 'ALL' && f.status !== selectedStatus) return false;

      if (selectedLawyerId !== 'ALL') {
        const associatedCase = cases.find((c) => c.id === f.caseId);
        if (associatedCase && associatedCase.responsibleLawyerId !== selectedLawyerId) {
          return false;
        }
      }

      if (period === 'MONTH' && !f.dueDate.startsWith('2026-10')) return false;
      if (period === 'QUARTER' && !f.dueDate.startsWith('2026-10') && !f.dueDate.startsWith('2026-11') && !f.dueDate.startsWith('2026-12')) return false;
      if (period === 'YEAR' && !f.dueDate.startsWith('2026')) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = f.title.toLowerCase().includes(q);
        const matchClient = f.clientName.toLowerCase().includes(q);
        const matchCase = f.caseNumber?.toLowerCase().includes(q);
        if (!matchTitle && !matchClient && !matchCase) return false;
      }

      return true;
    });
  }, [fees, cases, selectedClientId, selectedCaseId, selectedStatus, selectedLawyerId, period, searchQuery]);

  // 2. Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (selectedCaseId !== 'ALL' && e.caseId !== selectedCaseId) return false;
      if (selectedClientId !== 'ALL') {
        const associatedCase = cases.find((c) => c.id === e.caseId);
        if (associatedCase && associatedCase.clientId !== selectedClientId) return false;
      }
      if (selectedLawyerId !== 'ALL') {
        const associatedCase = cases.find((c) => c.id === e.caseId);
        if (associatedCase && associatedCase.responsibleLawyerId !== selectedLawyerId) return false;
      }

      if (period === 'MONTH' && !e.date.startsWith('2026-10')) return false;
      if (period === 'QUARTER' && !e.date.startsWith('2026-10') && !e.date.startsWith('2026-11') && !e.date.startsWith('2026-12')) return false;
      if (period === 'YEAR' && !e.date.startsWith('2026')) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchDesc = e.description.toLowerCase().includes(q);
        const matchCase = e.caseNumber.toLowerCase().includes(q);
        if (!matchDesc && !matchCase) return false;
      }
      return true;
    });
  }, [expenses, cases, selectedCaseId, selectedClientId, selectedLawyerId, period, searchQuery]);

  // 3. Consolidated Totals
  const totalAgreed = useMemo(() => filteredFees.reduce((sum, f) => sum + f.amountAoa, 0), [filteredFees]);
  const totalPaid = useMemo(() => filteredFees.reduce((sum, f) => sum + f.paidAmountAoa, 0), [filteredFees]);
  const totalPending = useMemo(() => filteredFees.reduce((sum, f) => sum + f.balanceAoa, 0), [filteredFees]);
  
  const totalExpenses = useMemo(() => filteredExpenses.reduce((sum, e) => sum + e.amountAoa, 0), [filteredExpenses]);
  const reimbursableExpenses = useMemo(() => filteredExpenses.filter(e => e.isReimbursable).reduce((sum, e) => sum + e.amountAoa, 0), [filteredExpenses]);
  const firmExpenses = useMemo(() => filteredExpenses.filter(e => !e.isReimbursable).reduce((sum, e) => sum + e.amountAoa, 0), [filteredExpenses]);

  // Estimated Operational Profit (Liquidado - Despesas Operacionais do Escritório)
  const estimatedProfitAoa = totalPaid - firmExpenses;
  const collectionRate = totalAgreed > 0 ? Math.round((totalPaid / totalAgreed) * 100) : 0;

  // Total Hours
  const totalHoursWorked = useMemo(() => {
    return cases.reduce((acc, c) => {
      const metric = MOCK_CASE_METRICS[c.id];
      return acc + (metric?.hoursWorked || 0);
    }, 0);
  }, [cases]);

  // 4. Per Case Profitability Matrix
  const caseProfitabilityList = useMemo(() => {
    return cases.map((c) => {
      const caseFeesList = fees.filter((f) => f.caseId === c.id);
      const caseExpensesList = expenses.filter((e) => e.caseId === c.id);

      const feeAgreed = caseFeesList.reduce((sum, f) => sum + f.amountAoa, 0);
      const feePaid = caseFeesList.reduce((sum, f) => sum + f.paidAmountAoa, 0);
      const feePending = caseFeesList.reduce((sum, f) => sum + f.balanceAoa, 0);
      
      const expTotal = caseExpensesList.reduce((sum, e) => sum + e.amountAoa, 0);
      const expFirm = caseExpensesList.filter(e => !e.isReimbursable).reduce((sum, e) => sum + e.amountAoa, 0);

      const metric = MOCK_CASE_METRICS[c.id] || {
        hoursWorked: 20,
        hourlyRateAoa: 60000,
        contractModel: 'Honorário Convencional',
        expenseBudgetAoa: 500000
      };

      const estimatedCaseProfit = feePaid - expFirm;
      const isOverBudget = expTotal > metric.expenseBudgetAoa;

      return {
        caseId: c.id,
        caseNumber: c.caseNumber,
        subject: c.subject,
        clientName: c.clientName,
        courtName: c.courtName,
        responsibleLawyerName: c.responsibleLawyerName,
        contractModel: metric.contractModel,
        hoursWorked: metric.hoursWorked,
        feeAgreed,
        feePaid,
        feePending,
        expTotal,
        expenseBudget: metric.expenseBudgetAoa,
        isOverBudget,
        estimatedCaseProfit
      };
    });
  }, [cases, fees, expenses]);

  // Open Invoice Preview Modal
  const handleOpenInvoicePreview = (fee?: FeeItem) => {
    setSelectedFeeForInvoice(fee || null);
    setIsInvoiceModalOpen(true);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/20">
              <BadgeDollarSign className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  Rentabilidade & Gestão Financeira Forense
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Moeda: Kwanza (AOA)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Controlo executivo de avenças, cobranças por hora, quota litis, preparos judiciais e rentabilidade por processo em Angola.
              </p>
            </div>
          </div>
        </div>

        {/* Global Financial Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => handleOpenInvoicePreview()}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700/80 transition-all flex items-center gap-2 shadow"
          >
            <Printer className="w-3.5 h-3.5 text-blue-400" />
            <span>Extrato / Recibo Demonstrativo</span>
          </button>

          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-amber-600 text-slate-200 hover:text-white text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-2 shadow"
          >
            <Receipt className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Lançar Despesa</span>
          </button>

          <button
            onClick={() => setIsAddFeeOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Lançar Honorário</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('PROFITABILITY')}
          className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'PROFITABILITY'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Painel de Rentabilidade & Análise Comercial</span>
        </button>

        <button
          onClick={() => setActiveTab('FEES')}
          className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'FEES'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BadgeDollarSign className="w-4 h-4" />
          <span>Honorários & Cobranças ({fees.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('EXPENSES')}
          className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'EXPENSES'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Despesas Forenses & Preparos ({expenses.length})</span>
        </button>
      </div>

      {/* Universal Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-850/90 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span>Filtros Dinâmicos de Análise</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-500 mr-1">Período:</span>
            <button
              onClick={() => setPeriod('ALL')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                period === 'ALL' ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setPeriod('MONTH')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                period === 'MONTH' ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Este Mês
            </button>
            <button
              onClick={() => setPeriod('QUARTER')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                period === 'QUARTER' ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Trimestre
            </button>
            <button
              onClick={() => setPeriod('YEAR')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                period === 'YEAR' ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Ano 2026
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Search */}
          <div className="relative lg:col-span-1">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar por título, cliente ou processo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Cliente */}
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Todos os Clientes</option>
            {MOCK_CLIENTS.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Processo */}
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Todos os Processos</option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>{c.caseNumber} — {c.clientName.slice(0, 20)}</option>
            ))}
          </select>

          {/* Advogado */}
          <select
            value={selectedLawyerId}
            onChange={(e) => setSelectedLawyerId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Todos os Advogados</option>
            {MOCK_USERS.filter(u => u.role === 'PARTNER' || u.role === 'LAWYER').map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>

          {/* Estado de Pagamento */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Todos os Estados</option>
            <option value={FeePaymentStatus.PAID}>Liquidado Integralmente</option>
            <option value={FeePaymentStatus.PARTIALLY_PAID}>Parcialmente Pago</option>
            <option value={FeePaymentStatus.PENDING}>Pendente de Liquidação</option>
          </select>
        </div>
      </div>

      {/* KPI Cards: 6 Executive Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* KPI 1: Honorários Contratados */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Honorários Acordados
          </span>
          <div className="text-xl font-bold text-white truncate">{formatAOA(totalAgreed)}</div>
          <span className="text-[11px] text-slate-400 block">Total contratual acordado</span>
        </div>

        {/* KPI 2: Total Liquidado */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
            Total Recebido
          </span>
          <div className="text-xl font-bold text-emerald-400 truncate">{formatAOA(totalPaid)}</div>
          <span className="text-[11px] text-slate-400 block">Entrado nas contas da banca</span>
        </div>

        {/* KPI 3: Saldo por Cobrar */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
          <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
            Saldo por Cobrar
          </span>
          <div className="text-xl font-bold text-amber-400 truncate">{formatAOA(totalPending)}</div>
          <span className="text-[11px] text-slate-400 block">Vencimentos e quota litis</span>
        </div>

        {/* KPI 4: Despesas Registadas */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
          <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block">
            Despesas Forenses
          </span>
          <div className="text-xl font-bold text-rose-300 truncate">{formatAOA(totalExpenses)}</div>
          <span className="text-[11px] text-slate-400 block">Reembolsáveis: {formatAOA(reimbursableExpenses)}</span>
        </div>

        {/* KPI 5: Resultado Operacional */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
          <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block">
            Resultado Estimado
          </span>
          <div className="text-xl font-bold text-blue-300 truncate">{formatAOA(estimatedProfitAoa)}</div>
          <span className="text-[11px] text-slate-400 block">Recebido menos custos diretos</span>
        </div>

        {/* KPI 6: Taxa de Cobrança & Horas */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
          <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider block">
            Taxa de Cobrança
          </span>
          <div className="text-xl font-bold text-purple-300 flex items-center gap-1.5">
            <span>{collectionRate}%</span>
            <span className="text-xs font-normal text-slate-400">({totalHoursWorked}h)</span>
          </div>
          <span className="text-[11px] text-slate-400 block">Índice de liquidação efetiva</span>
        </div>
      </div>

      {/* TAB 1: PAINEL DE RENTABILIDADE E ANÁLISE COMERCIAL */}
      {activeTab === 'PROFITABILITY' && (
        <div className="space-y-8">
          {/* Comparison charts and distributions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart: Facturação vs Recebimentos por Processo */}
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/70 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Comparativo: Contratado vs. Liquidado por Processo</span>
                  </h3>
                  <p className="text-xs text-slate-400">Volume em Kwanzas (AOA) de honorários e cobranças realizadas</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {caseProfitabilityList.map((item) => {
                  const percentPaid = item.feeAgreed > 0 ? Math.round((item.feePaid / item.feeAgreed) * 100) : 0;
                  return (
                    <div key={item.caseId} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-blue-400">{item.caseNumber} — {item.clientName}</span>
                        <span className="font-mono text-slate-300 font-semibold">{formatAOA(item.feePaid)} / {formatAOA(item.feeAgreed)} ({percentPaid}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentPaid}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Distribution of Outstanding Balances by Client */}
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/70 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Concentração de Saldos Pendentes por Cliente</span>
                  </h3>
                  <p className="text-xs text-slate-400">Mapeamento de valores a receber com risco de atraso</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {MOCK_CLIENTS.map((client) => {
                  const clientPending = fees
                    .filter(f => f.clientId === client.id)
                    .reduce((sum, f) => sum + f.balanceAoa, 0);

                  const clientAgreed = fees
                    .filter(f => f.clientId === client.id)
                    .reduce((sum, f) => sum + f.amountAoa, 0);

                  if (clientAgreed === 0) return null;
                  const percentPending = clientAgreed > 0 ? Math.round((clientPending / clientAgreed) * 100) : 0;

                  return (
                    <div key={client.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">{client.name}</span>
                        <span className="font-mono font-bold text-amber-400">{formatAOA(clientPending)}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentPending}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Comprehensive Profitability Table by Case */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-400" />
                  <span>Matriz de Rentabilidade Forense por Processo</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Cruzamento de honorários contratados, faturação, horas despendidas e despesas por causa
                </p>
              </div>
            </div>

            <div className="border border-slate-700/80 rounded-2xl bg-slate-850 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 border-b border-slate-750 text-slate-400">
                    <tr>
                      <th className="p-4">Processo & Cliente</th>
                      <th className="p-4">Responsável & Modelo</th>
                      <th className="p-4 text-right">Contratado (AOA)</th>
                      <th className="p-4 text-right">Recebido (AOA)</th>
                      <th className="p-4 text-right">Saldo Pendente</th>
                      <th className="p-4 text-right">Despesas (AOA)</th>
                      <th className="p-4 text-center">Horas</th>
                      <th className="p-4 text-right">Margem Estimada</th>
                      <th className="p-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {caseProfitabilityList.map((item) => (
                      <tr key={item.caseId} className="hover:bg-slate-800/70 transition-colors">
                        <td className="p-4">
                          <div className="font-mono font-bold text-blue-400">{item.caseNumber}</div>
                          <div className="text-white font-medium line-clamp-1">{item.clientName}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{item.courtName}</div>
                        </td>

                        <td className="p-4">
                          <div className="text-white font-semibold">{item.responsibleLawyerName}</div>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-700 text-slate-300 inline-block mt-0.5">
                            {item.contractModel}
                          </span>
                        </td>

                        <td className="p-4 text-right font-mono font-bold text-white">
                          {formatAOA(item.feeAgreed)}
                        </td>

                        <td className="p-4 text-right font-mono text-emerald-400 font-semibold">
                          {formatAOA(item.feePaid)}
                        </td>

                        <td className="p-4 text-right font-mono text-amber-400 font-semibold">
                          {formatAOA(item.feePending)}
                        </td>

                        <td className="p-4 text-right font-mono text-rose-300">
                          <div>{formatAOA(item.expTotal)}</div>
                          {item.isOverBudget && (
                            <span className="text-[10px] text-red-400 font-bold block">
                              Excede Orçamento
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-center font-mono text-slate-300">
                          {item.hoursWorked}h
                        </td>

                        <td className="p-4 text-right font-mono font-bold text-emerald-300">
                          {formatAOA(item.estimatedCaseProfit)}
                        </td>

                        <td className="p-4 text-center">
                          <button
                            onClick={() => {
                              if (onSelectCase) onSelectCase(item.caseId);
                            }}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1 border border-slate-700"
                            title="Abrir Dossier Judicial 360°"
                          >
                            <span>Dossier</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HONORÁRIOS & FATURAÇÃO */}
      {activeTab === 'FEES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Lançamentos de Honorários & Faturas Emitidas</h3>
            <span className="text-xs text-slate-400">{filteredFees.length} registos localizados</span>
          </div>

          <div className="divide-y divide-slate-800 rounded-2xl bg-slate-850 border border-slate-700/70 overflow-hidden shadow">
            {filteredFees.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Nenhum lançamento de honorário encontrado para os filtros selecionados.
              </div>
            ) : (
              filteredFees.map((fee) => (
                <div key={fee.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/80 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        {fee.caseNumber}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                        {fee.feeType}
                      </span>
                      {fee.receiptNumber && (
                        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {fee.receiptNumber}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-medium">Vencimento: {fee.dueDate}</span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{fee.title}</h3>
                    <p className="text-xs text-slate-400">Cliente: <strong className="text-slate-300">{fee.clientName}</strong></p>
                    {fee.notes && <p className="text-xs text-slate-400 italic mt-0.5">{fee.notes}</p>}
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-700/40 shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-xs text-slate-400">Montante Faturado</span>
                      <div className="text-base font-bold text-white font-mono">{formatAOA(fee.amountAoa)}</div>
                      <div className={`text-xs font-semibold mt-0.5 ${
                        fee.status === 'PAID' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {fee.status === 'PAID' ? 'Liquidado Integralmente' : `Saldo Pendente: ${formatAOA(fee.balanceAoa)}`}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {fee.balanceAoa > 0 && (
                        <button
                          onClick={() => {
                            setSelectedFeeForPayment(fee);
                            setIsAddPaymentOpen(true);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shadow"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Liquidar</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenInvoicePreview(fee)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all border border-slate-700"
                        title="Ver Fatura / Recibo"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span>Recibo</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: DESPESAS PROCESSUAIS & PREPAROS */}
      {activeTab === 'EXPENSES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Despesas Judiciais, Preparos e Custas Forenses</h3>
              <p className="text-xs text-slate-400">Controlo de adiantamentos do escritório e reembolsos de clientes</p>
            </div>
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Despesa</span>
            </button>
          </div>

          <div className="border border-slate-700/80 rounded-2xl bg-slate-850 overflow-hidden shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 border-b border-slate-750 text-slate-400">
                  <tr>
                    <th className="p-4">Processo</th>
                    <th className="p-4">Descrição da Despesa</th>
                    <th className="p-4">Data</th>
                    <th className="p-4 text-right">Montante (AOA)</th>
                    <th className="p-4 text-center">Tipo de Custo</th>
                    <th className="p-4 text-center">Estado Reembolso</th>
                    <th className="p-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        Nenhuma despesa processual encontrada para os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-800/70 transition-colors">
                        <td className="p-4 font-mono font-bold text-blue-400">
                          {exp.caseNumber}
                        </td>

                        <td className="p-4 text-white font-medium max-w-sm">
                          {exp.description}
                        </td>

                        <td className="p-4 text-slate-400 font-mono">
                          {exp.date}
                        </td>

                        <td className="p-4 text-right font-mono font-bold text-emerald-400">
                          {formatAOA(exp.amountAoa)}
                        </td>

                        <td className="p-4 text-center">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            exp.isReimbursable
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          }`}>
                            {exp.isReimbursable ? 'Reembolsável' : 'Operacional Escritório'}
                          </span>
                        </td>

                        <td className="p-4 text-center">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            exp.isReimbursed
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {exp.isReimbursed ? 'Reembolsada' : 'Pendente de Reembolso'}
                          </span>
                        </td>

                        <td className="p-4 text-center">
                          {exp.isReimbursable && !exp.isReimbursed ? (
                            <button
                              onClick={() => markExpenseReimbursed(exp.id)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1 border border-slate-700"
                              title="Marcar como Reembolsada"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Reembolsar</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-500 font-mono">&mdash;</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
      />

      <AddFeeModal
        isOpen={isAddFeeOpen}
        onClose={() => setIsAddFeeOpen(false)}
      />

      <InvoiceReceiptModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        feeItem={selectedFeeForInvoice}
        caseFees={filteredFees}
        caseExpenses={filteredExpenses}
      />

      {isAddPaymentOpen && (
        <AddPaymentModal
          isOpen={isAddPaymentOpen}
          onClose={() => {
            setIsAddPaymentOpen(false);
            setSelectedFeeForPayment(null);
          }}
          caseFees={selectedFeeForPayment ? [selectedFeeForPayment] : fees.filter(f => f.balanceAoa > 0)}
          caseNumber={selectedFeeForPayment?.caseNumber || '0284/24-C'}
        />
      )}
    </div>
  );
};
