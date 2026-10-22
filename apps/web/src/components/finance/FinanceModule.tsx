import { formatAOA } from '@sigea/shared';
import { MOCK_FEES } from '../../data/mockData';
import { BadgeDollarSign, Plus, Download } from 'lucide-react';

export const FinanceModule: React.FC = () => {
  const totalBilled = MOCK_FEES.reduce((acc, f) => acc + f.amountAoa, 0);
  const totalPaid = MOCK_FEES.reduce((acc, f) => acc + f.paidAmountAoa, 0);
  const totalPending = MOCK_FEES.reduce((acc, f) => acc + f.balanceAoa, 0);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BadgeDollarSign className="w-6 h-6 text-emerald-400" />
            <span>Gestão Financeira & Honorários Jurídicos (AOA)</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Controlo de avenças, honorários por hora, quota litis (sucesso) e despesas processuais em Kwanzas.
          </p>
        </div>

        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          <span>Lançar Honorário</span>
        </button>
      </div>

      {/* KPI Cards in AOA */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Contratado</span>
          <div className="text-2xl font-bold text-white mt-1">{formatAOA(totalBilled)}</div>
          <span className="text-xs text-slate-400 mt-2 block">Volume acumulado de contratos jurídicos</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Total Liquidado (Pago)</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{formatAOA(totalPaid)}</div>
          <span className="text-xs text-slate-400 mt-2 block">Recebido em contas bancárias do escritório</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Saldos Pendentes</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">{formatAOA(totalPending)}</div>
          <span className="text-xs text-slate-400 mt-2 block">A vencer ou com prazo de liquidação aberto</span>
        </div>
      </div>

      {/* Fees List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Lançamentos de Honorários & Faturação</h2>
          <button className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Relatório Fiscal (AGT)</span>
          </button>
        </div>

        <div className="divide-y divide-slate-800 rounded-2xl bg-slate-800/60 border border-slate-700/70 overflow-hidden">
          {MOCK_FEES.map((fee) => (
            <div key={fee.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/80 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                    {fee.caseNumber}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                    {fee.feeType}
                  </span>
                  {fee.receiptNumber && (
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {fee.receiptNumber}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-white">{fee.title}</h3>
                <p className="text-xs text-slate-400">Cliente: <strong className="text-slate-300">{fee.clientName}</strong></p>
                {fee.notes && <p className="text-xs text-slate-400 italic">{fee.notes}</p>}
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-700/40 shrink-0">
                <div className="text-left md:text-right">
                  <span className="text-xs text-slate-400">Valor</span>
                  <div className="text-base font-bold text-white">{formatAOA(fee.amountAoa)}</div>
                  <div className={`text-xs font-semibold mt-0.5 ${
                    fee.status === 'PAID' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {fee.status === 'PAID' ? 'Liquidado Integralmente' : `Pendente: ${formatAOA(fee.balanceAoa)}`}
                  </div>
                </div>

                <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors" title="Descarregar Recibo">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
