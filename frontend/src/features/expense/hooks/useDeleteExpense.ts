import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExpense } from "../api/expense.api";

export const useDeleteExpense = () => {
    const queryClient = useQueryClient();
    
    const { mutateAsync, isPending, error, isError } = useMutation({
        mutationFn: (id: string) => deleteExpense(id),
        onSuccess: () => {
            // Invalidate and refetch expenses list
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
        },
    });

    return {
        deleteExpense: mutateAsync,
        isLoading: isPending,
        error,
        isError,
    };
}
