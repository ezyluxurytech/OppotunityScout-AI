import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../common/types';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProgressDto } from './dto/create-progress.dto';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) { }

  async create(actorId: string, dto: CreateProgressDto) {
    const opp = await this.prisma.opportunity.findUnique({ where: { id: dto.opportunityId } });
    if (!opp) throw new NotFoundException('Opportunity not found.');

    return this.prisma.progressUpdate.create({
      data: {
        opportunityId: dto.opportunityId,
        connectionRequestId: dto.connectionRequestId,
        actorId,
        stage: dto.stage,
        note: dto.note,
      },
    });
  }

  async getProgressHistory(opportunityId: string, userId: string, role: UserRole) {
    const opp = await this.prisma.opportunity.findUnique({ where: { id: opportunityId } });
    if (!opp) throw new NotFoundException('Opportunity not found.');

    const isOwner = opp.ownerId === userId;
    const isAdmin = role === UserRole.ADMIN;

    // Investors can see progress if they have a connection
    let hasConnection = false;
    if (role === UserRole.INVESTOR) {
      const conn = await this.prisma.connectionRequest.findFirst({
        where: { investorId: userId, opportunityId, status: { in: ['ACCEPTED'] } },
      });
      hasConnection = !!conn;
    }

    if (!isOwner && !isAdmin && !hasConnection) {
      throw new ForbiddenException('You do not have permission to view progress for this opportunity.');
    }

    return this.prisma.progressUpdate.findMany({
      where: { opportunityId },
      orderBy: { createdAt: 'asc' },
      include: {
        actor: { select: { id: true, name: true, role: true } },
      },
    });
  }
}
