import { useMutation } from '@tanstack/react-query';
import { signup } from '../api/auth.api';
import type { SignupFormData } from '../types/auth.types';
import { signupSchema } from '../validation/signup.schema';
export function useSignup() {
  const { mutateAsync, isPending, error, isError } = useMutation({
    mutationFn: (data: SignupFormData) => signup(data),
  });

  const handleSignup = async (data: SignupFormData) => {
    return mutateAsync(data)
  };

  return {
    signup: handleSignup,
    isLoading: isPending,
    error,
    isError,
    signupSchema, // Export schema for use in forms
  };
}
