
import { useNavigate } from 'react-router-dom';
import { useSignin } from '../hooks/useSignin';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { login as loginAction } from '../actions/auth.actions';
import type { LoginFormData } from '../types/auth.types';
import { loginSchema } from '../validation/login.schema';

export const SigninForm = () => {
  const navigate = useNavigate();
  const { signin, isLoading, error, isError } = useSignin();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await loginAction(signin, data, navigate);
    } catch (err) {
      // Error handling is managed by the useSignin hook
      console.error('Login failed:', err);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {isError && error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error.message || 'An error occurred during signin'}
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="mt-1 px-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className="mt-1 px-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </form>
  );
};
