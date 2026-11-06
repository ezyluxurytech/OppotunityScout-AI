import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UserRole } from '../common/types';
import { AdminService } from './admin.service';
import { ReviewOpportunityDto } from './dto/review-opportunity.dto';
import { ManageUserDto } from './dto/manage-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('opportunities')
  @ApiOperation({ summary: 'Get opportunity review queue' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getReviewQueue(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.adminService.getReviewQueue(+page, +limit);
  }

  @Patch('opportunities/:id/review')
  @ApiOperation({ summary: 'Review an opportunity (approve, reject, request info, etc.)' })
  reviewOpportunity(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
    @Body() dto: ReviewOpportunityDto,
  ) {
    return this.adminService.reviewOpportunity(id, adminId, dto);
  }

  @Get('users')
  @ApiOperation({ summary: 'List and search users' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  listUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
  ) {
    return this.adminService.listUsers(+page, +limit, search);
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Suspend or activate a user account' })
  manageUser(
    @Param('id') targetUserId: string,
    @CurrentUser('id') adminId: string,
    @Body() dto: ManageUserDto,
  ) {
    return this.adminService.manageUser(targetUserId, adminId, dto);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get platform metrics' })
  getMetrics() {
    return this.adminService.getMetrics();
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get admin audit logs' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getAuditLogs(
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    return this.adminService.getAuditLogs(+page, +limit);
  }
}
