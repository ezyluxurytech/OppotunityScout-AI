import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OpportunityAnalysisService } from './opportunity-analysis.service';
import { OpportunityAnalysisController } from './opportunity-analysis.controller';

@Module({
  imports: [HttpModule],
  providers: [OpportunityAnalysisService],
  controllers: [OpportunityAnalysisController],
  exports: [OpportunityAnalysisService],
})
export class OpportunityAnalysisModule {}
