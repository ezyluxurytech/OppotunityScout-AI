import { IsOptional, IsArray, IsString, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpsertPreferencesDto {
  @ApiPropertyOptional({ type: [String], example: ['Agriculture', 'Technology'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sectors?: string[];

  @ApiPropertyOptional({ type: [String], example: ['BUSINESS', 'IDEA'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  opportunityTypes?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Nigeria', 'Ghana'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  locations?: string[];

  @ApiPropertyOptional({ type: [String], example: ['EARLY_STAGE', 'GROWTH'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  stages?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  minInvestment?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxInvestment?: number;
}
