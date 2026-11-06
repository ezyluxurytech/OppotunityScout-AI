import { Module } from '@nestjs/common';
import { SavedOpportunitiesService } from './saved-opportunities.service';
import { SavedOpportunitiesController } from './saved-opportunities.controller';

@Module({
  providers: [SavedOpportunitiesService],
  controllers: [SavedOpportunitiesController],
})
export class SavedOpportunitiesModule {}
