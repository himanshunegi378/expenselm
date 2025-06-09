import React from 'react';
import type { UseFormRegister, FieldError } from 'react-hook-form';

type FormInputProps = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  register: UseFormRegister<any>;
  name: string;
  error?: FieldError;
  className?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

export const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = 'text',
  placeholder = '',
  autoComplete,
  register,
  name,
  error,
  className = '',
  inputProps,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...register(name)}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}` }
        {...inputProps}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};
