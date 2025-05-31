import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';

interface ProtectedRouteProps {
  redirectPath?: string;
}

/**
 * A wrapper component that protects routes by checking authentication state
 * Redirects to login if not authenticated
 */
export const ProtectedRoute = ({ 
  redirectPath = '/login' 
}: ProtectedRouteProps) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // If authenticated, render the child route components
  return <Outlet />;
};
