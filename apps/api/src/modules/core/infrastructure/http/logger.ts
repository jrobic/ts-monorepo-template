import { FastifyReply, FastifyRequest } from 'fastify';
import { PinoLoggerOptions } from 'fastify/types/logger';
import { levels } from 'pino';

export function resolveLoggerConfiguration(): PinoLoggerOptions | boolean {
  if (process.env.TEST === 'true') {
    return false;
  }

  const config: PinoLoggerOptions = {
    level: 'debug',
    formatters: {
      level: (label, numericLevel): { level: string } => {
        const level = levels.labels[numericLevel] || 'unknown';
        return { level };
      },
    },
  };

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.info("Logger is configured to use 'pino-pretty' transport.");
    config.transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    };
  }

  return config;
}

export async function onRequestLogger(request: FastifyRequest) {
  if (request.method !== 'OPTIONS') {
    request.log.info(`${request.id} ${request.method} ${request.raw.url}`);
  }
}

export async function onResponseLogger(request: FastifyRequest, reply: FastifyReply) {
  if (request.method !== 'OPTIONS') {
    request.log.info(
      `${request.id} ${request.method} ${request.raw.url} - ${reply.statusCode} +${reply
        .getResponseTime()
        .toFixed(3)}ms`,
    );
  }
}
