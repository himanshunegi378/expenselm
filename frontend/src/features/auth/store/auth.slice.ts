import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types/auth.types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

// Check if user is already logged in
const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('token');

const initialState: AuthState = {
  isAuthenticated: !!storedToken,
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<User & { token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.token = action.payload.token;
      // Store user data in local storage
      localStorage.setItem('user', JSON.stringify(action.payload));
      localStorage.setItem('token', action.payload.token);
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      // Clear local storage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
});

export const { 
  loginUser,
  logoutUser
} = authSlice.actions;

export default authSlice.reducer;
