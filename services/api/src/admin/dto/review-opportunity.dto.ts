import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ReviewAction {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  REQUEST_INFO = 'REQUEST_INFO',
  ARCHIVE = 'ARCHIVE',
  SET_UNDER_REVIEW = 'SET_UNDER_REVIEW',
}

export class ReviewOpportunityDto {
  @ApiProperty({ enum: ReviewAction })
  @IsEnum(ReviewAction)
  action: ReviewAction;

  @ApiPropertyOptional({ description: 'Feedback note for the opportunity owner' })
  @IsOptional()
  @IsString()
  feedback?: string;
}
