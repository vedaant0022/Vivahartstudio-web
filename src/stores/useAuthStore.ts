import { create } from 'zustand';

// Cache initial state to avoid re-parsing on every render
const initialToken = localStorage.getItem('token');
const initialUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null;

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified?: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  setIsAuthenticated: (value: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role?: string;
  }) => Promise<void>;
  verifyEmail: (email: string, otp: string) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: Boolean(initialToken),
  user: initialUser,
  token: initialToken,

  setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),

  login: async (email: string, password: string) => {
    try {
      const response = await fetch('https://api.vivahartstudio.com/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({
        isAuthenticated: true,
        token: data.token,
        user: data.user,
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  signup: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role?: string;
  }) => {
    try {
      const response = await fetch('https://api.vivahartstudio.com/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...userData, role: userData.role || 'user' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  },

  verifyEmail: async (email: string, otp: string) => {
    try {
      const response = await fetch('https://api.vivahartstudio.com/api/users/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Email verification failed');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Email verification failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      set({
        isAuthenticated: true,
        token: data.token,
        user: data.data,
      });
    } catch (error) {
      console.error('Email verification failed:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.clear();
    set({
      isAuthenticated: false,
      token: null,
      user: null,
    });
  },
}));

export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectUser = (state: AuthState) => state.user;
export const selectToken = (state: AuthState) => state.token;
export const selectLogin = (state: AuthState) => state.login;
export const selectSignup = (state: AuthState) => state.signup;
export const selectVerifyEmail = (state: AuthState) => state.verifyEmail;
export const selectLogout = (state: AuthState) => state.logout;

export default useAuthStore;