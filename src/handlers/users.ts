import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';

import { CreateUserPayload, UpdateUserPayload } from '../types';

export const getAllUsers = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;

  const users = await prisma.user.findMany().catch((error) => {
    throw Boom.badImplementation(error);
  });

  return h.response(users).code(200);
};

export const getUserById = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { userId } = request.params;

  const user = await request.server.app.prisma.user
    .findUniqueOrThrow({
      where: { id: parseInt(userId) },
    })
    .catch((error) => {
      throw Boom.notFound(`User with id: ${userId} does not exist`, error);
    });

  return h.response(user).code(200);
};

export const createUser = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { firstName, lastName, email, isAdmin, social } = request.payload as CreateUserPayload;

  try {
    const user = await request.server.app.prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        isAdmin,
        social: JSON.stringify(social || {}),
        // ...(courses && {
        //   courses: courses.map(({ role, courseId }) => ({
        //     create: {
        //       role,
        //       course: {
        //         connect: { id: courseId },
        //       },
        //     },
        //   })),
        // }),
      },
      select: { id: true },
    });

    return h.response(user).code(201);
  } catch (e) {
    throw Boom.badRequest('Failed to create user', e);
  }
};

export const updateUserById = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const userId = parseInt(request.params.userId);
  const payload = request.payload as UpdateUserPayload;
  const { prisma } = request.server.app;

  const user = await prisma.user
    .update({
      where: { id: userId },
      data: payload,
    })
    .catch((e) => {
      throw Boom.notFound(`User with id: ${userId} does not exist`, e);
    });

  return h.response(user).code(200);
};

export const deleteUserById = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const userId = parseInt(request.params.userId);
  const { prisma } = request.server.app;

  await prisma.user
    .delete({
      where: { id: userId },
    })
    .catch((e) => {
      throw Boom.notFound(`User with id: ${userId} does not exist`, e);
    });

  return h.response().code(204);
};
