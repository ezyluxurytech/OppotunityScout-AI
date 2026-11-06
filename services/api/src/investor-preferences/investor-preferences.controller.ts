import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '../common/types';
import { InvestorPreferencesService } from './investor-preferences.service';
import { UpsertPreferencesDto } from './dto/upsert-preferences.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('investor-preferences')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.INVESTOR)
@Controller('investor/preferences')
export class InvestorPreferencesController {
  constructor(private readonly service: InvestorPreferencesService) { }

  @Get('me')
  @ApiOperation({ summary: 'Get current investor preferences' })
  getMyPreferences(@CurrentUser('id') userId: string) {
    return this.service.getMyPreferences(userId);
  }

  @Put('me')
  @ApiOperation({ summary: 'Create or update investor preferences' })
  upsertPreferences(
    @CurrentUser('id') userId: string,
    @Body() dto: UpsertPreferencesDto,
  ) {
    return this.service.upsertPreferences(userId, dto);
  }
}
