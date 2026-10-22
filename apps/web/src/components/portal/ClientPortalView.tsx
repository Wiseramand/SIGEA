import React from 'react';
import { formatAOA } from '@sigea/shared';
import { MOCK_CASES, MOCK_FEES } from '../../data/mockData';
import { Briefcase, FileText, BadgeDollarSign, ShieldCheck, Download, ExternalLink } from 'lucide-react';

export const ClientPortalView: React.FC = () => {
  // Client: Kwanza Investimentos (cli-001)
  const clientCases = MOCK_CASES.filter((c) => c.clientId === 'cli-001');
  const clientFees = MOCK_FEES.filter((f) => f.clientId === 'cli-001');

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/60 via-slate-800 to-slate-900 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Portal Corporativo do Cliente
          </span>
          <h1 className="text-xl font-bold text-white mt-2">
            Kwanza Investimentos e Participações SA
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Espaço digital exclusivo e confidencial gerido por <strong className="text-white">Falcão & Associados</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4" />
          <span>Sessão Encriptada Ponta a Ponta</span>
        </div>
      </div>

      {/* Processos do Cliente */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-blue-400" />
          <span>Os Seus Processos em Acompanhamento</span>
        </h2>

        <div className="space-y-3">
          {clientCases.map((c) => (
            <div key={c.id} className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/70 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                    {c.caseNumber}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300">
                    Fase: {c.status}
                  </span>
                </div>
                <span className="text-xs text-slate-400">Patrono: {c.responsibleLawyerName}</span>
              </div>

              <h3 className="text-sm font-bold text-white">{c.subject}</h3>
              <p className="text-xs text-slate-400">{c.courtName}</p>

              <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Última atualização: <strong className="text-slate-200">Requerimento Pericial Notificado</strong>
                </span>
                <button className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
                  <span>Ver Andamento Detalhado</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documentos Partilhados com o Cliente */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          <span>Peças & Documentos Autorizados</span>
        </h2>

        <div className="divide-y divide-slate-800 rounded-2xl bg-slate-800/60 border border-slate-700/70 overflow-hidden text-xs">
          {[
            { name: 'Petição_Inicial_Devidamente_Distribuida.pdf', date: '14 Fev 2024', size: '2.4 MB' },
            { name: 'Procuracao_Forense_c_Poderes_Especiais.pdf', date: '12 Fev 2024', size: '850 KB' },
            { name: 'Contrato_Submarino_Telecomunicacoes_Atlas.pdf', date: '14 Fev 2024', size: '14.2 MB' }
          ].map((doc, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-800/80 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="font-semibold text-white">{doc.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Partilhado em {doc.date} • {doc.size}</div>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Faturas do Cliente em AOA */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <BadgeDollarSign className="w-4 h-4 text-emerald-400" />
          <span>Extrato Financeiro de Honorários (AOA)</span>
        </h2>

        <div className="divide-y divide-slate-800 rounded-2xl bg-slate-800/60 border border-slate-700/70 overflow-hidden text-xs">
          {clientFees.map((fee) => (
            <div key={fee.id} className="p-4 flex items-center justify-between">
              <div>
                <span className="font-bold text-white">{fee.title}</span>
                <p className="text-slate-400 text-[11px] mt-0.5">Vencimento: {fee.dueDate}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-white">{formatAOA(fee.amountAoa)}</span>
                <div className={`text-[11px] font-semibold ${fee.status === 'PAID' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {fee.status === 'PAID' ? 'Liquidado' : 'Aguardando Pagamento'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
