import { faker } from '../../../../utils/faker';
import { UserInputProps } from '../entity';

export function newUserBuilder(overrides: Partial<UserInputProps> = {}): UserInputProps {
  const firstName = overrides.firstName || faker.name.firstName();
  const lastName = overrides.lastName || faker.name.lastName();

  const email = faker.internet.email(firstName, lastName, 'example.com');

  return {
    firstName,
    lastName,
    email,
    phone: faker.phone.number('+336########'),
    deletedAt: null,
    ...overrides,
  };
}
