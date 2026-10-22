import React, { useState } from 'react';
import { TaskPriority, TaskStatus, Task } from '@sigea/shared';
import { useCases } from '../../context/CasesContext';
import { AddTaskModal } from './AddTaskModal';
import {
  CheckSquare,
  Plus,
  Search,
  CheckCircle2
} from 'lucide-react';

export const TasksList: React.FC = () => {
  const { tasks, updateTaskStatus } = useCases();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | TaskStatus>('ALL');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignedToName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleTask = (task: Task) => {
    if (task.status === TaskStatus.COMPLETED) {
      updateTaskStatus(task.id, TaskStatus.IN_PROGRESS);
    } else {
      updateTaskStatus(task.id, TaskStatus.COMPLETED);
    }
  };

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

        <button
          onClick={() => setIsAddTaskOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Tarefa</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar tarefas ou responsáveis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-750 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Todas ({tasks.length})
          </button>
          <button
            onClick={() => setStatusFilter(TaskStatus.PENDING)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === TaskStatus.PENDING
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Pendentes ({tasks.filter(t => t.status === TaskStatus.PENDING).length})
          </button>
          <button
            onClick={() => setStatusFilter(TaskStatus.IN_PROGRESS)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === TaskStatus.IN_PROGRESS
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Em Curso
          </button>
          <button
            onClick={() => setStatusFilter(TaskStatus.COMPLETED)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === TaskStatus.COMPLETED
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Concluídas ({tasks.filter(t => t.status === TaskStatus.COMPLETED).length})
          </button>
        </div>
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
            Nenhuma tarefa encontrada com os filtros selecionados.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.status === TaskStatus.COMPLETED;
            return (
              <div
                key={task.id}
                className={`p-5 rounded-2xl bg-slate-800/70 border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isDone
                    ? 'border-emerald-500/30 bg-emerald-950/10'
                    : 'border-slate-700/70 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <button
                    onClick={() => handleToggleTask(task)}
                    className={`mt-1 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                      isDone
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'border-slate-600 hover:border-blue-400 bg-slate-900 text-transparent'
                    }`}
                    title={isDone ? 'Marcar como não concluída' : 'Marcar como concluída'}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                  </button>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        task.priority === TaskPriority.URGENT
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : task.priority === TaskPriority.HIGH
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-700 text-slate-300'
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

                    <h3 className={`text-sm font-bold ${isDone ? 'text-slate-400 line-through' : 'text-white'}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-xs text-slate-400 leading-relaxed">{task.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-5 border-t md:border-t-0 pt-3 md:pt-0 border-slate-700/40 shrink-0">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] text-slate-400">Data Limite</span>
                    <div className="text-xs font-bold text-white font-mono">{task.dueDate}</div>
                    <div className={`text-[11px] font-semibold mt-0.5 ${
                      isDone ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {task.status}
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleTask(task)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isDone
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                    }`}
                  >
                    {isDone ? 'Reabrir' : 'Concluir'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Criação de Tarefa */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
      />
    </div>
  );
};
