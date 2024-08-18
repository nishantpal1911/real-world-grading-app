import { RouteOptionsValidate } from '@hapi/hapi';
import Joi from '@hapi/joi';

namespace CourseValidation {
  export const PARAMS_ID: RouteOptionsValidate = {
    params: Joi.object({
      courseId: Joi.number().integer().required(),
    }),
  };

  const payload: Joi.ObjectSchema = Joi.object({
    name: Joi.string()
      .alphanum()
      .alter({
        create: (schema) => schema.required(),
        update: (schema) => schema.optional(),
      }),
    courseDetails: Joi.string().optional(),
  });

  export const CREATE: RouteOptionsValidate = {
    payload: payload.tailor('create'),
  };

  export const UPDATE: RouteOptionsValidate = {
    ...PARAMS_ID,
    payload: payload.tailor('update'),
  };
}

export default CourseValidation;
