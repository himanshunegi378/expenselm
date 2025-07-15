import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { useQuery } from "@tanstack/react-query";
import { getAllExpenses } from "../api/expense.api";

export const useGetAllExpenses = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const {
        data: expenses = [],
        error,
        isError,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ['expenses'],
        queryFn: getAllExpenses,
        // Only fetch if user is authenticated
        enabled: isAuthenticated,
        // Don't refetch on window focus for expense data
        refetchOnWindowFocus: false,
        // Cache the expense data for 5 minutes
        staleTime: 5 * 60 * 1000,
    });

    return {
        expenses,
        isLoading: isFetching,
        error,
        isError,
        refetch,
    };
}

useGetAllExpenses.queryKey = ['expenses'];
