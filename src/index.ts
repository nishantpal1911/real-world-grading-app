import dotenv from 'dotenv';
import 'tsconfig-paths/register';

import { createServer, startServer } from 'src/server';

dotenv.config();

createServer()
  .then(startServer)
  .catch((err) => {
    console.log(err);
  });
