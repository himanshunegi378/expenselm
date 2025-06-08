import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { useQuery } from "@tanstack/react-query";
import { getAllExpenses } from "../api/expense.api";
import type { Expense } from "../types/expense.types";

export const useGetAllExpenses = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const {
        data: expenses = [],
        isLoading,
        error,
        isError,
        refetch,
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
        isLoading,
        error,
        isError,
        refetch,
    };
}
