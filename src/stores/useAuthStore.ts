import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  setIsAuthenticated: (value: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the store with proper typing
const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: Boolean(localStorage.getItem('token')),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null,
  token: localStorage.getItem('token'),
  
  setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
  
  login: async (email: string, password: string) => {
    try {
      const response = await fetch('http://43.204.212.179:8585/api/users/login', {
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
      
      // Store token and user data in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Update state
      set({ 
        isAuthenticated: true,
        token: data.token,
        user: data.user
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  
  logout: () => {
    // Clear localStorage
    localStorage.clear();
    
    // Reset state
    set({ 
      isAuthenticated: false,
      token: null,
      user: null
    });
  }
}));

// Selector functions with proper typing
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectUser = (state: AuthState) => state.user;
export const selectToken = (state: AuthState) => state.token;
export const selectLogout = (state: AuthState) => state.logout;
export const selectLogin = (state: AuthState) => state.login;

export default useAuthStore; 