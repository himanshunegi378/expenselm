import React from 'react';
import type { ReactNode } from 'react';

type FormContainerProps = {
  children: ReactNode;
  title?: string;
  className?: string;
};

export const FormContainer: React.FC<FormContainerProps> = ({
  children,
  title,
  className = '',
}) => {
  return (
    <div className={`max-w-md w-full mx-auto p-6 ${className}`}>
      {title && <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">{title}</h2>}
      {children}
    </div>
  );
};
