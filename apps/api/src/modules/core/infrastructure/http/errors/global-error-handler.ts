import { types } from 'node:util';

import type { FastifyBaseLogger } from 'fastify';
import { stdSerializers } from 'pino';

import { hasMessage } from '../../../../../utils/type-utils';

export function resolveGlobalErrorLogObject(err: unknown, correlationID?: string) {
  if (types.isNativeError(err)) {
    return {
      ...stdSerializers.err(err),
      correlationID,
    };
  }

  if (hasMessage(err)) {
    return correlationID ? `${err.message} (${correlationID})` : err.message;
  }

  return 'Unknown global error';
}

export function executeAndHandleGlobalErrors<T>(operation: () => T, logger: FastifyBaseLogger) {
  try {
    const result = operation();
    return result;
  } catch (err) {
    const logObject = resolveGlobalErrorLogObject(err);
    logger.error(logObject);
    return process.exit(1);
  }
}
