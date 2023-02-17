import crypto from 'crypto';

export interface UserProps extends UserInputProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInputProps {
  deletedAt?: Date | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export class UserEntity implements UserProps {
  public id: string;

  public createdAt: Date;

  public updatedAt: Date;

  public deletedAt: Date | null;

  public firstName: string;

  public lastName: string;

  public email: string;

  public phone: string;

  constructor({
    id,
    createdAt,
    updatedAt,
    deletedAt,
    firstName,
    lastName,
    email,
    phone,
  }: UserProps) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt || null;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
  }

  static create(data: UserInputProps) {
    // TODO: Puts some domain validation here

    const now = new Date();

    return new UserEntity({
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      deletedAt: data.deletedAt || null,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
    });
  }

  update(data: Partial<UserInputProps>) {
    this.updatedAt = new Date();

    Object.assign(this, data);

    return this;
  }

  softDelete() {
    this.update({
      deletedAt: new Date(),
    });
  }

  toUpdate(): Omit<UserProps, 'id'> {
    return {
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
    };
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      deletedAt: this.deletedAt ? this.deletedAt.toISOString() : null,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
    };
  }
}
