import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';

import authenticateHandler from 'src/handlers/auth';
import loginHandler from 'src/handlers/login';

// Endpoint to login or register and to send the short-lived token
const loginRoute: Hapi.ServerRoute = {
  method: 'POST',
  path: '/login',
  handler: loginHandler,
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
      }),
    },
  },
};

const authRoute: Hapi.ServerRoute = {
  method: 'POST',
  path: '/authenticate',
  handler: authenticateHandler,
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required(),
        emailToken: Joi.string().required(),
      }),
    },
  },
};

export default [authRoute, loginRoute];
