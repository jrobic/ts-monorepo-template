/* eslint no-void: ["error", { "allowAsStatement": true }] */

import { randomUUID } from 'crypto';

import { fastifyAwilixPlugin } from '@fastify/awilix';
import cors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { createContainer } from 'awilix';
import fastify from 'fastify';
import fastifyNoIcon from 'fastify-no-icon';
import {
  ZodTypeProvider,
  createJsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

import { Config, getConfig, isDevelopment } from '../config/config';
import { DependencyOverrides, registerDependencies } from '../config-di';

import { errorHandler } from './errors/error-handler';
import { gracefullShutdown } from './gracefull-shutdown';
import { onRequestLogger, onResponseLogger, resolveLoggerConfiguration } from './logger';
import { prismaMiddlewarePlugin } from './plugins/prisma-middleware.plugins';
import { Route } from './routes';

export async function newHttpServer(
  configOverrides?: Config,
  dependencyOverrides: DependencyOverrides = {},
) {
  const config = getConfig(configOverrides);
  const appConfig = config.app;

  const app = fastify({
    logger: resolveLoggerConfiguration(),
    disableRequestLogging: isDevelopment(),
    genReqId: () => randomUUID(),
    requestIdHeader: 'x-request-id',
  });

  app.setErrorHandler(errorHandler);
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  void app.register(fastifyNoIcon);
  void app.register(fastifyHelmet, isDevelopment() ? { contentSecurityPolicy: false } : {});

  // allow cors on all routes, this server isn't meant to be public.
  // A Traefik reverse proxy will handle the security for us.
  void app.register(cors, {
    origin: '*',
  });

  void app.register(fastifyAwilixPlugin);

  void app.register(fastifySwagger, {
    transform: createJsonSchemaTransform({
      skipList: [
        '/documentation/',
        '/documentation/initOAuth',
        '/documentation/json',
        '/documentation/uiConfig',
        '/documentation/yaml',
        '/documentation/*',
        '/documentation/static/*',
        '*',
      ],
    }),
    openapi: {
      info: {
        title: 'TSMT API',
        description: 'TSMT API Documentation',
        version: '1.0.0',
      },
      servers: [
        {
          url: `http://${
            appConfig.bindAddress === '0.0.0.0' ? 'localhost' : appConfig.bindAddress
          }:${appConfig.port}`,
        },
      ],
      components: {
        securitySchemes: {},
      },
    },
  });

  void app.register(fastifySwaggerUi);

  app.addHook('onRequest', onRequestLogger);

  app.addHook('onResponse', onResponseLogger);

  const globalContainer = createContainer();
  registerDependencies(
    globalContainer,
    {
      app,
    },
    dependencyOverrides,
    configOverrides,
  );

  void app.register(prismaMiddlewarePlugin, {
    prismaInstance: globalContainer.cradle.prisma,
  });

  // graceful shutdown
  const closeListeners = gracefullShutdown(app);
  app.addHook('onClose', async (instance, done) => {
    globalContainer.dispose();
    closeListeners.uninstall();
    done();
  });

  app.after(() => {
    // Register controllers/routes
    // const { routes } = getRoutes(globalContainer.);
    globalContainer.cradle.routes.forEach((route: Route) => {
      app.withTypeProvider<ZodTypeProvider>().route(route);
    });
  });

  try {
    await app.ready();
  } catch (err) {
    app.log.error(err);
    throw err;
  }

  return app;
}
