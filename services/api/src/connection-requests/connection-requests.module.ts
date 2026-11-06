import { Module } from '@nestjs/common';
import { ConnectionRequestsService } from './connection-requests.service';
import { ConnectionRequestsController } from './connection-requests.controller';

@Module({
  providers: [ConnectionRequestsService],
  controllers: [ConnectionRequestsController],
})
export class ConnectionRequestsModule {}
