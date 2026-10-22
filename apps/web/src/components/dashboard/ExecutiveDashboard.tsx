import React from 'react';
import { formatAOA } from '@sigea/shared';
import { MOCK_CLIENTS } from '../../data/mockData';
import { useCases } from '../../context/CasesContext';
import {
  Briefcase,
  Clock,
  Users,
  BadgeDollarSign,
  ArrowUpRight,
  AlertTriangle,
  Calendar,
  Building,
  FileCheck2,
  TrendingUp
} from 'lucide-react';

interface ExecutiveDashboardProps {
  onSelectCase: (caseId: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  onSelectCase,
  onNavigateTab
}) => {
  const { cases, deadlines, fees } = useCases();
  const [timeFilter, setTimeFilter] = React.useState<'TODAY' | 'NEXT_7_DAYS' | 'NEXT_30_DAYS'>('NEXT_7_DAYS');

  const totalBilled = fees.reduce((acc, f) => acc + f.paidAmountAoa, 0);
  const totalPending = fees.reduce((acc, f) => acc + f.balanceAoa, 0);

  const urgentDeadline = deadlines.find(d => d.daysRemaining !== undefined && d.daysRemaining <= 2);

  const filteredDeadlines = deadlines.filter((d) => {
    const days = d.daysRemaining ?? 99;
    if (timeFilter === 'TODAY') return days === 0;
    if (timeFilter === 'NEXT_7_DAYS') return days <= 7;
    return days <= 30;
  });

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Painel Executivo</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              Escritório Operacional
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Gestão integrada de contencioso, prazos processuais e faturação em Angola.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('cases')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" />
            <span>Novo Processo</span>
          </button>
          <button
            onClick={() => onNavigateTab('deadlines')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-all flex items-center gap-2"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Registar Prazo</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Processos */}
        <div 
          onClick={() => onNavigateTab('cases')}
          className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-blue-500/50 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Processos Ativos</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{cases.length}</div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+2 novos este mês em Luanda</span>
          </div>
        </div>

        {/* Card 2: Prazos Críticos */}
        <div 
          onClick={() => onNavigateTab('deadlines')}
          className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-amber-500/50 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Prazos na Semana</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">
            {deadlines.filter(d => (d.daysRemaining || 0) <= 7).length}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>1 prazo peremptório em 48h</span>
          </div>
        </div>

        {/* Card 3: Clientes */}
        <div 
          onClick={() => onNavigateTab('clients')}
          className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-indigo-500/50 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Clientes & Empresas</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{MOCK_CLIENTS.length}</div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
            <Building className="w-3.5 h-3.5 text-indigo-400" />
            <span>3 Pessoas Coletivas • 1 Singular</span>
          </div>
        </div>

        {/* Card 4: Faturação AOA */}
        <div 
          onClick={() => onNavigateTab('finance')}
          className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-emerald-500/50 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Faturação Liquidada</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <BadgeDollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400 truncate">
            {formatAOA(totalBilled)}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
            <span>Pendente a receber: </span>
            <span className="font-semibold text-amber-400">{formatAOA(totalPending)}</span>
          </div>
        </div>
      </div>

      {/* Main Section: Visão Temporal & Dossier de Destaque */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Agenda de Prazos com Abas Temporais */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>Visão Temporal dos Prazos Judiciais</span>
              </h2>
              <p className="text-xs text-slate-400">Controlo de caducidade e prescrições</p>
            </div>

            {/* Filter buttons: Hoje, 7 dias, 30 dias */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-700/70 text-xs">
              <button
                onClick={() => setTimeFilter('TODAY')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  timeFilter === 'TODAY'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Hoje
              </button>
              <button
                onClick={() => setTimeFilter('NEXT_7_DAYS')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  timeFilter === 'NEXT_7_DAYS'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Próximos 7 Dias
              </button>
              <button
                onClick={() => setTimeFilter('NEXT_30_DAYS')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  timeFilter === 'NEXT_30_DAYS'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Próximos 30 Dias
              </button>
            </div>
          </div>

          {/* List of deadlines filtered */}
          <div className="space-y-3">
            {filteredDeadlines.length === 0 ? (
              <div className="p-8 rounded-xl bg-slate-800/40 text-center text-xs text-slate-400">
                Sem prazos processuais para o período temporal selecionado.
              </div>
            ) : (
              filteredDeadlines.map((dl) => (
                <div
                  key={dl.id}
                  onClick={() => onSelectCase(dl.caseId)}
                  className="p-4 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700/70 hover:border-slate-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        {dl.caseNumber}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {dl.assignedLawyerName}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {dl.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1">{dl.description}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-slate-200">{dl.dueDate}</div>
                      <div className="text-[11px] text-slate-400">{dl.dueTime}</div>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      (dl.daysRemaining || 0) <= 2
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {dl.daysRemaining === 0 ? 'Hoje' : `${dl.daysRemaining} dias`}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Processo em Destaque & Feed Recente */}
        <div className="space-y-6">
          {/* Urgent Deadline Card */}
          {urgentDeadline && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-800/80 to-slate-800/90 border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Alerta Peremptório
                </span>
                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                  {urgentDeadline.daysRemaining} dias restantes
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">{urgentDeadline.title}</h3>
              <p className="text-xs text-slate-300">
                Processo nº <strong className="text-white">{urgentDeadline.caseNumber}</strong> sob responsabilidade de {urgentDeadline.assignedLawyerName}.
              </p>
              <button
                onClick={() => onSelectCase(urgentDeadline.caseId)}
                className="w-full mt-2 py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <span>Aceder ao Dossier do Processo</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Activity Feed */}
          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>Atividade Recente</span>
            </h2>

            <div className="space-y-3.5 text-xs">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <div>
                  <p className="text-slate-200 font-medium">Pagamento de Honorários Confirmado</p>
                  <p className="text-slate-400 text-[11px]">Kwanza Investimentos liquidou 12.500.000,00 Kz (Recibo nº REC-2026/0042).</p>
                  <span className="text-[10px] text-slate-500">Há 2 horas</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                <div>
                  <p className="text-slate-200 font-medium">Minuta de Perícia Concluída</p>
                  <p className="text-slate-400 text-[11px]">Estagiário Nzinga Luvumbo submeteu rascunho para revisão do Dr. Rui Falcão.</p>
                  <span className="text-[10px] text-slate-500">Hoje às 09:30</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                <div>
                  <p className="text-slate-200 font-medium">Novo Processo Distribuído</p>
                  <p className="text-slate-400 text-[11px]">Processo 0078/25-FAM distribuído à Sala de Família do Tribunal de Belas.</p>
                  <span className="text-[10px] text-slate-500">Ontem às 16:15</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
