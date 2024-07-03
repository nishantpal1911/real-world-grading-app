import { createServer } from '../../src/server';
import Hapi from '@hapi/hapi';

describe('it starts the server correctly', () => {
  let server: Hapi.Server;

  beforeAll(async () => {
    server = await createServer();
  });

  afterAll(async () => {
    await server.stop();
  });

  test('/ endpoint returns 200', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/',
    });
    expect(response.statusCode).toEqual(200);
    const responsePayload = JSON.parse(response.payload);
    expect(responsePayload.up).toEqual(true);
  });
});
