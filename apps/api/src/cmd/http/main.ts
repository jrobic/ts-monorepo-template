/* eslint-disable import/first, import/order */
// need to be loaded before any other import
import { registerTracing } from '../../modules/core/infrastructure/http/otel';

const enableTracing = Boolean(process.env.TRACING?.trim());

if (enableTracing) {
  registerTracing();
}

import { Config, getConfig } from '../../modules/core/infrastructure/config/config';
import {
  executeAndHandleGlobalErrors,
  resolveGlobalErrorLogObject,
} from '../../modules/core/infrastructure/http/errors/global-error-handler';
import { newHttpServer } from '../../modules/core/infrastructure/http/server';

export async function main() {
  const app = await newHttpServer();
  const config = executeAndHandleGlobalErrors<Config>(getConfig, app.log);

  if (enableTracing) {
    app.log.info('Tracing enabled');
  }

  try {
    await app.listen({
      port: config.app.port,
      host: config.app.bindAddress,
    });
  } catch (error) {
    app.log.error(resolveGlobalErrorLogObject(error));
    process.exit(1);
  }
}

main();
