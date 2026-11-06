import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '../common/types';
import { OpportunitiesService } from './opportunities.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { QueryOpportunitiesDto } from './dto/query-opportunities.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('opportunities')
@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OPPORTUNITY_OWNER, UserRole.SCOUT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new opportunity draft' })
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateOpportunityDto,
  ) {
    return this.opportunitiesService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Discover published opportunities (public)' })
  discover(@Query() query: QueryOpportunitiesDto) {
    return this.opportunitiesService.discover(query);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OPPORTUNITY_OWNER, UserRole.SCOUT)
  @ApiBearerAuth()
  @ApiOperation({ summary: "List current user's opportunities" })
  myOpportunities(@CurrentUser('id') userId: string) {
    return this.opportunitiesService.findMyOpportunities(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get opportunity details' })
  findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.opportunitiesService.findOne(id, userId, role);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OPPORTUNITY_OWNER, UserRole.SCOUT, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an opportunity' })
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: UserRole,
    @Body() dto: UpdateOpportunityDto,
  ) {
    return this.opportunitiesService.update(id, userId, role, dto);
  }

  @Post(':id/submit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OPPORTUNITY_OWNER, UserRole.SCOUT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit opportunity for review' })
  submit(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.opportunitiesService.submit(id, userId);
  }
}
