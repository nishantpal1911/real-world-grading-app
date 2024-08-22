import Boom from '@hapi/boom';
import Hapi from '@hapi/hapi';

import { CreateCoursePayload, UpdateCoursePayload } from '../types';
import { Course } from '../entity/Course';

export const getAllCourses = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const courses = await Course.find().catch((error: any) => {
    throw Boom.badImplementation(error);
  });

  return h.response(courses).code(200);
};

export const getCourseById = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { courseId } = request.params;

  const course = await Course.findOneByOrFail({ id: parseInt(courseId) }).catch((e: any) => {
    throw Boom.notFound(`Course with id: ${courseId} does not exist`, e);
  });

  return h.response(course).code(200);
};

export const createCourse = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { name, courseDetails } = request.payload as CreateCoursePayload;

  const course = await new Course({ name, courseDetails }).save().catch((e: any) => {
    throw Boom.conflict(`Course ${name} already exists`, e);
  });

  return h.response(course).code(201);
};

export const updateCourseById = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const {
    query: { courseId },
    payload,
  } = request;

  const course = await Course.findOneByOrFail({ id: parseInt(courseId) }).catch((e: any) => {
    throw Boom.notFound(`Course with id: ${courseId} does not exist`, e);
  });

  Object.assign(course, payload as UpdateCoursePayload);

  await course.save().catch((e: any) => {
    throw Boom.conflict(`Course ${course.name} already exists`, e);
  });

  return h.response({ courseId }).code(200);
};

export const deleteCourseById = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { courseId } = request.query;

  await Course.delete({ id: parseInt(courseId) }).catch((e: any) => {
    throw Boom.notFound(`Course with id: ${courseId} does not exist`, e);
  });

  return h.response().code(200);
};
