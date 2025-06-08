import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateExpense } from "../api/expense.api";
import type { Expense } from "../types/expense.types";

export const useUpdateExpense = () => {
    const queryClient = useQueryClient();
    
    const { mutateAsync, isPending, error, isError } = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Expense, 'id'>> }) => 
            updateExpense(id, data),
        onSuccess: (data, variables) => {
            // Invalidate and refetch expenses queries
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            queryClient.invalidateQueries({ queryKey: ['expense', variables.id] });
        },
    });

    const handleUpdateExpense = async (id: string, data: Partial<Omit<Expense, 'id'>>) => {
        return mutateAsync({ id, data });
    };

    return {
        updateExpense: handleUpdateExpense,
        isLoading: isPending,
        error,
        isError,
    };
}
