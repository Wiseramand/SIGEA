import React, { useState } from 'react';
import { LegalCase, CaseStatus } from '@sigea/shared';
import { useCases } from '../../context/CasesContext';
import { X, Edit3, Shield, Scale } from 'lucide-react';

interface EditCaseModalProps {
  legalCase: LegalCase;
  isOpen: boolean;
  onClose: () => void;
}

export const EditCaseModal: React.FC<EditCaseModalProps> = ({
  legalCase,
  isOpen,
  onClose
}) => {
  const { updateCase } = useCases();

  const [status, setStatus] = useState<CaseStatus>(legalCase.status);
  const [priority, setPriority] = useState<'NORMAL' | 'HIGH' | 'CRITICAL'>(legalCase.priority || 'NORMAL');
  const [judgeName, setJudgeName] = useState(legalCase.judgeName || '');
  const [section, setSection] = useState(legalCase.section || '');
  const [provisionedValueAoa, setProvisionedValueAoa] = useState(legalCase.provisionedValueAoa || legalCase.claimValueAoa);
  const [isConfidential, setIsConfidential] = useState(legalCase.isConfidential);
  const [description, setDescription] = useState(legalCase.description || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCase(legalCase.id, {
      status,
      priority,
      judgeName: judgeName.trim() || undefined,
      section: section.trim() || undefined,
      provisionedValueAoa: Number(provisionedValueAoa),
      isConfidential,
      description: description.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Editar Dados Processuais</h2>
              <p className="text-xs text-slate-400">Proc. nº {legalCase.caseNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Fase / Estado Processual</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CaseStatus)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value={CaseStatus.DISTRIBUTED}>Distribuído</option>
                <option value={CaseStatus.INITIAL_PHASE}>Fase Inicial / Articulados</option>
                <option value={CaseStatus.INSTRUCTION}>Instrução & Produção de Prova</option>
                <option value={CaseStatus.HEARING}>Audiência / Julgamento</option>
                <option value={CaseStatus.SENTENCE}>Decisão / Sentença</option>
                <option value={CaseStatus.APPEAL}>Fase de Recurso</option>
                <option value={CaseStatus.ENFORCEMENT}>Execução de Sentença</option>
                <option value={CaseStatus.CLOSED}>Concluído</option>
                <option value={CaseStatus.ARCHIVED}>Arquivado</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Prioridade</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="NORMAL">Normal</option>
                <option value="HIGH">Alta Prioridade</option>
                <option value="CRITICAL">Crítica / Urgente</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-blue-400" />
                <span>Juiz de Direito Titular</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Dr. Valdemar Pascoal"
                value={judgeName}
                onChange={(e) => setJudgeName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Secção do Tribunal</label>
              <input
                type="text"
                placeholder="Ex: 2ª Secção do Cível"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Valor Provisionado para Risco (AOA / Kz)</label>
            <input
              type="number"
              value={provisionedValueAoa}
              onChange={(e) => setProvisionedValueAoa(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Resumo Fáctico Atualizado</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-850 border border-slate-800">
            <input
              type="checkbox"
              id="editConfidentialCheck"
              checked={isConfidential}
              onChange={(e) => setIsConfidential(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700"
            />
            <label htmlFor="editConfidentialCheck" className="text-slate-300 cursor-pointer flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Processo Confidencial / Segredo de Justiça</span>
            </label>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow"
            >
              Guardar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
