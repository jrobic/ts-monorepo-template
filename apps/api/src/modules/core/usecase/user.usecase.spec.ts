import crypto from 'crypto';

import { describe, it, expect, vi } from 'vitest';

import * as testing from '../../../utils/testing';
import { UserEntity } from '../domain';
import { UserInMemoryRepository } from '../infrastructure/repository/user-inmemory.repository';

import { CreateUserUseCase } from './create-user.usecase';
import { GetUserUseCase } from './get-user.usecase';
import { GetUsersUseCase } from './get-users.usecase';
import { RemoveUserUseCase } from './remove-user.usecase';

describe('UserUseCases', () => {
  describe('GetUserUseCase', () => {
    it('should return a User', async () => {
      const want = testing.genUsersList();

      const userRepository = new UserInMemoryRepository({
        mockUsers: want,
      });

      const getUserUsecase = new GetUserUseCase({
        userRepository,
      } as any); // improve interface of dependencies

      const got = await getUserUsecase.execute({ id: want[0].id });

      testing.assertUserEqual(got, want[0]);
    });
  });

  describe('GetUsersUseCase', () => {
    it('should return all Users', async () => {
      const want = testing.genUsersList();

      const userRepository = new UserInMemoryRepository({
        mockUsers: want,
      });

      const getAllUserUsecase = new GetUsersUseCase({
        userRepository,
      } as any);

      const got = await getAllUserUsecase.execute();

      testing.assertUserEqual(got, want);
    });
  });

  describe('RemoveUserUseCase', () => {
    it('should remove a User', async () => {
      vi.useFakeTimers({ now: new Date('2022-12-07T00:00:00.000Z') });

      const Users = testing.genUsersList();

      const userRepository = new UserInMemoryRepository({
        mockUsers: Users,
      });

      const getUserUsecase = new GetUserUseCase({
        userRepository,
      } as any);

      const removeUserUsecase = new RemoveUserUseCase({
        userRepository,
      } as any);

      const want = Users[1];
      want.deletedAt = new Date('2022-12-07T00:00:00.000Z');

      const removeUser = await removeUserUsecase.execute(want.id);
      testing.assertUserEqual(removeUser, want);

      const got = await getUserUsecase.execute({ id: want.id });

      testing.assertUserEqual(got, want);
    });

    it('should return an error when User is not exist', async () => {
      const Users = testing.genUsersList();

      const userRepository = new UserInMemoryRepository({
        mockUsers: Users,
      });
      const removeUserUsecase = new RemoveUserUseCase({
        userRepository,
      } as any);

      expect(removeUserUsecase.execute('123')).rejects.toThrowError(
        `Its not possible to remove User with id '123' because it does not exist`,
      );
    });
  });

  describe('CreateUserUseCase', () => {
    it('should create a User', async () => {
      vi.useFakeTimers({ now: new Date('2022-12-01T00:00:00.000Z') });
      vi.spyOn(crypto, 'randomUUID').mockReturnValue('1234567890');

      const userRepository = new UserInMemoryRepository({
        mockUsers: [],
      });
      const createUserUsecase = new CreateUserUseCase({
        userRepository,
      } as any);
      const getUserUsecase = new GetUserUseCase({
        userRepository,
      } as any);

      const want = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
        phone: '+33601010101',
      };

      const insertedUser = await createUserUsecase.execute(want);

      const got = await getUserUsecase.execute({
        id: insertedUser.id,
      });

      testing.assertUserEqual(
        got,
        want
          ? new UserEntity({
              ...want,
              createdAt: new Date('2022-12-01T00:00:00.000Z'),
              updatedAt: new Date('2022-12-01T00:00:00.000Z'),
              deletedAt: null,
              id: '1234567890',
            })
          : null,
      );
    });
  });
});
