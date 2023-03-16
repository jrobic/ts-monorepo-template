import { config } from 'dotenv';

import { ConfigScope } from './config-scope';

config();

const configScope: ConfigScope = new ConfigScope();

export type Config = {
  app: AppConfig;
  database: DatabaseConfig;
};

export type AppConfig = {
  port: number;
  bindAddress: string;
  logLevel: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent';
  nodeEnv: 'production' | 'development' | 'test';
  appEnv: 'production' | 'development' | 'staging';
  appVersion: string;
  gitCommitSha: string;
};

export type DatabaseConfig = {
  connectionUrl: string;
  logQuery: boolean;
};

export function getAppConfig(): AppConfig {
  return {
    port: configScope.getMandatoryInteger('APP_PORT'),
    bindAddress: configScope.getMandatory('APP_BIND_ADDRESS'),
    logLevel: configScope.getMandatoryOneOf('LOG_LEVEL', [
      'fatal',
      'error',
      'warn',
      'info',
      'debug',
      'trace',
      'silent',
    ]),
    nodeEnv: configScope.getMandatoryOneOf('NODE_ENV', ['production', 'development', 'test']),
    appEnv: configScope.getMandatoryOneOf('APP_ENV', ['production', 'development', 'staging']),
    appVersion: configScope.getOptional('APP_VERSION', 'local'),
    gitCommitSha: configScope.getOptional('GIT_COMMIT_SHA', ''),
  };
}

export function getDatabaseConfig(): DatabaseConfig {
  return {
    connectionUrl: configScope.getMandatory('DATABASE_URL'),
    logQuery: configScope.getOptionalBoolean('DATABASE_LOG_QUERY', false),
  };
}

export function getConfig(overrides?: Config): Config {
  return (
    overrides || {
      app: getAppConfig(),
      database: getDatabaseConfig(),
    }
  );
}
export function isDevelopment() {
  return configScope.isDevelopment();
}

export function isTest() {
  return configScope.isTest();
}

export function isProduction() {
  return configScope.isProduction();
}
