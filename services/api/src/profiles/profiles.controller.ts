import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '../common/types';
import { ProfilesService } from './profiles.service';
import { UpsertOwnerProfileDto } from './dto/upsert-owner-profile.dto';
import { UpsertInvestorProfileDto } from './dto/upsert-investor-profile.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('profiles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) { }

  @Get('me')
  @ApiOperation({ summary: 'Get current user role profile' })
  getMyProfile(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.profilesService.getMyProfile(userId, role);
  }

  @Put('me/owner')
  @Roles(UserRole.OPPORTUNITY_OWNER)
  @ApiOperation({ summary: 'Create or update opportunity owner profile' })
  upsertOwnerProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpsertOwnerProfileDto,
  ) {
    return this.profilesService.upsertOwnerProfile(userId, dto);
  }

  @Put('me/investor')
  @Roles(UserRole.INVESTOR)
  @ApiOperation({ summary: 'Create or update investor profile' })
  upsertInvestorProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpsertInvestorProfileDto,
  ) {
    return this.profilesService.upsertInvestorProfile(userId, dto);
  }
}
