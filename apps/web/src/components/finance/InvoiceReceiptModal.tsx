import React, { useState, useEffect } from 'react';
import { formatAOA, FeeItem, ExpenseItem, LegalCase } from '@sigea/shared';
import { CURRENT_ORGANIZATION } from '../../data/mockData';
import { X, Printer, ShieldAlert, FileText } from 'lucide-react';

interface InvoiceReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  legalCase?: LegalCase | null;
  feeItem?: FeeItem | null;
  caseFees?: FeeItem[];
  caseExpenses?: ExpenseItem[];
}

export const InvoiceReceiptModal: React.FC<InvoiceReceiptModalProps> = ({
  isOpen,
  onClose,
  legalCase,
  feeItem,
  caseFees = [],
  caseExpenses = []
}) => {
  const [withholdingTaxRate, setWithholdingTaxRate] = useState<number>(6.5); // 6.5% Imposto Industrial Angola (Demonstrativo)
  const [applyWithholdingTax, setApplyWithholdingTax] = useState<boolean>(true);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Items to display: either single feeItem or all fees for the case
  const items = feeItem ? [feeItem] : caseFees;
  const grossFees = items.reduce((sum, f) => sum + f.amountAoa, 0);
  const paidFees = items.reduce((sum, f) => sum + f.paidAmountAoa, 0);
  const pendingFees = items.reduce((sum, f) => sum + f.balanceAoa, 0);

  const reimbursableExpenses = caseExpenses.filter(e => e.isReimbursable);
  const totalExpenses = reimbursableExpenses.reduce((sum, e) => sum + e.amountAoa, 0);

  const subtotalGross = grossFees + totalExpenses;
  const simulatedTax = applyWithholdingTax ? Math.round(grossFees * (withholdingTaxRate / 100)) : 0;
  const netPayable = subtotalGross - simulatedTax;

  const invoiceNumber = feeItem?.receiptNumber || `FAT-DEMO/${new Date().getFullYear()}/0482`;
  const invoiceDate = new Date().toISOString().split('T')[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Toolbar (pinned to top, hidden when printing) */}
        <div className="p-4 sm:px-6 border-b border-slate-800 flex items-center justify-between bg-slate-850 shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Extrato Financeiro & Pré-visualização de Fatura-Recibo
              </h3>
              <p className="text-[11px] text-slate-400">
                {legalCase ? `Proc. nº ${legalCase.caseNumber} • ${legalCase.clientName}` : 'Documento Demonstrativo Forense'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              title="Imprimir ou gerar PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:px-3 sm:py-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              aria-label="Fechar"
              title="Fechar (Esc)"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Fechar</span>
            </button>
          </div>
        </div>

        {/* Printable Document Body with internal scroll */}
        <div className="p-6 sm:p-8 bg-slate-950 text-slate-100 space-y-6 overflow-y-auto flex-1 print:p-0 print:bg-white print:text-black print:overflow-visible">
          {/* Watermark / Legal Disclaimer Alert */}
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center space-y-1 print:border-slate-300">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 print:text-black">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Documento de Demonstração — Não Válido para Efeitos Fiscais Oficiais</span>
            </div>
            <p className="text-[11px] text-slate-400 print:text-slate-600">
              Emitido pelo protótipo SIGEA. Valores simulados para análise comercial e financeira de escritório de advocacia.
            </p>
          </div>

          {/* Law Firm Header & Invoice Meta */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-800 print:border-slate-300">
            <div>
              <h1 className="text-lg font-black text-white print:text-black tracking-tight">
                {CURRENT_ORGANIZATION.name}
              </h1>
              <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
                NIF: <span className="font-mono font-bold text-slate-300 print:text-black">{CURRENT_ORGANIZATION.nif}</span> &bull; Sociedade de Advogados, RL
              </p>
              <p className="text-xs text-slate-400 print:text-slate-600 mt-0.5">
                {CURRENT_ORGANIZATION.address}, {CURRENT_ORGANIZATION.city}, {CURRENT_ORGANIZATION.country}
              </p>
              <p className="text-xs text-slate-400 print:text-slate-600">
                Contacto: {CURRENT_ORGANIZATION.phone} &bull; {CURRENT_ORGANIZATION.email}
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="text-xs font-mono font-bold text-emerald-400 print:text-black bg-emerald-500/10 print:bg-slate-100 px-3 py-1 rounded-lg border border-emerald-500/20 print:border-slate-300 inline-block">
                {invoiceNumber}
              </div>
              <div className="text-xs text-slate-400 print:text-slate-600">Data de Emissão: <strong className="text-slate-200 print:text-black">{invoiceDate}</strong></div>
              <div className="text-xs text-slate-400 print:text-slate-600">Moeda: <strong className="text-slate-200 print:text-black">Kwanza Angolano (AOA)</strong></div>
            </div>
          </div>

          {/* Client & Case Details Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 print:bg-slate-50 print:border-slate-300 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block mb-1">
                Exmo.(s) Senhor(es) / Cliente
              </span>
              <p className="font-bold text-white print:text-black text-sm">
                {feeItem?.clientName || legalCase?.clientName || 'Cliente Corporativo'}
              </p>
              <p className="text-slate-400 print:text-slate-600 mt-0.5">
                Rep. Legal / NIF: <span className="font-mono">5401982736 (Angola)</span>
              </p>
              <p className="text-slate-400 print:text-slate-600">
                Luanda, República de Angola
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block mb-1">
                Referência do Processo Judicial
              </span>
              <p className="font-bold text-white print:text-black font-mono">
                {legalCase?.caseNumber || feeItem?.caseNumber || '0284/24-C'}
              </p>
              <p className="text-slate-400 print:text-slate-600 mt-0.5">
                Tribunal: {legalCase?.courtName || 'Tribunal da Comarca de Luanda'}
              </p>
              <p className="text-slate-400 print:text-slate-600 line-clamp-1">
                Ação: {legalCase?.subject || 'Ação Declarativa Ordinária'}
              </p>
            </div>
          </div>

          {/* Table of Items */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-slate-700">
              Discriminação de Serviços Forenses & Honorários
            </h3>

            <div className="border border-slate-800 print:border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 print:bg-slate-100 border-b border-slate-800 print:border-slate-300 text-slate-400 print:text-slate-700">
                  <tr>
                    <th className="p-3">Descrição da Prestação Forense</th>
                    <th className="p-3">Modelo</th>
                    <th className="p-3 text-right">Montante (AOA)</th>
                    <th className="p-3 text-right">Liquidado</th>
                    <th className="p-3 text-right">Saldo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                  {items.map((fee) => (
                    <tr key={fee.id}>
                      <td className="p-3 font-semibold text-white print:text-black">
                        {fee.title}
                      </td>
                      <td className="p-3 text-slate-400 print:text-slate-600 font-mono text-[11px]">
                        {fee.feeType}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-white print:text-black">
                        {formatAOA(fee.amountAoa)}
                      </td>
                      <td className="p-3 text-right font-mono text-emerald-400 print:text-black">
                        {formatAOA(fee.paidAmountAoa)}
                      </td>
                      <td className="p-3 text-right font-mono text-amber-400 print:text-black">
                        {formatAOA(fee.balanceAoa)}
                      </td>
                    </tr>
                  ))}

                  {reimbursableExpenses.map((exp) => (
                    <tr key={exp.id} className="bg-slate-900/40 print:bg-slate-50">
                      <td className="p-3 text-slate-300 print:text-black flex items-center gap-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">DESPESA</span>
                        <span>{exp.description}</span>
                      </td>
                      <td className="p-3 text-slate-400 print:text-slate-600 text-[11px]">Reembolso</td>
                      <td className="p-3 text-right font-mono font-semibold text-white print:text-black">
                        {formatAOA(exp.amountAoa)}
                      </td>
                      <td className="p-3 text-right font-mono text-emerald-400 print:text-black">
                        {exp.isReimbursed ? formatAOA(exp.amountAoa) : formatAOA(0)}
                      </td>
                      <td className="p-3 text-right font-mono text-amber-400 print:text-black">
                        {exp.isReimbursed ? formatAOA(0) : formatAOA(exp.amountAoa)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tax Withholding & Summary Calculation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Left: Retenção na Fonte configurável */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 print:border-slate-300 text-xs space-y-3">
              <span className="text-xs font-bold text-white print:text-black block">
                Simulação de Retenção na Fonte (Angola)
              </span>

              <div className="flex items-center justify-between gap-3 flex-wrap print:hidden">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={applyWithholdingTax}
                    onChange={(e) => setApplyWithholdingTax(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700"
                  />
                  <span className="text-slate-300">Simular Retenção de Imposto Industrial</span>
                </label>

                {applyWithholdingTax && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-400">Taxa:</span>
                    <input
                      type="number"
                      min="1"
                      max="25"
                      step="0.5"
                      value={withholdingTaxRate}
                      onChange={(e) => setWithholdingTaxRate(Number(e.target.value))}
                      className="w-14 px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-center text-white font-mono font-bold"
                    />
                    <span className="text-slate-400">%</span>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-400 print:text-slate-600 leading-relaxed">
                * Nota Explicativa: A retenção na fonte sobre prestações de serviços de advocacia é apresentada a título de estimativa configurável, sujeita a confirmação e enquadramento fiscal perante a AGT.
              </p>
            </div>

            {/* Right: Totais Finais */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 print:bg-slate-100 print:border-slate-300 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300 print:text-slate-700">
                <span>Subtotal Bruto de Honorários:</span>
                <span className="font-mono font-bold text-white print:text-black">{formatAOA(grossFees)}</span>
              </div>

              {totalExpenses > 0 && (
                <div className="flex justify-between text-slate-300 print:text-slate-700">
                  <span>Despesas Forenses Reembolsáveis:</span>
                  <span className="font-mono font-bold text-white print:text-black">{formatAOA(totalExpenses)}</span>
                </div>
              )}

              {applyWithholdingTax && (
                <div className="flex justify-between text-amber-400 print:text-black">
                  <span>Retenção na Fonte Estimada ({withholdingTaxRate}%):</span>
                  <span className="font-mono font-bold">- {formatAOA(simulatedTax)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 print:border-slate-300 flex justify-between text-sm font-bold text-emerald-400 print:text-black">
                <span>Total Líquido do Contrato:</span>
                <span className="font-mono">{formatAOA(netPayable)}</span>
              </div>

              <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                <span>Total Efetivamente Liquidado:</span>
                <span className="font-mono text-emerald-400">{formatAOA(paidFees)}</span>
              </div>

              <div className="flex justify-between text-[11px] font-bold text-amber-400">
                <span>Saldo Global Pendente:</span>
                <span className="font-mono">{formatAOA(pendingFees)}</span>
              </div>
            </div>
          </div>

          {/* Bank coordinates & signatures */}
          <div className="pt-6 border-t border-slate-800 print:border-slate-300 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 print:text-slate-600 gap-4">
            <div>
              <p className="font-semibold text-slate-300 print:text-black">Coordenadas Bancárias para Liquidação (BFA / BAI):</p>
              <p className="font-mono text-[11px]">IBAN: AO06.0006.0000.1892.4410.1012.3 &bull; Titular: Falcão & Associados RL</p>
            </div>
            <div className="text-center sm:text-right">
              <div className="w-48 border-b border-slate-600 print:border-black mb-1 mx-auto sm:ml-auto"></div>
              <p className="text-[11px] font-semibold text-slate-300 print:text-black">Direção Financeira e Coordenação Forense</p>
            </div>
          </div>
        </div>

        {/* Modal Footer (pinned at bottom, hidden when printing) */}
        <div className="p-4 px-6 border-t border-slate-800 bg-slate-850 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Documento para efeitos de demonstração interna e comercial.</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-blue-400" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
            >
              <X className="w-4 h-4" />
              <span>Fechar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
