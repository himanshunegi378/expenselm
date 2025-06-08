import axios from "axios";
import { isErrorResponse, isSuccessResponse, type ApiResponse } from "../../../types/response.types";
import { axiosInstance } from "../../../shared/axiosInstance";
import type { Category } from "../types/category.type";


/**
 * Get all categories
 */
export const getAllCategories = async () => {
    try {
        const { data } = await axiosInstance.get<ApiResponse<Category[]>>("expenses/categories/all");
        if (!isSuccessResponse(data)) {
            throw new Error(data.error.message);
        }
        return data.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            if (isErrorResponse(error.response.data)) {
                throw new Error(error.response.data.error.message);
            }
        }
        console.log(error);
        throw new Error('An unknown error occurred while fetching categories');
    }
}

/**
 * Create a new Category
 */
export const createCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
        const { data } = await axiosInstance.post<ApiResponse<Category>>("expenses/categories", categoryData);
        if (!isSuccessResponse(data)) {
            throw new Error(data.error.message);
        }
        return data.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            if (isErrorResponse(error.response.data)) {
                throw new Error(error.response.data.error.message);
            }
        }
        console.log(error);
        throw new Error('An unknown error occurred while creating category');
    }
}

    