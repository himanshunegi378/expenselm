import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateExpense } from "../api/expense.api";
import type { Expense } from "../types/expense.types";

export const useUpdateExpense = () => {
    const queryClient = useQueryClient();

    const { mutateAsync, isPending, error, isError } = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Expense, 'id'>> }) =>
            updateExpense(id, data),
        onSuccess: (_, variables) => {
            // Invalidate and refetch expenses queries
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            queryClient.invalidateQueries({ queryKey: ['expense', variables.id] });
        },
    });



    return {
        updateExpense: mutateAsync,
        isLoading: isPending,
        error,
        isError,
    };
}
