import React from 'react';

type AlertBoxProps = {
  type: 'error' | 'success' | 'warning' | 'info';
  message: string;
  className?: string;
};

export const AlertBox: React.FC<AlertBoxProps> = ({
  type,
  message,
  className = '',
}) => {
  const styles = {
    error: 'bg-red-100 border-red-400 text-red-700',
    success: 'bg-green-100 border-green-400 text-green-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  };

  return (
    <div
      className={`px-4 py-3 border rounded mb-4 ${styles[type]} ${className}`}
      role="alert"
    >
      <p>{message}</p>
    </div>
  );
};
