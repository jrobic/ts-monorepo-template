/* eslint-disable @typescript-eslint/no-use-before-define, import/no-extraneous-dependencies */
import { randomUUID } from 'crypto';

import { Lifetime, asClass } from 'awilix';
import { expect } from 'vitest';

import { UserEntity, UserRepository } from '../modules/core';
import { newUserBuilder } from '../modules/core/domain/builder';
import { newHttpServer } from '../modules/core/infrastructure/http/server';
import { UserInMemoryRepository } from '../modules/core/infrastructure/repository/user-inmemory.repository';

import { faker } from './faker';
import { Jsonify } from './type-utils';

// --------------- SERVER ---------------
interface ServerOptions {
  mockUsers?: UserEntity[];
}
export async function initServer(options: ServerOptions = {}) {
  const server = await newHttpServer(
    {
      app: {
        appEnv: 'development',
        appVersion: '0.0.0',
        bindAddress: '0.0.0.0',
        port: 3000,
        logLevel: 'info',
        gitCommitSha: '',
        nodeEnv: 'test',
      },
      database: {
        connectionUrl: 'postgresql://localhost:5432',
        logQuery: false,
      },
    },
    {
      userRepository: asClass<UserRepository>(UserInMemoryRepository, {
        lifetime: Lifetime.SCOPED,
      }).inject(() => ({ mockUsers: options.mockUsers })),
    },
  );

  return server;
}

// --------------- CONTACT ---------------
export function genUsersList(num = 2) {
  return range(num).map(() => {
    const contact = newUserBuilder();
    const createdAt = faker.date.past();
    return new UserEntity({
      id: randomUUID(),
      createdAt,
      updatedAt: createdAt,
      ...contact,
    });
  });
}

export function assertUserEqual<T>(got: T, want: T) {
  // console.log({ got: testing.jsonify(got), want: testing.jsonify(want) });
  expect(jsonify(got)).toEqual(jsonify(want));
}

// --------------- HELPERS ---------------
export function jsonify<T>(obj: unknown): Jsonify<T> {
  return JSON.parse(JSON.stringify(obj));
}

function range(n: number) {
  return [...Array(n).keys()];
}
