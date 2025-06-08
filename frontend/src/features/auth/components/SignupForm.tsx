import { useNavigate, Link } from 'react-router-dom';
import { useSignup } from '../hooks/useSignup';
import { signupSchema } from '../validation/signup.schema';
import type { SignupFormData } from '../types/auth.types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { signup as signupAction } from '../actions/auth.actions';
import { FormInput, SubmitButton, AlertBox, FormContainer } from '../../../shared/ui';

type SignupSchema = z.infer<typeof signupSchema>;

export function SignupForm() {
  const navigate = useNavigate();
  const { signup, isLoading, isError, error } = useSignup();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    signupAction(signup, data, navigate);
  };

  return (
    <FormContainer title="Create Your Account">
      {isError && (
        <AlertBox 
          type="error" 
          message={error instanceof Error ? error.message : 'An error occurred during signup'} 
        />
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          id="name"
          label="Full Name"
          type="text"
          autoComplete="name"
          register={register}
          name="name"
          error={errors.name}
        />
        <FormInput
          id="email"
          label="Email Address"
          type="email"
          autoComplete="email"
          register={register}
          name="email"
          error={errors.email}
        />
        <FormInput
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          register={register}
          name="password"
          error={errors.password}
        />
        <FormInput
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          register={register}
          name="confirmPassword"
          error={errors.confirmPassword}
        />
        <div>
          <SubmitButton
            isLoading={isLoading}
            loadingText="Creating Account..."
            text="Sign Up"
          />
        </div>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Log in
          </Link>
        </p>
      </div>
    </FormContainer>
  );
}
