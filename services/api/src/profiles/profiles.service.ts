import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../common/types';
import { arrToStr } from '../common/db-helpers';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertOwnerProfileDto } from './dto/upsert-owner-profile.dto';
import { UpsertInvestorProfileDto } from './dto/upsert-investor-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) { }

  async getMyProfile(userId: string, role: UserRole) {
    switch (role) {
      case UserRole.OPPORTUNITY_OWNER:
        return this.prisma.opportunityOwnerProfile.findUnique({ where: { userId } });
      case UserRole.INVESTOR:
        return this.prisma.investorProfile.findUnique({
          where: { userId },
          include: { preferences: true },
        });
      case UserRole.SCOUT:
        return this.prisma.scoutProfile.findUnique({ where: { userId } });
      case UserRole.ADMIN:
        return this.prisma.adminProfile.findUnique({ where: { userId } });
      default:
        throw new ForbiddenException('Unknown role.');
    }
  }

  async upsertOwnerProfile(userId: string, dto: UpsertOwnerProfileDto) {
    // Destructure the array field so it can be JSON-encoded for SQLite storage.
    // Other fields are passed through as-is.
    const { areasOfInterest, ...rest } = dto;
    const data = {
      ...rest,
      ...(areasOfInterest !== undefined && { areasOfInterest: arrToStr(areasOfInterest) }),
    };

    return this.prisma.opportunityOwnerProfile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }

  async upsertInvestorProfile(userId: string, dto: UpsertInvestorProfileDto) {
    return this.prisma.investorProfile.upsert({
      where: { userId },
      create: { userId, ...dto },
      update: dto,
    });
  }
}
