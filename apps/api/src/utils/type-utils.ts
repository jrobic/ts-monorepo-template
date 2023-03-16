export type StandardizedError = {
  code: string;
  message: string;
};

/**
 *
 * @param maybeObject
 * Type Guard function to check if a value is an object
 * @see (https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards)
 */
export const isObject = (maybeObject: unknown): maybeObject is Record<PropertyKey, unknown> =>
  typeof maybeObject === 'object' && maybeObject !== null;

export const hasMessage = (maybe: unknown): maybe is { message: string } =>
  isObject(maybe) && typeof maybe.message === 'string';

export const isStandardizedError = (error: unknown): error is StandardizedError =>
  isObject(error) && typeof error.code === 'string' && typeof error.message === 'string';

export type Jsonify<T> = T extends { toJSON(): infer U }
  ? U
  : T extends object
  ? {
      [k in keyof T]: Jsonify<T[k]>;
    }
  : T;
