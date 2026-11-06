import { IsOptional, IsString, IsArray, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpsertOwnerProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactInfo?: string;

  @ApiPropertyOptional({ enum: ['PUBLIC', 'PRIVATE', 'CONNECTIONS_ONLY'] })
  @IsOptional()
  @IsIn(['PUBLIC', 'PRIVATE', 'CONNECTIONS_ONLY'])
  contactVisibility?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  areasOfInterest?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  organizationName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  profileImageUrl?: string;
}
