import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { OpportunitiesModule } from './opportunities/opportunities.module';
import { OpportunityAnalysisModule } from './opportunity-analysis/opportunity-analysis.module';
import { InvestorPreferencesModule } from './investor-preferences/investor-preferences.module';
import { MatchingModule } from './matching/matching.module';
import { DiscoveryModule } from './discovery/discovery.module';
import { SavedOpportunitiesModule } from './saved-opportunities/saved-opportunities.module';
import { ConnectionRequestsModule } from './connection-requests/connection-requests.module';
import { ProgressModule } from './progress/progress.module';
import { AdminModule } from './admin/admin.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        name: 'global',
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
    OpportunitiesModule,
    OpportunityAnalysisModule,
    InvestorPreferencesModule,
    MatchingModule,
    DiscoveryModule,
    SavedOpportunitiesModule,
    ConnectionRequestsModule,
    ProgressModule,
    AdminModule,
    HealthModule,
  ],
})
export class AppModule { }
