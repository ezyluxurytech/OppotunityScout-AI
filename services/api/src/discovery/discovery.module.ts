import { Module } from '@nestjs/common';

// Discovery is handled via GET /opportunities (OpportunitiesModule)
// This module is reserved for future discovery-specific features (e.g. featured listings, trending)
@Module({})
export class DiscoveryModule {}
