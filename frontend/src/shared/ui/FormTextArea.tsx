import React from 'react';
import type { UseFormRegister, FieldError } from 'react-hook-form';

type FormTextAreaProps = {
  id: string;
  label: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  name: string;
  error?: FieldError;
  className?: string;
  rows?: number;
};

export const FormTextArea: React.FC<FormTextAreaProps> = ({
  id,
  label,
  placeholder = '',
  register,
  name,
  error,
  className = '',
  rows = 4,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        id={id}
        placeholder={placeholder}
        {...register(name)}
        rows={rows}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};
