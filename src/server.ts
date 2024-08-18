import Hapi from '@hapi/hapi';
import hapiAuthJwt2 from 'hapi-auth-jwt2';

import prismaPlugin from './plugins/prisma';
import { setupRoutes } from './routes';
import emailPlugin from './plugins/email';
import authPlugin from './plugins/auth';

const server: Hapi.Server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
});

export const createServer = async (): Promise<Hapi.Server> => {
  await server.register([prismaPlugin, emailPlugin, hapiAuthJwt2, authPlugin]);
  setupRoutes(server);
  await server.initialize();

  return server;
};

export const startServer = async (server: Hapi.Server): Promise<Hapi.Server> => {
  await server.start();
  console.log(`Server running on ${server.info.uri}`);

  return server;
};

process.on('unhandledRejection', async (err) => {
  console.log(err);
  await server.app.prisma.$disconnect();
  process.exit(1);
});
