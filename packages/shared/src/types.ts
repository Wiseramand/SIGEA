import {
  UserRole,
  ClientType,
  ClientStatus,
  CaseStatus,
  Jurisdiction,
  FeeType,
  FeePaymentStatus,
  DeadlinePriority,
  DeadlineStatus,
  DeadlineAlertLevel,
  TaskStatus,
  TaskPriority,
  SubscriptionTier,
  AuditAction
} from './enums';

export interface Organization {
  id: string;
  name: string;
  nif: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  subscriptionTier: SubscriptionTier;
  maxUsers: number;
  storageLimitGb: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: UserRole;
  oaaNumber?: string; // Número da Ordem dos Advogados de Angola
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  department?: string;
  createdAt: string;
}

export interface Client {
  id: string;
  organizationId: string;
  type: ClientType; // Singular ou Coletiva
  name: string;
  legalRepresentative?: string;
  nif: string; // Número de Identificação Fiscal Angolano
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  status: ClientStatus;
  notes?: string;
  portalAccessEnabled: boolean;
  activeCasesCount?: number;
  totalBilledAoa?: number;
  createdAt: string;
}

export interface LegalParty {
  id: string;
  name: string;
  role: 'CLAIMANT' | 'DEFENDANT' | 'INTERVENIENT' | 'THIRD_PARTY'; // Autor, Réu, Interveniente, Terceiro
  lawyerName?: string;
  oaaNumber?: string;
}

export interface LegalCase {
  id: string;
  organizationId: string;
  caseNumber: string; // Ex: 0142/24-A
  courtName: string; // Ex: Tribunal Provincial de Luanda - Sala do Cível e Comercial
  jurisdiction: Jurisdiction;
  subject: string; // Objeto da causa
  status: CaseStatus;
  clientId: string;
  clientName: string;
  responsibleLawyerId: string;
  responsibleLawyerName: string;
  parties: LegalParty[];
  judgeName?: string;
  distributionDate: string;
  claimValueAoa: number; // Valor da Causa em Kwanzas
  provisionedValueAoa?: number;
  isConfidential: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LegalDocument {
  id: string;
  organizationId: string;
  caseId?: string;
  clientId?: string;
  title: string;
  category: 'PETITION' | 'EVIDENCE' | 'CONTRACT' | 'COURT_DECISION' | 'POWER_OF_ATTORNEY' | 'RECEIPT' | 'OTHER';
  fileKey: string;
  fileSize: number; // Bytes
  fileType: string;
  version: number;
  uploadedById: string;
  uploadedByName: string;
  isClientVisible: boolean; // Portal do Cliente
  createdAt: string;
}

export interface Deadline {
  id: string;
  organizationId: string;
  caseId: string;
  caseNumber: string;
  caseSubject: string;
  title: string;
  dueDate: string; // ISO date string
  dueTime?: string;
  priority: DeadlinePriority;
  status: DeadlineStatus;
  alertLevel: DeadlineAlertLevel;
  assignedLawyerId: string;
  assignedLawyerName: string;
  description?: string;
  completedAt?: string;
  daysRemaining?: number;
}

export interface Task {
  id: string;
  organizationId: string;
  caseId?: string;
  clientId?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedToId: string;
  assignedToName: string;
  createdById: string;
  createdByName: string;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  organizationId: string;
  title: string;
  type: 'HEARING' | 'MEETING' | 'DILIGENCE' | 'DEADLINE' | 'INTERNAL';
  caseId?: string;
  caseNumber?: string;
  clientId?: string;
  clientName?: string;
  location?: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  notes?: string;
}

export interface FeeItem {
  id: string;
  organizationId: string;
  caseId?: string;
  caseNumber?: string;
  clientId: string;
  clientName: string;
  feeType: FeeType;
  title: string;
  amountAoa: number;
  paidAmountAoa: number;
  balanceAoa: number;
  status: FeePaymentStatus;
  dueDate: string;
  paidDate?: string;
  receiptNumber?: string;
  notes?: string;
}

export interface ExpenseItem {
  id: string;
  organizationId: string;
  caseId: string;
  caseNumber: string;
  description: string;
  amountAoa: number;
  isReimbursable: boolean;
  isReimbursed: boolean;
  date: string;
  receiptUrl?: string;
}

export interface InternProfile {
  id: string;
  organizationId: string;
  userId: string;
  name: string;
  email: string;
  oaaTraineeNumber: string; // Cédula de Advogado Estagiário
  supervisorLawyerId: string;
  supervisorName: string;
  startDate: string;
  expectedEndDate: string;
  stageProgressPercent: number;
  assignedCasesCount: number;
  completedTasksCount: number;
  evaluationScore?: number; // 0 a 20
  status: 'ACTIVE' | 'GRADUATED' | 'SUSPENDED';
}

export interface AuditLogItem {
  id: string;
  organizationId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: AuditAction;
  entity: string;
  entityId: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}
