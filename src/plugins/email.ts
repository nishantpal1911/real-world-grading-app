import Hapi from '@hapi/hapi';
import nodemailer, { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

// Module augmentation to add shared application state
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33809#issuecomment-472103564
declare module '@hapi/hapi' {
  interface ServerApplicationState {
    sendEmailToken(email: string, token: string): Promise<SMTPTransport.SentMessageInfo | void>;
  }
}

let transporter: Transporter<SMTPTransport.SentMessageInfo>;

const getTransporter = () => {
  transporter =
    transporter ||
    nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

  return transporter;
};

const mailOptions: Mail.Options = {
  from: {
    name: 'Nodemailer',
    address: process.env.NODEMAILER_USER || '',
  },
  to: 'receiver@nodemailer.com', // list of receivers
  subject: 'Default Subject', // Subject line
  text: 'Default Text', // plain text body
  html: '<b>Default html</b>', // html body
};

const emailPlugin = {
  name: 'app/email',
  register: async function (server: Hapi.Server) {
    if (!process.env.NODEMAILER_USER || !process.env.NODEMAILER_PASS) {
      console.log(
        "The NODEMAILER_USER and NODEMAILER_PASS env var must be set, otherwise the API won't be able to send emails.",
        'Using debug mode which logs the email content instead.'
      );
      server.app.sendEmailToken = debugSendEmailToken;
    } else {
      server.app.sendEmailToken = sendEmailToken;
    }
  },
};

const sendEmailToken = async (email: string, token: string) => {
  const message: Mail.Options = {
    ...mailOptions,
    to: email,
    // subject: 'Confirm your email address',
    // text: 'Thank you for signing up for the grading app. Please click this link to confirm your email address',
    // html: '<b>Thank you for signing up for the grading app. Please click this  to confirm your email address</b>'
    subject: 'Your Login Token',
    text: `Your login token is: ${token}`,
    html: `Your login token is: <b>${token}</b>`,
  };

  return getTransporter()
    .sendMail(message)
    .catch((error) => {
      console.log('error: ', error);
    });
};

const debugSendEmailToken = async (email: string, token: string) => {
  console.log(`email token for ${email}: ${token}`);
};

export default emailPlugin;
