import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { arrToStr } from '../common/db-helpers';
import { UpsertPreferencesDto } from './dto/upsert-preferences.dto';

@Injectable()
export class InvestorPreferencesService {
  constructor(private prisma: PrismaService) { }

  async getMyPreferences(userId: string) {
    const profile = await this.prisma.investorProfile.findUnique({
      where: { userId },
      include: { preferences: true },
    });
    if (!profile) throw new NotFoundException('Investor profile not found. Please create your profile first.');
    return profile.preferences;
  }

  async upsertPreferences(userId: string, dto: UpsertPreferencesDto) {
    const profile = await this.prisma.investorProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Investor profile not found. Please create your profile first.');

    // Destructure array fields so they can be JSON-encoded for SQLite storage.
    // Non-array fields (minInvestment, maxInvestment) are passed through as-is.
    const { sectors, opportunityTypes, locations, stages, ...rest } = dto;
    const data = {
      ...rest,
      ...(sectors !== undefined && { sectors: arrToStr(sectors) }),
      ...(opportunityTypes !== undefined && { opportunityTypes: arrToStr(opportunityTypes) }),
      ...(locations !== undefined && { locations: arrToStr(locations) }),
      ...(stages !== undefined && { stages: arrToStr(stages) }),
    };

    return this.prisma.investorPreference.upsert({
      where: { investorId: profile.id },
      create: { investorId: profile.id, ...data },
      update: data,
    });
  }
}
