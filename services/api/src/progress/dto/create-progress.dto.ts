import { IsString, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProgressStage } from '../../common/types';

export class CreateProgressDto {
  @ApiProperty()
  @IsString()
  opportunityId: string;

  @ApiProperty({ enum: ProgressStage })
  @IsEnum(ProgressStage)
  stage: ProgressStage;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;

  @ApiPropertyOptional({ description: 'Optional connection request ID this update relates to' })
  @IsOptional()
  @IsString()
  connectionRequestId?: string;
}
