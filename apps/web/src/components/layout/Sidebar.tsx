import React from 'react';
import { UserRole } from '@sigea/shared';
import { NavigationTab } from '../../types';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Clock,
  CheckSquare,
  BadgeDollarSign,
  GraduationCap,
  Building2,
  ShieldAlert,
  FileText,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  currentRole: UserRole;
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  currentTab,
  onSelectTab
}) => {
  // If Client role is active, show only client portal navigation
  if (currentRole === UserRole.CLIENT) {
    return (
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0">
        <div>
          <div className="px-3 py-2 mb-4">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              Área Externa Segura
            </span>
            <h3 className="text-sm font-semibold text-white mt-0.5">Portal do Cliente</h3>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => onSelectTab('portal')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                currentTab === 'portal'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Meus Processos & Andamento</span>
            </button>
            <button
              onClick={() => onSelectTab('finance')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                currentTab === 'finance'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BadgeDollarSign className="w-4 h-4" />
              <span>Minhas Faturas & Recibos</span>
            </button>
          </nav>
        </div>

        <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs text-slate-400">
          <p className="font-medium text-slate-300">Ambiente Criptografado</p>
          <p className="text-[11px] mt-1">Isolamento rigoroso de dados corporativos.</p>
        </div>
      </aside>
    );
  }

  // If Super Admin role is active
  if (currentRole === UserRole.SUPER_ADMIN) {
    return (
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0">
        <div>
          <div className="px-3 py-2 mb-4">
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
              Plataforma Central
            </span>
            <h3 className="text-sm font-semibold text-white mt-0.5">Super Admin SaaS</h3>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => onSelectTab('superadmin')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                currentTab === 'superadmin'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Escritórios & Subscrições</span>
            </button>
            <button
              onClick={() => onSelectTab('audit')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                currentTab === 'audit'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Auditoria Global</span>
            </button>
          </nav>
        </div>

        <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-800/40 text-xs text-indigo-300">
          <p className="font-semibold">Regra de Ouro</p>
          <p className="text-[11px] mt-1 text-indigo-200">Platform Admin ≠ Legal Data Access</p>
        </div>
      </aside>
    );
  }

  // Standard Law Firm Team navigation
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0">
      <div className="space-y-6">
        {/* Group: Visão Geral */}
        <div>
          <div className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Principal
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Painel Executivo</span>
            </button>
            <button
              onClick={() => onSelectTab('deadlines')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                currentTab === 'deadlines'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Prazos Críticos</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                1 urgente
              </span>
            </button>
            <button
              onClick={() => onSelectTab('tasks')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                currentTab === 'tasks'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Minhas Tarefas</span>
            </button>
          </nav>
        </div>

        {/* Group: Prática Jurídica */}
        <div>
          <div className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Prática Jurídica
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => onSelectTab('cases')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                currentTab === 'cases'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Processos Judiciais</span>
            </button>
            <button
              onClick={() => onSelectTab('clients')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                currentTab === 'clients'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Clientes & Empresas</span>
            </button>
            <button
              onClick={() => onSelectTab('interns')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                currentTab === 'interns'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Estagiários OAA</span>
            </button>
          </nav>
        </div>

        {/* Group: Finanças & Gestão */}
        <div>
          <div className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Finanças & Conformidade
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => onSelectTab('finance')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                currentTab === 'finance'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BadgeDollarSign className="w-4 h-4 text-emerald-400" />
              <span>Honorários & Pagamentos</span>
            </button>
            <button
              onClick={() => onSelectTab('audit')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                currentTab === 'audit'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Trilha de Auditoria</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Footer shortcut to client portal preview */}
      <div className="pt-4 border-t border-slate-800/80">
        <button
          onClick={() => onSelectTab('portal')}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 text-xs text-slate-400 hover:text-slate-200 border border-slate-700/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Ver Portal do Cliente</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
