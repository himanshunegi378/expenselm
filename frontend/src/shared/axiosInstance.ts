import axios from "axios";
import { store } from "../store";
import { logoutUser } from "../features/auth/store/auth.slice";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Necessary for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
          store.dispatch(logoutUser())           
        }
    }
)