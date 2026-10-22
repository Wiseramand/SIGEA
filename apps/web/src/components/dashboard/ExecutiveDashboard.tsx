import React from 'react';
import { formatAOA, UserRole } from '@sigea/shared';
import { MOCK_CLIENTS } from '../../data/mockData';
import { useCases } from '../../context/CasesContext';
import { canViewFees, canViewIntelligence } from '../../utils/permissions';
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
  TrendingUp,
  Sparkles,
  Bot,
  CheckSquare,
  CheckCircle2
} from 'lucide-react';

interface ExecutiveDashboardProps {
  currentRole: UserRole;
  onSelectCase: (caseId: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  currentRole,
  onSelectCase,
  onNavigateTab
}) => {
  const { cases, deadlines, fees } = useCases();
  const [timeFilter, setTimeFilter] = React.useState<'TODAY' | 'NEXT_7_DAYS' | 'NEXT_30_DAYS'>('NEXT_7_DAYS');

  const showFinancials = canViewFees(currentRole);
  const showIntelligence = canViewIntelligence(currentRole);

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
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {currentRole === UserRole.INTERN
                ? 'Painel de Acompanhamento do Estagiário'
                : currentRole === UserRole.LAWYER
                ? 'Painel Operacional do Mandatário'
                : 'Painel Executivo da Sociedade'}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              {currentRole === UserRole.INTERN ? 'Estágio OAA' : 'Escritório Operacional'}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            {showFinancials
              ? 'Gestão integrada de contencioso, prazos processuais e faturação em Angola.'
              : 'Gestão contenciosa de processos, minutas e prazos perentórios.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {showIntelligence ? (
            <button
              onClick={() => onNavigateTab('intelligence')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold rounded-lg border border-slate-700 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>SIGEA Intelligence</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigateTab('legal-ai')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold rounded-lg border border-slate-700 transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>Assistente Legal AI</span>
            </button>
          )}

          <button
            onClick={() => onNavigateTab('cases')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" />
            <span>Ver Processos</span>
          </button>
          <button
            onClick={() => onNavigateTab('deadlines')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-all flex items-center gap-2"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Prazos Judiciais</span>
          </button>
        </div>
      </div>

      {/* Banner Superior Contextual por Perfil */}
      {showIntelligence ? (
        <div 
          onClick={() => onNavigateTab('intelligence')}
          className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950/60 border border-slate-700/80 hover:border-blue-500/50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-sm"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-blue-950 text-blue-400 border border-blue-800/60 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                  Centro Executivo de Inteligência Jurídica & Alertas Proativos
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-blue-950 text-blue-300 border border-blue-800/60 font-mono">
                  Sócios & Gestão
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                1 prazo perentório crítico em 48h, {fees.filter(f => (f.balanceAoa || 0) > 0).length} cobranças pendentes e recomendações de balanceamento processual.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 group-hover:text-white shrink-0">
            <span>Abrir Centro de Inteligência</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      ) : (
        <div 
          onClick={() => onNavigateTab('legal-ai')}
          className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-sm"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800/60 group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  SIGEA Legal AI — Assistente de Apoio Jurídico
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                  Prática Forense
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Preparação e estruturação de rascunhos para contestação, recursos e sumários de audiência para validação do patrono titular.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 group-hover:text-white shrink-0">
            <span>Abrir Assistente</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      )}

      {/* Metric Cards Grid com Adaptação RBAC */}
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
            <span>1 prazo perentório em 48h</span>
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

        {/* Card 4: Faturação AOA (SÓCIOS E FINANCEIRO) vs Minhas Tarefas (ESTAGIÁRIOS E ADVOGADOS) */}
        {showFinancials ? (
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
            <div className="text-2xl font-bold text-emerald-400 truncate font-mono">
              {formatAOA(totalBilled)}
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
              <span>Pendente a receber: </span>
              <span className="font-semibold text-amber-400 font-mono">{formatAOA(totalPending)}</span>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => onNavigateTab('tasks')}
            className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-blue-500/50 transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Minhas Tarefas & Diligências</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                <CheckSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white font-mono">
              4
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Diligências e minutas para revisão</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Deadlines + Quick Actions / Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Timeline / Upcoming Deadlines */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span>Visão Temporal dos Prazos Judiciais</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Controlo de caducidade e prescrições
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center bg-slate-850 p-1 rounded-xl border border-slate-700/80 text-xs font-medium">
              <button
                onClick={() => setTimeFilter('TODAY')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeFilter === 'TODAY'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Hoje
              </button>
              <button
                onClick={() => setTimeFilter('NEXT_7_DAYS')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeFilter === 'NEXT_7_DAYS'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Próximos 7 Dias
              </button>
              <button
                onClick={() => setTimeFilter('NEXT_30_DAYS')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeFilter === 'NEXT_30_DAYS'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Próximos 30 Dias
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredDeadlines.map((deadline) => {
              const isUrgent = (deadline.daysRemaining || 0) <= 2;
              return (
                <div
                  key={deadline.id}
                  onClick={() => onSelectCase(deadline.caseId)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 group ${
                    isUrgent
                      ? 'bg-slate-900/90 border-amber-500/40 hover:border-amber-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {deadline.caseNumber}
                      </span>
                      <span className="text-xs text-slate-400">• {deadline.assignedLawyerName || 'Dr. Rui Falcão'}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {deadline.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {deadline.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono text-slate-300">
                      {new Date(deadline.dueDate).toLocaleDateString('pt-AO')}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {deadline.dueTime}
                    </div>
                    <span className={`inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isUrgent
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {deadline.daysRemaining} dias
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Urgent Alert + Activity Feed */}
        <div className="space-y-6">
          {urgentDeadline && (
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Alerta Perentório
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                  {urgentDeadline.daysRemaining} dias restantes
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">
                {urgentDeadline.title}
              </h4>
              <p className="text-xs text-slate-300">
                Processo nº <strong className="text-amber-300 font-mono">{urgentDeadline.caseNumber}</strong> sob responsabilidade de {urgentDeadline.assignedLawyerName || 'Dr. Rui Falcão'}.
              </p>
              <button
                onClick={() => onSelectCase(urgentDeadline.caseId)}
                className="w-full mt-2 py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl text-xs font-semibold transition-all border border-amber-500/40"
              >
                Aceder ao Dossier do Processo ↗
              </button>
            </div>
          )}

          {/* Activity Feed */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>Atividade Recente</span>
            </h3>

            <div className="space-y-3 text-xs">
              {showFinancials && (
                <div className="flex items-start gap-2.5 pb-3 border-b border-slate-800/60">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-slate-200 font-medium">Pagamento de Honorários Confirmado</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">Kwanza Investimentos liquidou 12.500.000,00 Kz (Recibo nº REC-2026/0042).</p>
                    <span className="text-[10px] text-slate-500">Há 2 horas</span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2.5 pb-3 border-b border-slate-800/60">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                <div>
                  <p className="text-slate-200 font-medium">Minuta de Perícia Concluída</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Estagiário Nzinga Luvumbo submeteu rascunho para revisão do Dr. Rui Falcão.</p>
                  <span className="text-[10px] text-slate-500">Hoje às 09:30</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                <div>
                  <p className="text-slate-200 font-medium">Novo Processo Distribuído</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Processo 0078/25-FAM distribuído à Sala de Família do Tribunal de Belas.</p>
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
