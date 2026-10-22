import React from 'react';
import { formatAOA } from '@sigea/shared';
import { MOCK_CASES } from '../../data/mockData';
import { Briefcase, Search, Plus, Filter, ArrowUpRight, Scale, UserCheck } from 'lucide-react';

interface CasesListProps {
  onSelectCase: (caseId: string) => void;
}

export const CasesList: React.FC<CasesListProps> = ({ onSelectCase }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [jurisdictionFilter, setJurisdictionFilter] = React.useState<string>('ALL');

  const filteredCases = MOCK_CASES.filter((c) => {
    const matchesSearch =
      c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.courtName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesJurisdiction =
      jurisdictionFilter === 'ALL' || c.jurisdiction === jurisdictionFilter;

    return matchesSearch && matchesJurisdiction;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-500" />
            <span>Processos Judiciais & Contencioso</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gestão dos dossiers centrais de processos nos Tribunais de Angola.
          </p>
        </div>

        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          <span>Autuar Novo Processo</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar por número, tribunal, cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={jurisdictionFilter}
            onChange={(e) => setJurisdictionFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Todas as Jurisdições</option>
            <option value="COMMERCIAL">Comercial</option>
            <option value="CIVIL">Cível</option>
            <option value="LABOR">Trabalho</option>
            <option value="FAMILY_SUCCESSION">Família & Sucessões</option>
          </select>
        </div>
      </div>

      {/* Cases Cards / Table */}
      <div className="space-y-3">
        {filteredCases.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelectCase(c.id)}
            className="p-5 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 hover:border-slate-600 transition-all cursor-pointer group flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                  {c.caseNumber}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-700/60 text-slate-300">
                  {c.jurisdiction}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Fase: {c.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                {c.subject}
              </h3>

              <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-blue-400" />
                  <span className="truncate max-w-[280px]">{c.courtName}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Patrono: {c.responsibleLawyerName}</span>
                </span>
                <span>•</span>
                <span className="text-slate-300 font-medium">Cliente: {c.clientName}</span>
              </div>
            </div>

            <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-700/50 shrink-0">
              <div className="text-left lg:text-right">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Valor da Causa</span>
                <div className="text-sm font-bold text-white">{formatAOA(c.claimValueAoa)}</div>
              </div>

              <div className="p-2 rounded-xl bg-slate-700/40 text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
