import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ConnectionRequestStatus, UserRole } from '../common/types';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConnectionRequestDto } from './dto/create-connection-request.dto';
import { ConnectionAction } from './dto/update-connection-request.dto';

@Injectable()
export class ConnectionRequestsService {
  constructor(private prisma: PrismaService) { }

  async create(investorId: string, dto: CreateConnectionRequestDto) {
    const opp = await this.prisma.opportunity.findUnique({
      where: { id: dto.opportunityId },
    });
    if (!opp || opp.status !== 'PUBLISHED') {
      throw new NotFoundException('Opportunity not found or not available for connection requests.');
    }

    // Check for existing pending/accepted request
    const existing = await this.prisma.connectionRequest.findFirst({
      where: {
        investorId,
        opportunityId: dto.opportunityId,
        status: { in: ['PENDING', 'ACCEPTED'] },
      },
    });
    if (existing) {
      throw new ConflictException('A connection request already exists for this opportunity.');
    }

    return this.prisma.connectionRequest.create({
      data: {
        investorId,
        opportunityId: dto.opportunityId,
        ownerId: opp.ownerId,
        message: dto.message,
        status: 'PENDING',
      },
      include: {
        opportunity: { select: { id: true, title: true } },
      },
    });
  }

  async list(userId: string, role: UserRole) {
    if (role === UserRole.INVESTOR) {
      return this.prisma.connectionRequest.findMany({
        where: { investorId: userId },
        orderBy: { updatedAt: 'desc' },
        include: {
          opportunity: { select: { id: true, title: true, type: true, sector: true } },
        },
      });
    }

    if (role === UserRole.OPPORTUNITY_OWNER) {
      const requests = await this.prisma.connectionRequest.findMany({
        where: { ownerId: userId },
        orderBy: { updatedAt: 'desc' },
        include: {
          opportunity: { select: { id: true, title: true, type: true } },
          // Only expose investor identity after the request is accepted
          investor: { select: { id: true, name: true } },
        },
      });
      // Mask investor name for PENDING requests per spec privacy rules
      return requests.map((req) => ({
        ...req,
        investor: req.status === 'PENDING' ? { id: '', name: 'Anonymous Investor' } : req.investor,
      }));
    }

    if (role === UserRole.ADMIN) {
      return this.prisma.connectionRequest.findMany({
        orderBy: { updatedAt: 'desc' },
        include: {
          opportunity: { select: { id: true, title: true } },
          investor: { select: { id: true, name: true, email: true } },
          owner: { select: { id: true, name: true, email: true } },
        },
      });
    }

    return [];
  }

  async updateStatus(requestId: string, userId: string, role: UserRole, action: ConnectionAction) {
    const request = await this.prisma.connectionRequest.findUnique({
      where: { id: requestId },
    });
    if (!request) throw new NotFoundException('Connection request not found.');

    const isInvestor = request.investorId === userId;
    const isOwner = request.ownerId === userId;
    const isAdmin = role === UserRole.ADMIN;

    // Validate allowed actions by role
    if (action === ConnectionAction.WITHDRAW) {
      if (!isInvestor && !isAdmin) throw new ForbiddenException('Only the investor can withdraw a request.');
      if (request.status !== 'PENDING') throw new BadRequestException('Only PENDING requests can be withdrawn.');
    }

    if (action === ConnectionAction.ACCEPT || action === ConnectionAction.DECLINE) {
      if (!isOwner && !isAdmin) throw new ForbiddenException('Only the opportunity owner can accept or decline requests.');
      if (request.status !== 'PENDING') throw new BadRequestException('Only PENDING requests can be accepted or declined.');
    }

    if (action === ConnectionAction.CLOSE) {
      if (!isOwner && !isInvestor && !isAdmin) throw new ForbiddenException('Not authorized.');
      if (!['ACCEPTED'].includes(request.status)) throw new BadRequestException('Only ACCEPTED connections can be closed.');
    }

    const statusMap: Record<ConnectionAction, ConnectionRequestStatus> = {
      [ConnectionAction.ACCEPT]: 'ACCEPTED',
      [ConnectionAction.DECLINE]: 'DECLINED',
      [ConnectionAction.WITHDRAW]: 'WITHDRAWN',
      [ConnectionAction.CLOSE]: 'CLOSED',
    };

    return this.prisma.connectionRequest.update({
      where: { id: requestId },
      data: { status: statusMap[action] },
    });
  }
}
