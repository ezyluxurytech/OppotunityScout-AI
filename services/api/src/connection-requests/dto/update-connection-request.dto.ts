import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ConnectionAction {
  ACCEPT = 'ACCEPT',
  DECLINE = 'DECLINE',
  WITHDRAW = 'WITHDRAW',
  CLOSE = 'CLOSE',
}

export class UpdateConnectionRequestDto {
  @ApiProperty({ enum: ConnectionAction })
  @IsEnum(ConnectionAction)
  action: ConnectionAction;
}
