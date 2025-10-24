import Cookies from 'js-cookie';
import { API_CONFIG } from '@/lib/config';

// Cookie configuration for authentication
export const AUTH_COOKIE_CONFIG = {
  expires: API_CONFIG.COOKIE_CONFIG.EXPIRES,
  secure: API_CONFIG.COOKIE_CONFIG.SECURE,
  sameSite: API_CONFIG.COOKIE_CONFIG.SAME_SITE,
  path: API_CONFIG.COOKIE_CONFIG.PATH,
};

// Cookie names
export const COOKIE_NAMES = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
} as const;

// Helper functions for cookie management
export const cookieUtils = {
  // Set authentication cookies
  setAuthCookies: (token: string, userData: any) => {
    Cookies.set(COOKIE_NAMES.AUTH_TOKEN, token, AUTH_COOKIE_CONFIG);
    Cookies.set(COOKIE_NAMES.USER_DATA, JSON.stringify(userData), AUTH_COOKIE_CONFIG);
  },

  // Get authentication token
  getAuthToken: (): string | undefined => {
    return Cookies.get(COOKIE_NAMES.AUTH_TOKEN);
  },

  // Get user data
  getUserData: (): any | null => {
    try {
      const userData = Cookies.get(COOKIE_NAMES.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  },

  // Clear all authentication cookies
  clearAuthCookies: () => {
    Cookies.remove(COOKIE_NAMES.AUTH_TOKEN, { path: '/' });
    Cookies.remove(COOKIE_NAMES.USER_DATA, { path: '/' });
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!(cookieUtils.getAuthToken() && cookieUtils.getUserData());
  },

  // Refresh session by extending cookie expiration
  refreshSession: () => {
    const token = cookieUtils.getAuthToken();
    const userData = cookieUtils.getUserData();
    
    if (token && userData) {
      cookieUtils.setAuthCookies(token, userData);
    }
  },
};
