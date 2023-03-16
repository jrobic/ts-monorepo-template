import type { CoreDependencies } from '../core-di';
import { UserRepository, UserEntity, EntityNotFoundError } from '../domain';

function removeUserNotFound(id: string) {
  return `Its not possible to remove User with id '${id}' because it does not exist`;
}

export class RemoveUserUseCase {
  #userRepository: UserRepository;

  constructor({ userRepository }: CoreDependencies) {
    this.#userRepository = userRepository;
  }

  async execute(id: string): Promise<UserEntity> {
    const user = await this.#userRepository.findUser({ id });

    if (!user) {
      throw new EntityNotFoundError({
        message: removeUserNotFound(id),
      });
    }

    user.softDelete();

    const userUpdated = await this.#userRepository.updateUser(id, user.toUpdate());

    if (!userUpdated) {
      throw new EntityNotFoundError({
        message: removeUserNotFound(id),
      });
    }

    return userUpdated;
  }
}
