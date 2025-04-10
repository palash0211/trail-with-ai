import axios from 'axios';
import { LoginResponse } from '@/types';

// API URL from environment variable or default
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';

// Authentication service
export const authService = {
  // Login user
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });
      
      if (response.data.success && response.data.data) {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', response.data.data.tokens.accessToken);
        localStorage.setItem('idToken', response.data.data.tokens.idToken);
        localStorage.setItem('refreshToken', response.data.data.tokens.refreshToken);
        
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error || 'Login failed');
      }
      
      throw new Error('Network error');
    }
  },
  
  // Register user
  async register(userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error || 'Registration failed');
      }
      
      throw new Error('Network error');
    }
  },
  
  // Logout user
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
  
  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('accessToken');
  },
  
  // Get current user
  getCurrentUser(): any {
    if (typeof window === 'undefined') return null;
    
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  },
  
  // Get token
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  },
};
