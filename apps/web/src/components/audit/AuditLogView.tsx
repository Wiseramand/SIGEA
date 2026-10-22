import React from 'react';
import { AuditAction, UserRole } from '@sigea/shared';
import { ShieldAlert, Download } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const auditLogs = [
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
    }
  ];

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

        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-all flex items-center gap-2 self-start sm:self-auto">
          <Download className="w-4 h-4" />
          <span>Exportar Relatório Criptografado</span>
        </button>
      </div>

      {/* Log entries */}
      <div className="divide-y divide-slate-800 rounded-2xl bg-slate-800/60 border border-slate-700/70 overflow-hidden text-xs">
        {auditLogs.map((log) => (
          <div key={log.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/80 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  log.action === AuditAction.READ_CONFIDENTIAL
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : log.action === AuditAction.CREATE
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
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
        ))}
      </div>
    </div>
  );
};
