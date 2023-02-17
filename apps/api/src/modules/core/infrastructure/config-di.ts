import { Prisma, PrismaClient } from '@prisma/client';
import { AwilixContainer, Resolver, asFunction, Lifetime } from 'awilix';
import { FastifyInstance } from 'fastify';

import { CoreDependencies, coreDependencies } from '../core-di';

import { Config, getConfig } from './config/config';
import { SINGLETON_CONFIG } from './constant-di';
import { Routes, getRoutes } from './http/routes';

export interface Dependencies extends CoreDependencies {
  config: Config;
  prisma: PrismaClient;
  routes: Routes[];
}

export type ExternalDependencies = {
  app?: FastifyInstance;
};

type DiConfig = Record<keyof Dependencies, Resolver<unknown>>;

export type DependencyOverrides = Partial<DiConfig>;

export function registerDependencies(
  diContainer: AwilixContainer,
  _dependencies: ExternalDependencies = {},
  dependencyOverrides: DependencyOverrides = {},
  configOverride?: Config,
): void {
  const diConfig: DiConfig = {
    config: asFunction(() => getConfig(configOverride), SINGLETON_CONFIG),
    prisma: asFunction(
      ({ config }: Dependencies) => {
        const logLevel: Prisma.LogLevel[] = ['info', 'error'];

        if (config.database.logQuery) {
          logLevel.push('query');
        }

        return new PrismaClient({
          datasources: {
            db: {
              url: config.database.connectionUrl,
            },
          },
          log: logLevel,
        });
      },
      {
        dispose: (prisma) => {
          return prisma.$disconnect();
        },
        lifetime: Lifetime.SINGLETON,
      },
    ),
    ...coreDependencies,
    routes: asFunction(getRoutes, SINGLETON_CONFIG),
  };

  diContainer.register(diConfig);

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(dependencyOverrides)) {
    diContainer.register(key, value);
  }
}
