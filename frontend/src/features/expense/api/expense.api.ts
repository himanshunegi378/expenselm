import { axiosInstance } from "../../../shared/axiosInstance"
import { type ApiResponse } from "../../../types/response.types"
import { apiRequest } from "../../../utils/apiReuest"
import type { Expense } from "../types/expense.types"



export const createExpense = async (expense: Omit<Expense, 'id'>) => {
    return apiRequest<Expense>(
        () => axiosInstance.post<ApiResponse<Expense>>('/expenses', expense),
        'An unknown error occurred while creating expense'
    );
}

export const getAllExpenses = async () => {
    return apiRequest<Expense[]>(
        () => axiosInstance.get<ApiResponse<Expense[]>>('/expenses'),
        'An unknown error occurred while fetching expenses'
    );
}

export const getExpenseById = async (id: string) => {
    return apiRequest<Expense>(
        () => axiosInstance.get<ApiResponse<Expense>>(`/expenses/${id}`),
        'An unknown error occurred while fetching expense by id'
    );
}

export const updateExpense = async (id: string, expense: Partial<Omit<Expense, 'id'>>) => {
    return apiRequest<Expense>(
        () => axiosInstance.put<ApiResponse<Expense>>(`/expenses/${id}`, expense),
        'An unknown error occurred while updating expense'
    );
};

export const deleteExpense = async (id: string) => {
    return apiRequest<null>(
        () => axiosInstance.delete<ApiResponse<null>>(`/expenses/${id}`),
        'An unknown error occurred while deleting expense'
    );
};