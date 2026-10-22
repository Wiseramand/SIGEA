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
  FeePaymentStatus,
  Client,
  Task,
  TaskStatus,
  DeadlineStatus
} from '@sigea/shared';
import {
  MOCK_CASES,
  MOCK_DEADLINES,
  MOCK_DOCUMENTS,
  MOCK_ACTIVITIES,
  MOCK_FEES,
  MOCK_EXPENSES,
  MOCK_CLIENTS,
  MOCK_TASKS
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
  clients: Client[];
  tasks: Task[];
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
  addCase: (caseData: Partial<LegalCase> & { caseNumber: string; subject: string; courtName: string; clientId: string; clientName: string }) => LegalCase;
  updateCase: (caseId: string, updates: Partial<LegalCase>) => void;
  addParty: (caseId: string, party: Omit<LegalParty, 'id'>) => void;
  addDocument: (doc: { caseId: string; title: string; category: LegalDocument['category']; isClientVisible: boolean; fileSize?: number; fileType?: string; uploadedByName?: string }) => void;
  addDeadline: (deadline: { caseId: string; title: string; dueDate: string; dueTime?: string; priority: Deadline['priority']; description?: string; assignedLawyerName?: string }) => void;
  completeDeadline: (deadlineId: string) => void;
  addActivity: (activity: { caseId: string; title: string; description: string; authorName?: string; authorRole?: string; type?: CaseActivityItem['type'] }) => void;
  addPayment: (feeId: string, amountPaidAoa: number, receiptNumber?: string) => void;
  addFee: (fee: Omit<FeeItem, 'id' | 'organizationId'>) => void;
  addExpense: (expense: Omit<ExpenseItem, 'id' | 'organizationId'>) => void;
  markExpenseReimbursed: (expenseId: string) => void;
  addClient: (clientData: Partial<Client>) => Client;
  addTask: (taskData: Partial<Task>) => Task;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  resetAllToMockData: () => void;
}

