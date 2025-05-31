import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';

interface PublicRouteProps {
  redirectPath?: string;
}

/**
 * A wrapper component for public routes like login and signup
 * Redirects authenticated users to the dashboard
 */
export const PublicRoute = ({ 
  redirectPath = '/dashboard' 
}: PublicRouteProps) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // If not authenticated, allow access to public routes
  return <Outlet />;
};
