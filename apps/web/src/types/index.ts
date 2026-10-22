import { UserRole } from '@sigea/shared';

export type NavigationTab = 
  | 'dashboard'
  | 'cases'
  | 'clients'
  | 'deadlines'
  | 'tasks'
  | 'finance'
  | 'interns'
  | 'portal'
  | 'superadmin'
  | 'audit';

export interface AppState {
  currentRole: UserRole;
  currentTab: NavigationTab;
  isSearchOpen: boolean;
  selectedCaseId: string | null;
}
