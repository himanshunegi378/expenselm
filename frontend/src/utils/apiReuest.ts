import axios from "axios";
import { isErrorResponse, isSuccessResponse, type ApiResponse } from "../types/response.types";

// Generic API request handler to avoid code duplication
export async function apiRequest<T>(
  requestFn: () => Promise<{ data: ApiResponse<T> }>,
  errorMessage: string
): Promise<T> {
  try {
    const response = await requestFn();
    if (!isSuccessResponse(response.data)) {
      throw new Error(response.data.error.message);
    }
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (isErrorResponse(error.response.data)) {
        throw new Error(error.response.data.error.message);
      }
    }
    console.log(error);
    throw new Error(errorMessage);
  }
}