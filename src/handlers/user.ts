import Hapi from '@hapi/hapi';
import Boom from "@hapi/boom";

import { prisma } from "../server";
import { CreateUserPayload } from "../types";

export const getAllUsers = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  return prisma.user.findMany();
};

export const getUserById = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { userId } = request.params;

  return prisma.user.findFirstOrThrow({
    where: { id: userId },
  }).catch(() => {
    throw Boom.notFound(`User with id: ${userId} not found`);
  });
};

export const createUser = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { firstName, lastName, email, social, courses } = request.payload as CreateUserPayload;

  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        ...(social && { social }),
        ...(courses && {
          courses: courses.map(({ role, courseId }) => ({
            create: {
              role,
              course: {
                connect: { id: courseId },
              },
            },
          })),
        }),
      }
    });

    return user.id;
  } catch (e) {
    throw Boom.badRequest(e as Error);
  }
};
