import { types } from 'node:util';

import { pino, stdSerializers } from 'pino';

import { hasMessage } from '../../../../../utils/type-utils';

export const globalLogger = pino();

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

export function executeAndHandleGlobalErrors<T>(operation: () => T) {
  try {
    const result = operation();
    return result;
  } catch (err) {
    const logObject = resolveGlobalErrorLogObject(err);
    globalLogger.error(logObject);
    return process.exit(1);
  }
}
