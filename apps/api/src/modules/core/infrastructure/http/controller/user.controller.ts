import { format } from 'util';

import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import type { CoreDependencies } from '../../../core-di';
import type { CreateUserUseCase } from '../../../usecase/create-user.usecase';
import type { GetUserUseCase } from '../../../usecase/get-user.usecase';
import type { GetUsersUseCase } from '../../../usecase/get-users.usecase';
import type { RemoveUserUseCase } from '../../../usecase/remove-user.usecase';
import { ApiResponse } from '../dto';

const kUserNotFound = 'User with id: "%s" not found';

export const kGetUserByIdSchema = z.object({
  id: z.string(),
});

export const kCreateUserSchema = z.object({
  lastName: z.string(),
  firstName: z.string(),
  phone: z.string(),
  email: z.string().email(),
});

export const kUserSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
  lastName: z.string(),
  firstName: z.string(),
  phone: z.string(),
  email: z.string().email(),
});

export class UserController {
  #usecases: {
    getAllUsers: GetUsersUseCase;
    getUser: GetUserUseCase;
    createUser: CreateUserUseCase;
    removeUser: RemoveUserUseCase;
  };

  constructor(deps: CoreDependencies) {
    this.#usecases = {
      getAllUsers: deps.getUsersUsecase,
      getUser: deps.getUserUsecase,
      createUser: deps.createUserUsecase,
      removeUser: deps.removeUserUsecase,
    };
  }

  getAllUsers = async (_: FastifyRequest, reply: FastifyReply) => {
    const users = await this.#usecases.getAllUsers.execute();

    const res = ApiResponse.success(
      200,
      users.map((user) => user.toJSON()),
    );
    reply.send(res);
  };

  getUserById = async (
    request: FastifyRequest<{ Params: z.infer<typeof kGetUserByIdSchema> }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;

    const user = await this.#usecases.getUser.execute({ id });

    if (!user) {
      return reply.status(404).send(ApiResponse.error(404, null, format(kUserNotFound, id)));
    }

    const res = ApiResponse.success(200, user.toJSON());
    return reply.send(res);
  };

  createUser = async (
    request: FastifyRequest<{ Body: z.infer<typeof kCreateUserSchema> }>,
    reply: FastifyReply,
  ) => {
    const { lastName, firstName, phone, email } = request.body;

    const user = await this.#usecases.createUser.execute({
      lastName,
      firstName,
      phone,
      email,
    });

    const res = ApiResponse.success(201, user.toJSON());

    return reply.status(201).send(res);
  };

  removeUser = async (
    request: FastifyRequest<{ Params: z.infer<typeof kGetUserByIdSchema> }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;

    await this.#usecases.removeUser.execute(id);

    const res = ApiResponse.success(204, null);
    return reply.status(204).send(res);
  };
}
