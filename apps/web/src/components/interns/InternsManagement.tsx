import { MOCK_INTERNS } from '../../data/mockData';
import { GraduationCap, UserCheck, Plus } from 'lucide-react';

export const InternsManagement: React.FC = () => {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-400" />
            <span>Gestão de Advogados Estagiários (OAA)</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Supervisão de patronato, acompanhamento de peças e cumprimento das exigências da Ordem dos Advogados de Angola.
          </p>
        </div>

        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          <span>Admitir Estagiário</span>
        </button>
      </div>

      {/* Interns Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_INTERNS.map((intern) => (
          <div
            key={intern.id}
            className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {intern.oaaTraineeNumber}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{intern.name}</h3>
                <p className="text-xs text-slate-400">{intern.email}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Nota de Avaliação</span>
                <div className="text-lg font-bold text-emerald-400">{intern.evaluationScore} / 20</div>
              </div>
            </div>

            {/* Supervisor Info */}
            <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-750 flex items-center gap-3">
              <UserCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="text-xs">
                <span className="text-slate-400">Patrono / Advogado Supervisor:</span>
                <p className="font-semibold text-white">{intern.supervisorName}</p>
              </div>
            </div>

            {/* Stage Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Cumprimento do Estágio Forense</span>
                <span className="font-bold text-white">{intern.stageProgressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                  style={{ width: `${intern.stageProgressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Início: {intern.startDate}</span>
                <span>Previsão de Término: {intern.expectedEndDate}</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700/50 text-xs">
              <div className="p-3 rounded-lg bg-slate-850">
                <span className="text-slate-400">Processos em Apoio</span>
                <div className="text-sm font-bold text-white mt-0.5">{intern.assignedCasesCount} processos</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-850">
                <span className="text-slate-400">Minutas & Tarefas Validadas</span>
                <div className="text-sm font-bold text-white mt-0.5">{intern.completedTasksCount} peças aprovadas</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
