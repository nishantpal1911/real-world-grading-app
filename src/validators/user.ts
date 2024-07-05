import { RouteOptionsValidate } from "@hapi/hapi";
import Joi from "@hapi/joi";

namespace UserValidation {
  const PAYLOAD: Joi.ObjectSchema = Joi.object({
    firstName: Joi.string().alter({
      create: schema => schema.required(),
      update: schema => schema.optional(),
    }),
    lastName: Joi.string().alter({
      create: schema => schema.required(),
      update: schema => schema.optional(),
    }),
    email: Joi.string()
      .email()
      .alter({
        create: schema => schema.required(),
        update: schema => schema.optional(),
      }),
    social: Joi.object({
      facebook: Joi.string().optional(),
      twitter: Joi.string().optional(),
      github: Joi.string().optional(),
      website: Joi.string().optional(),
    }).optional(),
    courses: Joi.array().optional(),
  });

  export const CREATE: RouteOptionsValidate = {
    payload: PAYLOAD.tailor('create'),
  };

  export const PARAMS_ID: RouteOptionsValidate = {
    params: Joi.object({
      userId: Joi.number().integer().required(),
    }),
  };

  export const UPDATE: RouteOptionsValidate = {
    ...PARAMS_ID,
    payload: (PAYLOAD.tailor('update') as Joi.ObjectSchema)
      .or('firstName', 'lastName', 'email', 'courses', 'social.facebook', 'social.twitter', 'social.github', 'social.website'),
  }
};

export default UserValidation;
