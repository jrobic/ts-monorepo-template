import { describe, expect, it, vi } from 'vitest';

import * as testing from '../../../../../utils/testing';

describe('UserController', () => {
  describe('getAllUser', () => {
    it('should return all users', async () => {
      const users = testing.genUsersList();
      const want = users.map((user) => user.toJSON());

      const server = await testing.initServer({ mockUsers: users });

      const got = await server.inject({
        url: '/users',
        method: 'GET',
      });

      expect(got.statusCode).toBe(200);
      expect(got.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(got.json()).toEqual({
        code: 200,
        data: want,
        message: 'Success',
        timestamp: expect.any(String),
        errorCode: null,
      });
    });
  });

  describe('getUserById', () => {
    it('should return a user', async () => {
      const users = testing.genUsersList();
      const want = users[1].toJSON();

      const server = await testing.initServer({ mockUsers: users });

      const got = await server.inject({
        url: `/users/${want.id}`,
        method: 'GET',
      });

      expect(got.statusCode).toBe(200);
      expect(got.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(got.json()).toEqual({
        code: 200,
        data: want,
        message: 'Success',
        timestamp: expect.any(String),
        errorCode: null,
      });
    });

    it('should return a 404 error if user not found', async () => {
      const users = testing.genUsersList();

      const server = await testing.initServer({ mockUsers: users });

      const got = await server.inject({
        url: '/users/invalid-id',
        method: 'GET',
      });

      expect(got.statusCode).toBe(404);
      expect(got.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(got.json()).toEqual({
        code: 404,
        data: null,
        message: 'User with id: "invalid-id" not found',
        timestamp: expect.any(String),
        errorCode: null,
      });
    });
  });

  describe('createUser', () => {
    it('should return a new user', async () => {
      vi.setSystemTime(new Date('2022-12-07T00:00:00.000Z'));

      const users = testing.genUsersList();

      const server = await testing.initServer({ mockUsers: users });

      const payload = {
        firstName: 'Robert',
        lastName: 'Doe',
        email: 'robert@doe.com',
        phone: '+33601010103',
      };

      const insertedUser = await server.inject({
        url: '/users',
        method: 'POST',
        payload,
      });

      const insertedUserJson = insertedUser.json();

      const userId = insertedUserJson.data.id;

      const want = {
        code: 200,
        data: {
          ...payload,
          id: userId,
          deletedAt: null,
          createdAt: '2022-12-07T00:00:00.000Z',
          updatedAt: '2022-12-07T00:00:00.000Z',
        },
        message: 'Success',
        timestamp: expect.any(String),
        errorCode: null,
      };

      const got = await server.inject({
        url: `/users/${userId}`,
        method: 'GET',
      });
      const gotJson = got.json();

      expect(insertedUser.statusCode).toBe(201);
      expect(insertedUserJson).toEqual({
        ...want,
        code: 201,
      });

      expect(gotJson).toEqual({
        ...want,
      });
    });
  });

  describe('removeUser', () => {
    it('should remove a user', async () => {
      const users = testing.genUsersList();
      const user = users[0];

      const server = await testing.initServer({ mockUsers: users });

      vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'));

      const removeUser = await server.inject({
        url: `/users/${user.id}`,
        method: 'DELETE',
      });

      expect(removeUser.statusCode).toBe(204);
      expect(removeUser.json()).toEqual({
        code: 204,
        data: null,
        message: 'Success',
        timestamp: expect.any(String),
        errorCode: null,
      });

      const got = await server.inject({
        url: `/users/${user.id}`,
        method: 'GET',
      });

      expect(got.statusCode).toBe(200);
      expect(got.json()).toEqual({
        code: 200,
        data: {
          ...user.toJSON(),
          updatedAt: '2023-01-01T00:00:00.000Z',
          deletedAt: '2023-01-01T00:00:00.000Z',
        },
        message: `Success`,
        timestamp: expect.any(String),
        errorCode: null,
      });
    });

    it('should return an error when user is not exist', async () => {
      const users = testing.genUsersList();

      const server = await testing.initServer({ mockUsers: users });

      const removeUser = await server.inject({
        url: `/users/invalid-id`,
        method: 'DELETE',
      });

      expect(removeUser.statusCode).toBe(404);
      expect(removeUser.json()).toEqual({
        code: 404,
        data: null,
        message: "Its not possible to remove User with id 'invalid-id' because it does not exist",
        timestamp: expect.any(String),
        errorCode: 'ENTITY_NOT_FOUND',
      });
    });
  });
});
