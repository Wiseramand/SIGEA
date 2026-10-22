import React, { useState } from 'react';
import { SubscriptionTier, formatAOA } from '@sigea/shared';
import { Building2, Plus, Lock, X, Edit } from 'lucide-react';
import { useCases } from '../../context/CasesContext';

interface Tenant {
  id: string;
  name: string;
  nif: string;
  city: string;
  tier: SubscriptionTier;
  users: number;
  maxUsers: number;
  storageUsed: string;
  mrrAoa: number;
  status: 'ACTIVE' | 'SUSPENDED';
}

const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'org-01',
    name: 'Falcão & Associados — Sociedade de Advogados, RL',
    nif: '5417082390',
    city: 'Luanda',
    tier: SubscriptionTier.ENTERPRISE,
    users: 18,
    maxUsers: 50,
    storageUsed: '42.5 GB / 500 GB',
    mrrAoa: 1850000,
    status: 'ACTIVE'
  },
  {
    id: 'org-02',
    name: 'Benguela Legal Partners',
    nif: '5409128371',
    city: 'Benguela',
    tier: SubscriptionTier.PROFESSIONAL,
    users: 8,
    maxUsers: 25,
    storageUsed: '12.8 GB / 100 GB',
    mrrAoa: 950000,
    status: 'ACTIVE'
  },
  {
    id: 'org-03',
    name: 'Dr. Afonso Quaresma & Associados',
    nif: '5418290311',
    city: 'Lubango',
    tier: SubscriptionTier.STARTER,
    users: 3,
    maxUsers: 10,
    storageUsed: '3.1 GB / 50 GB',
    mrrAoa: 450000,
    status: 'ACTIVE'
  }
];

