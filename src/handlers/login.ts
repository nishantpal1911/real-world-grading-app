import Hapi from '@hapi/hapi';
import { add } from 'date-fns';
import { TokenType } from '@prisma/client';
import Boom from '@hapi/boom';

import { EMAIL_TOKEN_EXPIRATION_MINUTES } from '../utils/constants';
import { LoginInput } from '../types';

/**
 * Generate a random 8 digit number as the email token
 */
function generateEmailToken(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

const loginHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma, sendEmailToken } = request.server.app;
  const { firstName, lastName, email } = request.payload as LoginInput;

  const emailToken = generateEmailToken();
  const tokenExpiration = add(new Date(), {
    minutes: EMAIL_TOKEN_EXPIRATION_MINUTES,
  });

  try {
    // Create a short lived token and update user or create if they don't exist
    await prisma.token.create({
      data: {
        emailToken,
        type: TokenType.EMAIL,
        expiresAt: tokenExpiration,
        user: {
          connectOrCreate: {
            create: {
              firstName,
              lastName,
              email,
            },
            where: { email },
          },
        },
      },
    });

    sendEmailToken(email, emailToken);

    return h.response().code(200);
  } catch (error) {
    return Boom.badImplementation((error as Error).message);
  }
};

export default loginHandler;
