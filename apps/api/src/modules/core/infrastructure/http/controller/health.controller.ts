import { FastifyRequest, FastifyReply } from 'fastify';

import { HealthRepository } from '../../../domain/repository/health.repository';
import type { Dependencies } from '../../config-di';

export class HealthController {
  #healthRepo: HealthRepository;

  constructor({ healthRepository }: Dependencies) {
    this.#healthRepo = healthRepository;
  }

  execute = async (_request: FastifyRequest, reply: FastifyReply) => {
    const database = await this.#healthRepo.getDatabaseStatus();

    const res = { database: database ? 'up' : 'down' };

    const statusCode = Object.values(res).every((value) => value === 'up') ? 200 : 503;

    return reply.status(statusCode).send(res);
  };
}
