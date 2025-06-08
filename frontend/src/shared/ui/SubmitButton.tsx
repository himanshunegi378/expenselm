import React from 'react';

type SubmitButtonProps = {
  isLoading: boolean;
  loadingText: string;
  text: string;
  className?: string;
};

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading,
  loadingText,
  text,
  className = '',
}) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ${className}`}
    >
      {isLoading ? loadingText : text}
    </button>
  );
};
