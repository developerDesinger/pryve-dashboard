// API Configuration
export const API_CONFIG = {
  // Base URL for the Pryve Auth API
  // Update this with your actual API URL
  BASE_URL: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
  // Shared headers for all API requests
  DEFAULT_HEADERS: {
    "ngrok-skip-browser-warning": "true",
  },

  // API endpoints
  ENDPOINTS: {
    LOGIN: "/api/v1/users/login",
    REGISTER: "/api/v1/users/create",
    VERIFY_OTP: "/api/v1/users/verify-otp",
    RESEND_OTP: "/api/v1/users/resend-otp",
    FORGOT_PASSWORD: "/api/v1/users/forgot-password",
    UPDATE_PASSWORD: "/api/v1/users/update-password",
    CHANGE_PASSWORD: "/api/v1/users/change-password",
    USER_BY_TOKEN: "/api/v1/users/user-by-token",
    UPDATE_USER: "/api/v1/users/update-user",
    SOCIAL_LOGIN: "/api/v1/users/social-login",
    GET_ALL_USERS: "/api/v1/users/get-all",
    // Tone Profiles endpoints
    TONE_PROFILES: "/api/v1/tone-profiles",
    TONE_PROFILE_BY_ID: "/api/v1/tone-profiles/:id",
    TONE_PROFILE_TOGGLE: "/api/v1/tone-profiles/:id/toggle",
    // Emotional Rules endpoints
    EMOTIONAL_RULES: "/api/v1/emotional-rules",
    EMOTIONAL_RULE_BY_ID: "/api/v1/emotional-rules/:id",
    // AI Configuration endpoints
    AI_CONFIG: "/api/v1/ai-config",
    // Chat Settings endpoints
    CHAT_SETTINGS: "/api/v1/chat-settings",
    // Analytics endpoints
    ANALYTICS_EMOTIONS: "/api/v1/analytics/emotions",
    // Dashboard endpoints
    DASHBOARD_SUMMARY: "/api/v1/dashboard",
    DASHBOARD_ACTIVITY_TRENDS: "/api/v1/dashboard/activity-trends",
    DASHBOARD_USER_ENGAGEMENT: "/api/v1/dashboard/user-engagement",
    DASHBOARD_EMOTIONAL_TOPICS: "/api/v1/dashboard/emotional-topics",
    DASHBOARD_RECENT_ACTIVITY: "/api/v1/dashboard/recent-activity",
    // Payments endpoints
    REVENUECAT_PAYMENTS: "/api/v1/webhooks/revenuecat/admin/payments",
    // Settings endpoints
    SETTINGS: "/api/v1/settings",
    FEATURE_TOGGLES: "/api/v1/settings/feature-toggles",
    FEATURE_TOGGLE_BY_NAME: "/api/v1/settings/feature-toggles/:featureName",
    FEATURE_TOGGLE_TOGGLE: "/api/v1/settings/feature-toggles/:featureName/toggle",
    FEATURE_TOGGLES_INITIALIZE: "/api/v1/settings/feature-toggles/initialize",
    SYSTEM_LANGUAGE: "/api/v1/settings/system-language",
    SYSTEM_SETTINGS: "/api/v1/settings/system",
    // Notifications endpoints
    NOTIFICATIONS: "/api/v1/notifications",
    NOTIFICATIONS_BROADCAST: "/api/v1/notifications/broadcast",
    NOTIFICATION_MARK_READ: "/api/v1/notifications/:notificationId/read",
  },

  // Cookie configuration
  COOKIE_CONFIG: {
    EXPIRES: 7, // 7 days
    SECURE: process.env.NODE_ENV === "production",
    SAME_SITE: "strict" as const,
    PATH: "/",
  },
} as const;

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
