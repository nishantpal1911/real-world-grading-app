import Boom from '@hapi/boom';
import Hapi from '@hapi/hapi';

import { User } from 'src/entity/User';
import { CreateUserPayload, UpdateUserPayload } from 'src/types';

export const getAllUsers = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const users = await User.find().catch((error: any) => {
    throw Boom.badImplementation(error);
  });

  return h.response(users).code(200);
};

export const getUserById = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { userId } = request.params;

  const user = await User.findOneByOrFail({ id: parseInt(userId) }).catch((error: any) => {
    throw Boom.notFound(`User with id: ${userId} does not exist`, error);
  });

  return h.response(user).code(200);
};

export const createUser = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { email, firstName, isAdmin, lastName, social } = request.payload as CreateUserPayload;

  try {
    const user = await new User({
      firstName,
      lastName,
      email,
      isAdmin,
      social,
    }).save();

    return h.response(user).code(201);
  } catch (e: any) {
    throw Boom.badRequest('Failed to create user', e);
  }
};

export const updateUserById = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const userId = parseInt(request.params.userId);
  const payload = request.payload as UpdateUserPayload;

  const user = (await User.findOneBy({ id: userId }).catch((e: any) => {
    throw Boom.notFound(`User with id: ${userId} does not exist`, e);
  })) as User;

  Object.assign(user, payload);

  await user.save();

  return h.response(user).code(200);
};

export const deleteUserById = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const userId = parseInt(request.params.userId);

  await User.delete({ id: userId }).catch((e: any) => {
    throw Boom.notFound(`User with id: ${userId} does not exist`, e);
  });

  return h.response().code(204);
};
