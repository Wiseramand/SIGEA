import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LegalCase,
  Deadline,
  LegalDocument,
  CaseActivityItem,
  FeeItem,
  ExpenseItem,
  LegalParty,
  CaseStatus,
  FeePaymentStatus
} from '@sigea/shared';
import {
  MOCK_CASES,
  MOCK_DEADLINES,
  MOCK_DOCUMENTS,
  MOCK_ACTIVITIES,
  MOCK_FEES,
  MOCK_EXPENSES
} from '../data/mockData';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface CasesContextType {
  cases: LegalCase[];
  deadlines: Deadline[];
  documents: LegalDocument[];
  activities: CaseActivityItem[];
  fees: FeeItem[];
  expenses: ExpenseItem[];
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
  addCase: (caseData: Partial<LegalCase> & { caseNumber: string; subject: string; courtName: string; clientId: string; clientName: string }) => LegalCase;
  updateCase: (caseId: string, updates: Partial<LegalCase>) => void;
  addParty: (caseId: string, party: Omit<LegalParty, 'id'>) => void;
  addDocument: (doc: { caseId: string; title: string; category: LegalDocument['category']; isClientVisible: boolean; fileSize?: number; fileType?: string; uploadedByName?: string }) => void;
  addDeadline: (deadline: { caseId: string; title: string; dueDate: string; dueTime?: string; priority: Deadline['priority']; description?: string; assignedLawyerName?: string }) => void;
  addActivity: (activity: { caseId: string; title: string; description: string; authorName?: string; authorRole?: string; type?: CaseActivityItem['type'] }) => void;
  addPayment: (feeId: string, amountPaidAoa: number, receiptNumber?: string) => void;
  addFee: (fee: Omit<FeeItem, 'id' | 'organizationId'>) => void;
  addExpense: (expense: Omit<ExpenseItem, 'id' | 'organizationId'>) => void;
  markExpenseReimbursed: (expenseId: string) => void;
  resetAllToMockData: () => void;
}

const CasesContext = createContext<CasesContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CASES: 'sigea_cases_v1',
  DEADLINES: 'sigea_deadlines_v1',
  DOCUMENTS: 'sigea_documents_v1',
  ACTIVITIES: 'sigea_activities_v1',
  FEES: 'sigea_fees_v1',
  EXPENSES: 'sigea_expenses_v1'
};

