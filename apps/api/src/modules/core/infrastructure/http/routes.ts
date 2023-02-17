import type http from 'http';

import { FastifyBaseLogger, RouteOptions } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import type { Dependencies } from '../config-di';

import { getCoreRoutes } from './routes/core.routes';

export type Route = RouteOptions<
  http.Server,
  http.IncomingMessage,
  http.ServerResponse,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  ZodTypeProvider,
  FastifyBaseLogger
>;

export type Routes = Array<Route>;

export function getRoutes(deps: Dependencies): Routes {
  const userRoutes = getCoreRoutes(deps);

  return [...userRoutes];
}