const CasesContext = createContext<CasesContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CASES: 'sigea_cases_v1',
  DEADLINES: 'sigea_deadlines_v1',
  DOCUMENTS: 'sigea_documents_v1',
  ACTIVITIES: 'sigea_activities_v1',
  FEES: 'sigea_fees_v1',
  EXPENSES: 'sigea_expenses_v1',
  CLIENTS: 'sigea_clients_v1',
  TASKS: 'sigea_tasks_v1'
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

  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      return saved ? JSON.parse(saved) : MOCK_CLIENTS;
    } catch {
      return MOCK_CLIENTS;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : MOCK_TASKS;
    } catch {
      return MOCK_TASKS;
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
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [cases, deadlines, documents, activities, fees, expenses, clients, tasks]);

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
      distributionDate: caseData.distributionDate || new Date().toISOString().split('T')[0],
      claimValueAoa: caseData.claimValueAoa || 0,
      provisionedValueAoa: caseData.provisionedValueAoa || 0,
      priority: caseData.priority || 'NORMAL',
      section: caseData.section || '1.ª Secção',
      teamMembers: caseData.teamMembers || ['Dr. Rui Falcão de Carvalho', 'Dra. Kieza dos Santos Manuel'],
      isConfidential: Boolean(caseData.isConfidential),
      description: caseData.description || 'Processo autuado no sistema SIGEA.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCases((prev) => [newCase, ...prev]);

    // Regista atividade inicial
    addActivity({
      caseId: newCase.id,
      title: 'Processo Distribuído no Cartório',
      description: `Processo ${newCase.caseNumber} autuado e registado perante o ${newCase.courtName}.`,
      authorName: newCase.responsibleLawyerName,
      authorRole: 'Sócio Titular',
      type: 'STATUS_CHANGE'
    });

    showToast(`Processo ${newCase.caseNumber} autuado com sucesso!`, 'success');
    return newCase;
  };

  const updateCase = (caseId: string, updates: Partial<LegalCase>) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          const updated = { ...c, ...updates, updatedAt: new Date().toISOString() };
          return updated;
        }
        return c;
      })
    );
    showToast('Dados do processo atualizados com sucesso.', 'success');
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
      title: 'Nova Parte Registada',
      description: `${newParty.name} adicionado(a) como ${newParty.role}.`,
      authorName: 'Dr. Rui Falcão',
      authorRole: 'Sócio',
      type: 'INTERNAL_NOTE'
    });

    showToast(`Parte "${newParty.name}" associada ao processo com sucesso.`, 'success');
  };

  const addDocument = (doc: { caseId: string; title: string; category: LegalDocument['category']; isClientVisible: boolean; fileSize?: number; fileType?: string; uploadedByName?: string }) => {
    const newDoc: LegalDocument = {
      id: 'doc-' + Date.now(),
      organizationId: 'org-angola-001',
      caseId: doc.caseId,
      title: doc.title,
      category: doc.category,
      fileKey: 'docs/' + Date.now() + '.pdf',
      fileSize: doc.fileSize || 1024 * 450,
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
      title: 'Peça Processual Carregada',
      description: `Documento "${newDoc.title}" (${newDoc.category}) indexado no dossier.`,
      authorName: newDoc.uploadedByName,
      authorRole: 'Mandatário',
      type: 'PETITION_FILED'
    });

    showToast(`Documento "${newDoc.title}" anexado com sucesso.`, 'success');
  };

  const addDeadline = (deadline: { caseId: string; title: string; dueDate: string; dueTime?: string; priority: Deadline['priority']; description?: string; assignedLawyerName?: string }) => {
    const associatedCase = cases.find((c) => c.id === deadline.caseId);
    
    // Calcula dias restantes aproximados
    const dueTime = new Date(deadline.dueDate).getTime();
    const nowTime = new Date().getTime();
    const diffDays = Math.max(0, Math.ceil((dueTime - nowTime) / (1000 * 60 * 60 * 24)));

    const newDeadline: Deadline = {
      id: 'dl-' + Date.now(),
      organizationId: 'org-angola-001',
      caseId: deadline.caseId,
      caseNumber: associatedCase ? associatedCase.caseNumber : '0000/26',
      caseSubject: associatedCase ? associatedCase.subject : 'Processo Judicial',
      title: deadline.title,
      dueDate: deadline.dueDate,
      dueTime: deadline.dueTime || '15:30',
      priority: deadline.priority,
      status: DeadlineStatus.PENDING,
      alertLevel: diffDays <= 2 ? ('CRITICAL' as any) : ('WARNING' as any),
      assignedLawyerId: 'user-01',
      assignedLawyerName: deadline.assignedLawyerName || 'Dr. Rui Falcão de Carvalho',
      description: deadline.description || 'Cumprimento de prazo perentório fixado pelo Tribunal.',
      daysRemaining: diffDays
    };

    setDeadlines((prev) => [newDeadline, ...prev]);

    addActivity({
      caseId: deadline.caseId,
      title: 'Prazo Perentório Registado',
      description: `Fixado termo para ${newDeadline.dueDate} (${newDeadline.title}).`,
      authorName: newDeadline.assignedLawyerName,
      authorRole: 'Patrono',
      type: 'JUDICIAL_NOTE'
    });

    showToast(`Prazo "${newDeadline.title}" registado na agenda com sucesso!`, 'success');
  };

  const completeDeadline = (deadlineId: string) => {
    setDeadlines((prev) =>
      prev.map((d) => {
        if (d.id === deadlineId) {
          return {
            ...d,
            status: DeadlineStatus.COMPLETED,
            completedAt: new Date().toISOString(),
            daysRemaining: 0
          };
        }
        return d;
      })
    );
    showToast('Prazo processual marcado como cumprido perante o Tribunal.', 'success');
  };

  const addActivity = (act: { caseId: string; title: string; description: string; authorName?: string; authorRole?: string; type?: CaseActivityItem['type'] }) => {
    const newAct: CaseActivityItem = {
      id: 'act-' + Date.now(),
      caseId: act.caseId,
      title: act.title,
      description: act.description,
      authorName: act.authorName || 'Dr. Rui Falcão',
      authorRole: act.authorRole || 'Sócio Titular',
      type: act.type || 'INTERNAL_NOTE',
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
          const newStatus =
            newBalance <= 0
              ? FeePaymentStatus.PAID
              : newPaid > 0
              ? FeePaymentStatus.PARTIALLY_PAID
              : f.status;

          return {
            ...f,
            paidAmountAoa: newPaid,
            balanceAoa: newBalance,
            status: newStatus,
            paidDate: new Date().toISOString().split('T')[0],
            receiptNumber: receiptNumber || `REC-2026/${Math.floor(1000 + Math.random() * 9000)}`
          };
        }
        return f;
      })
    );

    showToast(`Liquidação de ${amountPaidAoa.toLocaleString('pt-AO')} Kz registada com sucesso!`, 'success');
  };

  const addFee = (feeData: Omit<FeeItem, 'id' | 'organizationId'>) => {
    const newFee: FeeItem = {
      ...feeData,
      id: 'fee-' + Date.now(),
      organizationId: 'org-angola-001',
      balanceAoa: Math.max(0, feeData.amountAoa - (feeData.paidAmountAoa || 0)),
      status:
        (feeData.paidAmountAoa || 0) >= feeData.amountAoa
          ? FeePaymentStatus.PAID
          : (feeData.paidAmountAoa || 0) > 0
          ? FeePaymentStatus.PARTIALLY_PAID
          : FeePaymentStatus.PENDING
    };

    setFees((prev) => [newFee, ...prev]);
    showToast(`Honorário de ${newFee.amountAoa.toLocaleString('pt-AO')} Kz emitido com sucesso!`, 'success');
  };

  const addExpense = (expData: Omit<ExpenseItem, 'id' | 'organizationId'>) => {
    const newExp: ExpenseItem = {
      ...expData,
      id: 'exp-' + Date.now(),
      organizationId: 'org-angola-001'
    };

    setExpenses((prev) => [newExp, ...prev]);
    showToast(`Despesa judicial de ${newExp.amountAoa.toLocaleString('pt-AO')} Kz registada.`, 'success');
  };

  const markExpenseReimbursed = (expenseId: string) => {
    setExpenses((prev) =>
      prev.map((e) => {
        if (e.id === expenseId) {
          return { ...e, isReimbursed: true, reimbursedDate: new Date().toISOString().split('T')[0] };
        }
        return e;
      })
    );
    showToast('Despesa marcada como reembolsada pelo cliente.', 'info');
  };

  const addClient = (clientData: Partial<Client>) => {
    const newClient: Client = {
      id: 'client-' + Date.now(),
      organizationId: 'org-angola-001',
      type: clientData.type || ('COMPANY' as any),
      name: clientData.name || 'Nova Entidade',
      legalRepresentative: clientData.legalRepresentative || '',
      nif: clientData.nif || '5418000000',
      email: clientData.email || 'contacto@empresa.ao',
      phone: clientData.phone || '+244 923 000 000',
      address: clientData.address || 'Luanda, Angola',
      city: clientData.city || 'Luanda',
      province: clientData.province || 'Luanda',
      status: ('ACTIVE' as any),
      portalAccessEnabled: Boolean(clientData.portalAccessEnabled),
      activeCasesCount: 0,
      totalBilledAoa: 0,
      createdAt: new Date().toISOString()
    };

    setClients((prev) => [newClient, ...prev]);
    showToast(`Cliente "${newClient.name}" cadastrado com sucesso!`, 'success');
    return newClient;
  };

  const addTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: 'task-' + Date.now(),
      organizationId: 'org-angola-001',
      title: taskData.title || 'Nova Diligência',
      description: taskData.description || '',
      status: taskData.status || TaskStatus.PENDING,
      priority: taskData.priority || ('NORMAL' as any),
      assignedToId: taskData.assignedToId || 'user-03',
      assignedToName: taskData.assignedToName || 'Nzinga Luvumbo (Estagiário)',
      createdById: 'user-01',
      createdByName: 'Dr. Rui Falcão de Carvalho',
      dueDate: taskData.dueDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    setTasks((prev) => [newTask, ...prev]);
    showToast(`Tarefa "${newTask.title}" atribuída com sucesso!`, 'success');
    return newTask;
  };

  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: newStatus,
            completedAt: newStatus === TaskStatus.COMPLETED ? new Date().toISOString() : undefined
          };
        }
        return t;
      })
    );
    showToast(`Estado da tarefa atualizado para: ${newStatus}`, 'info');
  };

  const resetAllToMockData = () => {
    setCases(MOCK_CASES);
    setDeadlines(MOCK_DEADLINES);
    setDocuments(MOCK_DOCUMENTS);
    setActivities(MOCK_ACTIVITIES);
    setFees(MOCK_FEES);
    setExpenses(MOCK_EXPENSES);
    setClients(MOCK_CLIENTS);
    setTasks(MOCK_TASKS);
    localStorage.removeItem(STORAGE_KEYS.CASES);
    localStorage.removeItem(STORAGE_KEYS.DEADLINES);
    localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    localStorage.removeItem(STORAGE_KEYS.FEES);
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);
    localStorage.removeItem(STORAGE_KEYS.CLIENTS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
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
        clients,
        tasks,
        toasts,
        showToast,
        dismissToast,
        addCase,
        updateCase,
        addParty,
        addDocument,
        addDeadline,
        completeDeadline,
        addActivity,
        addPayment,
        addFee,
        addExpense,
        markExpenseReimbursed,
        addClient,
        addTask,
        updateTaskStatus,
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
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl flex items-center justify-between gap-3 text-xs font-semibold backdrop-blur-md transition-all ${
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
