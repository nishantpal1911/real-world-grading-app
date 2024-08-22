import CourseValidation from 'src/validators/courses';
import UserValidation from 'src/validators/users';

namespace Validation {
  export const Users = UserValidation;
  export const Courses = CourseValidation;
}

export default Validation;
