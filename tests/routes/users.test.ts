import { createServer } from '../../src/server';
import Hapi from '@hapi/hapi';

describe('/users path tests', () => {
  let server: Hapi.Server;
  let testUserId: number;
  let email: string;

  beforeAll(async () => {
    server = await createServer();
  });

  afterAll(async () => {
    await server.stop();
  });

  test('POST /users with correct payload returns status 201', async () => {
    email = `test-${Date.now()}@domain.com`;
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        firstName: 'test-first-name',
        lastName: 'test-last-name',
        email,
        social: {
          twitter: 'thisisalice',
          website: 'https://www.thisisalice.com',
        },
      },
    });
    expect(response.statusCode).toEqual(201);
    const { id } = JSON.parse(response.payload);
    expect(id).toBeTruthy();
    testUserId = id;
  });

  test('POST /users validation works correctly', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        lastName: 'test-last-name',
        email: `test-${Date.now()}@domain.com`,
        social: {
          twitter: 'thisisalice',
          website: 'https://www.thisisalice.com',
        },
      },
    });

    expect(response.statusCode).toEqual(400);
  });

  test('POST /users only allows unique users to be created', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        firstName: 'test-first-name',
        lastName: 'test-last-name',
        email,
        social: {
          twitter: 'thisisalice',
          website: 'https://www.thisisalice.com',
        },
      },
    });

    expect(response.statusCode).toEqual(400);
  });

  test('GET /users/{id} returns user object for existing user', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/users/${testUserId}`,
    });

    expect(response.statusCode).toEqual(200);
    const user = JSON.parse(response.payload);
    expect(user.id).toBe(testUserId);
  });

  test('PATCH /users/{id} updates existing user info correctly', async () => {
    const updatedFirstName = 'updated-first-name';
    const updatedLastName = 'updated-last-name';
    const response = await server.inject({
      method: 'PATCH',
      url: `/users/${testUserId}`,
      payload: {
        firstName: updatedFirstName,
        lastName: updatedLastName,
      },
    });

    expect(response.statusCode).toEqual(200);
    const user = JSON.parse(response.payload);
    expect(user.id).toBe(testUserId);
    expect(user.firstName).toBe(updatedFirstName);
    expect(user.lastName).toBe(updatedLastName);
  });

  test('PATCH /users/{id} payload validation works correctly', async () => {
    const response = await server.inject({
      method: 'PATCH',
      url: `/users/${testUserId}`,
      payload: {},
    });

    expect(response.statusCode).toEqual(400);
  });

  test('DELETE /users/{id} returns 204 after deleting user', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/users/${testUserId}`,
    });

    expect(response.statusCode).toEqual(204);
  });

  test('GET /users/{id} returns 404 for non existent user', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/users/${testUserId}`,
    });

    expect(response.statusCode).toEqual(404);
  });

  test('DELETE /users/{id} returns 404 for non existent user', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/users/${testUserId}`,
    });

    expect(response.statusCode).toEqual(404);
  });

  test('PATCH /users/{id} returns 404 for non existent user', async () => {
    const updatedFirstName = 'updated-first-name';
    const updatedLastName = 'updated-last-name';
    const response = await server.inject({
      method: 'PATCH',
      url: `/users/${testUserId}`,
      payload: {
        firstName: updatedFirstName,
        lastName: updatedLastName,
      },
    });

    expect(response.statusCode).toEqual(404);
  });
});
