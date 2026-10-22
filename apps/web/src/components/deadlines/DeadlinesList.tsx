import React from 'react';
import { DeadlinePriority } from '@sigea/shared';
import { MOCK_DEADLINES } from '../../data/mockData';
import { Clock, Calendar, ShieldAlert, Search } from 'lucide-react';

interface DeadlinesListProps {
  onSelectCase: (caseId: string) => void;
}

export const DeadlinesList: React.FC<DeadlinesListProps> = ({ onSelectCase }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredDeadlines = MOCK_DEADLINES.filter(
    (d) =>
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.assignedLawyerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            Sistema de alerta precoce (30d, 15d, 7d, 3d, 1d) conforme os prazos legais de Angola.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrar prazos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-750 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2 shrink-0">
            <ShieldAlert className="w-4 h-4" />
            <span>Monitorização Ativa</span>
          </div>
        </div>
      </div>

      {/* Deadlines List */}
      <div className="space-y-4">
        {filteredDeadlines.map((dl) => {
          const isUrgent = (dl.daysRemaining || 0) <= 2;
          return (
            <div
              key={dl.id}
              className={`p-5 rounded-2xl bg-slate-800/80 border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isUrgent ? 'border-amber-500/50 ring-1 ring-amber-500/30' : 'border-slate-700/70 hover:border-slate-600'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                    {dl.caseNumber}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    dl.priority === DeadlinePriority.CRITICAL
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    Prioridade: {dl.priority}
                  </span>
                  <span className="text-xs text-slate-400">
                    Advogado: <strong className="text-slate-300">{dl.assignedLawyerName}</strong>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{dl.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{dl.description}</p>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-700/40 shrink-0">
                <div className="text-left md:text-right">
                  <div className="text-sm font-bold text-white flex items-center md:justify-end gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>{dl.dueDate}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Limite: {dl.dueTime}</div>
                  <div className={`mt-1 text-xs font-bold ${isUrgent ? 'text-red-400' : 'text-amber-400'}`}>
                    {dl.daysRemaining === 0 ? 'Expira hoje!' : `${dl.daysRemaining} dias para expirar`}
                  </div>
                </div>

                <button
                  onClick={() => onSelectCase(dl.caseId)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow transition-colors shrink-0"
                >
                  Ver Dossier
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
