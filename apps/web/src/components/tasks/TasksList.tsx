import { TaskPriority, TaskStatus } from '@sigea/shared';
import { MOCK_TASKS } from '../../data/mockData';
import { CheckSquare, Plus } from 'lucide-react';

export const TasksList: React.FC = () => {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-blue-400" />
            <span>Minhas Tarefas & Diligências Processuais</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gestão operacional de minutas, revisões e preparação de audiências forenses.
          </p>
        </div>

        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          <span>Criar Tarefa</span>
        </button>
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {MOCK_TASKS.map((task) => (
          <div
            key={task.id}
            className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/70 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  task.priority === TaskPriority.URGENT
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {task.priority}
                </span>
                <span className="text-xs text-slate-400">
                  Responsável: <strong className="text-slate-200">{task.assignedToName}</strong>
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-400">
                  Criado por: <strong className="text-slate-300">{task.createdByName}</strong>
                </span>
              </div>

              <h3 className="text-sm font-bold text-white">{task.title}</h3>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-700/40 shrink-0">
              <div className="text-left md:text-right">
                <span className="text-xs text-slate-400">Data Limite</span>
                <div className="text-sm font-bold text-white">{task.dueDate}</div>
                <div className={`text-xs font-semibold mt-0.5 ${
                  task.status === TaskStatus.COMPLETED ? 'text-emerald-400' : 'text-blue-400'
                }`}>
                  {task.status}
                </div>
              </div>

              <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-650 text-slate-200 rounded-lg text-xs font-semibold transition-colors">
                Atualizar Estado
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
