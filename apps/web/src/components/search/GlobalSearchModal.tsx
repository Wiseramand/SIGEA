import React from 'react';
import { MOCK_CASES, MOCK_CLIENTS, MOCK_DEADLINES } from '../../data/mockData';
import { Search, X, Briefcase, Users, Clock } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCase: (caseId: string) => void;
  onSelectClient?: (clientId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCase
}) => {
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const matchedCases = query
    ? MOCK_CASES.filter(
        c =>
          c.caseNumber.toLowerCase().includes(query.toLowerCase()) ||
          c.subject.toLowerCase().includes(query.toLowerCase()) ||
          c.clientName.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchedClients = query
    ? MOCK_CLIENTS.filter(
        cl =>
          cl.name.toLowerCase().includes(query.toLowerCase()) ||
          cl.nif.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchedDeadlines = query
    ? MOCK_DEADLINES.filter(
        d =>
          d.title.toLowerCase().includes(query.toLowerCase()) ||
          d.caseNumber.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Pesquisar por número de processo, cliente, NIF, prazo ou advogado..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4">
          {!query && (
            <div className="text-center py-8 text-xs text-slate-500">
              Comece a digitar para pesquisar em toda a base de dados do escritório...
            </div>
          )}

          {query && matchedCases.length === 0 && matchedClients.length === 0 && matchedDeadlines.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400">
              Nenhum resultado encontrado para "<span className="text-white">{query}</span>"
            </div>
          )}

          {/* Cases Results */}
          {matchedCases.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                <span>Processos Judiciais</span>
              </span>
              <div className="space-y-1">
                {matchedCases.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSelectCase(c.id);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-400">{c.caseNumber}</span>
                        <span className="font-semibold text-white">{c.subject}</span>
                      </div>
                      <span className="text-slate-400 text-[11px] mt-0.5 block">{c.clientName}</span>
                    </div>
                    <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clients Results */}
          {matchedClients.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Clientes</span>
              </span>
              <div className="space-y-1">
                {matchedClients.map((cl) => (
                  <div
                    key={cl.id}
                    className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-white">{cl.name}</span>
                      <span className="text-slate-400 text-[11px] mt-0.5 block">NIF: {cl.nif} • {cl.city}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">
                      {cl.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deadlines Results */}
          {matchedDeadlines.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Prazos</span>
              </span>
              <div className="space-y-1">
                {matchedDeadlines.map((dl) => (
                  <div
                    key={dl.id}
                    onClick={() => {
                      onSelectCase(dl.caseId);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-white">{dl.title}</span>
                      <span className="text-slate-400 text-[11px] mt-0.5 block">Proc: {dl.caseNumber} • Vence em: {dl.dueDate}</span>
                    </div>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                      {dl.daysRemaining} dias
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
