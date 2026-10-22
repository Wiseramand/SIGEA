import React, { useState } from 'react';
import { formatAOA, CaseStatus, Jurisdiction } from '@sigea/shared';
import { ANGOLA_COURTS } from '@sigea/shared';
import { useCases } from '../../context/CasesContext';
import { NewCaseModal } from './NewCaseModal';
import {
  Briefcase,
  Search,
  Plus,
  ArrowUpRight,
  Scale,
  UserCheck,
  AlertTriangle,
  Clock,
  ArrowUpDown,
  Lock,
  RotateCcw
} from 'lucide-react';

interface CasesListProps {
  onSelectCase: (caseId: string) => void;
}

export const CasesList: React.FC<CasesListProps> = ({ onSelectCase }) => {
  const { cases, deadlines, resetAllToMockData } = useCases();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [jurisdictionFilter, setJurisdictionFilter] = useState<string>('ALL');
  const [courtFilter, setCourtFilter] = useState<string>('ALL');
  const [lawyerFilter, setLawyerFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'DATE_DESC' | 'VALUE_DESC' | 'NUMBER_ASC'>('DATE_DESC');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);

  // Lista de advogados únicos
  const uniqueLawyers = Array.from(new Set(cases.map((c) => c.responsibleLawyerName)));

  // Filtragem
  const filteredCases = cases.filter((c) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      c.caseNumber.toLowerCase().includes(query) ||
      c.subject.toLowerCase().includes(query) ||
      c.clientName.toLowerCase().includes(query) ||
      c.courtName.toLowerCase().includes(query) ||
      c.responsibleLawyerName.toLowerCase().includes(query);

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesJurisdiction = jurisdictionFilter === 'ALL' || c.jurisdiction === jurisdictionFilter;
    const matchesCourt = courtFilter === 'ALL' || c.courtName === courtFilter;
    const matchesLawyer = lawyerFilter === 'ALL' || c.responsibleLawyerName === lawyerFilter;
    const matchesPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesJurisdiction && matchesCourt && matchesLawyer && matchesPriority;
  });

  // Ordenação
  const sortedCases = [...filteredCases].sort((a, b) => {
    if (sortBy === 'DATE_DESC') {
      return new Date(b.distributionDate || b.createdAt).getTime() - new Date(a.distributionDate || a.createdAt).getTime();
    }
    if (sortBy === 'VALUE_DESC') {
      return b.claimValueAoa - a.claimValueAoa;
    }
    if (sortBy === 'NUMBER_ASC') {
      return a.caseNumber.localeCompare(b.caseNumber);
    }
    return 0;
  });

  // Paginação
  const totalPages = Math.ceil(sortedCases.length / itemsPerPage) || 1;
  const paginatedCases = sortedCases.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Helper para verificar se o caso possui prazo crítico
  const hasCriticalDeadline = (caseId: string) => {
    return deadlines.some((d) => d.caseId === caseId && (d.daysRemaining || 0) <= 2);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-500" />
              <span>Processos Judiciais & Contencioso</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">
              {cases.length} Processos Registados
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Gestão integrada dos dossiers centrais perante os Tribunais e Comarcas de Angola.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => resetAllToMockData()}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white rounded-lg text-xs font-semibold border border-slate-700/80 transition-colors flex items-center gap-1.5"
            title="Repor dados de demonstração originais"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Repor Dados</span>
          </button>

          <button
            onClick={() => setIsNewCaseOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Autuar Novo Processo</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="space-y-3 p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
        {/* Search bar & Sort */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar por número, objeto, tribunal, cliente ou advogado..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5 text-blue-400" />
              <span>Ordenar por:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="DATE_DESC">Data Mais Recente</option>
              <option value="VALUE_DESC">Maior Valor da Causa (Kz)</option>
              <option value="NUMBER_ASC">Número do Processo (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Multi-Filter Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2 border-t border-slate-700/40 text-xs">
          {/* Status Filter */}
          <div>
            <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Estado</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-800 border border-slate-750 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Todos os Estados</option>
              <option value={CaseStatus.DISTRIBUTED}>Distribuído</option>
              <option value={CaseStatus.INITIAL_PHASE}>Fase Inicial</option>
              <option value={CaseStatus.INSTRUCTION}>Instrução</option>
              <option value={CaseStatus.HEARING}>Audiência / Julgamento</option>
              <option value={CaseStatus.SENTENCE}>Decisão / Sentença</option>
              <option value={CaseStatus.APPEAL}>Recurso</option>
              <option value={CaseStatus.ENFORCEMENT}>Execução</option>
              <option value={CaseStatus.CLOSED}>Concluído</option>
            </select>
          </div>

          {/* Jurisdiction Filter */}
          <div>
            <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Jurisdição</label>
            <select
              value={jurisdictionFilter}
              onChange={(e) => {
                setJurisdictionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-800 border border-slate-750 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Todas as Jurisdições</option>
              <option value={Jurisdiction.COMMERCIAL}>Comercial</option>
              <option value={Jurisdiction.CIVIL}>Cível</option>
              <option value={Jurisdiction.LABOR}>Trabalho</option>
              <option value={Jurisdiction.FAMILY_SUCCESSION}>Família & Sucessões</option>
              <option value={Jurisdiction.ADMINISTRATIVE_TAX}>Fiscal / Administrativo</option>
            </select>
          </div>

          {/* Court Filter */}
          <div>
            <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Tribunal</label>
            <select
              value={courtFilter}
              onChange={(e) => {
                setCourtFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-800 border border-slate-750 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500 truncate"
            >
              <option value="ALL">Todos os Tribunais</option>
              {ANGOLA_COURTS.map((court) => (
                <option key={court} value={court}>
                  {court}
                </option>
              ))}
            </select>
          </div>

          {/* Responsible Lawyer */}
          <div>
            <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Advogado Patrono</label>
            <select
              value={lawyerFilter}
              onChange={(e) => {
                setLawyerFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-800 border border-slate-750 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Toda a Equipa</option>
              {uniqueLawyers.map((lawyer) => (
                <option key={lawyer} value={lawyer}>
                  {lawyer}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Grau de Prioridade</label>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-800 border border-slate-750 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Todas as Prioridades</option>
              <option value="CRITICAL">Crítica / Urgente</option>
              <option value="HIGH">Alta</option>
              <option value="NORMAL">Normal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases List Result Counter */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>A exibir <strong className="text-white">{sortedCases.length}</strong> processos encontrados</span>
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('ALL');
              setJurisdictionFilter('ALL');
              setCourtFilter('ALL');
              setLawyerFilter('ALL');
              setPriorityFilter('ALL');
            }}
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Limpar todos os filtros
          </button>
        )}
      </div>

      {/* Cases Cards */}
      <div className="space-y-3">
        {paginatedCases.length === 0 ? (
          <div className="p-12 rounded-2xl bg-slate-800/40 border border-slate-750 text-center space-y-3">
            <Briefcase className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-semibold text-white">Nenhum processo judicial encontrado</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Não existem processos correspondentes aos critérios de pesquisa ou filtros selecionados.
            </p>
            <button
              onClick={() => setIsNewCaseOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
            >
              Autuar Novo Processo
            </button>
          </div>
        ) : (
          paginatedCases.map((c) => {
            const isUrgent = hasCriticalDeadline(c.id);
            return (
              <div
                key={c.id}
                onClick={() => onSelectCase(c.id)}
                className={`p-5 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border transition-all cursor-pointer group flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm ${
                  isUrgent ? 'border-amber-500/40 hover:border-amber-500/60' : 'border-slate-700/70 hover:border-slate-600'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                      {c.caseNumber}
                    </span>

                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-700/60 text-slate-300">
                      {c.jurisdiction}
                    </span>

                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      c.status === CaseStatus.CLOSED || c.status === CaseStatus.ARCHIVED
                        ? 'bg-slate-700/60 text-slate-400 border-slate-600'
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    }`}>
                      Fase: {c.status}
                    </span>

                    {c.priority === 'CRITICAL' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Crítico
                      </span>
                    )}

                    {isUrgent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 animate-pulse">
                        <Clock className="w-3 h-3 text-amber-400" />
                        Prazo Iminente
                      </span>
                    )}

                    {c.isConfidential && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Segredo
                      </span>
                    )}
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
                    <span className="text-[11px] text-slate-500">Distribuição: {c.distributionDate}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-700/40 text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors" title="Abrir Dossier 360°">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
          <div>
            Página <strong className="text-white">{currentPage}</strong> de <strong className="text-white">{totalPages}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-colors"
            >
              Anterior
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-colors"
            >
              Próxima
            </button>
          </div>
        </div>
      )}

      {/* Modal de Autuação de Processo */}
      <NewCaseModal
        isOpen={isNewCaseOpen}
        onClose={() => setIsNewCaseOpen(false)}
        onCaseCreated={(caseId) => onSelectCase(caseId)}
      />
    </div>
  );
};
