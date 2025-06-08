import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "../api/category.api";

export const useGetAllCategories = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const {
        data: categories = [],
        isLoading,
        error,
        isError,
        refetch,
    } = useQuery({
        queryKey: ['categories'],
        queryFn: getAllCategories,
        // Only fetch if user is authenticated
        enabled: isAuthenticated,
        // Don't refetch on window focus for user profile data
        refetchOnWindowFocus: false,
        // Cache the profile data for 5 minutes
        staleTime: 5 * 60 * 1000,
    });

    return {
        categories,
        isLoading,
        error,
        isError,
        refetch,
    };
}
