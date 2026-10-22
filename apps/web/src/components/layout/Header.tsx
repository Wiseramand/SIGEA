import React from 'react';
import { UserRole } from '@sigea/shared';
import { CURRENT_ORGANIZATION } from '../../data/mockData';
import { Search, Bell, Shield, Scale, ChevronDown, CheckCircle2, Globe2 } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenSearch: () => void;
  unreadCount: number;
  onOpenLanding?: () => void;
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
  unreadCount,
  onOpenLanding
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
    <header className="h-16 shrink-0 bg-[#0A0E18] border-b border-slate-800/80 px-6 flex items-center justify-between select-none z-30">
      {/* Left side: Org Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center shadow-xs">
            <Scale className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white tracking-tight font-serif">SIGEA</span>
              <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-800/60">
                Angola
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[280px]">
              {currentRole === UserRole.SUPER_ADMIN ? 'Painel Global da Plataforma' : CURRENT_ORGANIZATION.name}
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Search trigger */}
      <div className="flex-1 max-w-md mx-6">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-lg text-xs text-slate-400 transition-all group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
            <span>Pesquisar processos, clientes, prazos...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right side: Landing Shortcut, Notifications & Role Switcher */}
      <div className="flex items-center gap-3">
        {/* Institutional Landing Page button */}
        {onOpenLanding && (
          <button
            onClick={onOpenLanding}
            title="Ver Página Inicial Institucional"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <Globe2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Página Inicial</span>
          </button>
        )}

        {/* Notifications */}
        <button 
          title="Notificações do Cartório & Prazos"
          className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-850 border border-transparent hover:border-slate-800 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-slate-900" />
          )}
        </button>

        {/* Demo Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-700/80 rounded-lg text-left transition-all"
          >
            <div className="w-6 h-6 rounded-md bg-blue-950 border border-blue-800/80 flex items-center justify-center text-[10px] font-mono font-semibold text-blue-400">
              {currentRole.slice(0, 2)}
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-medium text-white flex items-center gap-1.5">
                {currentRoleInfo.label}
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <div className="text-[9px] text-amber-400/90 font-mono font-medium uppercase tracking-wider">
                {currentRoleInfo.badge}
              </div>
            </div>
          </button>

          {roleMenuOpen && (
            <div 
              className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl py-2 z-50 divide-y divide-slate-800"
              onMouseLeave={() => setRoleMenuOpen(false)}
            >
              <div className="px-3.5 py-2">
                <p className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                  Simulação de Papéis (RBAC Demo)
                </p>
                <p className="text-xs text-slate-300 mt-0.5">
                  Alterne entre perfis para avaliar a experiência:
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
                        isSelected ? 'bg-blue-950/60 text-white font-medium' : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="text-xs flex items-center gap-1.5">
                          {info.label}
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {info.badge} • {info.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="px-3.5 py-2 text-[10px] text-slate-400 flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>Isolamento seguro de dados na República de Angola</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
