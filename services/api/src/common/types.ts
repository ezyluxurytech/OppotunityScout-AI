/**
 * Shared type definitions mirroring the original Prisma enums.
 * Uses const-object + derived-type pattern so each name works as
 * BOTH a runtime value (e.g. UserRole.ADMIN) and a TypeScript type.
 * This is needed because SQLite doesn't support Prisma enums.
 */

export const UserRole = {
  OPPORTUNITY_OWNER: 'OPPORTUNITY_OWNER',
  INVESTOR: 'INVESTOR',
  SCOUT: 'SCOUT',
  ADMIN: 'ADMIN',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  DEACTIVATED: 'DEACTIVATED',
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const OpportunityType = {
  BUSINESS: 'BUSINESS',
  IDEA: 'IDEA',
  TALENT: 'TALENT',
} as const;
export type OpportunityType = (typeof OpportunityType)[keyof typeof OpportunityType];

export const OpportunityStage = {
  IDEA: 'IDEA',
  EARLY_STAGE: 'EARLY_STAGE',
  GROWTH: 'GROWTH',
  ESTABLISHED: 'ESTABLISHED',
  SEEKING_PARTNER: 'SEEKING_PARTNER',
} as const;
export type OpportunityStage = (typeof OpportunityStage)[keyof typeof OpportunityStage];

export const OpportunityStatus = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  PUBLISHED: 'PUBLISHED',
  NEEDS_INFORMATION: 'NEEDS_INFORMATION',
  REJECTED: 'REJECTED',
  ARCHIVED: 'ARCHIVED',
} as const;
export type OpportunityStatus = (typeof OpportunityStatus)[keyof typeof OpportunityStatus];

export const AnalysisStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;
export type AnalysisStatus = (typeof AnalysisStatus)[keyof typeof AnalysisStatus];

export const ConnectionRequestStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  WITHDRAWN: 'WITHDRAWN',
  CLOSED: 'CLOSED',
} as const;
export type ConnectionRequestStatus =
  (typeof ConnectionRequestStatus)[keyof typeof ConnectionRequestStatus];

export const ProgressStage = {
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  INTEREST_RECEIVED: 'INTEREST_RECEIVED',
  DISCUSSION: 'DISCUSSION',
  OUTCOME: 'OUTCOME',
} as const;
export type ProgressStage = (typeof ProgressStage)[keyof typeof ProgressStage];

// Re-export PrismaClient (still needed by PrismaService)
export { PrismaClient } from '@prisma/client';
