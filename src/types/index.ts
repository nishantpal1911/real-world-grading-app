export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  isAdmin?: boolean;
  social?: {
    facebook?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  // courses?: any[];
}

export interface UpdateUserPayload extends Partial<Omit<CreateUserPayload, 'isAdmin'>> {}

export interface LoginInput {
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthenticateInput {
  email: string;
  emailToken: string;
}

export interface APITokenPayload {
  tokenId: number;
}

export interface CreateCoursePayload {
  name: string;
  courseDetails?: string;
}

export interface UpdateCoursePayload extends Partial<CreateCoursePayload> {}

export enum TokenType {
  API = 'API',
  EMAIL = 'EMAIL',
}

export enum UserRole {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}
