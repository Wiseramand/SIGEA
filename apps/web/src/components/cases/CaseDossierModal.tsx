import React from 'react';
import { LegalCase, formatAOA } from '@sigea/shared';
import { MOCK_DEADLINES, MOCK_FEES } from '../../data/mockData';
import {
  X,
  Scale,
  Users,
  FileText,
  BadgeDollarSign,
  History,
  Download,
  UploadCloud,
  Clock
} from 'lucide-react';

interface CaseDossierModalProps {
  legalCase: LegalCase | null;
  onClose: () => void;
}

export const CaseDossierModal: React.FC<CaseDossierModalProps> = ({
  legalCase,
  onClose
}) => {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'documents' | 'deadlines' | 'finance' | 'history'>('overview');

  if (!legalCase) return null;

  const caseDeadlines = MOCK_DEADLINES.filter(d => d.caseId === legalCase.id);
  const caseFees = MOCK_FEES.filter(f => f.caseId === legalCase.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-850 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                Proc. nº {legalCase.caseNumber}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Fase de {legalCase.status}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-700/60 text-slate-300">
                {legalCase.jurisdiction}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {legalCase.subject}
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-blue-400" />
              <span>{legalCase.courtName}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="px-6 border-b border-slate-800 bg-slate-900/60 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Dados Gerais & Partes</span>
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'documents'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Peças & Documentos (5)</span>
          </button>
          <button
            onClick={() => setActiveTab('deadlines')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'deadlines'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Prazos ({caseDeadlines.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('finance')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'finance'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BadgeDollarSign className="w-3.5 h-3.5" />
            <span>Honorários & Custas</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Andamento & Trilha</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Financial & Court Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Valor da Causa</span>
                  <div className="text-xl font-bold text-white mt-1">
                    {formatAOA(legalCase.claimValueAoa)}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Advogado Responsável</span>
                  <div className="text-sm font-bold text-white mt-1">
                    {legalCase.responsibleLawyerName}
                  </div>
                  <span className="text-[11px] text-amber-400">Patrono Principal</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Magistrado Titular</span>
                  <div className="text-sm font-bold text-white mt-1">
                    {legalCase.judgeName || 'Não atribuído'}
                  </div>
                  <span className="text-[11px] text-slate-400">Juiz de Direito</span>
                </div>
              </div>

              {/* Partes Processuais */}
              <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Partes Processuais & Representantes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {legalCase.parties.map((party) => (
                    <div key={party.id} className="p-3.5 rounded-lg bg-slate-800 border border-slate-700/70 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          party.role === 'CLAIMANT'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {party.role === 'CLAIMANT' ? 'Autor / Requerente' : 'Réu / Requerido'}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-white mt-1">{party.name}</h4>
                      {party.lawyerName && (
                        <p className="text-xs text-slate-400">
                          Mandatário: <strong className="text-slate-300">{party.lawyerName}</strong> ({party.oaaNumber})
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Descrição e Enquadramento */}
              <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Resumo Fáctico & Causa de Pedir
                </h3>
                <p className="text-xs leading-relaxed text-slate-300">
                  {legalCase.description}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Repositório digital auditado. Compatível com S3/R2 para arquivos seguros.
                </p>
                <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Carregar Peça / Prova</span>
                </button>
              </div>

              <div className="divide-y divide-slate-800 rounded-xl bg-slate-800/40 border border-slate-700/70 overflow-hidden">
                {[
                  { name: 'Petição_Inicial_Devidamente_Distribuida.pdf', size: '2.4 MB', date: '14 Fev 2024', user: 'Dr. Rui Falcão', type: 'Petição', visible: true },
                  { name: 'Procuracao_Forense_c_Poderes_Especiais.pdf', size: '850 KB', date: '12 Fev 2024', user: 'Dr. Rui Falcão', type: 'Procuração', visible: true },
                  { name: 'Contrato_Submarino_Telecomunicacoes_Atlas.pdf', size: '14.2 MB', date: '14 Fev 2024', user: 'Nzinga Luvumbo', type: 'Prova Documental', visible: true },
                  { name: 'Contestacao_Reu_Atlas_Telecom.pdf', size: '3.1 MB', date: '18 Abr 2024', user: 'Cartório do Tribunal', type: 'Peça da Contraparte', visible: false },
                  { name: 'Minuta_Requerimento_Pericia_Informatica.docx', size: '420 KB', date: '20 Out 2026', user: 'Nzinga Luvumbo', type: 'Rascunho Interno', visible: false }
                ].map((doc, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-slate-800/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">{doc.name}</span>
                          {doc.visible && (
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-medium border border-emerald-500/20">
                              Visível no Portal do Cliente
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {doc.type} • {doc.size} • Enviado por {doc.user} em {doc.date}
                        </div>
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-750 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DEADLINES */}
          {activeTab === 'deadlines' && (
            <div className="space-y-4">
              {caseDeadlines.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Sem prazos pendentes vinculados a este processo.
                </div>
              ) : (
                caseDeadlines.map((dl) => (
                  <div key={dl.id} className="p-4 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {dl.priority}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{dl.assignedLawyerName}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{dl.title}</h4>
                      <p className="text-xs text-slate-400">{dl.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-white">{dl.dueDate}</div>
                      <div className="text-xs text-amber-400 font-semibold">{dl.daysRemaining} dias restantes</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: FINANCE */}
          {activeTab === 'finance' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-800 border border-slate-700/70">
                  <span className="text-xs font-semibold text-slate-400">Total Contratado (AOA)</span>
                  <div className="text-xl font-bold text-white mt-1">
                    {formatAOA(caseFees.reduce((a, b) => a + b.amountAoa, 0))}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-800 border border-slate-700/70">
                  <span className="text-xs font-semibold text-slate-400">Saldo Liquidado pelo Cliente</span>
                  <div className="text-xl font-bold text-emerald-400 mt-1">
                    {formatAOA(caseFees.reduce((a, b) => a + b.paidAmountAoa, 0))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Histórico de Honorários</h4>
                {caseFees.map((fee) => (
                  <div key={fee.id} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/70 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white">{fee.title}</span>
                      <p className="text-xs text-slate-400 mt-0.5">{fee.feeType} • Vencimento: {fee.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-white">{formatAOA(fee.amountAoa)}</span>
                      <div className={`text-xs font-semibold ${fee.status === 'PAID' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {fee.status === 'PAID' ? 'Liquidado' : 'Pendente'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="relative pl-6 border-l-2 border-slate-700 space-y-6 text-xs">
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-slate-900" />
                  <p className="font-bold text-white">Fixação de Questões Fácticas Controvertidas</p>
                  <p className="text-slate-400 mt-0.5">Despacho interlocutório notificando as partes para apresentação de rol de testemunhas.</p>
                  <span className="text-[10px] text-slate-500">20 Out 2026 • Notificação Judicial</span>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-slate-600 ring-4 ring-slate-900" />
                  <p className="font-bold text-white">Junção de Contestação e Documentos</p>
                  <p className="text-slate-400 mt-0.5">Mandatário da Ré deduziu oposição por impugnação especificada.</p>
                  <span className="text-[10px] text-slate-500">18 Abr 2024 • Cartório Judicial</span>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-slate-900" />
                  <p className="font-bold text-white">Distribuição e Citação</p>
                  <p className="text-slate-400 mt-0.5">Entrada da Petição Inicial na Sala do Cível do Tribunal de Luanda.</p>
                  <span className="text-[10px] text-slate-500">14 Fev 2024 • Dr. Rui Falcão</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
