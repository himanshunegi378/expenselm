import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { useQuery } from "@tanstack/react-query";
import { getAllCategoriesOrderedByLikeliness } from "../api/category.api";
import useDebounce from "../../../shared/hooks/useDebounce";

export const useGetAllCategoriesOrderedByLikeliness = ({ description, notes }: { description: string; notes?: string }) => {
    const debouncedDescription = useDebounce(description, 500);
    const debouncedNotes = useDebounce(notes, 500);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const {
        data: categories = [],
        isLoading,
        error,
        isError,
        refetch,
    } = useQuery({
        queryKey: ['categories', debouncedDescription, debouncedNotes],
        queryFn: () => getAllCategoriesOrderedByLikeliness({ description: debouncedDescription, notes: debouncedNotes }),
        // Only fetch if user is authenticated
        enabled: isAuthenticated,
        // Don't refetch on window focus for user profile data
        refetchOnWindowFocus: false,
        // Cache the profile data for 5 minutes
    });

    return {
        categories,
        isLoading,
        error,
        isError,
        refetch,
    };
}