export const CasesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<LegalCase[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CASES);
      return saved ? JSON.parse(saved) : MOCK_CASES;
    } catch {
      return MOCK_CASES;
    }
  });

  const [deadlines, setDeadlines] = useState<Deadline[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEADLINES);
      return saved ? JSON.parse(saved) : MOCK_DEADLINES;
    } catch {
      return MOCK_DEADLINES;
    }
  });

  const [documents, setDocuments] = useState<LegalDocument[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      return saved ? JSON.parse(saved) : MOCK_DOCUMENTS;
    } catch {
      return MOCK_DOCUMENTS;
    }
  });

  const [activities, setActivities] = useState<CaseActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : MOCK_ACTIVITIES;
    } catch {
      return MOCK_ACTIVITIES;
    }
  });

  const [fees, setFees] = useState<FeeItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FEES);
      return saved ? JSON.parse(saved) : MOCK_FEES;
    } catch {
      return MOCK_FEES;
    }
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return saved ? JSON.parse(saved) : MOCK_EXPENSES;
    } catch {
      return MOCK_EXPENSES;
    }
  });

  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
      localStorage.setItem(STORAGE_KEYS.DEADLINES, JSON.stringify(deadlines));
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
      localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(fees));
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [cases, deadlines, documents, activities, fees, expenses]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addCase = (caseData: Partial<LegalCase> & { caseNumber: string; subject: string; courtName: string; clientId: string; clientName: string }) => {
    const newCase: LegalCase = {
      id: 'case-' + Date.now(),
      organizationId: 'org-angola-001',
      caseNumber: caseData.caseNumber,
      courtName: caseData.courtName,
      jurisdiction: caseData.jurisdiction || ('COMMERCIAL' as any),
      subject: caseData.subject,
      status: caseData.status || CaseStatus.DISTRIBUTED,
      clientId: caseData.clientId,
      clientName: caseData.clientName,
      responsibleLawyerId: caseData.responsibleLawyerId || 'user-01',
      responsibleLawyerName: caseData.responsibleLawyerName || 'Dr. Rui Falcão de Carvalho',
      parties: caseData.parties || [
        { id: 'p-' + Date.now(), name: caseData.clientName, role: 'CLAIMANT', lawyerName: caseData.responsibleLawyerName || 'Dr. Rui Falcão de Carvalho', oaaNumber: 'OAA 1420' }
      ],
      judgeName: caseData.judgeName || 'A aguardar distribuição de juízo',
      distributionDate: caseData.distributionDate || new Date().toISOString().split('T')[0],
      claimValueAoa: caseData.claimValueAoa || 0,
      provisionedValueAoa: caseData.provisionedValueAoa || caseData.claimValueAoa || 0,
      priority: caseData.priority || 'NORMAL',
      section: caseData.section || 'Secção de Distribuição Cível',
      teamMembers: caseData.teamMembers || [caseData.responsibleLawyerName || 'Dr. Rui Falcão de Carvalho'],
      isConfidential: Boolean(caseData.isConfidential),
      description: caseData.description || 'Processo autuado via plataforma SIGEA Angola.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCases((prev) => [newCase, ...prev]);

    // Registar entrada na timeline
    addActivity({
      caseId: newCase.id,
      title: 'Autuação e Distribuição do Processo',
      description: `Processo autuado sob o nº ${newCase.caseNumber} no ${newCase.courtName}.`,
      authorName: newCase.responsibleLawyerName,
      authorRole: 'Advogado Mandatário',
      type: 'STATUS_CHANGE'
    });

    showToast(`Processo ${newCase.caseNumber} autuado com sucesso!`, 'success');
    return newCase;
  };

  const updateCase = (caseId: string, updates: Partial<LegalCase>) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          const oldStatus = c.status;
          const updated = { ...c, ...updates, updatedAt: new Date().toISOString() };

          // Se o estado mudou, adicionar ao histórico automaticamente
          if (updates.status && updates.status !== oldStatus) {
            addActivity({
              caseId,
              title: `Fase Processual Atualizada: ${updates.status}`,
              description: `O processo transitou da fase de ${oldStatus} para a fase de ${updates.status}.`,
              authorName: 'Secretaria Forense',
              authorRole: 'Controlo Processual',
              type: 'STATUS_CHANGE'
            });
          }

          return updated;
        }
        return c;
      })
    );
    showToast('Dossier do processo atualizado com sucesso.', 'info');
  };

  const addParty = (caseId: string, party: Omit<LegalParty, 'id'>) => {
    const newParty: LegalParty = {
      ...party,
      id: 'party-' + Date.now()
    };

    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            parties: [...c.parties, newParty],
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      })
    );

    addActivity({
      caseId,
      title: `Nova Parte Registada: ${newParty.name}`,
      description: `Parte adicionada na qualidade de ${newParty.role}. Mandatário: ${newParty.lawyerName || 'Sem mandatário constituído'}.`,
      authorName: 'Dr. Rui Falcão de Carvalho',
      authorRole: 'Advogado',
      type: 'INTERNAL_NOTE'
    });

    showToast(`Parte ${newParty.name} adicionada ao processo.`, 'success');
  };

  const addDocument = (doc: { caseId: string; title: string; category: LegalDocument['category']; isClientVisible: boolean; fileSize?: number; fileType?: string; uploadedByName?: string }) => {
    const newDoc: LegalDocument = {
      id: 'doc-' + Date.now(),
      organizationId: 'org-angola-001',
      caseId: doc.caseId,
      title: doc.title,
      category: doc.category,
      fileKey: `cases/${doc.caseId}/${doc.title.toLowerCase().replace(/\s+/g, '_')}`,
      fileSize: doc.fileSize || 1250000,
      fileType: doc.fileType || 'application/pdf',
      version: 1,
      uploadedById: 'user-01',
      uploadedByName: doc.uploadedByName || 'Dr. Rui Falcão de Carvalho',
      isClientVisible: doc.isClientVisible,
      createdAt: new Date().toISOString()
    };

    setDocuments((prev) => [newDoc, ...prev]);

    addActivity({
      caseId: doc.caseId,
      title: `Peça Processual Carregada: ${doc.title}`,
      description: `Categoria: ${doc.category} • Visível no Portal do Cliente: ${doc.isClientVisible ? 'Sim' : 'Não'}.`,
      authorName: newDoc.uploadedByName,
      authorRole: 'Advogado',
      type: 'PETITION_FILED'
    });

    showToast(`Documento "${doc.title}" anexado ao dossier.`, 'success');
  };

  const addDeadline = (deadline: { caseId: string; title: string; dueDate: string; dueTime?: string; priority: Deadline['priority']; description?: string; assignedLawyerName?: string }) => {
    const theCase = cases.find((c) => c.id === deadline.caseId);
    
    // Calcular dias restantes
    const dueTime = new Date(deadline.dueDate).getTime();
    const todayTime = new Date().setHours(0, 0, 0, 0);
    const diffDays = Math.max(0, Math.ceil((dueTime - todayTime) / (1000 * 60 * 60 * 24)));

    const newDeadline: Deadline = {
      id: 'dl-' + Date.now(),
      organizationId: 'org-angola-001',
      caseId: deadline.caseId,
      caseNumber: theCase?.caseNumber || '0000/26',
      caseSubject: theCase?.subject || '',
      title: deadline.title,
      dueDate: deadline.dueDate,
      dueTime: deadline.dueTime || '15:00',
      priority: deadline.priority,
      status: 'PENDING' as any,
      alertLevel: diffDays <= 1 ? ('DAYS_1' as any) : diffDays <= 7 ? ('DAYS_7' as any) : ('DAYS_15' as any),
      assignedLawyerId: 'user-01',
      assignedLawyerName: deadline.assignedLawyerName || 'Dr. Rui Falcão de Carvalho',
      description: deadline.description || 'Prazo judicial registado na agenda do processo.',
      daysRemaining: diffDays
    };

    setDeadlines((prev) => [newDeadline, ...prev]);

    addActivity({
      caseId: deadline.caseId,
      title: `Prazo Judicial Agendado: ${deadline.title}`,
      description: `Data limite: ${deadline.dueDate} às ${newDeadline.dueTime} • Prioridade: ${deadline.priority}.`,
      authorName: newDeadline.assignedLawyerName,
      authorRole: 'Responsável',
      type: 'HEARING'
    });

    showToast(`Prazo registado para ${deadline.dueDate}!`, 'success');
  };

  const addActivity = (activity: { caseId: string; title: string; description: string; authorName?: string; authorRole?: string; type?: CaseActivityItem['type'] }) => {
    const newAct: CaseActivityItem = {
      id: 'act-' + Date.now(),
      caseId: activity.caseId,
      title: activity.title,
      description: activity.description,
      authorName: activity.authorName || 'Dr. Rui Falcão de Carvalho',
      authorRole: activity.authorRole || 'Advogado Mandatário',
      type: activity.type || 'JUDICIAL_NOTE',
      createdAt: new Date().toISOString()
    };

    setActivities((prev) => [newAct, ...prev]);
  };

  const addPayment = (feeId: string, amountPaidAoa: number, receiptNumber?: string) => {
    setFees((prev) =>
      prev.map((f) => {
        if (f.id === feeId) {
          const newPaid = f.paidAmountAoa + amountPaidAoa;
          const newBalance = Math.max(0, f.amountAoa - newPaid);
          const isFull = newBalance === 0;
          return {
            ...f,
            paidAmountAoa: newPaid,
            balanceAoa: newBalance,
            status: isFull ? FeePaymentStatus.PAID : FeePaymentStatus.PARTIALLY_PAID,
            paidDate: new Date().toISOString().split('T')[0],
            receiptNumber: receiptNumber || `REC-${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`
          };
        }
        return f;
      })
    );
    showToast('Pagamento de honorário registado com sucesso!', 'success');
  };

  const addFee = (feeData: Omit<FeeItem, 'id' | 'organizationId'>) => {
    const newFee: FeeItem = {
      ...feeData,
      id: 'fee-' + Date.now(),
      organizationId: 'org-angola-001'
    };
    setFees((prev) => [newFee, ...prev]);
    showToast('Novo lançamento de honorários registado com sucesso!', 'success');
  };

  const addExpense = (expenseData: Omit<ExpenseItem, 'id' | 'organizationId'>) => {
    const newExp: ExpenseItem = {
      ...expenseData,
      id: 'exp-' + Date.now(),
      organizationId: 'org-angola-001'
    };
    setExpenses((prev) => [newExp, ...prev]);
    showToast('Despesa processual registada com sucesso!', 'success');
  };

  const markExpenseReimbursed = (expenseId: string) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === expenseId ? { ...e, isReimbursed: true } : e))
    );
    showToast('Despesa marcada como reembolsada pelo cliente.', 'info');
  };

  const resetAllToMockData = () => {
    setCases(MOCK_CASES);
    setDeadlines(MOCK_DEADLINES);
    setDocuments(MOCK_DOCUMENTS);
    setActivities(MOCK_ACTIVITIES);
    setFees(MOCK_FEES);
    setExpenses(MOCK_EXPENSES);
    localStorage.removeItem(STORAGE_KEYS.CASES);
    localStorage.removeItem(STORAGE_KEYS.DEADLINES);
    localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    localStorage.removeItem(STORAGE_KEYS.FEES);
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);
    showToast('Dados de demonstração repostos para os valores padrão.', 'info');
  };

  return (
    <CasesContext.Provider
      value={{
        cases,
        deadlines,
        documents,
        activities,
        fees,
        expenses,
        toasts,
        showToast,
        dismissToast,
        addCase,
        updateCase,
        addParty,
        addDocument,
        addDeadline,
        addActivity,
        addPayment,
        addFee,
        addExpense,
        markExpenseReimbursed,
        resetAllToMockData
      }}
    >
      {children}

      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => dismissToast(t.id)}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl flex items-center justify-between gap-3 text-xs font-semibold backdrop-blur-md transition-all animate-bounce ${
              t.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
                : t.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
                : t.type === 'warning'
                ? 'bg-amber-950/90 border-amber-500/40 text-amber-200'
                : 'bg-blue-950/90 border-blue-500/40 text-blue-200'
            }`}
          >
            <span>{t.message}</span>
            <button className="text-slate-400 hover:text-white shrink-0 text-sm">✕</button>
          </div>
        ))}
      </div>
    </CasesContext.Provider>
  );
};

export const useCases = () => {
  const context = useContext(CasesContext);
  if (!context) {
    throw new Error('useCases must be used within a CasesProvider');
  }
  return context;
};
