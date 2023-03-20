/* eslint-disable class-methods-use-this */
import { PrismaClient } from '@prisma/client';

import { HealthRepository } from '../../domain/repository/health.repository';
import type { Dependencies } from '../config-di';

export class HealthImplRepository implements HealthRepository {
  #db: PrismaClient;

  constructor({ prisma }: Dependencies) {
    this.#db = prisma;
  }

  async getDatabaseStatus(): Promise<boolean> {
    try {
      await this.#db.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