export const SuperAdminView: React.FC = () => {
  const { showToast } = useCases();
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);

  // Modals
  const [isProvisionOpen, setIsProvisionOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  // Provision Form
  const [name, setName] = useState('');
  const [nif, setNif] = useState('');
  const [city, setCity] = useState('Luanda');
  const [tier, setTier] = useState<SubscriptionTier>(SubscriptionTier.PROFESSIONAL);

  const totalMrr = tenants.reduce((acc, t) => acc + t.mrrAoa, 0);

  const mrrByTier: Record<SubscriptionTier, number> = {
    [SubscriptionTier.STARTER]: 450000,
    [SubscriptionTier.PROFESSIONAL]: 950000,
    [SubscriptionTier.BUSINESS]: 1400000,
    [SubscriptionTier.ENTERPRISE]: 1850000
  };

  const maxUsersByTier: Record<SubscriptionTier, number> = {
    [SubscriptionTier.STARTER]: 10,
    [SubscriptionTier.PROFESSIONAL]: 25,
    [SubscriptionTier.BUSINESS]: 35,
    [SubscriptionTier.ENTERPRISE]: 50
  };

  const storageByTier: Record<SubscriptionTier, string> = {
    [SubscriptionTier.STARTER]: '0.1 GB / 50 GB',
    [SubscriptionTier.PROFESSIONAL]: '0.1 GB / 100 GB',
    [SubscriptionTier.BUSINESS]: '0.1 GB / 250 GB',
    [SubscriptionTier.ENTERPRISE]: '0.1 GB / 500 GB'
  };

  const handleProvisionTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newTenant: Tenant = {
      id: `org-${Date.now()}`,
      name: name.trim(),
      nif: nif.trim() || '5400000000',
      city,
      tier,
      users: 1,
      maxUsers: maxUsersByTier[tier],
      storageUsed: storageByTier[tier],
      mrrAoa: mrrByTier[tier],
      status: 'ACTIVE'
    };

    setTenants([newTenant, ...tenants]);
    setIsProvisionOpen(false);
    setName('');
    setNif('');
    showToast(`Escritório ${newTenant.name} provisionado com sucesso na infraestrutura SaaS`, 'success');
  };

  const handleUpdateTier = (newTier: SubscriptionTier) => {
    if (!selectedTenant) return;

    setTenants(tenants.map(t => {
      if (t.id === selectedTenant.id) {
        return {
          ...t,
          tier: newTier,
          mrrAoa: mrrByTier[newTier],
          maxUsers: maxUsersByTier[newTier],
          storageUsed: storageByTier[newTier]
        };
      }
      return t;
    }));

    showToast(`Plano do escritório ${selectedTenant.name} atualizado para ${newTier}`, 'success');
    setSelectedTenant(null);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Plataforma SaaS Central
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-400" />
            <span>Gestão de Escritórios & Subscrições Multi-Tenant</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Controlo de infraestrutura, planos, quotas de armazenamento e faturamento mensal de subscrições.
          </p>
        </div>

        <button
          onClick={() => setIsProvisionOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Provisionar Novo Escritório</span>
        </button>
      </div>

      {/* Security principle banner */}
      <div className="p-4 rounded-xl bg-slate-850 border border-indigo-500/30 flex items-center gap-3 text-xs text-indigo-300">
        <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
        <div>
          <strong className="text-white">Princípio de Confidencialidade Absoluta: </strong>
          Platform Administration ≠ Legal Data Access. O Super Admin gere planos e contas, mas não tem acesso aos processos judiciais privados dos escritórios clientes.
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Escritórios Ativos</span>
          <div className="text-2xl font-bold text-white mt-1">{tenants.length} Organizações</div>
          <span className="text-xs text-emerald-400 mt-2 block">100% de retenção de clientes</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Utilizadores Licenciados</span>
          <div className="text-2xl font-bold text-white mt-1">
            {tenants.reduce((acc, t) => acc + t.users, 0)} Advogados & Colaboradores
          </div>
          <span className="text-xs text-slate-400 mt-2 block">
            Média de {(tenants.reduce((acc, t) => acc + t.users, 0) / tenants.length).toFixed(1)} por escritório
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">MRR da Plataforma (AOA)</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{formatAOA(totalMrr)}</div>
          <span className="text-xs text-slate-400 mt-2 block">Receita Recorrente Mensal</span>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">Escritórios de Advocacia Contratados</h2>

        <div className="divide-y divide-slate-800 rounded-2xl bg-slate-800/60 border border-slate-700/70 overflow-hidden text-xs">
          {tenants.map((t) => (
            <div key={t.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/80 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{t.name}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    Plano {t.tier}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                  <span>NIF: {t.nif}</span>
                  <span>•</span>
                  <span>Localização: {t.city}, Angola</span>
                  <span>•</span>
                  <span>Armazenamento: {t.storageUsed}</span>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-700/40 shrink-0">
                <div className="text-left md:text-right">
                  <span className="text-slate-400">Mensalidade</span>
                  <div className="text-sm font-bold text-white">{formatAOA(t.mrrAoa)} / mês</div>
                  <span className="text-[11px] text-emerald-400 font-medium">Assinatura Ativa</span>
                </div>

                <button
                  onClick={() => setSelectedTenant(t)}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-indigo-600 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Gerir Plano</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Provisionar Novo Escritório */}
      {isProvisionOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">Provisionar Novo Escritório SaaS</h3>
              </div>
              <button
                onClick={() => setIsProvisionOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProvisionTenant} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nome da Sociedade de Advogados *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Luanda Juris & Associados — RL"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">NIF Fiscal</label>
                  <input
                    type="text"
                    placeholder="ex: 5419082341"
                    value={nif}
                    onChange={(e) => setNif(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Província / Sede</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Luanda">Luanda</option>
                    <option value="Benguela">Benguela</option>
                    <option value="Huíla (Lubango)">Huíla (Lubango)</option>
                    <option value="Cabinda">Cabinda</option>
                    <option value="Cuanza Sul">Cuanza Sul</option>
                    <option value="Huambo">Huambo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Plano de Subscrição</label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as SubscriptionTier)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value={SubscriptionTier.STARTER}>Starter (até 10 utilizadores • 450.000 Kz/mês)</option>
                  <option value={SubscriptionTier.PROFESSIONAL}>Professional (até 25 utilizadores • 950.000 Kz/mês)</option>
                  <option value={SubscriptionTier.BUSINESS}>Business (até 35 utilizadores • 1.400.000 Kz/mês)</option>
                  <option value={SubscriptionTier.ENTERPRISE}>Enterprise (até 50 utilizadores • 1.850.000 Kz/mês)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProvisionOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/20"
                >
                  Provisionar Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Gerir Plano */}
      {selectedTenant && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">Gerir Plano do Escritório</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedTenant.name}</p>
              </div>
              <button
                onClick={() => setSelectedTenant(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-300">
                Selecione o novo nível de subscrição para este escritório. A quota de armazenamento e o limite de utilizadores serão atualizados instantaneamente:
              </p>

              <div className="space-y-2.5">
                {[
                  { tier: SubscriptionTier.STARTER, label: 'Starter', price: '450.000 Kz/mês', users: '10 advogados', storage: '50 GB' },
                  { tier: SubscriptionTier.PROFESSIONAL, label: 'Professional', price: '950.000 Kz/mês', users: '25 advogados', storage: '100 GB' },
                  { tier: SubscriptionTier.BUSINESS, label: 'Business', price: '1.400.000 Kz/mês', users: '35 advogados', storage: '250 GB' },
                  { tier: SubscriptionTier.ENTERPRISE, label: 'Enterprise', price: '1.850.000 Kz/mês', users: '50 advogados', storage: '500 GB' }
                ].map((item) => (
                  <div
                    key={item.tier}
                    onClick={() => handleUpdateTier(item.tier)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedTenant.tier === item.tier
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-800/80 border-slate-700 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>{item.label}</span>
                        {selectedTenant.tier === item.tier && (
                          <span className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.2 rounded font-mono">Atual</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {item.users} • {item.storage}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-indigo-300">{item.price}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => setSelectedTenant(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

