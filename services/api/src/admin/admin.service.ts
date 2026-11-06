import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OpportunityStatus } from '../common/types';
import { objToStr, strToArr, strToObj } from '../common/db-helpers';
import { PrismaService } from '../prisma/prisma.service';
import { ReviewOpportunityDto, ReviewAction } from './dto/review-opportunity.dto';
import { ManageUserDto } from './dto/manage-user.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) { }

  // ── Opportunities ────────────────────────────────────────────────

  async getReviewQueue(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] as OpportunityStatus[] } };

    const [total, items] = await Promise.all([
      this.prisma.opportunity.count({ where }),
      this.prisma.opportunity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { submittedAt: 'asc' },
        include: {
          owner: { select: { id: true, name: true, email: true } },
          analysis: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { id: true, status: true, summary: true, categories: true },
          },
        },
      }),
    ]);

    // Convert JSON-encoded array fields back from SQLite string storage
    const data = items.map((item) => ({
      ...item,
      analysis: item.analysis.map((a) => ({
        ...a,
        categories: strToArr(a.categories),
      })),
    }));

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async reviewOpportunity(opportunityId: string, adminId: string, dto: ReviewOpportunityDto) {
    const opp = await this.prisma.opportunity.findUnique({ where: { id: opportunityId } });
    if (!opp) throw new NotFoundException('Opportunity not found.');

    const statusMap: Record<ReviewAction, OpportunityStatus> = {
      [ReviewAction.APPROVE]: 'PUBLISHED',
      [ReviewAction.REJECT]: 'REJECTED',
      [ReviewAction.REQUEST_INFO]: 'NEEDS_INFORMATION',
      [ReviewAction.ARCHIVE]: 'ARCHIVED',
      [ReviewAction.SET_UNDER_REVIEW]: 'UNDER_REVIEW',
    };

    const newStatus = statusMap[dto.action];

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.opportunity.update({
        where: { id: opportunityId },
        data: {
          status: newStatus,
          reviewFeedback: dto.feedback,
          ...(newStatus === 'PUBLISHED' && { publishedAt: new Date() }),
        },
      });

      await tx.opportunityStatusHistory.create({
        data: {
          opportunityId,
          status: newStatus,
          actorId: adminId,
          note: dto.feedback,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: adminId,
          action: `OPPORTUNITY_${dto.action}`,
          entityType: 'Opportunity',
          entityId: opportunityId,
          metadata: objToStr({ feedback: dto.feedback, previousStatus: opp.status, newStatus }),
        },
      });

      return result;
    });

    return updated;
  }

  // ── Users ────────────────────────────────────────────────────────

  async listUsers(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where = search
      ? {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
        ],
      }
      : {};

    const [total, items] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    return { data: items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async manageUser(targetUserId: string, adminId: string, dto: ManageUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) throw new NotFoundException('User not found.');

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.user.update({
        where: { id: targetUserId },
        data: { status: dto.status },
        select: { id: true, name: true, email: true, role: true, status: true },
      });

      await tx.auditLog.create({
        data: {
          actorId: adminId,
          action: `USER_STATUS_CHANGED_TO_${dto.status}`,
          entityType: 'User',
          entityId: targetUserId,
          metadata: objToStr({ previousStatus: user.status, newStatus: dto.status }),
        },
      });

      return result;
    });

    return updated;
  }

  // ── Metrics ──────────────────────────────────────────────────────

  async getMetrics() {
    const [
      totalUsers,
      usersByRole,
      totalOpportunities,
      opportunitiesByStatus,
      totalConnections,
      connectionsByStatus,
      pendingReview,
      completedAnalyses,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.groupBy({ by: ['role'], _count: { id: true } }),
      this.prisma.opportunity.count(),
      this.prisma.opportunity.groupBy({ by: ['status'], _count: { id: true } }),
      this.prisma.connectionRequest.count(),
      this.prisma.connectionRequest.groupBy({ by: ['status'], _count: { id: true } }),
      this.prisma.opportunity.count({ where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } } }),
      this.prisma.opportunityAnalysis.count({ where: { status: 'COMPLETED' } }),
    ]);

    return {
      users: {
        total: totalUsers,
        byRole: usersByRole.reduce((acc, r) => ({ ...acc, [r.role]: r._count.id }), {}),
      },
      opportunities: {
        total: totalOpportunities,
        byStatus: opportunitiesByStatus.reduce((acc, r) => ({ ...acc, [r.status]: r._count.id }), {}),
        pendingReview,
      },
      connections: {
        total: totalConnections,
        byStatus: connectionsByStatus.reduce((acc, r) => ({ ...acc, [r.status]: r._count.id }), {}),
      },
      ai: { completedAnalyses },
      generatedAt: new Date().toISOString(),
    };
  }

  // ── Audit Logs ───────────────────────────────────────────────────

  async getAuditLogs(page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      this.prisma.auditLog.count(),
      this.prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          actor: { select: { id: true, name: true, role: true } },
        },
      }),
    ]);

    // Convert JSON-encoded metadata back from SQLite string storage
    const data = items.map((item) => ({
      ...item,
      metadata: strToObj(item.metadata),
    }));

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
