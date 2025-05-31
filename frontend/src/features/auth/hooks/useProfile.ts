import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../api/auth.api';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';

/**
 * Hook to fetch and manage user profile data
 */
export function useProfile() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const {
    data: profile,
    isLoading,
    error,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getCurrentUser,
    // Only fetch if user is authenticated
    enabled: isAuthenticated,
    // Don't refetch on window focus for user profile data
    refetchOnWindowFocus: false,
    // Cache the profile data for 5 minutes
    staleTime: 5 * 60 * 1000,
  });

  return {
    profile,
    isLoading,
    error,
    isError,
    refetch,
  };
}
