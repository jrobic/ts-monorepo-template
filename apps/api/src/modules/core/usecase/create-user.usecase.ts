import type { CoreDependencies } from '../core-di';
import { UserRepository, UserInputProps, UserEntity } from '../domain';

export class CreateUserUseCase {
  #userRepository: UserRepository;

  constructor({ userRepository }: CoreDependencies) {
    this.#userRepository = userRepository;
  }

  async execute(input: UserInputProps): Promise<UserEntity> {
    const user = UserEntity.create(input);

    return this.#userRepository.createUser(user);
  }
}
