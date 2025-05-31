import { useMutation } from '@tanstack/react-query';
import { login } from '../api/auth.api';
import type { LoginFormData } from '../types/auth.types';
import { loginSchema } from '../validation/login.schema';

export function useSignin() {
  const { mutateAsync, isPending, error, isError } = useMutation({
    mutationFn: (data: LoginFormData) => login(data),
  });

  const handleSignin = async (data: LoginFormData) => {
    return mutateAsync(data);
  };

  return {
    signin: handleSignin,
    isLoading: isPending,
    error,
    isError,
    loginSchema, // Export schema for use in forms
  };
}
