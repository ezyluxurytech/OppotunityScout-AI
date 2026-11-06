import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '../common/types';
import { ConnectionRequestsService } from './connection-requests.service';
import { CreateConnectionRequestDto } from './dto/create-connection-request.dto';
import { UpdateConnectionRequestDto } from './dto/update-connection-request.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('connection-requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('connection-requests')
export class ConnectionRequestsController {
  constructor(private readonly service: ConnectionRequestsService) { }

  @Post()
  @Roles(UserRole.INVESTOR)
  @ApiOperation({ summary: 'Send a connection request' })
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateConnectionRequestDto,
  ) {
    return this.service.create(userId, dto);
  }

  @Get()
  @Roles(UserRole.INVESTOR, UserRole.OPPORTUNITY_OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'List connection requests visible to current user' })
  list(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.service.list(userId, role);
  }

  @Patch(':id')
  @Roles(UserRole.INVESTOR, UserRole.OPPORTUNITY_OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Accept, decline, withdraw, or close a connection request' })
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: UserRole,
    @Body() dto: UpdateConnectionRequestDto,
  ) {
    return this.service.updateStatus(id, userId, role, dto.action);
  }
}
