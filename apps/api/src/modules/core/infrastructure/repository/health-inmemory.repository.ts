/* eslint-disable class-methods-use-this */
import { HealthRepository } from '../../domain/repository/health.repository';

export class HealthInMemoryRepository implements HealthRepository {
  async getDatabaseStatus(): Promise<boolean> {
    return Promise.resolve(true);
  }
}
