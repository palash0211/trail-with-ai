import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/login-form';
import { useAuthStore } from '@/store/auth-store';

// Mock the necessary dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/store/auth-store', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('@/i18n/config', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'login.title': 'Login',
        'login.username': 'Username',
        'login.usernamePlaceholder': 'Enter your username',
        'login.password': 'Password',
        'login.passwordPlaceholder': 'Enter your password',
        'login.submit': 'Log In',
        'login.loggingIn': 'Logging in...',
        'login.demoHint': 'Use any username and password for demo',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock fetch globally
global.fetch = jest.fn();

describe('LoginForm', () => {
  // Setup common mocks before each test
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
    
    (useAuthStore as jest.Mock).mockReturnValue({
      login: jest.fn(),
    });
    
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        success: true,
        data: {
          token: 'test-token',
          user: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
          },
        },
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form correctly', () => {
    render(<LoginForm />);
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
  });

  it('shows validation errors for invalid inputs', async () => {
    render(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: 'Log In' });
    fireEvent.click(submitButton);
    
    // Wait for validation messages
    await waitFor(() => {
      expect(screen.getByText('Username must be at least 3 characters.')).toBeInTheDocument();
      expect(screen.getByText('Password must be at least 6 characters.')).toBeInTheDocument();
    });
  });

  it('submits the form with valid data', async () => {
    render(<LoginForm />);
    
    // Fill the form
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'testuser' },
    });
    
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Log In' });
    fireEvent.click(submitButton);
    
    // Wait for form submission
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(useAuthStore().login).toHaveBeenCalled();
      expect(useRouter().push).toHaveBeenCalledWith('/home');
    });
  });

  it('handles login failure', async () => {
    // Mock a failed login response
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        success: false,
        error: { message: 'Invalid credentials' },
      }),
    });
    
    render(<LoginForm />);
    
    // Fill and submit the form
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'testuser' },
    });
    
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'Log In' }));
    
    // Check that error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      expect(useRouter().push).not.toHaveBeenCalled();
    });
  });
});
