import { PrismaClient } from '@prisma/client'
import Hapi from '@hapi/hapi';

import { setupRoutes } from './routes';

export const prisma = new PrismaClient();

const server: Hapi.Server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
})

export const createServer = async (): Promise<Hapi.Server> => {
  setupRoutes(server);
  await server.initialize();

  return server;;
};

export const startServer = async (server: Hapi.Server): Promise<Hapi.Server> => {
  await server.start();
  console.log(`Server running on ${server.info.uri}`);

  return server;
};

process.on('unhandledRejection', async (err) => {
  console.log(err);
  await prisma.$disconnect();
  process.exit(1);
});
