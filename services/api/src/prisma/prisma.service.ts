import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    // Attempt to connect but don't crash the app if DB is unavailable.
    // The health endpoint will report the actual DB status.
    try {
      await this.$connect();
      this.logger.log('✅ Database connection established');
    } catch (err) {
      this.logger.warn(
        '⚠️  Database connection failed — API will start but database operations will error. ' +
        'Start PostgreSQL to enable full functionality.',
      );
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch {
      // ignore on shutdown
    }
  }
}
