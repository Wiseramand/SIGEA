import React, { useState } from 'react';
import { FeeType, FeePaymentStatus } from '@sigea/shared';
import { useCases } from '../../context/CasesContext';
import { X, BadgeDollarSign } from 'lucide-react';

interface AddFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCaseId?: string;
}

export const AddFeeModal: React.FC<AddFeeModalProps> = ({
  isOpen,
  onClose,
  defaultCaseId
}) => {
  const { cases, addFee } = useCases();

  const [caseId, setCaseId] = useState<string>(defaultCaseId || cases[0]?.id || '');
  const [title, setTitle] = useState('');
  const [feeType, setFeeType] = useState<FeeType>(FeeType.FIXED);
  const [amountAoa, setAmountAoa] = useState<number>(5000000);
  const [dueDate, setDueDate] = useState('2026-11-30');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Por favor informe o título ou objeto do honorário.');
      return;
    }
    if (amountAoa <= 0) {
      setErrorMsg('O montante dos honorários deve ser superior a zero.');
      return;
    }

    const selectedCase = cases.find(c => c.id === caseId) || cases[0];

    addFee({
      caseId: selectedCase.id,
      caseNumber: selectedCase.caseNumber,
      clientId: selectedCase.clientId,
      clientName: selectedCase.clientName,
      title: title.trim(),
      feeType,
      amountAoa: Number(amountAoa),
      paidAmountAoa: 0,
      balanceAoa: Number(amountAoa),
      status: FeePaymentStatus.PENDING,
      dueDate,
      notes: notes.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <BadgeDollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Lançar Honorário / Faturação</h2>
              <p className="text-xs text-slate-400">Contrato de honorários, avenças e serviços forenses (AOA)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300">
              {errorMsg}
            </div>
          )}

          {/* Processo Vinculado */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Processo / Cliente Vinculado *
            </label>
            <select
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.caseNumber} — {c.clientName} ({c.courtName.split('—')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Título do Honorário */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Descrição da Fatura / Honorário *
            </label>
            <input
              type="text"
              placeholder="Ex: Honorários de Acompanhamento da Fase Instrutória"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Modelo de Cobrança & Montante */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Modelo de Cobrança *
              </label>
              <select
                value={feeType}
                onChange={(e) => setFeeType(e.target.value as FeeType)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value={FeeType.FIXED}>Honorário Fixo</option>
                <option value={FeeType.HOURLY}>Cobrança por Hora</option>
                <option value={FeeType.SUCCESS_FEE}>Honorário de Êxito (Quota Litis)</option>
                <option value={FeeType.HYBRID}>Misto (Entrada + Êxito)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Montante em Kwanzas (AOA) *
              </label>
              <input
                type="number"
                min="10000"
                step="50000"
                value={amountAoa}
                onChange={(e) => setAmountAoa(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Data de Vencimento */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Data Limite de Pagamento (Vencimento) *
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Notas */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Condições Contratuais / Notas Bancárias
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Liquidação em conta BFA do escritório. Sujeito à entrega das alegações finais."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5"
            >
              <span>Lançar Honorário</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
