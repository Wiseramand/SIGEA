import React, { useState } from 'react';
import { LegalParty } from '@sigea/shared';
import { useCases } from '../../context/CasesContext';
import { X, UserPlus } from 'lucide-react';

interface AddPartyModalProps {
  caseId: string;
  caseNumber: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AddPartyModal: React.FC<AddPartyModalProps> = ({
  caseId,
  caseNumber,
  isOpen,
  onClose
}) => {
  const { addParty } = useCases();

  const [name, setName] = useState('');
  const [role, setRole] = useState<LegalParty['role']>('DEFENDANT');
  const [lawyerName, setLawyerName] = useState('');
  const [oaaNumber, setOaaNumber] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addParty(caseId, {
      name: name.trim(),
      role,
      lawyerName: lawyerName.trim() || undefined,
      oaaNumber: oaaNumber.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        <div className="p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Adicionar Parte Processual</h2>
              <p className="text-xs text-slate-400">Proc. nº {caseNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Qualidade Processual</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="DEFENDANT">Réu / Requerido</option>
              <option value="INTERVENIENT">Interveniente Principal / Acessório</option>
              <option value="THIRD_PARTY">Terceiro Interessado / Opoente</option>
              <option value="CLAIMANT">Autor / Co-requerente</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Nome Completo / Denominação Social *</label>
            <input
              type="text"
              placeholder="Ex: Seguradora Mundial Angola SA"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Advogado Mandatário</label>
              <input
                type="text"
                placeholder="Ex: Dr. Silvestre Pedro"
                value={lawyerName}
                onChange={(e) => setLawyerName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Cédula OAA</label>
              <input
                type="text"
                placeholder="Ex: OAA 0984"
                value={oaaNumber}
                onChange={(e) => setOaaNumber(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
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
              Adicionar Parte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
