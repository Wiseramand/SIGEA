import React, { useState, useMemo } from 'react';
import {
  formatAOA,
  CaseStatus,
  DeadlinePriority,
  FeePaymentStatus
} from '@sigea/shared';
import { useCases } from '../../context/CasesContext';
import { MOCK_USERS, MOCK_TASKS } from '../../data/mockData';
import {
  Sparkles,
  Clock,
  Briefcase,
  BadgeDollarSign,
  Search,
  ArrowUpRight,
  ShieldAlert,
  Activity,
  Layers,
  CheckCircle2,
  TrendingUp,
  Scale,
  RefreshCw
} from 'lucide-react';

interface SigeaIntelligenceProps {
  onSelectCase: (caseId: string) => void;
  onNavigateTab: (tab: any) => void;
}

type TimeHorizon = 'ALL' | 'TODAY' | 'NEXT_7_DAYS' | 'NEXT_30_DAYS';
type AlertSeverity = 'ALL' | 'CRITICAL' | 'WARNING' | 'INFO';

interface SmartAlert {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  category: 'PRAZO' | 'COBRANCA' | 'INATIVIDADE' | 'TAREFA' | 'DOCUMENTO';
  title: string;
  reason: string;
  caseId?: string;
  caseNumber?: string;
  clientName?: string;
  lawyerName?: string;
  dueDate?: string;
  daysRemaining?: number;
  amountAoa?: number;
  badgeText: string;
}

interface SmartRecommendation {
  id: string;
  title: string;
  impactLevel: 'ALTO' | 'MEDIO' | 'ESTRATEGICO';
  category: 'PRAZO' | 'FINANCEIRO' | 'OPERACIONAL' | 'EQUIPA';
  reason: string;
  actionText: string;
  caseId?: string;
  targetTab?: string;
}

