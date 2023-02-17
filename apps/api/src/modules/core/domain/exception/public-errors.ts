/* eslint-disable max-classes-per-file */

import { PublicNonRecoverableError } from './public-non-recoverable-error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FreeformRecord = Record<string, any>;

export type CommonErrorParams = {
  message: string;
  details?: FreeformRecord;
};

export type OptionalMessageErrorParams = {
  message?: string;
  details?: FreeformRecord;
};

export class EntityNotFoundError extends PublicNonRecoverableError {
  constructor(params: CommonErrorParams) {
    super({
      message: params.message,
      errorCode: 'ENTITY_NOT_FOUND',
      httpStatusCode: 404,
      details: params.details,
    });
  }
}
