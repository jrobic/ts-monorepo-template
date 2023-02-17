import { z } from 'zod';

import type { CoreDependencies } from '../../../core-di';
import { kCreateUserSchema, kGetUserByIdSchema, kUserSchema } from '../controller/user.controller';
import { makeApiResponsePresenter } from '../dto';
import type { Routes } from '../routes';

export const getCoreRoutes = (deps: CoreDependencies): Routes => {
  return [
    {
      method: 'GET',
      url: '/hello',
      schema: {
        tags: ['hello'],
        summary: 'Get the documentation',
        description: 'Get the documentation',
        response: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
      handler: async (_, reply) => {
        reply.send({
          message: 'Hello World!',
        });
      },
    },
    {
      method: 'GET',
      url: '/users',
      schema: {
        tags: ['users'],
        summary: 'Get all users',
        description: 'Get all users',
        response: {
          200: makeApiResponsePresenter(kUserSchema.array()),
        },
        operationId: 'getAllUsers',
      },
      handler: deps.userController.getAllUsers,
    },
    {
      method: 'GET',
      url: '/users/:id',
      schema: {
        tags: ['users'],
        summary: 'Get a user by id',
        description: 'Get a user by id',
        params: kGetUserByIdSchema,
        response: {
          200: makeApiResponsePresenter(kUserSchema),
          404: makeApiResponsePresenter(),
        },
        operationId: 'getUserById',
      },
      handler: deps.userController.getUserById,
    },
    {
      method: 'POST',
      url: '/users',
      schema: {
        tags: ['users'],
        summary: 'Create a user',
        description: 'Create a user',
        body: kCreateUserSchema,
        response: {
          201: makeApiResponsePresenter(kUserSchema),
        },
        operationId: 'createUser',
      },
      handler: deps.userController.createUser,
    },
    {
      method: 'DELETE',
      url: '/users/:id',
      schema: {
        tags: ['users'],
        summary: 'Delete a user by id',
        description: 'Delete a user by id',
        params: kGetUserByIdSchema,
        response: {
          204: makeApiResponsePresenter(),
          404: makeApiResponsePresenter(),
        },
        operationId: 'deleteUserById',
      },
      handler: deps.userController.removeUser,
    },
  ];
};
