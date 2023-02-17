import closeWithGrace from 'close-with-grace';
import { FastifyInstance } from 'fastify';

export function gracefullShutdown(app: FastifyInstance): ReturnType<typeof closeWithGrace> {
  const closeListenersFn: closeWithGrace.CloseWithGraceCallback = async ({ err }) => {
    if (err) {
      app.log.error(err);
    }
    await app.close();
  };

  return closeWithGrace({ delay: 500 }, closeListenersFn);
}
