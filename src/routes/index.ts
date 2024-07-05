import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';

import { createUser, deleteUserById, getAllUsers, getUserById, updateUserById } from '../handlers/users';
import Validation from '../validators';

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
      validate: Validation.User.PARAMS_ID
    }
  });

  server.route({
    path: '/users',
    method: 'POST',
    handler: createUser,
    options: {
      validate: Validation.User.CREATE,
    }
  });

  server.route({
    path: '/users/{userId}',
    method: 'PATCH',
    handler: updateUserById,
    options: {
      validate: Validation.User.UPDATE
    }
  });

  server.route({
    path: '/users/{userId}',
    method: 'DELETE',
    handler: deleteUserById,
    options: {
      validate: Validation.User.PARAMS_ID
    }
  });
};
