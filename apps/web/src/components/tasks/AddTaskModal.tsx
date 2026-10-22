import React, { useState } from 'react';
import { TaskPriority, TaskStatus } from '@sigea/shared';
import { useCases } from '../../context/CasesContext';
import { X, CheckSquare, Plus } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose }) => {
  const { addTask } = useCases();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.NORMAL);
  const [assignedToName, setAssignedToName] = useState('Nzinga Luvumbo (Estagiário)');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title,
      description,
      priority,
      status: TaskStatus.PENDING,
      assignedToName,
      dueDate
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800/60 flex items-center justify-center text-blue-400">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Atribuir Nova Tarefa / Diligência</h3>
              <p className="text-xs text-slate-400">Distribuição interna de minutas e atos processuais</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Título da Diligência / Tarefa *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Rascunho de Alegações Finais de Recurso"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Instruções / Descrição
            </label>
            <textarea
              rows={3}
              placeholder="Descreva as orientações práticas, jurisprudência a consultar ou autos a analisar..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Responsável Atribuído *
              </label>
              <select
                value={assignedToName}
                onChange={(e) => setAssignedToName(e.target.value)}
                className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Nzinga Luvumbo (Estagiário)">Nzinga Luvumbo (Estagiário OAA)</option>
                <option value="Dra. Kieza dos Santos Manuel">Dra. Kieza Manuel (Advogada)</option>
                <option value="Dr. Mateus Afonso Quaresma">Dr. Mateus Quaresma (Advogado)</option>
                <option value="Dr. Rui Falcão de Carvalho">Dr. Rui Falcão (Sócio)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Prioridade *
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value={TaskPriority.LOW}>Baixa</option>
                <option value={TaskPriority.NORMAL}>Normal</option>
                <option value={TaskPriority.HIGH}>Alta</option>
                <option value={TaskPriority.URGENT}>Urgente</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Data Limite *
            </label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Criar Tarefa</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