export const SigeaIntelligence: React.FC<SigeaIntelligenceProps> = ({
  onSelectCase,
  onNavigateTab
}) => {
  const { cases, deadlines, fees, activities, showToast } = useCases();

  // Filters State
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>('ALL');
  const [selectedLawyerId, setSelectedLawyerId] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. Executive KPIs Calculations
  const activeCases = useMemo(() => {
    return cases.filter(c => c.status !== CaseStatus.CLOSED && c.status !== CaseStatus.ARCHIVED);
  }, [cases]);

  const criticalDeadlinesCount = useMemo(() => {
    return deadlines.filter(d => (d.daysRemaining !== undefined && d.daysRemaining <= 3) || d.priority === DeadlinePriority.CRITICAL).length;
  }, [deadlines]);

  const pendingFeesTotal = useMemo(() => {
    return fees.reduce((acc, f) => acc + (f.balanceAoa || (f.status === FeePaymentStatus.PENDING ? f.amountAoa : 0)), 0);
  }, [fees]);

  const totalBilled = useMemo(() => {
    return fees.reduce((acc, f) => acc + f.amountAoa, 0);
  }, [fees]);

  const totalPaid = useMemo(() => {
    return fees.reduce((acc, f) => acc + (f.paidAmountAoa || 0), 0);
  }, [fees]);

  // Stale cases: cases without activity in > 15 days or distribution older with few activities
  const staleCases = useMemo(() => {
    return cases.filter(c => {
      const caseActs = activities.filter(a => a.caseId === c.id);
      if (caseActs.length === 0) return true;
      return c.status === CaseStatus.ENFORCEMENT || caseActs.length < 2;
    });
  }, [cases, activities]);

  // Tasks overdue or imminent
  const pendingTasks = useMemo(() => {
    return MOCK_TASKS.filter(t => t.status !== 'COMPLETED');
  }, []);

  // 2. Dynamic Smart Alerts Engine
  const allAlerts: SmartAlert[] = useMemo(() => {
    const list: SmartAlert[] = [];

    // Alerts from Critical Deadlines
    deadlines.forEach(dl => {
      const remaining = dl.daysRemaining ?? 99;
      if (remaining <= 3 || dl.priority === DeadlinePriority.CRITICAL) {
        list.push({
          id: `alert-dl-${dl.id}`,
          severity: remaining <= 2 ? 'CRITICAL' : 'WARNING',
          category: 'PRAZO',
          title: `Prazo Peremptório: ${dl.title}`,
          reason: `Vencimento iminente no tribunal (${remaining === 0 ? 'Hoje' : remaining + ' dias restantes'}). Risco de caducidade processual.`,
          caseId: dl.caseId,
          caseNumber: dl.caseNumber,
          lawyerName: dl.assignedLawyerName,
          dueDate: dl.dueDate,
          daysRemaining: remaining,
          badgeText: remaining === 0 ? 'Expira Hoje' : `${remaining}d restantes`
        });
      } else if (remaining <= 7) {
        list.push({
          id: `alert-dl-${dl.id}`,
          severity: 'WARNING',
          category: 'PRAZO',
          title: `Preparação de Peça: ${dl.title}`,
          reason: `Prazo ordinário nos próximos 7 dias. Necessário rever rol probatório ou alegações.`,
          caseId: dl.caseId,
          caseNumber: dl.caseNumber,
          lawyerName: dl.assignedLawyerName,
          dueDate: dl.dueDate,
          daysRemaining: remaining,
          badgeText: `${remaining}d restantes`
        });
      }
    });

    // Alerts from Unpaid Fees / Partial Balances
    fees.forEach(fee => {
      const bal = fee.balanceAoa || 0;
      if (bal > 0) {
        list.push({
          id: `alert-fee-${fee.id}`,
          severity: fee.status === FeePaymentStatus.PARTIALLY_PAID ? 'WARNING' : 'INFO',
          category: 'COBRANCA',
          title: `Saldo Pendente: ${fee.title}`,
          reason: `Fatura pendente de liquidação no valor de ${formatAOA(bal)}. Vencimento previsto: ${fee.dueDate}.`,
          caseId: fee.caseId,
          caseNumber: fee.caseNumber,
          clientName: fee.clientName,
          amountAoa: bal,
          dueDate: fee.dueDate,
          badgeText: formatAOA(bal)
        });
      }
    });

    // Alerts from Stale Cases
    staleCases.forEach(c => {
      list.push({
        id: `alert-stale-${c.id}`,
        severity: 'WARNING',
        category: 'INATIVIDADE',
        title: `Processo sem Andamento Recente: ${c.caseNumber}`,
        reason: `Processo pendente perante ${c.courtName} sem despachos ou diligências registradas no último ciclo.`,
        caseId: c.id,
        caseNumber: c.caseNumber,
        clientName: c.clientName,
        lawyerName: c.responsibleLawyerName,
        badgeText: 'Sem Movimentação'
      });
    });

    // Alerts from Tasks
    pendingTasks.forEach(t => {
      list.push({
        id: `alert-task-${t.id}`,
        severity: t.priority === 'URGENT' ? 'CRITICAL' : 'INFO',
        category: 'TAREFA',
        title: `Diligência Interna: ${t.title}`,
        reason: `Tarefa atribuída a ${t.assignedToName} com prazo limite a ${t.dueDate}.`,
        caseId: t.caseId,
        lawyerName: t.assignedToName,
        dueDate: t.dueDate,
        badgeText: t.priority
      });
    });

    return list;
  }, [deadlines, fees, staleCases, pendingTasks]);

  // Filtered Alerts
  const filteredAlerts = useMemo(() => {
    return allAlerts.filter(alert => {
      // Filter by Severity
      if (selectedSeverity !== 'ALL' && alert.severity !== selectedSeverity) {
        return false;
      }

      // Filter by Lawyer
      if (selectedLawyerId !== 'ALL') {
        const lawyer = MOCK_USERS.find(u => u.id === selectedLawyerId);
        if (lawyer && alert.lawyerName && !alert.lawyerName.includes(lawyer.name)) {
          return false;
        }
      }

      // Filter by Time Horizon
      if (timeHorizon === 'TODAY' && alert.daysRemaining !== undefined && alert.daysRemaining > 0) {
        return false;
      }
      if (timeHorizon === 'NEXT_7_DAYS' && alert.daysRemaining !== undefined && alert.daysRemaining > 7) {
        return false;
      }
      if (timeHorizon === 'NEXT_30_DAYS' && alert.daysRemaining !== undefined && alert.daysRemaining > 30) {
        return false;
      }

      // Filter by Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = alert.title.toLowerCase().includes(query);
        const matchReason = alert.reason.toLowerCase().includes(query);
        const matchCase = alert.caseNumber?.toLowerCase().includes(query);
        const matchClient = alert.clientName?.toLowerCase().includes(query);
        if (!matchTitle && !matchReason && !matchCase && !matchClient) {
          return false;
        }
      }

      return true;
    });
  }, [allAlerts, selectedSeverity, selectedLawyerId, timeHorizon, searchQuery]);

  // 3. Operational Recommendations
  const recommendations: SmartRecommendation[] = useMemo(() => {
    const list: SmartRecommendation[] = [];

    // Recommendation 1: Critical deadline
    const urgentDl = deadlines.find(d => (d.daysRemaining || 99) <= 2);
    if (urgentDl) {
      list.push({
        id: 'rec-1',
        title: 'Rever Rol Testemunhal e Quesitos no Tribunal de Luanda',
        impactLevel: 'ALTO',
        category: 'PRAZO',
        reason: `O processo ${urgentDl.caseNumber} tem prazo peremptório de ${urgentDl.daysRemaining === 0 ? 'hoje' : urgentDl.daysRemaining + ' dias'} na 2ª Secção do Cível. A preclusão pode prejudicar a instrução da causa.`,
        actionText: 'Abrir Dossier do Processo',
        caseId: urgentDl.caseId
      });
    }

    // Recommendation 2: Outstanding Fee follow-up
    const partiallyPaidFee = fees.find(f => (f.balanceAoa || 0) > 0);
    if (partiallyPaidFee) {
      list.push({
        id: 'rec-2',
        title: `Emitir Lembrete de Cobrança ao Cliente ${partiallyPaidFee.clientName}`,
        impactLevel: 'MEDIO',
        category: 'FINANCEIRO',
        reason: `Identificado saldo em aberto de ${formatAOA(partiallyPaidFee.balanceAoa || 0)} referente à 2ª tranche com vencimento a ${partiallyPaidFee.dueDate}. Sugerida notificação amigável de cobrança bancária.`,
        actionText: 'Verificar Financeiro & Fatura',
        caseId: partiallyPaidFee.caseId,
        targetTab: 'finance'
      });
    }

    // Recommendation 3: Stale execution in Benguela
    const staleCase = cases.find(c => c.status === CaseStatus.ENFORCEMENT);
    if (staleCase) {
      list.push({
        id: 'rec-3',
        title: `Impulsionar Penhora de Saldos na Comarca de Benguela`,
        impactLevel: 'ALTO',
        category: 'OPERACIONAL',
        reason: `A Ação Executiva ${staleCase.caseNumber} requer verificação de ofícios judiciais junto do BNA e bancos comerciais para evitar a dissipação de bens pelos devedores.`,
        actionText: 'Aceder ao Dossier de Execução',
        caseId: staleCase.id
      });
    }

    // Recommendation 4: Workload balancing
    list.push({
      id: 'rec-4',
      title: 'Equilíbrio da Distribuição Forense entre Sócios e Advogados',
      impactLevel: 'ESTRATEGICO',
      category: 'EQUIPA',
      reason: 'Dr. Rui Falcão de Carvalho lidera 50% dos processos de alta complexidade. Sugere-se a integração de estagiários OAA para suporte na elaboração de minutas interlocutórias.',
      actionText: 'Gerir Estagiários OAA',
      targetTab: 'interns'
    });

    return list;
  }, [deadlines, fees, cases]);

  // 4. Performance Distributions
  const casesByStatus = useMemo(() => {
    const counts: Record<string, number> = {};
    cases.forEach(c => {
      counts[c.status] = (counts[c.status] || 0) + 1;
    });
    return [
      { status: 'Fase Inicial / Distribuído', count: (counts[CaseStatus.DISTRIBUTED] || 0) + (counts[CaseStatus.INITIAL_PHASE] || 0), color: 'bg-blue-500' },
      { status: 'Instrução Contraditória', count: counts[CaseStatus.INSTRUCTION] || 0, color: 'bg-indigo-500' },
      { status: 'Audiência de Julgamento', count: counts[CaseStatus.HEARING] || 0, color: 'bg-amber-500' },
      { status: 'Execução de Julgado / Penhora', count: counts[CaseStatus.ENFORCEMENT] || 0, color: 'bg-emerald-500' }
    ];
  }, [cases]);

  // Workload per lawyer
  const lawyerWorkloads = useMemo(() => {
    return MOCK_USERS.filter(u => u.role === 'PARTNER' || u.role === 'LAWYER').map(u => {
      const assigned = cases.filter(c => c.responsibleLawyerId === u.id || c.responsibleLawyerName?.includes(u.name));
      const managedValue = assigned.reduce((sum, c) => sum + c.claimValueAoa, 0);
      return {
        id: u.id,
        name: u.name,
        oaaNumber: u.oaaNumber,
        department: u.department,
        caseCount: assigned.length,
        managedValueAoa: managedValue,
        capacityPercent: Math.min(100, Math.round((assigned.length / 5) * 100))
      };
    });
  }, [cases]);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-violet-500 text-white shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  SIGEA Intelligence
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Centro Executivo de Inteligência Jurídica
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Análise preditiva de risco forense, monitorização de prazos e recomendações operacionais para escritórios de advocacia em Angola.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              showToast('Indicadores de inteligência recalculados com sucesso.', 'info');
            }}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700/80 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Atualizar Indicadores</span>
          </button>
          <button
            onClick={() => onNavigateTab('dashboard')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Painel Executivo</span>
          </button>
        </div>
      </div>

      {/* A. Indicadores Executivos (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* KPI 1 */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Processos Ativos</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">{activeCases.length}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">100%</span>
            <span>sob patrocínio judicial</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 hover:border-red-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Prazos Críticos</span>
            <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-red-400">{criticalDeadlinesCount}</div>
          <div className="text-[11px] text-red-300 mt-1">
            Vencem em &le; 3 dias úteis
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Tarefas Pendentes</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-300">{pendingTasks.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Diligências forenses ativas
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Sem Atividade</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-indigo-300">{staleCases.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Exigem despacho na secretaria
          </div>
        </div>

        {/* KPI 5 */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 hover:border-emerald-500/40 transition-all col-span-1 sm:col-span-2 xl:col-span-2">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Honorários Pendentes</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <BadgeDollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {formatAOA(pendingFeesTotal)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Faturado: {formatAOA(totalBilled)}</span>
            <span className="text-emerald-400 font-semibold">Liquidado: {formatAOA(totalPaid)}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: D. Recomendações Operacionais & C. Desempenho Forense */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recomendações e Desempenho */}
        <div className="lg:col-span-2 space-y-8">
          {/* D. Recomendações Operacionais da IA */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/30 via-slate-850 to-slate-800/90 border border-indigo-500/30 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Recomendações Operacionais Inteligentes</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sugestões proativas geradas com base nas condições do portfólio contencioso
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {recommendations.length} Atos Sugeridos
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map(rec => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-indigo-400/50 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        rec.impactLevel === 'ALTO'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : rec.impactLevel === 'ESTRATEGICO'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        Impacto {rec.impactLevel}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {rec.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {rec.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {rec.reason}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (rec.caseId) {
                        onSelectCase(rec.caseId);
                      } else if (rec.targetTab) {
                        onNavigateTab(rec.targetTab);
                      }
                    }}
                    className="w-full py-2 px-3 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border border-slate-700/80"
                  >
                    <span>{rec.actionText}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* C. Indicadores de Desempenho e Distribuição */}
          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-400" />
                  <span>Pipeline Contencioso & Capacidade Forense</span>
                </h2>
                <p className="text-xs text-slate-400">Distribuição processual por estado da causa e alocação de equipa</p>
              </div>
            </div>

            {/* Pipeline progress bars */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Distribuição por Fase Processual
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {casesByStatus.map((item, idx) => {
                  const percent = Math.round((item.count / (cases.length || 1)) * 100);
                  return (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">{item.status}</span>
                        <span className="font-mono font-bold text-white">{item.count} ({percent}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-500`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Workload by Lawyer */}
            <div className="space-y-3 pt-3 border-t border-slate-700/60">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Carga de Trabalho & Valor Gerido por Advogado
              </span>
              <div className="space-y-3">
                {lawyerWorkloads.map(lw => (
                  <div key={lw.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 font-bold flex items-center justify-center border border-blue-500/20">
                          {lw.name.charAt(4) || lw.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{lw.name}</div>
                          <div className="text-[11px] text-slate-400">{lw.oaaNumber} &bull; {lw.department}</div>
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-4">
                        <div>
                          <span className="text-[11px] text-slate-400 block">Processos Atribuídos</span>
                          <span className="font-bold text-white">{lw.caseCount} causas</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-400 block">Valor sob Patrocínio</span>
                          <span className="font-mono font-bold text-emerald-400">{formatAOA(lw.managedValueAoa)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        style={{ width: `${lw.capacityPercent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: B. Centro de Alertas Inteligentes com Filtros */}
        <div className="space-y-5">
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Centro de Alertas Críticos</span>
                </h2>
                <p className="text-xs text-slate-400">Rastreio em tempo real de não conformidades</p>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                {filteredAlerts.length} ativos
              </span>
            </div>

            {/* Filters */}
            <div className="space-y-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquisar alerta, processo ou cliente..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Time Horizon Filter */}
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  onClick={() => setTimeHorizon('ALL')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    timeHorizon === 'ALL'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white bg-slate-800'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setTimeHorizon('TODAY')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    timeHorizon === 'TODAY'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white bg-slate-800'
                  }`}
                >
                  Hoje
                </button>
                <button
                  onClick={() => setTimeHorizon('NEXT_7_DAYS')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    timeHorizon === 'NEXT_7_DAYS'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white bg-slate-800'
                  }`}
                >
                  7 Dias
                </button>
                <button
                  onClick={() => setTimeHorizon('NEXT_30_DAYS')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    timeHorizon === 'NEXT_30_DAYS'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white bg-slate-800'
                  }`}
                >
                  30 Dias
                </button>
              </div>

              {/* Severity & Lawyer Filters */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value as AlertSeverity)}
                  className="bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="ALL">Todas Prioridades</option>
                  <option value="CRITICAL">Apenas Críticos</option>
                  <option value="WARNING">Avisos</option>
                  <option value="INFO">Informativos</option>
                </select>

                <select
                  value={selectedLawyerId}
                  onChange={(e) => setSelectedLawyerId(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="ALL">Todos os Advogados</option>
                  {MOCK_USERS.filter(u => u.role === 'PARTNER' || u.role === 'LAWYER').map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Alerts List */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {filteredAlerts.length === 0 ? (
                <div className="p-8 rounded-xl bg-slate-900/60 text-center text-xs text-slate-400 border border-slate-800 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="font-semibold text-slate-300">Nenhum alerta crítico para os filtros selecionados.</p>
                  <p className="text-[11px]">Todos os processos e diligências encontram-se dentro dos prazos regulamentares.</p>
                </div>
              ) : (
                filteredAlerts.map(alert => (
                  <div
                    key={alert.id}
                    onClick={() => {
                      if (alert.caseId) onSelectCase(alert.caseId);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer group space-y-2 ${
                      alert.severity === 'CRITICAL'
                        ? 'bg-red-950/25 border-red-500/40 hover:border-red-400'
                        : alert.severity === 'WARNING'
                        ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                        : 'bg-slate-900/90 border-slate-700 hover:border-blue-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          alert.severity === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : alert.severity === 'WARNING'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        }`}>
                          {alert.category}
                        </span>
                        {alert.caseNumber && (
                          <span className="text-xs font-mono font-bold text-blue-400">
                            {alert.caseNumber}
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] font-mono font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                        {alert.badgeText}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {alert.title}
                    </h4>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {alert.reason}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-[11px] border-t border-slate-800/80 text-slate-400">
                      <span>{alert.lawyerName || alert.clientName || 'Gabinete Forense'}</span>
                      <span className="text-blue-400 group-hover:underline flex items-center gap-1 font-medium">
                        <span>Ver Dossier</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
