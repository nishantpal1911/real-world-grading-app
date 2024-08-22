import Hapi from '@hapi/hapi';
import { add } from 'date-fns';
import Boom from '@hapi/boom';

import { EMAIL_TOKEN_EXPIRATION_MINUTES } from '../utils/constants';
import { LoginInput, TokenType } from '../types';
import { Token } from '../entity/Token';
import { User } from '../entity/User';

/**
 * Generate a random 8 digit number as the email token
 */
function generateEmailToken(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

const loginHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { sendEmailToken } = request.server.app;
  const { firstName, lastName, email } = request.payload as LoginInput;

  const emailToken = generateEmailToken();
  const expiresAt = add(new Date(), {
    minutes: EMAIL_TOKEN_EXPIRATION_MINUTES,
  });

  const user = await User.findOneBy({ email });

  try {
    // Create a short lived token and update user or create if they don't exist
    const token = new Token({
      emailToken,
      type: TokenType.EMAIL,
      expiresAt,
      user: user || new User({ firstName, lastName, email }),
    });

    await token.save();

    sendEmailToken(email, emailToken);

    return h.response().code(200);
  } catch (error: any) {
    return Boom.badImplementation((error as Error).message);
  }
};

export default loginHandler;
