import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConnectionRequestDto {
  @ApiProperty({ description: 'The opportunity ID to request connection for' })
  @IsString()
  opportunityId: string;

  @ApiPropertyOptional({ description: 'Optional introductory message', maxLength: 1000 })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}
