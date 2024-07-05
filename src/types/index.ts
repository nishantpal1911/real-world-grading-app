export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  social?: {
    facebook?: string
    twitter?: string
    github?: string
    website?: string
  };
  // courses?: any[];
};

export interface UpdateUserPayload extends Partial<CreateUserPayload> {};
