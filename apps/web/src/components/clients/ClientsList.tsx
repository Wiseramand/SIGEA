import React from 'react';
import { ClientType, formatAOA } from '@sigea/shared';
import { MOCK_CLIENTS } from '../../data/mockData';
import { Users, Search, Plus, Building, User, Phone, Mail, CheckCircle } from 'lucide-react';

export const ClientsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<'ALL' | 'COMPANY' | 'INDIVIDUAL'>('ALL');

  const filteredClients = MOCK_CLIENTS.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.nif.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'ALL' || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            <span>Gestão de Clientes & Empresas</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Registo de Pessoas Singulares e Coletivas com NIF angolano e controlo de portal.
          </p>
        </div>

        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Cliente</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar por nome, NIF ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              typeFilter === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Todos ({MOCK_CLIENTS.length})
          </button>
          <button
            onClick={() => setTypeFilter('COMPANY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              typeFilter === 'COMPANY'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Pessoas Coletivas
          </button>
          <button
            onClick={() => setTypeFilter('INDIVIDUAL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              typeFilter === 'INDIVIDUAL'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Pessoas Singulares
          </button>
        </div>
      </div>

      {/* Grid of Clients */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/70 hover:border-slate-600 transition-all space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${
                  client.type === ClientType.COMPANY
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {client.type === ClientType.COMPANY ? (
                    <Building className="w-5 h-5" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{client.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-mono text-slate-400">
                      NIF: <strong className="text-slate-300">{client.nif}</strong>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                      {client.province}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {client.portalAccessEnabled && (
                  <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Portal Ativo
                  </span>
                )}
              </div>
            </div>

            {client.legalRepresentative && (
              <p className="text-xs text-slate-300 bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-750">
                Representante: <strong className="text-white">{client.legalRepresentative}</strong>
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700/50 text-xs">
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400">Processos Ativos</span>
                <div className="text-base font-bold text-white">{client.activeCasesCount} processos</div>
              </div>
              <div className="space-y-1 text-right">
                <span className="text-[11px] text-slate-400">Volume Faturado</span>
                <div className="text-sm font-bold text-emerald-400">
                  {formatAOA(client.totalBilledAoa || 0)}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700/40 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                <span>{client.phone}</span>
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate max-w-[160px]">{client.email}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
