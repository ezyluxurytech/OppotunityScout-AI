import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '../common/types';
import { SavedOpportunitiesService } from './saved-opportunities.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('saved-opportunities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.INVESTOR)
@Controller()
export class SavedOpportunitiesController {
  constructor(private readonly service: SavedOpportunitiesService) { }

  @Get('saved-opportunities')
  @ApiOperation({ summary: 'List all saved opportunities' })
  listSaved(@CurrentUser('id') userId: string) {
    return this.service.listSaved(userId);
  }

  @Post('opportunities/:id/save')
  @ApiOperation({ summary: 'Save an opportunity' })
  save(@CurrentUser('id') userId: string, @Param('id') opportunityId: string) {
    return this.service.save(userId, opportunityId);
  }

  @Delete('opportunities/:id/save')
  @ApiOperation({ summary: 'Remove a saved opportunity' })
  unsave(@CurrentUser('id') userId: string, @Param('id') opportunityId: string) {
    return this.service.unsave(userId, opportunityId);
  }
}
