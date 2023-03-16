/* eslint-disable max-classes-per-file */
import { InternalError } from './internal-error';
import { CommonErrorParams } from './public-errors';

export class DatabaseUnreachableError extends InternalError {
  constructor(params: CommonErrorParams) {
    super({
      message: params.message,
      errorCode: 'DATABASE_UNREACHABLE',
      details: params.details,
    });
  }
}
