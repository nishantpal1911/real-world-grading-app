import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';

import userRoutes from './users';
import authRoutes from './auth';
import courseRoutes from './courses';

export const setupRoutes = (server: Hapi.Server): void => {
  server.validator(Joi);

  server.route({
    path: '/',
    method: 'GET',
    handler: (_, h: Hapi.ResponseToolkit) => {
      return h.response({ up: true }).code(200);
    },
  });

  server.route([...authRoutes, ...userRoutes]);
};
