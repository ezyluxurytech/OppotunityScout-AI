/**
 * Database seed for development only.
 * Run: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
 *
 * NEVER use real user data for seeding. Never run in production.
 */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { arrToStr } from '../src/common/db-helpers';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding development data...');

  const password = await bcrypt.hash('DevPass123!', 12);

  // Seed users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@opportunityscout.dev' },
    update: {},
    create: {
      name: 'Platform Admin',
      email: 'admin@opportunityscout.dev',
      passwordHash: password,
      role: 'ADMIN',
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: 'owner@opportunityscout.dev' },
    update: {},
    create: {
      name: 'Demo Owner',
      email: 'owner@opportunityscout.dev',
      passwordHash: password,
      role: 'OPPORTUNITY_OWNER',
    },
  });

  const investor = await prisma.user.upsert({
    where: { email: 'investor@opportunityscout.dev' },
    update: {},
    create: {
      name: 'Demo Investor',
      email: 'investor@opportunityscout.dev',
      passwordHash: password,
      role: 'INVESTOR',
    },
  });

  // Seed opportunity
  await prisma.opportunity.upsert({
    where: { id: 'seed-opp-001' },
    update: {},
    create: {
      id: 'seed-opp-001',
      ownerId: owner.id,
      title: 'AgriTech Marketplace for Smallholder Farmers',
      type: 'BUSINESS',
      description:
        'A digital marketplace connecting smallholder farmers in West Africa with premium buyers, logistics providers, and access to agricultural inputs at competitive prices.',
      summary:
        'Digital agricultural marketplace reducing post-harvest losses and improving farmer income.',
      sector: 'Agriculture',
      location: 'Lagos, Nigeria',
      stage: 'EARLY_STAGE',
      problem: 'Smallholder farmers struggle to access premium buyers and often sell at below-market prices through middlemen.',
      solution: 'A mobile-first platform that connects farmers directly to verified buyers with transparent pricing and logistics support.',
      goals: 'Reach 10,000 farmers in Year 1. Expand to 3 countries in Year 2.',
      supportRequired: 'USD 150,000 seed funding',
      useOfFunds: 'Technology development (40%), Market expansion (35%), Operations (25%)',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      submittedAt: new Date(),
      supportingLinks: arrToStr([]),
    },
  });

  // Seed investor profile and preferences
  const investorProfile = await prisma.investorProfile.upsert({
    where: { userId: investor.id },
    update: {},
    create: {
      userId: investor.id,
      investorType: 'Angel Investor',
      description: 'Impact investor focused on African agri-tech and fintech.',
      location: 'Accra, Ghana',
    },
  });

  await prisma.investorPreference.upsert({
    where: { investorId: investorProfile.id },
    update: {},
    create: {
      investorId: investorProfile.id,
      sectors: arrToStr(['Agriculture', 'Technology', 'Fintech']),
      opportunityTypes: arrToStr(['BUSINESS', 'IDEA']),
      locations: arrToStr(['Nigeria', 'Ghana', 'Kenya']),
      stages: arrToStr(['EARLY_STAGE', 'GROWTH']),
    },
  });

  console.log('✅ Seed complete.');
  console.log('');
  console.log('Dev accounts (password: DevPass123!):');
  console.log(`  Admin:    admin@opportunityscout.dev`);
  console.log(`  Owner:    owner@opportunityscout.dev`);
  console.log(`  Investor: investor@opportunityscout.dev`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
