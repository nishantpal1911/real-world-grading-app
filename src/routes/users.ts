import Hapi from '@hapi/hapi';

import { createUser, deleteUserById, getAllUsers, getUserById, updateUserById } from '../handlers/users';
import Validation from '../validators';

const userRoutes: Hapi.ServerRoute[] = [
  {
    path: '/users',
    method: 'GET',
    handler: getAllUsers,
  },
  {
    path: '/users/{userId}',
    method: 'GET',
    handler: getUserById,
    options: {
      validate: Validation.Users.PARAMS_ID,
    },
  },
  {
    path: '/users',
    method: 'POST',
    handler: createUser,
    options: {
      validate: Validation.Users.CREATE,
    },
  },
  {
    path: '/users/{userId}',
    method: 'PATCH',
    handler: updateUserById,
    options: {
      validate: Validation.Users.UPDATE,
    },
  },
  {
    path: '/users/{userId}',
    method: 'DELETE',
    handler: deleteUserById,
    options: {
      validate: Validation.Users.PARAMS_ID,
    },
  },
];

export default userRoutes;
