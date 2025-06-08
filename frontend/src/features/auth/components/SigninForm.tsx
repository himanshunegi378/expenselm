import { useNavigate, Link } from 'react-router-dom';
import { useSignin } from '../hooks/useSignin';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { login as loginAction } from '../actions/auth.actions';
import type { LoginFormData } from '../types/auth.types';
import { loginSchema } from '../validation/login.schema';
import { FormInput, SubmitButton, AlertBox, FormContainer } from '../../../shared/ui';

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
    <FormContainer title="Sign In to Your Account">
      {isError && error && (
        <AlertBox
          type="error"
          message={error.message || 'An error occurred during signin'}
        />
      )}
      <form onSubmit={onSubmit} className="space-y-6">
        <FormInput
          id="email"
          label="Email"
          type="email"
          register={register}
          name="email"
          error={errors.email}
          autoComplete="email"
        />

        <FormInput
          id="password"
          label="Password"
          type="password"
          register={register}
          name="password"
          error={errors.password}
          autoComplete="current-password"
        />

        <div>
          <SubmitButton
            isLoading={isLoading}
            loadingText="Signing in..."
            text="Sign In"
          />
        </div>
      </form>
    </FormContainer>
  );
};
