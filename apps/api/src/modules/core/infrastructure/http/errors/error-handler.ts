import { FastifyInstance } from 'fastify';
import pino from 'pino';
import { ZodError } from 'zod';

import { isObject } from '../../../../../utils/type-utils';
import { InternalError } from '../../../domain/exception/internal-error';
import { PublicNonRecoverableError } from '../../../domain/exception/public-non-recoverable-error';
import { ApiResponse } from '../dto';

type Handler = Parameters<FastifyInstance['setErrorHandler']>[0];

export function resolveLogObject(error: Error): Record<string, unknown> {
  if (error instanceof InternalError) {
    return {
      message: error.message,
      code: error.errorCode,
      details: error.details ? JSON.stringify(error.details) : undefined,
      error: pino.stdSerializers.err({
        name: error.name,
        message: error.message,
        stack: error.stack,
      }),
    };
  }

  return {
    message: isObject(error) ? error.message : JSON.stringify(error),
    error: error instanceof Error ? pino.stdSerializers.err(error) : undefined,
  };
}

export const errorHandler: Handler = function errorHandler(this, error, request, reply): void {
  const logObject = resolveLogObject(error);
  this.log.error(logObject);

  if (error instanceof PublicNonRecoverableError) {
    const errorStatusCode = error.httpStatusCode ?? 500;
    reply
      .status(errorStatusCode)
      .send(ApiResponse.error(errorStatusCode, null, error.message, error.errorCode));
    return;
  }

  if (error instanceof ZodError) {
    // this.log.error(JSON.parse(error.message).message);
    reply.status(400).send(ApiResponse.error(400, null, JSON.parse(error.message)));
    return;
  }

  reply.status(500).send(ApiResponse.error(500, null, error.message));
};
