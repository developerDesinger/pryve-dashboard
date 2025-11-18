import { API_CONFIG, getApiUrl } from "@/lib/config";

// API Response types
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    userName?: string;
    profilePhoto?: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  userName?: string;
  profilePhoto?: string;
  gender?: string;
  dateOfBirth?: string;
  country?: string;
  region?: string;
  phoneNumber?: string;
  bio?: string;
  isVerified: boolean;
  status?: string;
  role?: string;
  // Prompt and Fallback Message fields
  systemPrompt?: string;
  systemPromptActive?: boolean;
  contextNeededMessage?: string;
  contextNeededActive?: boolean;
  technicalErrorMessage?: string;
  technicalErrorActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  profilePhoto: string;
  email: string;
  password: string | null;
  role: string;
  status: string;
  otp: string | null;
  otpCreatedAt: string;
  userName: string | null;
  loginType: string;
  firstName: string | null;
  lastName: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  country: string | null;
  region: string | null;
  phoneNumber: string | null;
  bio: string | null;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

interface UserCounts {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  premiumUsers: number;
}

interface PaginatedUsersResponse {
  data: User[];
  pagination: PaginationInfo;
  counts: UserCounts;
}

// API service class
class AuthAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config: RequestInit = {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...API_CONFIG.DEFAULT_HEADERS,
          ...options.headers,
        },
      };

      const response = await fetch(url, config);
      const data = await response.json();

      // Check if the response contains success field (API response format)
      if (data.hasOwnProperty("success")) {
        const result = {
          success: data.success,
          message:
            data.message || (data.success ? "Success" : "An error occurred"),
          data: data.success ? ((data.data || data) as T) : undefined,
          error: data.error || (!data.success ? data.message : undefined),
        };
        return result;
      }

      // Fallback to HTTP status check
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "An error occurred",
          error: data.error || "Unknown error",
        };
      }

      return {
        success: true,
        message: data.message || "Success",
        data: data.data || data,
      };
    } catch (error) {
      return {
        success: false,
        message: "Network error occurred",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Login user
  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>(API_CONFIG.ENDPOINTS.LOGIN, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  // Get current user profile
  async getCurrentUser(token: string): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>(API_CONFIG.ENDPOINTS.USER_BY_TOKEN, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Register new user
  async register(email: string, fullName: string): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.REGISTER, {
      method: "POST",
      body: JSON.stringify({ email, fullName }),
    });
  }

  // Verify OTP
  async verifyOTP(email: string, otp: number): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.VERIFY_OTP, {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  }

  // Resend OTP
  async resendOTP(email: string): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.RESEND_OTP, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  // Forgot password
  async forgotPassword(email: string): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.FORGOT_PASSWORD, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  // Update password with OTP
  async updatePassword(
    email: string,
    userId: string,
    otp: number,
    newPassword: string
  ): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.UPDATE_PASSWORD, {
      method: "POST",
      body: JSON.stringify({ email, userId, otp, newPassword }),
    });
  }

  // Change password (authenticated)
  async changePassword(
    token: string,
    oldPassword: string,
    newPassword: string
  ): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  }

  // Update user (authenticated)
  async updateUser(
    token: string,
    userId: string,
    userData: Partial<UserProfile>
  ): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>(
      `${API_CONFIG.ENDPOINTS.UPDATE_USER}/${userId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      }
    );
  }

  // Google social login
  async googleLogin(
    email: string,
    providerId: string,
    firstName: string,
    lastName: string,
    profilePhoto?: string
  ): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>(API_CONFIG.ENDPOINTS.SOCIAL_LOGIN, {
      method: "POST",
      body: JSON.stringify({
        email,
        provider: "GOOGLE",
        providerId,
        userName: email.split("@")[0],
        firstName,
        lastName,
        profilePhoto,
      }),
    });
  }

  // Get all users with pagination
  async getAllUsers(
    token: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<PaginatedUsersResponse>> {
    // Add pagination parameters to the URL
    const url = new URL(`${this.baseURL}${API_CONFIG.ENDPOINTS.GET_ALL_USERS}`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());

    // Make direct API call to get the raw response
    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...API_CONFIG.DEFAULT_HEADERS,
        },
      });

      const data = await response.json();

      if (data.success && data.data) {
        return {
          success: data.success,
          message: data.message,
          data: {
            data: data.data as User[],
            pagination: data.pagination || {
              currentPage: 1,
              totalPages: 1,
              totalItems: data.data.length,
              limit: 10,
            },
            counts: data.counts || {
              totalUsers: 0,
              activeUsers: 0,
              suspendedUsers: 0,
              premiumUsers: 0,
            },
          },
        };
      } else {
        return {
          success: false,
          message: data.message || "Failed to fetch users",
          error: data.message || "Unknown error",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Network error occurred",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

// Export singleton instance
export const authAPI = new AuthAPI();
export type {
  ApiResponse,
  LoginResponse,
  UserProfile,
  User,
  PaginationInfo,
  PaginatedUsersResponse,
  UserCounts,
};
