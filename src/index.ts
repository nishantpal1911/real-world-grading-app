import dotenv from 'dotenv';

import { createServer, startServer } from './server';

dotenv.config();

createServer()
  .then(startServer)
  .catch((err) => {
    console.log(err);
  });
