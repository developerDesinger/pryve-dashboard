// API Configuration
export const API_CONFIG = {
  // Base URL for the Pryve Auth API
  // Update this with your actual API URL
  BASE_URL: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
  
  // API endpoints
  ENDPOINTS: {
    LOGIN: '/api/v1/users/login',
    REGISTER: '/api/v1/users/create',
    VERIFY_OTP: '/api/v1/users/verify-otp',
    RESEND_OTP: '/api/v1/users/resend-otp',
    FORGOT_PASSWORD: '/api/v1/users/forgot-password',
    UPDATE_PASSWORD: '/api/v1/users/update-password',
    CHANGE_PASSWORD: '/api/v1/users/change-password',
    USER_BY_TOKEN: '/api/v1/users/user-by-token',
    UPDATE_USER: '/api/v1/users/update-user',
    SOCIAL_LOGIN: '/api/v1/users/social-login',
    GET_ALL_USERS: '/api/v1/users/get-all',
    // Tone Profiles endpoints
    TONE_PROFILES: '/api/v1/tone-profiles',
    TONE_PROFILE_BY_ID: '/api/v1/tone-profiles/:id',
    TONE_PROFILE_TOGGLE: '/api/v1/tone-profiles/:id/toggle',
    // Emotional Rules endpoints
    EMOTIONAL_RULES: '/api/v1/emotional-rules',
    EMOTIONAL_RULE_BY_ID: '/api/v1/emotional-rules/:id',
    // AI Configuration endpoints
    AI_CONFIG: '/api/v1/ai-config',
  },
  
  // Cookie configuration
  COOKIE_CONFIG: {
    EXPIRES: 7, // 7 days
    SECURE: process.env.NODE_ENV === 'production',
    SAME_SITE: 'strict' as const,
    PATH: '/',
  },
} as const;

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
