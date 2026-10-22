export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  PARTNER = 'PARTNER',
  LAWYER = 'LAWYER',
  PARALEGAL = 'PARALEGAL',
  INTERN = 'INTERN',
  FINANCIAL = 'FINANCIAL',
  SECRETARY = 'SECRETARY',
  CLIENT = 'CLIENT'
}

export enum ClientType {
  INDIVIDUAL = 'INDIVIDUAL', // Pessoa Singular
  COMPANY = 'COMPANY' // Pessoa Coletiva
}

export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  PROSPECT = 'PROSPECT',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED'
}

export enum CaseStatus {
  DISTRIBUTED = 'DISTRIBUTED', // Distribuído
  INITIAL_PHASE = 'INITIAL_PHASE', // Articulados / Fase Inicial
  INSTRUCTION = 'INSTRUCTION', // Instrução e Produção de Prova
  HEARING = 'HEARING', // Julgamento / Audiência
  SENTENCE = 'SENTENCE', // Decisão / Sentença
  APPEAL = 'APPEAL', // Fase de Recurso
  ENFORCEMENT = 'ENFORCEMENT', // Execução de Sentença
  CLOSED = 'CLOSED', // Concluído
  ARCHIVED = 'ARCHIVED' // Arquivado
}

export enum Jurisdiction {
  CIVIL = 'CIVIL', // Cível e Comercial
  COMMERCIAL = 'COMMERCIAL', // Comercial
  LABOR = 'LABOR', // Trabalho
  CRIMINAL = 'CRIMINAL', // Penal
  ADMINISTRATIVE_TAX = 'ADMINISTRATIVE_TAX', // Contencioso Administrativo e Fiscal
  FAMILY_SUCCESSION = 'FAMILY_SUCCESSION', // Família e Menores / Sucessões
  MARITIME = 'MARITIME', // Marítimo
  CONSTITUTIONAL = 'CONSTITUTIONAL' // Constitucional
}

export enum FeeType {
  FIXED = 'FIXED', // Honorário Fixo
  HOURLY = 'HOURLY', // Cobrança por Hora
  SUCCESS_FEE = 'SUCCESS_FEE', // Honorário de Sucesso / Quota Litis
  HYBRID = 'HYBRID' // Misto (Fixo + Êxito)
}

export enum FeePaymentStatus {
  PENDING = 'PENDING',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELED = 'CANCELED'
}

export enum DeadlinePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum DeadlineStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  EXTENDED = 'EXTENDED',
  EXPIRED = 'EXPIRED'
}

export enum DeadlineAlertLevel {
  DAYS_30 = 'DAYS_30',
  DAYS_15 = 'DAYS_15',
  DAYS_7 = 'DAYS_7',
  DAYS_3 = 'DAYS_3',
  DAYS_1 = 'DAYS_1',
  SAME_DAY = 'SAME_DAY'
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED'
}

export enum TaskPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum SubscriptionTier {
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL',
  BUSINESS = 'BUSINESS',
  ENTERPRISE = 'ENTERPRISE'
}

export enum AuditAction {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  EXPORT = 'EXPORT',
  READ_CONFIDENTIAL = 'READ_CONFIDENTIAL'
}
