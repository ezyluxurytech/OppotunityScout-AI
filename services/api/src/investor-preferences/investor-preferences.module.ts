import { Module } from '@nestjs/common';
import { InvestorPreferencesService } from './investor-preferences.service';
import { InvestorPreferencesController } from './investor-preferences.controller';

@Module({
  providers: [InvestorPreferencesService],
  controllers: [InvestorPreferencesController],
  exports: [InvestorPreferencesService],
})
export class InvestorPreferencesModule {}
