/**
 * Shared API contracts between frontend and backend.
 * These types mirror the NestJS DTOs and Prisma schema.
 */

export type UserRole = 'OPPORTUNITY_OWNER' | 'INVESTOR' | 'SCOUT' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
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
export type AnalysisStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type ConnectionStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'WITHDRAWN' | 'CLOSED';
export type ProgressStage = 'SUBMITTED' | 'UNDER_REVIEW' | 'INTEREST_RECEIVED' | 'DISCUSSION' | 'OUTCOME';

export interface ApiError {
  statusCode: number;
  message: string | string[];
  timestamp: string;
  path: string;
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
