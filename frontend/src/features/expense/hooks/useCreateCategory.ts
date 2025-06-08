import { useMutation } from "@tanstack/react-query";
import { createCategory } from "../api/category.api";
import type { Category } from "../types/category.type";

export const useCreateCategory = () => {
    const { mutateAsync, isPending, error, isError } = useMutation({
        mutationFn: (data: Omit<Category, 'id'>) => createCategory(data),
    });

    const handleCreateCategory = async (data: Omit<Category, 'id'>) => {
        return mutateAsync(data)
    };

    return {
        createCategory: handleCreateCategory,
        isLoading: isPending,
        error,
        isError,
    };
}
    
