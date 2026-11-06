import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '../common/types';
import { OpportunityAnalysisService } from './opportunity-analysis.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('opportunity-analysis')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('opportunities')
export class OpportunityAnalysisController {
  constructor(private readonly service: OpportunityAnalysisService) { }

  @Post(':id/analyze')
  @Roles(UserRole.OPPORTUNITY_OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Request AI analysis for an opportunity' })
  requestAnalysis(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.service.requestAnalysis(id, userId, role);
  }

  @Get(':id/analysis')
  @Roles(UserRole.OPPORTUNITY_OWNER, UserRole.INVESTOR, UserRole.ADMIN, UserRole.SCOUT)
  @ApiOperation({ summary: 'Get latest AI analysis for an opportunity' })
  getLatestAnalysis(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.service.getLatestAnalysis(id, userId, role);
  }
}
