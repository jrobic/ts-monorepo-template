import { UserProps, UserEntity } from '../..';
import { UserRepository } from '../../domain';

export class UserInMemoryRepository implements UserRepository {
  #users: UserProps[] = [];

  constructor({ mockUsers }: { mockUsers: UserProps[] }) {
    this.#users = mockUsers || [];
  }

  static #toUserEntity(user: UserProps): UserEntity {
    return new UserEntity(user);
  }

  async createUser(input: UserEntity): Promise<UserEntity> {
    this.#users.push(input);

    return Promise.resolve(input);
  }

  async findAllUsers(): Promise<UserEntity[]> {
    return Promise.resolve(this.#users.map(UserInMemoryRepository.#toUserEntity));
  }

  async findUser({ id }: { id: string }): Promise<UserEntity | null> {
    const user = this.#users.find((con) => con.id === id) || null;

    if (!user) {
      return null;
    }

    return Promise.resolve(UserInMemoryRepository.#toUserEntity(user));
  }

  async updateUser(id: string, input: Partial<UserProps>): Promise<UserEntity | null> {
    const user = this.#users.find((con) => con.id === id);

    if (!user) {
      return Promise.resolve(null);
    }

    Object.assign(user, input);

    return Promise.resolve(UserInMemoryRepository.#toUserEntity(user));
  }
}
