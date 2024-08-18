import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { add } from 'date-fns';
import { TokenType } from '@prisma/client';
import jwt from 'jsonwebtoken';

import { AuthenticateInput } from '../types';
import { AUTHENTICATION_TOKEN_EXPIRATION_HOURS, JWT_ALGORITHM, JWT_SECRET } from '../utils/constants';

// Generate a signed JWT token with the tokenId in the payload
const generateAuthToken = (tokenId: number): string => {
  return jwt.sign({ tokenId }, JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
    noTimestamp: true,
  });
};

const authenticateHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const { email, emailToken } = request.payload as AuthenticateInput;

  try {
    const fetchedEmailToken = await prisma.token.findUnique({
      where: {
        emailToken: emailToken,
      },
      include: {
        user: true,
      },
    });

    if (!fetchedEmailToken?.valid || fetchedEmailToken?.user?.email !== email) {
      // If the token doesn't exist or is not valid or does not match the user email
      // passed in the payload, return 401 unauthorized
      return Boom.unauthorized();
    }

    if (fetchedEmailToken.expiresAt < new Date()) {
      // If the token has expired, return 401 unauthorized
      return Boom.unauthorized('Token expired');
    }

    const expiresAt = add(new Date(), {
      hours: AUTHENTICATION_TOKEN_EXPIRATION_HOURS,
    });
    // Persist token in DB so it's stateful
    const createdToken = await prisma.token.create({
      data: {
        type: TokenType.API,
        expiresAt,
        user: {
          connect: { email },
        },
      },
    });

    // Invalidate the email token after it's been used
    await prisma.token.update({
      where: {
        id: fetchedEmailToken.id,
      },
      data: {
        valid: false,
      },
    });

    const authToken = generateAuthToken(createdToken.id);

    return h.response().code(200).header('Authorization', authToken);
  } catch (error) {
    return Boom.badImplementation((error as Error).message);
  }
};

export default authenticateHandler;
