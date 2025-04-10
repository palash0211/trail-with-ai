import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/login-form';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';

// Mock the next/navigation router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the zustand store
jest.mock('@/store/auth-store', () => ({
  useAuthStore: jest.fn(),
}));

// Mock the i18n provider
jest.mock('@/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'login.username': 'Username',
        'login.password': 'Password',
        'login.username_placeholder': 'Enter your username',
        'login.password_placeholder': 'Enter your password',
        'login.submit': 'Sign in',
        'login.loading': 'Signing in...',
        'login.error.generic': 'Invalid username or password',
      };
      return translations[key] || key;
    },
  }),
}));

describe('LoginForm', () => {
  // Setup mocks before each test
  beforeEach(() => {
    // Mock router
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Mock auth store
    const mockLogin = jest.fn();
    (useAuthStore as jest.Mock).mockReturnValue({
      login: mockLogin,
    });
  });

  // Reset mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form correctly', () => {
    render(<LoginForm />);
    
    // Check that form elements are rendered
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    render(<LoginForm />);
    
    // Submit form without filling fields
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/username must be at least 3 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  test('calls login function with correct credentials', async () => {
    const mockLogin = jest.fn().mockResolvedValue(true);
    (useAuthStore as jest.Mock).mockReturnValue({
      login: mockLogin,
    });

    render(<LoginForm />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Check that login was called with correct credentials
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123');
    });
  });

  test('redirects to home page after successful login', async () => {
    const mockLogin = jest.fn().mockResolvedValue(true);
    (useAuthStore as jest.Mock).mockReturnValue({
      login: mockLogin,
    });
    
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    render(<LoginForm />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Check that we're redirected to home page
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/home');
    });
  });

  test('shows error message when login fails', async () => {
    const mockLogin = jest.fn().mockResolvedValue(false);
    (useAuthStore as jest.Mock).mockReturnValue({
      login: mockLogin,
    });

    render(<LoginForm />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Check that error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
    });
  });
});
