import Hapi from '@hapi/hapi';
import hapiAuthJwt2 from 'hapi-auth-jwt2';

import { AppDataSource } from 'src/data-source';
import authPlugin from 'src/plugins/auth';
import emailPlugin from 'src/plugins/email';
import { setupRoutes } from 'src/routes';

const server: Hapi.Server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
});

export const createServer = async (): Promise<Hapi.Server> => {
  await AppDataSource.initialize().then(() => {
    console.log('DataSource initialized');
  });

  await server.register([emailPlugin, hapiAuthJwt2, authPlugin]);
  setupRoutes(server);
  await server.initialize();

  return server;
};

export const startServer = async (server: Hapi.Server): Promise<Hapi.Server> => {
  await server.start();
  console.log(`Server running on ${server.info.uri}`);

  return server;
};

export const stopServer = async () => {
  await server.stop();
  await AppDataSource.destroy();
};

process.on('unhandledRejection', async (err) => {
  console.log(err);
  process.exit(1);
});
