import React, { useState } from 'react';
import { LegalCase, formatAOA, CaseStatus } from '@sigea/shared';
import { useCases } from '../../context/CasesContext';
import { EditCaseModal } from './EditCaseModal';
import { AddDeadlineModal } from './AddDeadlineModal';
import { UploadDocumentModal } from './UploadDocumentModal';
import { AddPartyModal } from './AddPartyModal';
import { AddPaymentModal } from './AddPaymentModal';
import { AddExpenseModal } from '../finance/AddExpenseModal';
import { InvoiceReceiptModal } from '../finance/InvoiceReceiptModal';
import { MOCK_CASE_METRICS } from '../../data/mockData';
import {
  X,
  Scale,
  Users,
  FileText,
  BadgeDollarSign,
  History,
  Download,
  UploadCloud,
  Clock,
  Edit3,
  Plus,
  AlertTriangle,
  Send,
  Calendar,
  FileCheck2,
  Lock,
  Receipt,
  Printer,
  CheckCircle2
} from 'lucide-react';

interface CaseDossierModalProps {
  legalCase: LegalCase | null;
  onClose: () => void;
}

export const CaseDossierModal: React.FC<CaseDossierModalProps> = ({
  legalCase: initialCase,
  onClose
}) => {
  const { cases, deadlines, documents, activities, fees, expenses, markExpenseReimbursed, addActivity, showToast } = useCases();

  const [activeTab, setActiveTab] = useState<'overview' | 'parties' | 'documents' | 'deadlines' | 'finance' | 'history'>('overview');
  const [docCategoryFilter, setDocCategoryFilter] = useState<string>('ALL');
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteAuthor, setNewNoteAuthor] = useState('Dr. Rui Falcão de Carvalho');

  // Submodals state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddDeadlineOpen, setIsAddDeadlineOpen] = useState(false);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [isAddPartyOpen, setIsAddPartyOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  if (!initialCase) return null;

  // Obter versão mais recente do caso a partir do Context
  const currentCase = cases.find((c) => c.id === initialCase.id) || initialCase;

  // Dados vinculados ao caso
  const caseDeadlines = deadlines.filter((d) => d.caseId === currentCase.id);
  const caseDocuments = documents.filter((doc) => doc.caseId === currentCase.id);
  const caseActivities = activities.filter((act) => act.caseId === currentCase.id);
  const caseFees = fees.filter((fee) => fee.caseId === currentCase.id);
  const caseExpenses = expenses.filter((exp) => exp.caseId === currentCase.id);
  const caseMetric = MOCK_CASE_METRICS[currentCase.id] || {
    hoursWorked: 20,
    hourlyRateAoa: 60000,
    contractModel: 'Honorário Convencional',
    expenseBudgetAoa: 500000
  };

  // Filtrar documentos
  const filteredDocs = caseDocuments.filter((doc) => {
    return docCategoryFilter === 'ALL' || doc.category === docCategoryFilter;
  });

  // Próximo prazo
  const nextDeadline = caseDeadlines.sort((a, b) => (a.daysRemaining || 0) - (b.daysRemaining || 0))[0];

  // Adicionar nota / andamento judicial
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    addActivity({
      caseId: currentCase.id,
      title: 'Nota Interna / Despacho Processual Registado',
      description: newNoteText.trim(),
      authorName: newNoteAuthor,
      authorRole: 'Advocacia / Patrono',
      type: 'INTERNAL_NOTE'
    });

    setNewNoteText('');
    showToast('Nota processual registada com sucesso no dossier.', 'success');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="p-6 bg-slate-850 border-b border-slate-800 flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-sm font-mono font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20">
                  Proc. nº {currentCase.caseNumber}
                </span>

                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                  currentCase.status === CaseStatus.CLOSED || currentCase.status === CaseStatus.ARCHIVED
                    ? 'bg-slate-700 text-slate-300 border-slate-600'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                }`}>
                  Fase: {currentCase.status}
                </span>

                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-700/60 text-slate-300">
                  {currentCase.jurisdiction}
                </span>

                {currentCase.priority === 'CRITICAL' && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Urgente
                  </span>
                )}

                {currentCase.isConfidential && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Segredo de Justiça
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-white tracking-tight">
                {currentCase.subject}
              </h2>

              <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-blue-400" />
                  <span>{currentCase.courtName}</span>
                </span>
                {currentCase.section && (
                  <span>• Secção: <strong className="text-slate-300">{currentCase.section}</strong></span>
                )}
                <span>• Cliente: <strong className="text-slate-200">{currentCase.clientName}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsEditOpen(true)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Editar dados gerais do processo"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Editar Dados</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 6 Separadores Coerentes */}
          <div className="px-6 border-b border-slate-800 bg-slate-900/60 flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>1. Resumo</span>
            </button>

            <button
              onClick={() => setActiveTab('parties')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'parties'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>2. Partes & Mandatários ({currentCase.parties.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>3. Peças & Documentos ({caseDocuments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('deadlines')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'deadlines'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>4. Agenda & Prazos ({caseDeadlines.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('finance')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'finance'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BadgeDollarSign className="w-3.5 h-3.5" />
              <span>5. Honorários & Pagamentos ({caseFees.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>6. Histórico & Notas ({caseActivities.length})</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* SEPARADOR 1: RESUMO */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Banner de Próximo Prazo ou Alerta */}
                {nextDeadline && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-800 to-slate-800 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                          Próximo Prazo / Audiência Agendada
                        </span>
                        <h4 className="text-sm font-bold text-white">{nextDeadline.title}</h4>
                        <p className="text-xs text-slate-300">
                          Data limite: <strong className="text-white">{nextDeadline.dueDate}</strong> às {nextDeadline.dueTime} • Responsável: {nextDeadline.assignedLawyerName}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {nextDeadline.daysRemaining === 0 ? 'Expira Hoje' : `${nextDeadline.daysRemaining} dias restantes`}
                      </span>
                    </div>
                  </div>
                )}

                {/* Resumo de Indicadores Principais */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Valor da Causa</span>
                    <div className="text-lg font-bold text-white mt-1">
                      {formatAOA(currentCase.claimValueAoa)}
                    </div>
                    <span className="text-[11px] text-slate-500">Fixado na petição</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Provisão de Risco</span>
                    <div className="text-lg font-bold text-amber-400 mt-1">
                      {formatAOA(currentCase.provisionedValueAoa || currentCase.claimValueAoa)}
                    </div>
                    <span className="text-[11px] text-slate-500">Estimativa contabilística</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Advogado Patrono</span>
                    <div className="text-sm font-bold text-white mt-1 truncate">
                      {currentCase.responsibleLawyerName}
                    </div>
                    <span className="text-[11px] text-emerald-400">OAA e Mandato Ativo</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Magistrado Titular</span>
                    <div className="text-sm font-bold text-white mt-1 truncate">
                      {currentCase.judgeName || 'Aguardando atribuição'}
                    </div>
                    <span className="text-[11px] text-slate-400">Juiz de Direito</span>
                  </div>
                </div>

                {/* Equipa Jurídica Alocada */}
                <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span>Equipa Jurídica Alocada ao Dossier</span>
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {(currentCase.teamMembers || [currentCase.responsibleLawyerName]).map((member, idx) => (
                      <span key={idx} className="text-xs px-3 py-1 rounded-lg bg-slate-800 border border-slate-750 text-slate-200 font-medium">
                        {member}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Resumo Fáctico */}
                <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Resumo Fáctico & Causa de Pedir
                    </h3>
                    <span className="text-[11px] text-slate-500">Distribuído em {currentCase.distributionDate}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300 whitespace-pre-line">
                    {currentCase.description}
                  </p>
                </div>
              </div>
            )}

            {/* SEPARADOR 2: PARTES & REPRESENTANTES */}
            {activeTab === 'parties' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Partes Processuais e Mandatários Judiciais</h3>
                    <p className="text-xs text-slate-400">Registo de intervenientes, mandatários constituídos e cédulas OAA.</p>
                  </div>
                  <button
                    onClick={() => setIsAddPartyOpen(true)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Parte</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentCase.parties.map((party) => (
                    <div key={party.id} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/70 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          party.role === 'CLAIMANT'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : party.role === 'DEFENDANT'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}>
                          {party.role === 'CLAIMANT' ? 'Autor / Requerente' : party.role === 'DEFENDANT' ? 'Réu / Demandado' : 'Interveniente / Terceiro'}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{party.name}</h4>

                      {party.lawyerName ? (
                        <div className="pt-2 border-t border-slate-750 text-xs text-slate-300">
                          <span className="text-slate-400">Mandatário Forense: </span>
                          <strong>{party.lawyerName}</strong>
                          {party.oaaNumber && (
                            <span className="ml-1.5 text-amber-400 font-mono text-[11px]">({party.oaaNumber})</span>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic pt-2 border-t border-slate-750">
                          Sem mandatário forense registado nos autos.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SEPARADOR 3: PEÇAS & DOCUMENTOS */}
            {activeTab === 'documents' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">Repositório Digital de Peças Processuais</h3>
                    <p className="text-xs text-slate-400">Peças, articulados, contratos e provas com controlo de visibilidade no portal.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={docCategoryFilter}
                      onChange={(e) => setDocCategoryFilter(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                    >
                      <option value="ALL">Todas as Categorias</option>
                      <option value="PETITION">Petições</option>
                      <option value="EVIDENCE">Provas Documentais</option>
                      <option value="CONTRACT">Contratos</option>
                      <option value="POWER_OF_ATTORNEY">Procurações</option>
                    </select>

                    <button
                      onClick={() => setIsUploadDocOpen(true)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Carregar Peça</span>
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-slate-800 rounded-2xl bg-slate-800/60 border border-slate-700/70 overflow-hidden text-xs">
                  {filteredDocs.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      Nenhum documento encontrado para o filtro selecionado.
                    </div>
                  ) : (
                    filteredDocs.map((doc) => (
                      <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-slate-800/80 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-white">{doc.title}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                                {doc.category}
                              </span>
                              {doc.isClientVisible && (
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-semibold border border-emerald-500/20">
                                  Visível no Portal do Cliente
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-1">
                              Versão {doc.version} • {(doc.fileSize / 1024 / 1024).toFixed(2)} MB • Carregado por {doc.uploadedByName} em {new Date(doc.createdAt).toLocaleDateString('pt-AO')}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => showToast(`Download demonstrativo iniciado: ${doc.title}`, 'info')}
                          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
                          title="Descarregar ficheiro"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* SEPARADOR 4: AGENDA & PRAZOS */}
            {activeTab === 'deadlines' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Controlo de Prazos Peremptórios e Diligências</h3>
                    <p className="text-xs text-slate-400">Prazos vinculados com cálculo de caducidade e dias restantes.</p>
                  </div>
                  <button
                    onClick={() => setIsAddDeadlineOpen(true)}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Registar Prazo / Audiência</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {caseDeadlines.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      Sem prazos ou diligências pendentes neste processo.
                    </div>
                  ) : (
                    caseDeadlines.map((dl) => (
                      <div
                        key={dl.id}
                        className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {dl.priority}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">Patrono: {dl.assignedLawyerName}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white">{dl.title}</h4>
                          <p className="text-xs text-slate-300">{dl.description}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-white flex items-center sm:justify-end gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-blue-400" />
                            <span>{dl.dueDate}</span>
                          </div>
                          <div className="text-[11px] text-slate-400">Limite: {dl.dueTime}</div>
                          <div className="mt-1 text-xs font-bold text-amber-400">
                            {dl.daysRemaining === 0 ? 'Expira hoje!' : `${dl.daysRemaining} dias restantes`}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* SEPARADOR 5: HONORÁRIOS & RENTABILIDADE */}
            {activeTab === 'finance' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <BadgeDollarSign className="w-4 h-4 text-emerald-400" />
                      <span>Rentabilidade Forense, Honorários & Despesas (AOA)</span>
                    </h3>
                    <p className="text-xs text-slate-400">Modelo contratual, faturação acumulada, liquidações e preparos judiciais.</p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setIsInvoiceModalOpen(true)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 shadow"
                    >
                      <Printer className="w-3.5 h-3.5 text-blue-400" />
                      <span>Extrato / Recibo</span>
                    </button>
                    <button
                      onClick={() => setIsAddExpenseOpen(true)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-amber-600 text-slate-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 shadow"
                    >
                      <Receipt className="w-3.5 h-3.5 text-amber-400" />
                      <span>+ Despesa</span>
                    </button>
                    <button
                      onClick={() => setIsAddPaymentOpen(true)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Pagamento</span>
                    </button>
                  </div>
                </div>

                {/* 6 Executive Profitability Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/70 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Modelo</span>
                    <span className="text-xs font-bold text-blue-400 block truncate">{caseMetric.contractModel}</span>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/70 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contratado</span>
                    <span className="text-xs font-mono font-bold text-white block">
                      {formatAOA(caseFees.reduce((acc, f) => acc + f.amountAoa, 0))}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/70 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Recebido</span>
                    <span className="text-xs font-mono font-bold text-emerald-400 block">
                      {formatAOA(caseFees.reduce((acc, f) => acc + f.paidAmountAoa, 0))}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/70 space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Pendente</span>
                    <span className="text-xs font-mono font-bold text-amber-400 block">
                      {formatAOA(caseFees.reduce((acc, f) => acc + f.balanceAoa, 0))}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/70 space-y-1">
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Despesas</span>
                    <span className="text-xs font-mono font-bold text-rose-300 block">
                      {formatAOA(caseExpenses.reduce((acc, e) => acc + e.amountAoa, 0))}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/70 space-y-1">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Resultado Est.</span>
                    <span className="text-xs font-mono font-bold text-purple-300 block">
                      {formatAOA(
                        caseFees.reduce((acc, f) => acc + f.paidAmountAoa, 0) -
                        caseExpenses.filter(e => !e.isReimbursable).reduce((acc, e) => acc + e.amountAoa, 0)
                      )}
                    </span>
                  </div>
                </div>

                {/* Subseção A: Honorários do Processo */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Lançamentos de Honorários Forenses ({caseFees.length})
                  </h4>
                  {caseFees.length === 0 ? (
                    <div className="p-4 bg-slate-800/40 rounded-xl text-center text-xs text-slate-400">
                      Sem lançamentos de honorários registados neste processo.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {caseFees.map((fee) => (
                        <div key={fee.id} className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{fee.title}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">
                                {fee.feeType}
                              </span>
                              {fee.receiptNumber && (
                                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                  {fee.receiptNumber}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Vencimento: {fee.dueDate} {fee.notes && `• ${fee.notes}`}</p>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-sm font-bold text-white font-mono">{formatAOA(fee.amountAoa)}</span>
                            <div className={`text-xs font-semibold mt-0.5 ${fee.status === 'PAID' ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {fee.status === 'PAID' ? 'Liquidado' : `Saldo: ${formatAOA(fee.balanceAoa)}`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subseção B: Despesas Processuais e Preparos */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Despesas Forenses, Preparos e Emolumentos ({caseExpenses.length})
                  </h4>
                  {caseExpenses.length === 0 ? (
                    <div className="p-4 bg-slate-800/40 rounded-xl text-center text-xs text-slate-400">
                      Nenhuma despesa processual lançada para este processo.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {caseExpenses.map((exp) => (
                        <div key={exp.id} className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-white">{exp.description}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                exp.isReimbursable
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              }`}>
                                {exp.isReimbursable ? 'Reembolsável' : 'Operacional'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">Data: {exp.date}</p>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <div className="text-right">
                              <span className="text-sm font-bold text-rose-300 font-mono">{formatAOA(exp.amountAoa)}</span>
                              <div className={`text-xs font-semibold mt-0.5 ${
                                exp.isReimbursed ? 'text-emerald-400' : 'text-amber-400'
                              }`}>
                                {exp.isReimbursed ? 'Reembolsada' : 'Aguardando Reembolso'}
                              </div>
                            </div>

                            {exp.isReimbursable && !exp.isReimbursed && (
                              <button
                                onClick={() => markExpenseReimbursed(exp.id)}
                                className="px-2.5 py-1 bg-slate-700 hover:bg-emerald-600 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1"
                                title="Marcar como Reembolsada"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Reembolsar</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SEPARADOR 6: HISTÓRICO & NOTAS */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                {/* Formulário de Nova Nota / Despacho */}
                <form onSubmit={handleAddNote} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/70 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-blue-400" />
                    <span>Registar Nova Nota Interna / Despacho Processual</span>
                  </h4>

                  <textarea
                    rows={2}
                    placeholder="Registe notas sobre audiências, reuniões com clientes, despachos judiciais ou instruções a estagiários..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    required
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  />

                  <div className="flex items-center justify-between gap-2">
                    <select
                      value={newNoteAuthor}
                      onChange={(e) => setNewNoteAuthor(e.target.value)}
                      className="bg-slate-850 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none"
                    >
                      <option value="Dr. Rui Falcão de Carvalho">Dr. Rui Falcão de Carvalho (Sócio)</option>
                      <option value="Dra. Kieza dos Santos Manuel">Dra. Kieza dos Santos Manuel (Advogada)</option>
                      <option value="Nzinga Luvumbo (Estagiário)">Nzinga Luvumbo (Estagiário OAA)</option>
                    </select>

                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow transition-colors"
                    >
                      Publicar no Dossier
                    </button>
                  </div>
                </form>

                {/* Timeline */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Linha do Tempo Auditada do Processo
                  </h4>

                  <div className="relative pl-6 border-l-2 border-slate-700 space-y-6 text-xs">
                    {caseActivities.map((act) => (
                      <div key={act.id} className="relative">
                        <div className={`absolute -left-[31px] top-0 w-3 h-3 rounded-full ring-4 ring-slate-900 ${
                          act.type === 'STATUS_CHANGE'
                            ? 'bg-emerald-500'
                            : act.type === 'HEARING'
                            ? 'bg-amber-500'
                            : act.type === 'COURT_DECISION'
                            ? 'bg-blue-500'
                            : 'bg-indigo-400'
                        }`} />
                        <p className="font-bold text-white text-sm">{act.title}</p>
                        <p className="text-slate-300 mt-1 leading-relaxed">{act.description}</p>
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                          <span>{act.authorName}</span>
                          <span>•</span>
                          <span>{act.authorRole}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-500">
                            {new Date(act.createdAt).toLocaleString('pt-AO')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submodals */}
      <EditCaseModal
        legalCase={currentCase}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />

      <AddDeadlineModal
        caseId={currentCase.id}
        caseNumber={currentCase.caseNumber}
        isOpen={isAddDeadlineOpen}
        onClose={() => setIsAddDeadlineOpen(false)}
      />

      <UploadDocumentModal
        caseId={currentCase.id}
        caseNumber={currentCase.caseNumber}
        isOpen={isUploadDocOpen}
        onClose={() => setIsUploadDocOpen(false)}
      />

      <AddPartyModal
        caseId={currentCase.id}
        caseNumber={currentCase.caseNumber}
        isOpen={isAddPartyOpen}
        onClose={() => setIsAddPartyOpen(false)}
      />

      <AddPaymentModal
        caseFees={caseFees}
        caseNumber={currentCase.caseNumber}
        isOpen={isAddPaymentOpen}
        onClose={() => setIsAddPaymentOpen(false)}
      />

      <AddExpenseModal
        defaultCaseId={currentCase.id}
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
      />

      <InvoiceReceiptModal
        legalCase={currentCase}
        caseFees={caseFees}
        caseExpenses={caseExpenses}
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />
    </>
  );
};
