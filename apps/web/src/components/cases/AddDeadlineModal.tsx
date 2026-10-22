import React, { useState } from 'react';
import { DeadlinePriority } from '@sigea/shared';
import { useCases } from '../../context/CasesContext';
import { X, Clock, Calendar } from 'lucide-react';

interface AddDeadlineModalProps {
  caseId: string;
  caseNumber: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AddDeadlineModal: React.FC<AddDeadlineModalProps> = ({
  caseId,
  caseNumber,
  isOpen,
  onClose
}) => {
  const { addDeadline } = useCases();

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('15:00');
  const [priority, setPriority] = useState<DeadlinePriority>(DeadlinePriority.HIGH);
  const [description, setDescription] = useState('');
  const [assignedLawyerName, setAssignedLawyerName] = useState('Dr. Rui Falcão de Carvalho');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    addDeadline({
      caseId,
      title: title.trim(),
      dueDate,
      dueTime,
      priority,
      description: description.trim() || 'Prazo ou diligência registada na agenda forense do processo.',
      assignedLawyerName
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        <div className="p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Registar Prazo ou Audiência</h2>
              <p className="text-xs text-slate-400">Proc. nº {caseNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Designação do Prazo / Audiência *</label>
            <input
              type="text"
              placeholder="Ex: Audiência de Julgamento / Junção de Quesitos Periciais"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>Data Limite *</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Hora Limite (Tribunal)</label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Grau de Urgência</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as DeadlinePriority)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value={DeadlinePriority.CRITICAL}>Crítica (Peremptório)</option>
                <option value={DeadlinePriority.HIGH}>Alta</option>
                <option value={DeadlinePriority.MEDIUM}>Média</option>
                <option value={DeadlinePriority.LOW}>Baixa</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Advogado Responsável</label>
              <select
                value={assignedLawyerName}
                onChange={(e) => setAssignedLawyerName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Dr. Rui Falcão de Carvalho">Dr. Rui Falcão de Carvalho</option>
                <option value="Dra. Kieza dos Santos Manuel">Dra. Kieza dos Santos Manuel</option>
                <option value="Dr. Mateus Afonso Quaresma">Dr. Mateus Afonso Quaresma</option>
                <option value="Nzinga Luvumbo (Estagiário)">Nzinga Luvumbo (Estagiário)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Observações Jurídicas / Recomendações</label>
            <textarea
              rows={3}
              placeholder="Fundamento processual nos termos do Código de Processo Civil..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold shadow"
            >
              Agendar Prazo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
