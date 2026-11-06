import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SavedOpportunitiesService {
  constructor(private prisma: PrismaService) {}

  async save(investorId: string, opportunityId: string) {
    // Verify opportunity exists and is published
    const opp = await this.prisma.opportunity.findUnique({ where: { id: opportunityId } });
    if (!opp || opp.status !== 'PUBLISHED') {
      throw new NotFoundException('Opportunity not found or not available.');
    }

    try {
      return await this.prisma.savedOpportunity.create({
        data: { investorId, opportunityId },
        include: { opportunity: { select: { id: true, title: true, type: true, sector: true } } },
      });
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ConflictException('Opportunity already saved.');
      }
      throw e;
    }
  }

  async unsave(investorId: string, opportunityId: string) {
    const existing = await this.prisma.savedOpportunity.findUnique({
      where: { investorId_opportunityId: { investorId, opportunityId } },
    });
    if (!existing) throw new NotFoundException('Saved opportunity not found.');

    await this.prisma.savedOpportunity.delete({
      where: { investorId_opportunityId: { investorId, opportunityId } },
    });

    return { message: 'Opportunity removed from saved list.' };
  }

  async listSaved(investorId: string) {
    return this.prisma.savedOpportunity.findMany({
      where: { investorId },
      orderBy: { createdAt: 'desc' },
      include: {
        opportunity: {
          select: {
            id: true,
            title: true,
            type: true,
            summary: true,
            sector: true,
            location: true,
            stage: true,
            status: true,
            publishedAt: true,
          },
        },
      },
    });
  }
}
