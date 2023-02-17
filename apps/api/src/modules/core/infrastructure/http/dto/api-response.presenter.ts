import { z } from 'zod';

export function makeApiResponsePresenter<T>(schema?: z.ZodSchema<T>) {
  return z.object({
    code: z.number(),
    data: schema ? schema.nullable() : z.null(),
    message: z.string(),
    timestamp: z.string(),
    errorCode: z.string().nullable(),
  });
}

export class ApiResponse<TData> {
  readonly code: number;

  readonly data: TData | null;

  readonly message: string;

  readonly timestamp: string;

  readonly errorCode: string | null = null;

  constructor(code: number, message: string, data?: TData, errorCode?: string) {
    this.code = code;
    this.message = message;

    this.data = data ?? null;

    this.timestamp = new Date().toISOString();
    this.errorCode = errorCode ?? null;
  }

  public static success<TData>(code = 200, data?: TData, message = 'Success'): ApiResponse<TData> {
    return new ApiResponse<TData>(code, message, data);
  }

  public static error<TData>(
    code = 500,
    data?: TData,
    message = 'Internal error',
    errorCode?: string,
  ): ApiResponse<TData> {
    return new ApiResponse<TData>(code, message, data, errorCode);
  }
}
