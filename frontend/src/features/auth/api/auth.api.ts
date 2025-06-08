import axios from 'axios';
import type { SignupFormData, SignupResponse, User, LoginFormData, LoginResponse } from '../types/auth.types';
import { isErrorResponse, isSuccessResponse, type ApiResponse } from '../../../types/response.types';
import { axiosInstance } from '../../../shared/axiosInstance';


/**
 * Register a new user
 */
export const signup = async (formData: SignupFormData): Promise<SignupResponse> => {
  try {
    const { data } = await axiosInstance.post<ApiResponse<SignupResponse>>('/auth/register', {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
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
    throw new Error('An unknown error occurred during signup');
  }
};

/**
 * Login a user
 */
export const login = async (credentials: LoginFormData): Promise<LoginResponse> => {
  try {
    const { data } = await axiosInstance.post<ApiResponse<LoginResponse>>('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    
    if (!isSuccessResponse(data)) {
      throw new Error(data.error?.message || 'Login failed');
    }
    
    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (isErrorResponse(error.response.data)) {
        throw new Error(error.response.data.error.message);
      }
    }
    throw error;
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const { data } = await axiosInstance.get<ApiResponse<User>>('/auth/profile');
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
    throw new Error('An unknown error occurred while fetching user profile');
  }
};
