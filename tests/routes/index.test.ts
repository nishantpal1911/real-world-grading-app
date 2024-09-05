import Hapi from '@hapi/hapi';

import { createServer, stopServer } from 'src/server';

describe('it starts the server correctly', () => {
  let server: Hapi.Server;

  beforeAll(async () => {
    server = await createServer();
  });

  afterAll(async () => {
    await stopServer();
  });

  test('/ endpoint returns 200', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/',
    });
    expect(response.statusCode).toBe(200);
    const responsePayload = JSON.parse(response.payload);
    expect(responsePayload.up).toBe(true);
  });
});
