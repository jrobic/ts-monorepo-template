import { Resolver, asClass } from 'awilix';

import { UserRepository } from './domain';
import { SINGLETON_CONFIG } from './infrastructure/constant-di';
import { UserController } from './infrastructure/http/controller/user.controller';
import { UserPgRepository } from './infrastructure/repository/user-pg.repository';
import { CreateUserUseCase } from './usecase/create-user.usecase';
import { GetUserUseCase } from './usecase/get-user.usecase';
import { GetUsersUseCase } from './usecase/get-users.usecase';
import { RemoveUserUseCase } from './usecase/remove-user.usecase';

export interface CoreDependencies {
  userRepository: UserRepository;
  createUserUsecase: CreateUserUseCase;
  getUsersUsecase: GetUsersUseCase;
  getUserUsecase: GetUserUseCase;
  removeUserUsecase: RemoveUserUseCase;
  userController: UserController;
}

type CoreDiConfig = Record<keyof CoreDependencies, Resolver<unknown>>;

export const coreDependencies: CoreDiConfig = {
  userRepository: asClass<UserRepository>(UserPgRepository, SINGLETON_CONFIG),
  createUserUsecase: asClass(CreateUserUseCase, SINGLETON_CONFIG),
  getUsersUsecase: asClass(GetUsersUseCase, SINGLETON_CONFIG),
  getUserUsecase: asClass(GetUserUseCase, SINGLETON_CONFIG),
  removeUserUsecase: asClass(RemoveUserUseCase, SINGLETON_CONFIG),
  userController: asClass(UserController, SINGLETON_CONFIG),
};
