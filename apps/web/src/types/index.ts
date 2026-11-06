export type UserRole = 'OPPORTUNITY_OWNER' | 'INVESTOR' | 'SCOUT' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export type OpportunityType = 'BUSINESS' | 'IDEA' | 'TALENT';
export type OpportunityStage = 'IDEA' | 'EARLY_STAGE' | 'GROWTH' | 'ESTABLISHED' | 'SEEKING_PARTNER';
export type OpportunityStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'PUBLISHED'
  | 'NEEDS_INFORMATION'
  | 'REJECTED'
  | 'ARCHIVED';

export interface Opportunity {
  id: string;
  title: string;
  type: OpportunityType;
  summary?: string;
  description: string;
  sector?: string;
  location?: string;
  stage?: OpportunityStage;
  problem?: string;
  solution?: string;
  goals?: string;
  supportRequired?: string;
  useOfFunds?: string;
  supportingLinks?: string[];
  status: OpportunityStatus;
  reviewFeedback?: string;
  ownerId: string;
  owner?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  publishedAt?: string;
  analysis?: OpportunityAnalysis[];
}

export type AnalysisStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface OpportunityAnalysis {
  id: string;
  summary?: string;
  categories: string[];
  missingInformation: string[];
  suggestedQuestions: string[];
  disclaimer?: string;
  status: AnalysisStatus;
  createdAt: string;
  note?: string;
}

export type ConnectionStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'WITHDRAWN' | 'CLOSED';

export interface ConnectionRequest {
  id: string;
  investorId: string;
  opportunityId: string;
  ownerId: string;
  message?: string;
  status: ConnectionStatus;
  createdAt: string;
  updatedAt: string;
  opportunity?: { id: string; title: string; type: string };
  investor?: { id: string; name: string };
  owner?: { id: string; name: string };
}

export type ProgressStage =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'INTEREST_RECEIVED'
  | 'DISCUSSION'
  | 'OUTCOME';

export interface ProgressUpdate {
  id: string;
  opportunityId: string;
  stage: ProgressStage;
  note?: string;
  actorId: string;
  actor?: { id: string; name: string; role: string };
  createdAt: string;
}

export interface InvestorPreferences {
  id: string;
  investorId: string;
  sectors: string[];
  opportunityTypes: string[];
  locations: string[];
  stages: string[];
  minInvestment?: number;
  maxInvestment?: number;
}

export interface Match {
  opportunity: Opportunity;
  score: number;
  relevanceBand: 'HIGH' | 'MEDIUM' | 'LOW';
  matchedCriteria: Array<{
    criterion: string;
    matched: boolean;
    investorValue: string | string[];
    opportunityValue: string;
  }>;
  explanation: string;
  generatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}
