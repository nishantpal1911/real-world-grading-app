import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';

import { createUser, getAllUsers, getUserById } from '../handlers/user';

export const setupRoutes = (server: Hapi.Server): void => {
  server.validator(Joi);

  server.route({
    path: '/',
    method: 'GET',
    handler: (_, h: Hapi.ResponseToolkit) => {
      return h.response({ up: true }).code(200);
    }
  });

  server.route({
    path: '/users',
    method: 'GET',
    handler: getAllUsers,
  });

  server.route({
    path: '/users/{userId}',
    method: 'GET',
    handler: getUserById,
    options: {
      validate: {
        params: {
          userId: Joi.string().required(),
        },
      }
    }
  });

  server.route({
    path: '/users',
    method: 'POST',
    handler: createUser,
    options: {
      validate: {
        payload: Joi.object({
          firstName: Joi.string().required(),
          lastName: Joi.string().required(),
          email: Joi.string().required(),
          social: Joi.object(),
          courses: Joi.array(),
        }),
      }
    }
  });
};
