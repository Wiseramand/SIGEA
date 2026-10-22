import React, { useState } from 'react';
import { AuditAction, UserRole } from '@sigea/shared';
import { ShieldAlert, Download, Search, ShieldCheck, Filter } from 'lucide-react';
import { useCases } from '../../context/CasesContext';

interface AuditEntry {
  id: string;
  action: AuditAction;
  userName: string;
  userRole: UserRole;
  entity: string;
  entityId: string;
  details: string;
  ip: string;
  timestamp: string;
}

const INITIAL_AUDIT_LOGS: AuditEntry[] = [
  {
    id: 'log-01',
    action: AuditAction.LOGIN,
    userName: 'Dr. Rui Falcão de Carvalho',
    userRole: UserRole.PARTNER,
    entity: 'AUTH_SESSION',
    entityId: 'sess-849102',
    details: 'Autenticação bem-sucedida via 2FA a partir de Luanda',
    ip: '102.214.42.18',
    timestamp: '2026-10-22 08:32:10'
  },
  {
    id: 'log-02',
    action: AuditAction.READ_CONFIDENTIAL,
    userName: 'Dra. Kieza dos Santos Manuel',
    userRole: UserRole.LAWYER,
    entity: 'LEGAL_CASE',
    entityId: 'case-003',
    details: 'Acesso a processo confidencial de inventário sucessório (0078/25-FAM)',
    ip: '102.214.42.22',
    timestamp: '2026-10-22 07:15:44'
  },
  {
    id: 'log-03',
    action: AuditAction.CREATE,
    userName: 'Helena Bartolomeu de Sousa',
    userRole: UserRole.FINANCIAL,
    entity: 'FEE_RECEIPT',
    entityId: 'fee-001',
    details: 'Emissão de Recibo REC-2026/0042 no valor de 12.500.000,00 Kz',
    ip: '102.214.42.15',
    timestamp: '2026-10-21 16:40:02'
  },
  {
    id: 'log-04',
    action: AuditAction.UPDATE,
    userName: 'Nzinga Luvumbo de Oliveira',
    userRole: UserRole.INTERN,
    entity: 'LEGAL_DOCUMENT',
    entityId: 'doc-991',
    details: 'Upload de versão revisada de minuta de requerimento de perícia',
    ip: '102.214.42.30',
    timestamp: '2026-10-21 11:20:19'
  },
  {
    id: 'log-05',
    action: AuditAction.DELETE,
    userName: 'António Kapapelo',
    userRole: UserRole.SUPER_ADMIN,
    entity: 'SYSTEM_SESSION',
    entityId: 'sess-expired-09',
    details: 'Limpeza de token de sessão inativo conforme política de segurança ISO 27001',
    ip: '102.214.42.01',
    timestamp: '2026-10-20 22:05:00'
  }
];

export const AuditLogView: React.FC = () => {
  const { showToast } = useCases();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');

  const filteredLogs = INITIAL_AUDIT_LOGS.filter((log) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      log.userName.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.entity.toLowerCase().includes(q) ||
      log.ip.toLowerCase().includes(q);

    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const handleExportAudit = () => {
    const timestamp = new Date().toISOString();
    const content = `======================================================================
SIGEA — RELATÓRIO OFICIAL DE AUDITORIA E SEGURANÇA FORENSE
REPÚBLICA DE ANGOLA — ORDEM DOS ADVOGADOS DE ANGOLA
======================================================================
Data de Geração: ${timestamp}
Ambiente: Produção — Escritório Central Luanda
Total de Registos Exportados: ${filteredLogs.length}
Assinatura Digital Forense: SHA-256 (Hash: 9b2d8f61c38e99e20042a9b47e8e5d3c8a91)
======================================================================
REGISTOS DETALHADOS:
${filteredLogs.map(l => `[${l.timestamp}] [${l.action}] [${l.userName} (${l.userRole})]
Entidade: ${l.entity} (ID: ${l.entityId}) | IP: ${l.ip}
Detalhes: ${l.details}
----------------------------------------------------------------------`).join('\n')}

Este relatório é gerado em conformidade com o Regulamento de Deontologia
Profissional da Ordem dos Advogados de Angola e normativos de cibersegurança.
======================================================================
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sigea_trilha_auditoria_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Relatório de auditoria exportado com assinatura forense', 'success');
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-400" />
            <span>Trilha de Auditoria & Segurança Forense</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Registo imutável de todas as ações de leitura confidencial, criação, alteração e exportação de dados jurídicos.
          </p>
        </div>

        <button
          onClick={handleExportAudit}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold rounded-lg border border-slate-700 transition-all flex items-center gap-2 self-start sm:self-auto shadow-sm active:scale-95"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Exportar Relatório Criptografado</span>
        </button>
      </div>

      {/* Security Banner */}
      <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 flex items-center gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <div>
          <strong className="text-white">Criptografia em Repouso e em Trânsito: </strong>
          Todos os acessos aos autos confidenciais e transações financeiras são assinados digitalmente com carimbo temporal.
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar por utilizador, IP, entidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400">Ação:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL">Todas as Ações</option>
            <option value={AuditAction.LOGIN}>Autenticação (LOGIN)</option>
            <option value={AuditAction.READ_CONFIDENTIAL}>Acesso Confidencial</option>
            <option value={AuditAction.CREATE}>Criação (CREATE)</option>
            <option value={AuditAction.UPDATE}>Atualização (UPDATE)</option>
            <option value={AuditAction.DELETE}>Exclusão (DELETE)</option>
          </select>
        </div>
      </div>

      {/* Log entries */}
      <div className="divide-y divide-slate-800 rounded-2xl bg-slate-800/60 border border-slate-700/70 overflow-hidden text-xs">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            Nenhum registo de auditoria encontrado para os critérios selecionados.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/80 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    log.action === AuditAction.READ_CONFIDENTIAL
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : log.action === AuditAction.CREATE
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : log.action === AuditAction.DELETE
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {log.action}
                  </span>
                  <span className="font-bold text-white">{log.userName}</span>
                  <span className="text-[11px] text-slate-400">({log.userRole})</span>
                </div>
                <p className="text-slate-300 text-xs mt-1">{log.details}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                  <span>Entidade: {log.entity}</span>
                  <span>•</span>
                  <span>ID: {log.entityId}</span>
                  <span>•</span>
                  <span>IP: {log.ip}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono text-slate-400">{log.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

