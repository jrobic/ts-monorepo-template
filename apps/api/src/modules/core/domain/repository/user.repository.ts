import { UserEntity } from '../entity';

export interface UserRepository {
  createUser(input: UserEntity): Promise<UserEntity>;

  findAllUsers(): Promise<UserEntity[]>;

  findUser({ id }: { id: string }): Promise<UserEntity | null>;

  updateUser(id: string, input: Partial<UserEntity>): Promise<UserEntity | null>;
}
