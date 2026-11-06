import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '../common/types';
import { MatchingService } from './matching.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('matching')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.INVESTOR)
@Controller('matches')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) { }

  @Get()
  @ApiOperation({ summary: "Get investor's preference-based opportunity recommendations" })
  getMatches(@CurrentUser('id') userId: string) {
    return this.matchingService.getMatchesForInvestor(userId);
  }
}
