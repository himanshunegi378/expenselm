import type { z } from 'zod';
import type { signupSchema } from '../validation/signup.schema';
import type { loginSchema } from '../validation/login.schema';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;

export interface SignupResponse {
  user: User;
  token: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
