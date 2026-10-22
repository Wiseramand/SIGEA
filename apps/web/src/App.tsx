import React from 'react';
import { UserRole } from '@sigea/shared';
import { NavigationTab } from './types';
import { MOCK_CASES } from './data/mockData';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { CasesList } from './components/cases/CasesList';
import { CaseDossierModal } from './components/cases/CaseDossierModal';
import { ClientsList } from './components/clients/ClientsList';
import { DeadlinesList } from './components/deadlines/DeadlinesList';
import { FinanceModule } from './components/finance/FinanceModule';
import { InternsManagement } from './components/interns/InternsManagement';
import { ClientPortalView } from './components/portal/ClientPortalView';
import { SuperAdminView } from './components/superadmin/SuperAdminView';
import { TasksList } from './components/tasks/TasksList';
import { AuditLogView } from './components/audit/AuditLogView';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';

export const App: React.FC = () => {
  const [currentRole, setCurrentRole] = React.useState<UserRole>(UserRole.PARTNER);
  const [currentTab, setCurrentTab] = React.useState<NavigationTab>('dashboard');
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [selectedCaseId, setSelectedCaseId] = React.useState<string | null>(null);

  // When switching role, adapt tab if needed
  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === UserRole.CLIENT) {
      setCurrentTab('portal');
    } else if (newRole === UserRole.SUPER_ADMIN) {
      setCurrentTab('superadmin');
    } else if (newRole === UserRole.FINANCIAL) {
      setCurrentTab('finance');
    } else if (newRole === UserRole.INTERN) {
      setCurrentTab('tasks');
    } else if (currentTab === 'portal' || currentTab === 'superadmin') {
      setCurrentTab('dashboard');
    }
  };

  const selectedCase = selectedCaseId
    ? MOCK_CASES.find((c) => c.id === selectedCaseId) || null
    : null;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col text-slate-100">
      {/* Top Header with Role Switcher */}
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onOpenSearch={() => setIsSearchOpen(true)}
        unreadCount={3}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          currentRole={currentRole}
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950/60">
          {currentTab === 'dashboard' && (
            <ExecutiveDashboard
              onSelectCase={(caseId) => setSelectedCaseId(caseId)}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'cases' && (
            <CasesList onSelectCase={(caseId) => setSelectedCaseId(caseId)} />
          )}

          {currentTab === 'clients' && <ClientsList />}

          {currentTab === 'deadlines' && (
            <DeadlinesList onSelectCase={(caseId) => setSelectedCaseId(caseId)} />
          )}

          {currentTab === 'tasks' && <TasksList />}

          {currentTab === 'finance' && <FinanceModule />}

          {currentTab === 'interns' && <InternsManagement />}

          {currentTab === 'portal' && <ClientPortalView />}

          {currentTab === 'superadmin' && <SuperAdminView />}

          {currentTab === 'audit' && <AuditLogView />}
        </main>
      </div>

      {/* Case Dossier 360 Modal */}
      <CaseDossierModal
        legalCase={selectedCase}
        onClose={() => setSelectedCaseId(null)}
      />

      {/* Global Command-K Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCase={(caseId) => setSelectedCaseId(caseId)}
      />
    </div>
  );
};
export default App;
