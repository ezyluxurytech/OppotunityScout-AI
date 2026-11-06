import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { OpportunityStatus, UserRole } from '../common/types';
import { arrToStr, strToArr, strToObj } from '../common/db-helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { QueryOpportunitiesDto } from './dto/query-opportunities.dto';

@Injectable()
export class OpportunitiesService {
  constructor(private prisma: PrismaService) { }

  async create(ownerId: string, dto: CreateOpportunityDto) {
    const opportunity = await this.prisma.opportunity.create({
      data: {
        ownerId,
        title: dto.title,
        type: dto.type,
        description: dto.description,
        summary: dto.summary,
        sector: dto.sector,
        location: dto.location,
        stage: dto.stage,
        problem: dto.problem,
        solution: dto.solution,
        goals: dto.goals,
        supportRequired: dto.supportRequired,
        useOfFunds: dto.useOfFunds,
        supportingLinks: arrToStr(dto.supportingLinks),
        status: 'DRAFT',
      },
    });

    await this.recordStatusChange(opportunity.id, 'DRAFT', ownerId);
    return opportunity;
  }

  async findMyOpportunities(ownerId: string) {
    return this.prisma.opportunity.findMany({
      where: { ownerId },
      orderBy: { updatedAt: 'desc' },
      include: {
        analysis: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  }

  async findOne(id: string, userId: string, role: UserRole) {
    const opp = await this.prisma.opportunity.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true } },
        analysis: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            summary: true,
            categories: true,
            missingInformation: true,
            suggestedQuestions: true,
            disclaimer: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!opp) throw new NotFoundException('Opportunity not found.');

    // Owners see their own; admins see all; published is visible to all
    const isOwner = opp.ownerId === userId;
    const isAdmin = role === UserRole.ADMIN;
    const isPublished = opp.status === 'PUBLISHED';

    if (!isOwner && !isAdmin && !isPublished) {
      throw new ForbiddenException('You do not have access to this opportunity.');
    }

    // Convert JSON-encoded array/object fields back from SQLite string storage
    const analysis = opp.analysis.map((a) => ({
      ...a,
      categories: strToArr(a.categories),
      missingInformation: strToArr(a.missingInformation),
      suggestedQuestions: strToArr(a.suggestedQuestions),
    }));

    return {
      ...opp,
      supportingLinks: strToArr(opp.supportingLinks),
      evidence: strToObj(opp.evidence),
      analysis,
    };
  }

  async update(id: string, userId: string, role: UserRole, dto: UpdateOpportunityDto) {
    const opp = await this.prisma.opportunity.findUnique({ where: { id } });
    if (!opp) throw new NotFoundException('Opportunity not found.');

    const isOwner = opp.ownerId === userId;
    const isAdmin = role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You can only edit your own opportunities.');
    }

    // Owners can only edit DRAFT or NEEDS_INFORMATION
    if (isOwner && !isAdmin) {
      if (!['DRAFT', 'NEEDS_INFORMATION'].includes(opp.status)) {
        throw new BadRequestException('Opportunity cannot be edited in its current status.');
      }
    }

    const { supportingLinks, ...rest } = dto;

    return this.prisma.opportunity.update({
      where: { id },
      data: {
        ...rest,
        ...(supportingLinks !== undefined && { supportingLinks: arrToStr(supportingLinks) }),
      },
    });
  }

  async submit(id: string, userId: string) {
    const opp = await this.prisma.opportunity.findUnique({ where: { id } });
    if (!opp) throw new NotFoundException('Opportunity not found.');
    if (opp.ownerId !== userId) throw new ForbiddenException('You can only submit your own opportunities.');
    if (!['DRAFT', 'NEEDS_INFORMATION'].includes(opp.status)) {
      throw new BadRequestException('Only DRAFT or NEEDS_INFORMATION opportunities can be submitted.');
    }

    // Validate required fields
    if (!opp.title || !opp.description || !opp.type) {
      throw new BadRequestException('Please complete all required fields before submitting.');
    }

    const updated = await this.prisma.opportunity.update({
      where: { id },
      data: {
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
    });

    await this.recordStatusChange(id, 'SUBMITTED', userId);
    return updated;
  }

  async discover(query: QueryOpportunitiesDto) {
    const { type, sector, location, stage, search, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      status: OpportunityStatus.PUBLISHED,
      ...(type && { type }),
      ...(sector && { sector: { contains: sector } }),
      ...(location && { location: { contains: location } }),
      ...(stage && { stage }),
    };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { summary: { contains: search } },
        { description: { contains: search } },
        { sector: { contains: search } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.opportunity.count({ where }),
      this.prisma.opportunity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
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
          // Do not expose private owner contact info
          owner: { select: { id: true, name: true } },
        },
      }),
    ]);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  private async recordStatusChange(opportunityId: string, status: OpportunityStatus, actorId: string, note?: string) {
    await this.prisma.opportunityStatusHistory.create({
      data: { opportunityId, status, actorId, note },
    });
  }
}
