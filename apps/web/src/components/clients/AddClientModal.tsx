import React, { useState } from 'react';
import { ClientType, ANGOLA_PROVINCES } from '@sigea/shared';
import { useCases } from '../../context/CasesContext';
import { X, Users, Plus } from 'lucide-react';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose }) => {
  const { addClient } = useCases();

  const [name, setName] = useState('');
  const [type, setType] = useState<ClientType>(ClientType.COMPANY);
  const [nif, setNif] = useState('');
  const [legalRepresentative, setLegalRepresentative] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+244 9');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('Luanda');
  const [portalAccessEnabled, setPortalAccessEnabled] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !nif.trim()) return;

    addClient({
      name,
      type,
      nif,
      legalRepresentative: type === ClientType.COMPANY ? legalRepresentative : undefined,
      email,
      phone,
      address,
      province,
      city: province,
      portalAccessEnabled
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Cadastrar Novo Cliente / Entidade</h3>
              <p className="text-xs text-slate-400">Registo de Pessoa Singular ou Coletiva em Angola</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3 p-1 bg-slate-850 rounded-xl border border-slate-750">
            <button
              type="button"
              onClick={() => setType(ClientType.COMPANY)}
              className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                type === ClientType.COMPANY
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pessoa Coletiva (Empresa)
            </button>
            <button
              type="button"
              onClick={() => setType(ClientType.INDIVIDUAL)}
              className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                type === ClientType.INDIVIDUAL
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pessoa Singular
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {type === ClientType.COMPANY ? 'Razão Social / Denominação *' : 'Nome Completo do Cliente *'}
            </label>
            <input
              type="text"
              required
              placeholder={type === ClientType.COMPANY ? 'Ex: Sonangol Distribuidora, S.A.' : 'Ex: Dr. Baptista Sumbe'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                NIF Angolano (AGT) *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: 5418001234"
                value={nif}
                onChange={(e) => setNif(e.target.value.toUpperCase())}
                className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {type === ClientType.COMPANY && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Representante Legal
                </label>
                <input
                  type="text"
                  placeholder="Ex: Administrador Delegado"
                  value={legalRepresentative}
                  onChange={(e) => setLegalRepresentative(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Telefone de Contacto *
              </label>
              <input
                type="text"
                required
                placeholder="+244 923 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Correio Eletrónico (Email) *
              </label>
              <input
                type="email"
                required
                placeholder="juridico@cliente.ao"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Província *
              </label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {ANGOLA_PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Morada / Sede Social
              </label>
              <input
                type="text"
                placeholder="Ex: Av. 4 de Fevereiro, Talatona"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-850 rounded-xl border border-slate-750 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white block">Acesso ao Portal do Cliente</span>
              <span className="text-[11px] text-slate-400">Permite consulta segura de peças e recibos</span>
            </div>
            <input
              type="checkbox"
              checked={portalAccessEnabled}
              onChange={(e) => setPortalAccessEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 bg-slate-700 border-slate-600 focus:ring-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Cadastrar Cliente</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
