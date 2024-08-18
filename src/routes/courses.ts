import Hapi from '@hapi/hapi';

import { createCourse, deleteCourseById, getAllCourses, getCourseById, updateCourseById } from '../handlers/courses';
import Validation from '../validators';

const courseRoutes: Hapi.ServerRoute[] = [
  {
    path: '/courses',
    method: 'GET',
    handler: getAllCourses,
  },
  {
    path: '/courses/{courseId}',
    method: 'GET',
    handler: getCourseById,
    options: {
      validate: Validation.Courses.PARAMS_ID,
    },
  },
  {
    path: '/courses',
    method: 'POST',
    handler: createCourse,
    options: {
      validate: Validation.Courses.CREATE,
    },
  },
  {
    path: '/courses/{courseId}',
    method: 'PATCH',
    handler: updateCourseById,
    options: {
      validate: Validation.Courses.UPDATE,
    },
  },
  {
    path: '/courses/{courseId}',
    method: 'DELETE',
    handler: deleteCourseById,
    options: {
      validate: Validation.Courses.PARAMS_ID,
    },
  },
];

export default courseRoutes;
