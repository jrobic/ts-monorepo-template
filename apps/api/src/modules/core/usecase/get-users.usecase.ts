import type { CoreDependencies } from '../core-di';
import { UserRepository, UserEntity } from '../domain';

export class GetUsersUseCase {
  #userRepository: UserRepository;

  constructor({ userRepository }: CoreDependencies) {
    this.#userRepository = userRepository;
  }

  async execute(): Promise<UserEntity[]> {
    return this.#userRepository.findAllUsers();
  }
}
