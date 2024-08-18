import Boom from '@hapi/boom';
import Hapi from '@hapi/hapi';

import { CreateCoursePayload, UpdateCoursePayload } from '../types';

export const getAllCourses = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;

  const courses = await prisma.course.findMany().catch((error) => {
    throw Boom.badImplementation(error);
  });

  return h.response(courses).code(200);
};

export const getCourseById = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const { courseId } = request.params;

  const course = await prisma.course
    .findUniqueOrThrow({
      where: { id: parseInt(courseId) },
    })
    .catch((e) => {
      throw Boom.notFound(`Course with id: ${courseId} does not exist`, e);
    });

  return h.response(course).code(200);
};

export const createCourse = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const { name, courseDetails } = request.payload as CreateCoursePayload;

  const course = await prisma.course
    .create({
      data: { name, courseDetails },
      select: { id: true },
    })
    .catch((e) => {
      throw Boom.conflict(`Course ${name} already exists`, e);
    });

  return h.response(course).code(201);
};

export const updateCourseById = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const { name, courseDetails } = request.payload as UpdateCoursePayload;
  const { courseId } = request.query;

  await prisma.course
    .findUniqueOrThrow({
      where: { id: parseInt(courseId) },
    })
    .catch((e) => {
      throw Boom.notFound(`Course with id: ${courseId} does not exist`, e);
    });

  await prisma.course
    .update({
      where: { id: parseInt(courseId) },
      data: { name, courseDetails },
    })
    .catch((e) => {
      throw Boom.conflict(`Course ${name} already exists`, e);
    });

  return h.response({ courseId }).code(200);
};

export const deleteCourseById = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const { courseId } = request.query;

  await prisma.course
    .delete({
      where: { id: parseInt(courseId) },
    })
    .catch((e) => {
      throw Boom.notFound(`Course with id: ${courseId} does not exist`, e);
    });

  return h.response().code(200);
};
