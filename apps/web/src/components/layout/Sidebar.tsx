import React from 'react';
import { UserRole } from '@sigea/shared';
import { NavigationTab } from '../../types';
import {
  LayoutDashboard,
  Sparkles,
  Bot,
  Briefcase,
  Users,
  Clock,
  CheckSquare,
  BadgeDollarSign,
  GraduationCap,
  Building2,
  ShieldAlert,
  FileText,
  ExternalLink,
  Globe2
} from 'lucide-react';

interface SidebarProps {
  currentRole: UserRole;
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenLanding?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  currentTab,
  onSelectTab,
  onOpenLanding
}) => {
  // Helper for consistent navigation button styles (executive, clean, no AI-cliché gradients)
  const getNavClass = (isActive: boolean) => {
    return `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs transition-all relative ${
      isActive
        ? 'bg-slate-800/95 text-white font-semibold border border-slate-700/80 shadow-sm'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/60 font-medium'
    }`;
  };

  // If Client role is active, show only client portal navigation
  if (currentRole === UserRole.CLIENT) {
    return (
      <aside className="w-64 h-full shrink-0 bg-[#0B0F19] border-r border-slate-800/80 flex flex-col justify-between p-4 select-none overflow-y-auto">
        <div className="space-y-4">
          <div className="px-3 py-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
              Área Externa Segura
            </span>
            <h3 className="text-sm font-semibold text-white mt-2">Portal do Cliente</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Visão transparente e confidencial</p>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => onSelectTab('portal')}
              className={getNavClass(currentTab === 'portal')}
            >
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span>Meus Processos & Andamento</span>
            </button>
            <button
              onClick={() => onSelectTab('finance')}
              className={getNavClass(currentTab === 'finance')}
            >
              <BadgeDollarSign className="w-4 h-4 text-emerald-400" />
              <span>Minhas Faturas & Recibos</span>
            </button>
          </nav>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-800/80">
          {onOpenLanding && (
            <button
              onClick={onOpenLanding}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-xs text-slate-400 hover:text-white border border-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Página Inicial SIGEA</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </button>
          )}

          <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800/80 text-xs text-slate-400">
            <p className="font-medium text-slate-300">Ambiente Criptografado</p>
            <p className="text-[11px] mt-1 text-slate-400 leading-relaxed">
              Isolamento rigoroso de dados corporativos sob a Lei 22/11 (LPDP).
            </p>
          </div>
        </div>
      </aside>
    );
  }

  // If Super Admin role is active
  if (currentRole === UserRole.SUPER_ADMIN) {
    return (
      <aside className="w-64 h-full shrink-0 bg-[#0B0F19] border-r border-slate-800/80 flex flex-col justify-between p-4 select-none overflow-y-auto">
        <div className="space-y-4">
          <div className="px-3 py-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-semibold bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/50">
              Plataforma Central
            </span>
            <h3 className="text-sm font-semibold text-white mt-2">Super Admin SaaS</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Gestão de escritórios e licenças</p>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => onSelectTab('superadmin')}
              className={getNavClass(currentTab === 'superadmin')}
            >
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>Escritórios & Subscrições</span>
            </button>
            <button
              onClick={() => onSelectTab('audit')}
              className={getNavClass(currentTab === 'audit')}
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Auditoria Global</span>
            </button>
          </nav>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-800/80">
          {onOpenLanding && (
            <button
              onClick={onOpenLanding}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-xs text-slate-400 hover:text-white border border-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Página Inicial SIGEA</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </button>
          )}

          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-xs text-slate-400">
            <p className="font-semibold text-slate-300">Regra de Segregação</p>
            <p className="text-[11px] mt-1 text-slate-400">Platform Admin ≠ Legal Data Access</p>
          </div>
        </div>
      </aside>
    );
  }

  // Standard Law Firm Team navigation (Partners, Lawyers, Interns, Finance)
  return (
    <aside className="w-64 h-full shrink-0 bg-[#0B0F19] border-r border-slate-800/80 flex flex-col justify-between p-4 select-none overflow-y-auto">
      <div className="space-y-6">
        {/* Group: Principal */}
        <div>
          <div className="px-3 text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Gestão & Inteligência
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={getNavClass(currentTab === 'dashboard')}
            >
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
              <span>Painel Executivo</span>
            </button>

            <button
              onClick={() => onSelectTab('intelligence')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs transition-all ${
                currentTab === 'intelligence'
                  ? 'bg-slate-800/95 text-white font-semibold border border-slate-700/80 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-850/60 font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>SIGEA Intelligence</span>
              </div>
              <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/50 uppercase tracking-wider">
                Executivo
              </span>
            </button>

            <button
              onClick={() => onSelectTab('legal-ai')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs transition-all ${
                currentTab === 'legal-ai'
                  ? 'bg-slate-800/95 text-white font-semibold border border-slate-700/80 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-850/60 font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bot className="w-4 h-4 text-indigo-400" />
                <span>SIGEA Legal AI</span>
              </div>
              <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wider">
                Assistente
              </span>
            </button>

            <button
              onClick={() => onSelectTab('deadlines')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs transition-all ${
                currentTab === 'deadlines'
                  ? 'bg-slate-800/95 text-white font-semibold border border-slate-700/80 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/60 font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Prazos Judiciais</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-800/40">
                1 urgente
              </span>
            </button>

            <button
              onClick={() => onSelectTab('tasks')}
              className={getNavClass(currentTab === 'tasks')}
            >
              <CheckSquare className="w-4 h-4 text-slate-400" />
              <span>Minhas Tarefas</span>
            </button>
          </nav>
        </div>

        {/* Group: Prática Jurídica */}
        <div>
          <div className="px-3 text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Prática Jurídica
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => onSelectTab('cases')}
              className={getNavClass(currentTab === 'cases')}
            >
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span>Processos & Dossiers</span>
            </button>
            <button
              onClick={() => onSelectTab('clients')}
              className={getNavClass(currentTab === 'clients')}
            >
              <Users className="w-4 h-4 text-slate-400" />
              <span>Clientes & Entidades</span>
            </button>
            <button
              onClick={() => onSelectTab('interns')}
              className={getNavClass(currentTab === 'interns')}
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Estágios OAA</span>
            </button>
          </nav>
        </div>

        {/* Group: Finanças & Auditoria */}
        <div>
          <div className="px-3 text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Finanças & Conformidade
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => onSelectTab('finance')}
              className={getNavClass(currentTab === 'finance')}
            >
              <BadgeDollarSign className="w-4 h-4 text-emerald-400" />
              <span>Honorários em AOA</span>
            </button>
            <button
              onClick={() => onSelectTab('audit')}
              className={getNavClass(currentTab === 'audit')}
            >
              <ShieldAlert className="w-4 h-4 text-slate-400" />
              <span>Trilha de Auditoria</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Footer links: Landing Page & Client Portal */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2">
        {onOpenLanding && (
          <button
            onClick={onOpenLanding}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-xs text-slate-300 hover:text-white border border-slate-800 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Globe2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Página Inicial Institucional</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </button>
        )}

        <button
          onClick={() => onSelectTab('portal')}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/40 hover:bg-slate-800/70 text-xs text-slate-400 hover:text-slate-200 border border-slate-800/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Ver Portal do Cliente</span>
          </div>
          <ExternalLink className="w-3 h-3 text-slate-500" />
        </button>
      </div>
    </aside>
  );
};
