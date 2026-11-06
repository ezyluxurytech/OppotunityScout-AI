import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OpportunityType, OpportunityStage } from '../../common/types';

export class CreateOpportunityDto {
  @ApiProperty({ example: 'AgriTech Marketplace for Smallholder Farmers' })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @ApiProperty({ enum: OpportunityType })
  @IsEnum(OpportunityType)
  type: OpportunityType;

  @ApiProperty({ example: 'A platform connecting smallholder farmers with buyers.' })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional({ example: 'Agriculture' })
  @IsOptional()
  @IsString()
  sector?: string;

  @ApiPropertyOptional({ example: 'Lagos, Nigeria' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ enum: OpportunityStage })
  @IsOptional()
  @IsEnum(OpportunityStage)
  stage?: OpportunityStage;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  problem?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  solution?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  goals?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  supportRequired?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  useOfFunds?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportingLinks?: string[];
}
