import Boom from '@hapi/boom';
import Hapi from '@hapi/hapi';
import { add } from 'date-fns';
import jwt from 'jsonwebtoken';

import { Token } from 'src/entity/Token';
import { AuthenticateInput, TokenType } from 'src/types';
import { AUTHENTICATION_TOKEN_EXPIRATION_HOURS, JWT_ALGORITHM, JWT_SECRET } from 'src/utils/constants';

// Generate a signed JWT token with the tokenId in the payload
const generateAuthToken = (tokenId: number): string => {
  return jwt.sign({ tokenId }, JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
    noTimestamp: true,
  });
};

const authenticateHandler = async (request: any, h: Hapi.ResponseToolkit) => {
  const { email, emailToken } = request.payload as AuthenticateInput;

  try {
    const fetchedEmailToken = await Token.findOneBy({ emailToken });

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
    const createdToken = await new Token({ type: TokenType.API, expiresAt, user: fetchedEmailToken.user }).save();

    // Invalidate the email token after it's been used
    fetchedEmailToken.valid = false;
    fetchedEmailToken.save();

    const authToken = generateAuthToken(createdToken.id);

    return h.response().code(200).header('Authorization', authToken);
  } catch (error: any) {
    return Boom.badImplementation((error as Error).message);
  }
};

export default authenticateHandler;
