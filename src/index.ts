import dotenv from 'dotenv';

import { createServer, startServer } from 'src/server';

dotenv.config();

createServer()
  .then(startServer)
  .catch((err) => {
    console.log(err);
  });
