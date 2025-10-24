"use client";
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cookieUtils } from '@/lib/cookies';
import { authAPI, type LoginResponse, type UserProfile } from '@/lib/api/auth';
import { useToast } from '@/hooks/useToast';

interface User {
  id: string;
  email: string;
  name: string;
  fullName: string;
  userName?: string;
  profilePhoto?: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  refreshSession: () => void;
  refreshUserData: () => Promise<void>;
  register: (email: string, fullName: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { showSuccess, showError, showLoading, dismiss } = useToast();

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = cookieUtils.getUserData();
        
        if (cookieUtils.isAuthenticated() && userData) {
          setUser(userData);
        }
      } catch (error) {
        // Clear invalid data
        cookieUtils.clearAuthCookies();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const loadingToast = showLoading('Signing you in...');
    
    try {
      setIsLoading(true);
      
      // Call the real API
      const response = await authAPI.login(email, password);
      
      if (response.success && response.data) {
        const { token, user: apiUser } = response.data;
        
        // Transform API user data to our User interface
        const userData: User = {
          id: apiUser.id,
          email: apiUser.email,
          name: apiUser.fullName,
          fullName: apiUser.fullName,
          userName: apiUser.userName,
          profilePhoto: apiUser.profilePhoto,
          isVerified: apiUser.status === 'ACTIVE', // Map status to isVerified
        };
        
        // Store authentication data in cookies
        cookieUtils.setAuthCookies(token, userData);
        
        setUser(userData);
        
        dismiss(loadingToast);
        showSuccess(response.message || `Welcome back, ${apiUser.fullName}!`);
        
        return true;
      } else {
        dismiss(loadingToast);
        showError(response.message || 'Login failed. Please check your credentials.');
        return false;
      }
    } catch (error) {
      dismiss(loadingToast);
      showError('Network error. Please check your connection and try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear authentication data from cookies
    cookieUtils.clearAuthCookies();
    
    // Also clear any localStorage/sessionStorage as backup
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.clear();
    
    setUser(null);
    showSuccess('You have been logged out successfully');
    router.push('/signin');
  };

  const isAuthenticated = !!user;

  const refreshSession = useCallback(() => {
    cookieUtils.refreshSession();
  }, []);

  const refreshUserData = useCallback(async () => {
    try {
      const token = cookieUtils.getAuthToken();
      if (!token) return;

      const response = await authAPI.getCurrentUser(token);
      if (response.success && response.data) {
        const apiUser = response.data;
        const userData: User = {
          id: apiUser.id,
          email: apiUser.email,
          name: apiUser.fullName,
          fullName: apiUser.fullName,
          userName: apiUser.userName,
          profilePhoto: apiUser.profilePhoto,
          isVerified: apiUser.isVerified,
        };
        
        setUser(userData);
        cookieUtils.setAuthCookies(token, userData);
      }
    } catch (error) {
      // Silently handle refresh errors
    }
  }, []);

  const register = async (email: string, fullName: string): Promise<boolean> => {
    const loadingToast = showLoading('Creating your account...');
    
    try {
      const response = await authAPI.register(email, fullName);
      
      if (response.success) {
        dismiss(loadingToast);
        showSuccess('Account created successfully! Please check your email for verification.');
        return true;
      } else {
        dismiss(loadingToast);
        showError(response.message || 'Registration failed. Please try again.');
        return false;
      }
    } catch (error) {
      dismiss(loadingToast);
      showError('Network error. Please check your connection and try again.');
      return false;
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    const loadingToast = showLoading('Sending reset instructions...');
    
    try {
      const response = await authAPI.forgotPassword(email);
      
      if (response.success) {
        dismiss(loadingToast);
        showSuccess('Password reset instructions sent to your email!');
        return true;
      } else {
        dismiss(loadingToast);
        showError(response.message || 'Failed to send reset instructions. Please try again.');
        return false;
      }
    } catch (error) {
      dismiss(loadingToast);
      showError('Network error. Please check your connection and try again.');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      isAuthenticated,
      refreshSession,
      refreshUserData,
      register,
      forgotPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
