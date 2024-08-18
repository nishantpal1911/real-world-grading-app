import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';
import { UserRole } from '@prisma/client';

import { API_AUTH_STATEGY, JWT_ALGORITHM, JWT_SECRET } from '../utils/constants';
import { APITokenPayload } from '../types';

const authPlugin = {
  name: 'app/auth',
  dependencies: ['prisma', 'hapi-auth-jwt2'],
  register: async function (server: Hapi.Server) {
    // Define the authentication strategy which uses the `jwt` authentication scheme
    server.auth.strategy(API_AUTH_STATEGY, 'jwt', {
      key: JWT_SECRET,
      verifyOptions: { algorithms: [JWT_ALGORITHM] },
      validate: validateAPIToken,
    });

    // Set the default authentication strategy for API routes, unless explicitly disabled
    server.auth.default(API_AUTH_STATEGY);
  },
};

const apiTokenSchema = Joi.object({
  tokenId: Joi.number().integer().required(),
});

// Function will be called on every request using the auth strategy
const validateAPIToken = async (decoded: APITokenPayload, request: Hapi.Request) => {
  const { prisma } = request.server.app;
  const { tokenId } = decoded;
  // Validate the token payload adheres to the schema
  const { error } = apiTokenSchema.validate(decoded);

  if (error) {
    request.log(['error', 'auth'], `API token error: ${error.message}`);

    return { isValid: false };
  }

  try {
    // Fetch the token from DB to verify it's valid
    const fetchedToken = await prisma.token.findUnique({
      where: {
        id: tokenId,
      },
      include: {
        user: true,
      },
    });

    // Check if token could be found in database and is valid
    if (!fetchedToken?.valid) {
      return { isValid: false, errorMessage: 'Invalid Token' };
    }

    // Check token expiration
    if (fetchedToken.expiresAt < new Date()) {
      return { isValid: false, errorMessage: 'Token expired' };
    }

    // Get all the courses that the user is the teacher of
    const teacherOf = await prisma.courseEnrollment.findMany({
      where: {
        userId: fetchedToken.userId,
        role: UserRole.TEACHER,
      },
      select: {
        courseId: true,
      },
    });

    // The token is valid. Make the `userId`, `isAdmin`, and `teacherOf` to `credentials` which is available in route handlers via `request.auth.credentials`
    return {
      isValid: true,
      credentials: {
        tokenId: decoded.tokenId,
        userId: fetchedToken.userId,
        isAdmin: fetchedToken.user.isAdmin,
        // convert teacherOf from an array of objects to an array of numbers
        teacherOf: teacherOf.map(({ courseId }) => courseId),
      },
    };
  } catch (error) {
    request.log(['error', 'auth', 'db'], error as Error);

    return { isValid: false };
  }
};

export default authPlugin;
