import React from 'react';
import { SubscriptionTier, formatAOA } from '@sigea/shared';
import { Building2, Plus, Lock } from 'lucide-react';

export const SuperAdminView: React.FC = () => {
  const tenants = [
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

  const totalMrr = tenants.reduce((acc, t) => acc + t.mrrAoa, 0);

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

        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 self-start sm:self-auto">
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
          <div className="text-2xl font-bold text-white mt-1">29 Advogados & Colaboradores</div>
          <span className="text-xs text-slate-400 mt-2 block">Média de 9.6 por escritório</span>
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

                <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-650 text-slate-200 rounded-lg text-xs font-semibold transition-colors">
                  Gerir Plano
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
