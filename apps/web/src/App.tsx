import React, { useState } from 'react';
import { UserRole } from '@sigea/shared';
import { NavigationTab } from './types';
import { CasesProvider, useCases } from './context/CasesContext';
import { canAccessTab, getDefaultTabForRole } from './utils/permissions';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { SigeaIntelligence } from './components/intelligence/SigeaIntelligence';
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
import { SigeaLegalAi } from './components/legal-ai/SigeaLegalAi';

const AppContent: React.FC = () => {
  const { cases } = useCases();

  const [isLandingVisible, setIsLandingVisible] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.PARTNER);
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // Adapt tab when switching roles with strict RBAC
  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (!canAccessTab(newRole, currentTab)) {
      setCurrentTab(getDefaultTabForRole(newRole));
    }
  };

  const selectedCase = selectedCaseId
    ? cases.find((c) => c.id === selectedCaseId) || null
    : null;

  // If user requested to view the institutional Landing Page
  if (isLandingVisible) {
    return (
      <LandingPage
        onEnterApp={() => setIsLandingVisible(false)}
      />
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#070B14] text-slate-100 antialiased">
      {/* Top Header with Role Switcher & Landing Page button */}
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onOpenSearch={() => setIsSearchOpen(true)}
        unreadCount={3}
        onOpenLanding={() => setIsLandingVisible(true)}
      />

      {/* Main Container: Fixed Sidebar + Scrollable Main Content */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* Navigation Sidebar: Fixed, stays stationary while body scrolls */}
        <Sidebar
          currentRole={currentRole}
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          onOpenLanding={() => setIsLandingVisible(true)}
        />

        {/* Main Content Area: Own independent scroll container */}
        <main className="flex-1 h-full overflow-y-auto overflow-x-hidden min-h-0 bg-[#070B14]/80">
          {currentTab === 'dashboard' && canAccessTab(currentRole, 'dashboard') && (
            <ExecutiveDashboard
              currentRole={currentRole}
              onSelectCase={(caseId) => setSelectedCaseId(caseId)}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'intelligence' && canAccessTab(currentRole, 'intelligence') && (
            <SigeaIntelligence
              onSelectCase={(caseId) => setSelectedCaseId(caseId)}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'legal-ai' && canAccessTab(currentRole, 'legal-ai') && (
            <SigeaLegalAi
              onSelectCase={(caseId) => setSelectedCaseId(caseId)}
            />
          )}

          {currentTab === 'cases' && canAccessTab(currentRole, 'cases') && (
            <CasesList onSelectCase={(caseId) => setSelectedCaseId(caseId)} />
          )}

          {currentTab === 'clients' && canAccessTab(currentRole, 'clients') && (
            <ClientsList />
          )}

          {currentTab === 'deadlines' && canAccessTab(currentRole, 'deadlines') && (
            <DeadlinesList onSelectCase={(caseId) => setSelectedCaseId(caseId)} />
          )}

          {currentTab === 'tasks' && canAccessTab(currentRole, 'tasks') && (
            <TasksList />
          )}

          {currentTab === 'finance' && canAccessTab(currentRole, 'finance') && (
            <FinanceModule onSelectCase={(caseId) => setSelectedCaseId(caseId)} />
          )}

          {currentTab === 'interns' && canAccessTab(currentRole, 'interns') && (
            <InternsManagement />
          )}

          {currentTab === 'portal' && canAccessTab(currentRole, 'portal') && (
            <ClientPortalView />
          )}

          {currentTab === 'superadmin' && canAccessTab(currentRole, 'superadmin') && (
            <SuperAdminView />
          )}

          {currentTab === 'audit' && canAccessTab(currentRole, 'audit') && (
            <AuditLogView />
          )}
        </main>
      </div>

      {/* Case Dossier 360 Modal with RBAC protection */}
      <CaseDossierModal
        legalCase={selectedCase}
        onClose={() => setSelectedCaseId(null)}
        currentRole={currentRole}
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

export const App: React.FC = () => {
  return (
    <CasesProvider>
      <AppContent />
    </CasesProvider>
  );
};

export default App;
