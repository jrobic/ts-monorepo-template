/* c8 ignore start */
import { PrismaClient } from '@prisma/client';
import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const prismaMiddlewarePluginCb: FastifyPluginCallback<{
  prismaInstance: PrismaClient;
}> = (fastify, opts, done) => {
  if (process.env.NODE_ENV !== 'production') {
    opts.prismaInstance.$use(async (params, next) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();
      // eslint-disable-next-line no-console
      fastify.log.debug(`Prisma: Query ${params.model}.${params.action} took ${after - before}ms`);
      return result;
    });
  }

  done();
};

export const prismaMiddlewarePlugin = fp(prismaMiddlewarePluginCb, {
  fastify: '4.x',
  name: 'prisma-middleware-plugin',
});

/* c8 ignore end */
