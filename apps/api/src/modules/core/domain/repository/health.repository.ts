export interface HealthRepository {
  getDatabaseStatus(): Promise<boolean>;
}
