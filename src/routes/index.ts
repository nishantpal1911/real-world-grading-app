import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';

import authRoutes from 'src/routes/auth';
import courseRoutes from 'src/routes/courses';
import userRoutes from 'src/routes/users';

export const setupRoutes = (server: Hapi.Server): void => {
  server.validator(Joi);

  server.route({
    path: '/',
    method: 'GET',
    handler: (_, h: Hapi.ResponseToolkit) => {
      return h.response({ up: true }).code(200);
    },
  });

  server.route([...authRoutes, ...userRoutes, ...courseRoutes]);
};
