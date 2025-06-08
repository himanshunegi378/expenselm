import { useQuery } from "@tanstack/react-query";
import { getExpenseById } from "../api/expense.api";

export const useGetExpenseById = (id: string, enabled = true) => {
    const {
        data: expense,
        isLoading,
        error,
        isError,
        refetch,
    } = useQuery({
        queryKey: ['expense', id],
        queryFn: () => getExpenseById(id),
        enabled: !!id && enabled,
        // Don't refetch on window focus for expense data
        refetchOnWindowFocus: false,
        // Cache the expense data for 5 minutes
        staleTime: 5 * 60 * 1000,
    });

    return {
        expense,
        isLoading,
        error,
        isError,
        refetch,
    };
}
