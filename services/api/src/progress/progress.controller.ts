import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '../common/types';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class ProgressController {
  constructor(private readonly progressService: ProgressService) { }

  @Post('progress')
  @Roles(UserRole.OPPORTUNITY_OWNER, UserRole.INVESTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Add a progress update' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateProgressDto) {
    return this.progressService.create(userId, dto);
  }

  @Get('opportunities/:id/progress')
  @Roles(UserRole.OPPORTUNITY_OWNER, UserRole.INVESTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get progress history for an opportunity' })
  getHistory(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.progressService.getProgressHistory(id, userId, role);
  }
}
