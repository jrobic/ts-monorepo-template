import { PrismaClient, Prisma } from '@prisma/client';

import { UserEntity, UserProps, UserRepository } from '../../domain';
import type { Dependencies } from '../config-di';

export class UserPgRepository implements UserRepository {
  #db: PrismaClient;

  constructor({ prisma }: Dependencies) {
    this.#db = prisma;
  }

  private static toUserEntity(user: UserProps): UserEntity {
    return new UserEntity(user);
  }

  async createUser(input: UserEntity): Promise<UserEntity> {
    const user = await this.#db.user.create({ data: input });

    return UserPgRepository.toUserEntity(user);
  }

  async findAllUsers(): Promise<UserEntity[]> {
    const users = await this.#db.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return users.map(UserPgRepository.toUserEntity);
  }

  async findUser({ id }: { id: string }): Promise<UserEntity | null> {
    const user = await this.#db.user.findUnique({ where: { id } });

    if (!user) {
      return null;
    }

    return UserPgRepository.toUserEntity(user);
  }

  async updateUser(id: string, input: Partial<UserProps>): Promise<UserEntity | null> {
    try {
      const userUpdated = await this.#db.user.update({
        where: { id },
        data: input,
      });

      return UserPgRepository.toUserEntity(userUpdated);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          return null;
        }
      }
      throw error;
    }
  }
}
