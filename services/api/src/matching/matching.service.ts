import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { strToArr } from '../common/db-helpers';

export interface MatchCriteria {
  criterion: string;
  matched: boolean;
  investorValue: string | string[];
  opportunityValue: string;
}

@Injectable()
export class MatchingService {
  constructor(private prisma: PrismaService) { }

  async getMatchesForInvestor(userId: string) {
    const profile = await this.prisma.investorProfile.findUnique({
      where: { userId },
      include: { preferences: true },
    });

    if (!profile || !profile.preferences) {
      return {
        data: [],
        message: 'Please set your investor preferences to see recommendations.',
        disclaimer:
          'Match scores are preference-based discovery aids. They do not represent investment suitability or guarantee funding outcomes.',
      };
    }

    const prefs = profile.preferences;

    // Convert JSON-encoded array fields back from SQLite string storage
    const sectors = strToArr(prefs.sectors as any);
    const opportunityTypes = strToArr(prefs.opportunityTypes as any);
    const locations = strToArr(prefs.locations as any);
    const stages = strToArr(prefs.stages as any);

    // Get published opportunities
    const opportunities = await this.prisma.opportunity.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        id: true,
        title: true,
        type: true,
        summary: true,
        sector: true,
        location: true,
        stage: true,
        publishedAt: true,
        owner: { select: { id: true, name: true } },
      },
    });

    const matches = opportunities.map((opp) => {
      const criteria: MatchCriteria[] = [];
      let score = 0;

      // Sector match
      if (sectors.length > 0) {
        const sectorMatch = opp.sector
          ? sectors.some((s) =>
            s.toLowerCase() === opp.sector?.toLowerCase() ||
            opp.sector?.toLowerCase().includes(s.toLowerCase()),
          )
          : false;
        criteria.push({
          criterion: 'Sector',
          matched: sectorMatch,
          investorValue: sectors,
          opportunityValue: opp.sector || 'Not specified',
        });
        if (sectorMatch) score += 30;
      }

      // Opportunity type match
      if (opportunityTypes.length > 0) {
        const typeMatch = opportunityTypes.includes(opp.type);
        criteria.push({
          criterion: 'Opportunity Type',
          matched: typeMatch,
          investorValue: opportunityTypes,
          opportunityValue: opp.type,
        });
        if (typeMatch) score += 25;
      }

      // Location match
      if (locations.length > 0) {
        const locationMatch = opp.location
          ? locations.some((l) =>
            opp.location?.toLowerCase().includes(l.toLowerCase()),
          )
          : false;
        criteria.push({
          criterion: 'Location',
          matched: locationMatch,
          investorValue: locations,
          opportunityValue: opp.location || 'Not specified',
        });
        if (locationMatch) score += 25;
      }

      // Stage match
      if (stages.length > 0) {
        const stageMatch = opp.stage ? stages.includes(opp.stage) : false;
        criteria.push({
          criterion: 'Stage',
          matched: stageMatch,
          investorValue: stages,
          opportunityValue: opp.stage || 'Not specified',
        });
        if (stageMatch) score += 20;
      }

      const normalizedScore = criteria.length > 0 ? Math.round((score / 100) * 100) : 0;

      let relevanceBand: string;
      if (normalizedScore >= 70) relevanceBand = 'HIGH';
      else if (normalizedScore >= 40) relevanceBand = 'MEDIUM';
      else relevanceBand = 'LOW';

      const matchedCriteria = criteria.filter((c) => c.matched).map((c) => c.criterion);
      const explanation = this.buildExplanation(matchedCriteria, criteria.length);

      return {
        opportunity: opp,
        score: normalizedScore,
        relevanceBand,
        matchedCriteria: criteria,
        explanation,
        generatedAt: new Date().toISOString(),
      };
    });

    // Sort by score descending, return only matches with some relevance
    const sorted = matches
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score);

    return {
      data: sorted,
      total: sorted.length,
      disclaimer:
        'Match scores are preference-based discovery aids. They do not represent investment suitability or guarantee funding outcomes.',
    };
  }

  private buildExplanation(matched: string[], total: number): string {
    if (matched.length === 0) return 'No preference criteria matched.';
    if (matched.length === total) return `Matches all your preferences: ${matched.join(', ')}.`;
    return `Matches your preferences for: ${matched.join(', ')}.`;
  }
}
