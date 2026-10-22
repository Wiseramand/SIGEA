import React, { useState } from 'react';
import { DeadlinePriority, DeadlineStatus } from '@sigea/shared';
import { useCases } from '../../context/CasesContext';
import { AddDeadlineModal } from '../cases/AddDeadlineModal';
import { Clock, Calendar, Search, Plus, CheckCircle2 } from 'lucide-react';

interface DeadlinesListProps {
  onSelectCase: (caseId: string) => void;
}

export const DeadlinesList: React.FC<DeadlinesListProps> = ({ onSelectCase }) => {
  const { deadlines, cases, completeDeadline } = useCases();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDeadlineOpen, setIsAddDeadlineOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('PENDING');

  const filteredDeadlines = deadlines.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.assignedLawyerName.toLowerCase().includes(searchTerm.toLowerCase());

    const isCompleted = d.status === DeadlineStatus.COMPLETED;
    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'PENDING' && !isCompleted) ||
      (filterStatus === 'COMPLETED' && isCompleted);

    return matchesSearch && matchesStatus;
  });

  const firstCase = cases.length > 0 ? cases[0] : null;

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-400" />
            <span>Prazos Judiciais Críticos & Caducidades</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Sistema de alerta precoce conforme os prazos legais do Código de Processo Civil Angolano.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => setIsAddDeadlineOpen(true)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-amber-600/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Registar Novo Prazo</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrar por processo, matéria ou mandatário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-750 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus('PENDING')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === 'PENDING'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Pendentes ({deadlines.filter(d => d.status !== DeadlineStatus.COMPLETED).length})
          </button>
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === 'ALL'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Todos ({deadlines.length})
          </button>
          <button
            onClick={() => setFilterStatus('COMPLETED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === 'COMPLETED'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Cumpridos ({deadlines.filter(d => d.status === DeadlineStatus.COMPLETED).length})
          </button>
        </div>
      </div>

      {/* Deadlines List */}
      <div className="space-y-4">
        {filteredDeadlines.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
            Nenhum prazo encontrado com os filtros selecionados.
          </div>
        ) : (
          filteredDeadlines.map((dl) => {
            const isCompleted = dl.status === DeadlineStatus.COMPLETED;
            const isUrgent = !isCompleted && (dl.daysRemaining || 0) <= 2;
            return (
              <div
                key={dl.id}
                className={`p-5 rounded-2xl bg-slate-800/80 border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'border-emerald-500/30 bg-emerald-950/10'
                    : isUrgent
                    ? 'border-amber-500/50 ring-1 ring-amber-500/30'
                    : 'border-slate-700/70 hover:border-slate-600'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                      {dl.caseNumber}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded font-mono ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : dl.priority === DeadlinePriority.CRITICAL
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {isCompleted ? 'CUMPRIDO' : `Prioridade: ${dl.priority}`}
                    </span>
                    <span className="text-xs text-slate-400">
                      Mandatário: <strong className="text-slate-300">{dl.assignedLawyerName}</strong>
                    </span>
                  </div>

                  <h3 className={`text-sm font-bold ${isCompleted ? 'text-slate-300 line-through' : 'text-white'}`}>
                    {dl.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{dl.description}</p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-5 border-t md:border-t-0 pt-3 md:pt-0 border-slate-700/40 shrink-0">
                  <div className="text-left md:text-right">
                    <div className="text-xs font-bold text-white flex items-center md:justify-end gap-1.5 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>{dl.dueDate}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Limite: {dl.dueTime}</div>
                    <div className={`mt-1 text-xs font-bold ${
                      isCompleted
                        ? 'text-emerald-400'
                        : isUrgent
                        ? 'text-red-400'
                        : 'text-amber-400'
                    }`}>
                      {isCompleted
                        ? 'Cumprido no Tribunal'
                        : dl.daysRemaining === 0
                        ? 'Expira hoje!'
                        : `${dl.daysRemaining} dias para expirar`}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isCompleted && (
                      <button
                        onClick={() => completeDeadline(dl.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow transition-colors flex items-center gap-1.5"
                        title="Marcar prazo como cumprido nos autos"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Cumprir</span>
                      </button>
                    )}

                    <button
                      onClick={() => onSelectCase(dl.caseId)}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 shadow transition-colors shrink-0"
                    >
                      Dossier ↗
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal para adicionar novo prazo */}
      {isAddDeadlineOpen && (
        <AddDeadlineModal
          isOpen={isAddDeadlineOpen}
          onClose={() => setIsAddDeadlineOpen(false)}
          caseId={firstCase ? firstCase.id : 'case-mock-1'}
          caseNumber={firstCase ? firstCase.caseNumber : '0042/24.1TELU'}
        />
      )}
    </div>
  );
};
