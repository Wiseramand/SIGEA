import React, { useState } from 'react';
import { useCases } from '../../context/CasesContext';
import { X, Receipt } from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCaseId?: string;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  defaultCaseId
}) => {
  const { cases, addExpense } = useCases();

  const [caseId, setCaseId] = useState<string>(defaultCaseId || cases[0]?.id || '');
  const [description, setDescription] = useState('');
  const [amountAoa, setAmountAoa] = useState<number>(150000);
  const [isReimbursable, setIsReimbursable] = useState(true);
  const [isReimbursed, setIsReimbursed] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg('Por favor informe a descrição ou objeto da despesa.');
      return;
    }
    if (amountAoa <= 0) {
      setErrorMsg('O valor da despesa deve ser superior a zero.');
      return;
    }

    const selectedCase = cases.find(c => c.id === caseId) || cases[0];

    addExpense({
      caseId: selectedCase.id,
      caseNumber: selectedCase.caseNumber,
      description: description.trim(),
      amountAoa: Number(amountAoa),
      isReimbursable,
      isReimbursed,
      date
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Registar Despesa Forense</h2>
              <p className="text-xs text-slate-400">Preparos judiciais, certidões cartorárias e custas operacionais (AOA)</p>
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

          {/* Processo Associado */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Processo Judicial Vinculado *
            </label>
            <select
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.caseNumber} — {c.clientName} ({c.courtName.split('—')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Descrição da Despesa / Emolumento *
            </label>
            <input
              type="text"
              placeholder="Ex: Preparos de recurso na 1ª Secção da Sala do Cível"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Valor em Kwanzas e Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Montante em Kwanzas (AOA) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1000"
                  step="5000"
                  value={amountAoa}
                  onChange={(e) => setAmountAoa(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Data do Desembolso *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Toggles de Reembolso */}
          <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white block">Despesa Reembolsável pelo Cliente</span>
                <span className="text-[11px] text-slate-400">Será faturada ao cliente nos termos do contrato de patrocínio</span>
              </div>
              <input
                type="checkbox"
                checked={isReimbursable}
                onChange={(e) => setIsReimbursable(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-0 focus:ring-offset-0 bg-slate-800 border-slate-700"
              />
            </label>

            {isReimbursable && (
              <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-700/40">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">Já Reembolsada / Paga pelo Cliente</span>
                  <span className="text-[11px] text-slate-400">O cliente já transferiu o fundo de provisão de despesas</span>
                </div>
                <input
                  type="checkbox"
                  checked={isReimbursed}
                  onChange={(e) => setIsReimbursed(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-0 focus:ring-offset-0 bg-slate-800 border-slate-700"
                />
              </label>
            )}
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
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-amber-600/20 transition-all flex items-center gap-1.5"
            >
              <span>Registar Despesa</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
