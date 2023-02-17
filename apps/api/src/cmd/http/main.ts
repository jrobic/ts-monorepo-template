/* eslint-disable import/first */
// eslint-disable-next-line import/order
import { Config, getConfig } from '../../modules/core/infrastructure/config/config';
import {
  executeAndHandleGlobalErrors,
  resolveGlobalErrorLogObject,
} from '../../modules/core/infrastructure/http/errors/global-error-handler';
import { registerTracing } from '../../modules/core/infrastructure/http/otel';
import { newHttpServer } from '../../modules/core/infrastructure/http/server';

// need to be loaded before any other import
registerTracing();

export async function main() {
  const config = executeAndHandleGlobalErrors<Config>(getConfig);
  const app = await newHttpServer();

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
