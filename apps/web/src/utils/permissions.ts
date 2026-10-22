import { UserRole } from '@sigea/shared';
import { NavigationTab } from '../types';

/**
 * Matriz de Permissões RBAC para Sociedades de Advogados em Angola.
 * 
 * Regras estritas:
 * - HONORÁRIOS & FATURAÇÃO: Apenas SÓCIOS (PARTNER), DIREÇÃO FINANCEIRA (FINANCIAL) e ADMIN.
 *   Estagiários (INTERN), Advogados operacionais (LAWYER) e Paralegais NÃO têm acesso à saúde financeira global.
 * - INTELIGÊNCIA EXECUTIVA: Apenas SÓCIOS e ADMIN.
 * - SUPERVISÃO DE ESTÁGIOS: SÓCIOS, ADVOGADOS (Patronos) e ADMIN.
 * - AUDITORIA: SÓCIOS, ADMIN e SUPER_ADMIN.
 */

export const ROLE_ALLOWED_TABS: Record<UserRole, NavigationTab[]> = {
  [UserRole.PARTNER]: [
    'dashboard',
    'intelligence',
    'legal-ai',
    'deadlines',
    'tasks',
    'cases',
    'clients',
    'interns',
    'finance',
    'audit'
  ],
  [UserRole.ADMIN]: [
    'dashboard',
    'intelligence',
    'legal-ai',
    'deadlines',
    'tasks',
    'cases',
    'clients',
    'interns',
    'finance',
    'audit'
  ],
  [UserRole.FINANCIAL]: [
    'finance',
    'dashboard',
    'clients',
    'cases',
    'audit'
  ],
  [UserRole.LAWYER]: [
    'dashboard',
    'legal-ai',
    'deadlines',
    'tasks',
    'cases',
    'clients',
    'interns'
  ],
  [UserRole.INTERN]: [
    'tasks',
    'cases',
    'deadlines',
    'legal-ai'
  ],
  [UserRole.PARALEGAL]: [
    'tasks',
    'cases',
    'deadlines',
    'clients'
  ],
  [UserRole.SECRETARY]: [
    'deadlines',
    'clients',
    'tasks'
  ],
  [UserRole.CLIENT]: [
    'portal'
  ],
  [UserRole.SUPER_ADMIN]: [
    'superadmin',
    'audit'
  ]
};

export function canAccessTab(role: UserRole, tab: NavigationTab): boolean {
  const allowed = ROLE_ALLOWED_TABS[role] || [];
  return allowed.includes(tab);
}

export function canViewFees(role: UserRole): boolean {
  return role === UserRole.PARTNER || role === UserRole.FINANCIAL || role === UserRole.ADMIN;
}

export function canViewIntelligence(role: UserRole): boolean {
  return role === UserRole.PARTNER || role === UserRole.ADMIN;
}

export function canViewAudit(role: UserRole): boolean {
  return role === UserRole.PARTNER || role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN;
}

export function canManageInterns(role: UserRole): boolean {
  return role === UserRole.PARTNER || role === UserRole.LAWYER || role === UserRole.ADMIN;
}

export function getDefaultTabForRole(role: UserRole): NavigationTab {
  if (role === UserRole.CLIENT) return 'portal';
  if (role === UserRole.SUPER_ADMIN) return 'superadmin';
  if (role === UserRole.FINANCIAL) return 'finance';
  if (role === UserRole.INTERN) return 'tasks';
  return 'dashboard';
}
