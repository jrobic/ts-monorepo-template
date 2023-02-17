import type { CoreDependencies } from '../core-di';
import { UserEntity, UserRepository } from '../domain';

export class GetUserUseCase {
  readonly #userRepository: UserRepository;

  constructor({ userRepository }: CoreDependencies) {
    this.#userRepository = userRepository;
  }

  async execute({ id }: { id: string }): Promise<UserEntity | null> {
    return this.#userRepository.findUser({ id });
  }
}
