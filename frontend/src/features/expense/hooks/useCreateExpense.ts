import { useMutation } from "@tanstack/react-query";
import { createExpense } from "../api/expense.api";
import type { Expense } from "../types/expense.types";

export const useCreateExpense = () => {
    const { mutateAsync, isPending, error, isError, isSuccess } = useMutation({
        mutationFn: (data: Omit<Expense, 'id'>) => createExpense(data),
    });

    return {
        createExpense: mutateAsync,
        isLoading: isPending,
        error,
        isError,
        isSuccess,
    };
}
