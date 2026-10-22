import React from 'react';
import { UserRole } from '@sigea/shared';
import { CURRENT_ORGANIZATION } from '../../data/mockData';
import { Search, Bell, Shield, Scale, ChevronDown, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenSearch: () => void;
  unreadCount: number;
}

const ROLE_LABELS: Record<UserRole, { label: string; badge: string; desc: string }> = {
  [UserRole.PARTNER]: { label: 'Dr. Rui Falcão', badge: 'SÓCIO (OAA 1420)', desc: 'Visão Completa de Gestão' },
  [UserRole.LAWYER]: { label: 'Dra. Kieza Manuel', badge: 'ADVOGADA (OAA 2891)', desc: 'Visão Operacional de Processos' },
  [UserRole.INTERN]: { label: 'Nzinga Luvumbo', badge: 'ESTAGIÁRIO (OAA 7824)', desc: 'Visão de Acompanhamento' },
  [UserRole.FINANCIAL]: { label: 'Helena Bartolomeu', badge: 'DIREÇÃO FINANCEIRA', desc: 'Faturação e Honorários em AOA' },
  [UserRole.CLIENT]: { label: 'Dr. Baptista Sumbe', badge: 'PORTAL DO CLIENTE', desc: 'Visão Externa Segura' },
  [UserRole.SUPER_ADMIN]: { label: 'António Kapapelo', badge: 'SUPER ADMIN SAAS', desc: 'Gestão da Plataforma' },
  [UserRole.ADMIN]: { label: 'Administrador Local', badge: 'ADMIN', desc: 'Gestão Interna' },
  [UserRole.PARALEGAL]: { label: 'Técnico Jurídico', badge: 'PARALEGAL', desc: 'Suporte' },
  [UserRole.SECRETARY]: { label: 'Secretariado', badge: 'SECRETARIA', desc: 'Recepção' }
};

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenSearch,
  unreadCount
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);
  const currentRoleInfo = ROLE_LABELS[currentRole] || { label: 'Utilizador', badge: currentRole, desc: '' };

  const switchableRoles: UserRole[] = [
    UserRole.PARTNER,
    UserRole.LAWYER,
    UserRole.INTERN,
    UserRole.FINANCIAL,
    UserRole.CLIENT,
    UserRole.SUPER_ADMIN
  ];

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left side: Org Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-white tracking-tight">SIGEA</span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Angola
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-[280px]">
              {currentRole === UserRole.SUPER_ADMIN ? 'Painel Global da Plataforma' : CURRENT_ORGANIZATION.name}
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Search trigger */}
      <div className="flex-1 max-w-md mx-8">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-slate-600 rounded-lg text-sm text-slate-400 transition-all shadow-inner group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
            <span>Pesquisar processos, clientes, prazos...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-700/60 text-slate-300 border border-slate-600/50">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right side: Role Switcher & Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button 
          title="Notificações"
          className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
          )}
        </button>

        {/* Demo Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 border border-blue-500/30 hover:border-blue-500/60 rounded-lg text-left transition-all shadow-sm"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-xs font-semibold text-blue-400">
              {currentRole.slice(0, 2)}
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-medium text-white flex items-center gap-1.5">
                {currentRoleInfo.label}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                {currentRoleInfo.badge}
              </div>
            </div>
          </button>

          {roleMenuOpen && (
            <div 
              className="absolute right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 divide-y divide-slate-700/50"
              onMouseLeave={() => setRoleMenuOpen(false)}
            >
              <div className="px-3.5 py-2">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Simulação de Papéis (RBAC Demo)
                </p>
                <p className="text-xs text-slate-300 mt-0.5">
                  Alterne entre perfis para avaliar a experiência personalizada:
                </p>
              </div>

              <div className="py-1">
                {switchableRoles.map((role) => {
                  const info = ROLE_LABELS[role];
                  const isSelected = role === currentRole;
                  return (
                    <button
                      key={role}
                      onClick={() => {
                        onRoleChange(role);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 flex items-center justify-between text-left transition-colors ${
                        isSelected ? 'bg-blue-600/20 text-white' : 'hover:bg-slate-700/60 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold flex items-center gap-1.5">
                          {info.label}
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {info.badge} • {info.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="px-3.5 py-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Multi-tenancy e autorização estrita</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
