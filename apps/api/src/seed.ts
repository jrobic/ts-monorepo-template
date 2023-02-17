/* c8 ignore start */
/* eslint-disable import/no-extraneous-dependencies, no-console */
import PromisePool from '@supercharge/promise-pool';

import { UserEntity, prisma } from './modules/core';
import { newUserBuilder } from './modules/core/domain/builder';

// eslint-disable-next-line no-unused-vars
async function dropData() {
  const excludeTables = ['spatial_ref_sys', '_prisma_migrations'];

  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  // eslint-disable-next-line no-restricted-syntax
  for (const { tablename } of tablenames) {
    if (!excludeTables.includes(tablename)) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
        console.log(`TRUNCATE ${tablename}`);
      } catch (error) {
        console.log({ error });
      }
    }
  }
}

async function seed() {
  const pool = PromisePool.withConcurrency(20);

  // inject lots of Users in the database
  const range = [...Array(5000).keys()];

  const { results: users } = await pool.for(range).process(async () => {
    const user = UserEntity.create(newUserBuilder());
    await prisma.user.create({
      data: user,
    });
  });

  console.log('users created ', users.length);
}

async function main() {
  await dropData();

  await seed();

  console.log('Insert Data Successfully');
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

/* c8 ignore end */
