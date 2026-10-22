import React, { useState } from 'react';
import { FeeItem, formatAOA } from '@sigea/shared';
import { useCases } from '../../context/CasesContext';
import { X, BadgeDollarSign } from 'lucide-react';

interface AddPaymentModalProps {
  caseFees: FeeItem[];
  caseNumber: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  caseFees,
  caseNumber,
  isOpen,
  onClose
}) => {
  const { addPayment } = useCases();

  const pendingFees = caseFees.filter((f) => f.balanceAoa > 0);
  const [selectedFeeId, setSelectedFeeId] = useState(pendingFees[0]?.id || caseFees[0]?.id || '');
  const selectedFee = caseFees.find((f) => f.id === selectedFeeId);

  const [paymentAmount, setPaymentAmount] = useState<number>(selectedFee?.balanceAoa || 0);
  const [receiptNumber, setReceiptNumber] = useState(`REC-${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeeId || paymentAmount <= 0) return;

    addPayment(selectedFeeId, Number(paymentAmount), receiptNumber.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        <div className="p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <BadgeDollarSign className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Registar Pagamento de Honorários</h2>
              <p className="text-xs text-slate-400">Proc. nº {caseNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Lançamento de Honorário a Liquidar</label>
            <select
              value={selectedFeeId}
              onChange={(e) => {
                setSelectedFeeId(e.target.value);
                const fee = caseFees.find((f) => f.id === e.target.value);
                if (fee) {
                  setPaymentAmount(fee.balanceAoa > 0 ? fee.balanceAoa : fee.amountAoa);
                }
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              {caseFees.map((fee) => (
                <option key={fee.id} value={fee.id}>
                  {fee.title} — Saldo: {formatAOA(fee.balanceAoa)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Montante Liquidado em Kwanzas (AOA) *</label>
            <input
              type="number"
              step="50000"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Número do Recibo / Comprovativo Bancário</label>
            <input
              type="text"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Emissão Conforme Normas Fiscais Angolanas</p>
            <p>O recibo será gerado em Kwanzas (Kz) com referência ao NIF do cliente e retenção legal aplicável.</p>
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
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow"
            >
              Confirmar Liquidação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
