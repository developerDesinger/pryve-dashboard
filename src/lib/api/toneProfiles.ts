import { API_CONFIG } from '../config';
import { cookieUtils } from '../cookies';

export interface ToneProfile {
  id: string;
  name: string;
  description: string;
  icon: string;
  coreIdentity: string;
  safetyGuidelines: string[];
  comfortingInstructions: string;
  maxWords: number;
  responseStyle: string;
  bannedWords: string[];
  moodToToneRouting: {
    [key: string]: {
      priority: number;
      autoSelect: boolean;
      tone: string;
    };
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateToneProfileRequest {
  name: string;
  description: string;
  icon: string;
  coreIdentity: string;
  safetyGuidelines: string[];
  comfortingInstructions: string;
  maxWords: number;
  responseStyle: string;
  bannedWords: string[];
  moodToToneRouting: {
    [key: string]: {
      priority: number;
      autoSelect: boolean;
      tone: string;
    };
  };
}

export interface UpdateToneProfileRequest extends Partial<CreateToneProfileRequest> {}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

class ToneProfilesAPI {
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
      const token = cookieUtils.getAuthToken() || '';
      
      
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (data.hasOwnProperty('success')) {
        return {
          success: data.success,
          message: data.message || (data.success ? 'Success' : 'An error occurred'),
          data: data.success ? data.data as T : undefined,
          error: data.error || (!data.success ? data.message : undefined),
        };
      }

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'An error occurred',
          error: data.error || 'Unknown error',
        };
      }

      return {
        success: true,
        message: data.message || 'Success',
        data: data.data || data,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Network error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Get all tone profiles
  async getAllToneProfiles(): Promise<ApiResponse<ToneProfile[]>> {
    return this.request<ToneProfile[]>(API_CONFIG.ENDPOINTS.TONE_PROFILES, {
      method: 'GET',
    });
  }

  // Get single tone profile
  async getToneProfile(id: string): Promise<ApiResponse<ToneProfile>> {
    return this.request<ToneProfile>(API_CONFIG.ENDPOINTS.TONE_PROFILE_BY_ID.replace(':id', id), {
      method: 'GET',
    });
  }

  // Create tone profile
  async createToneProfile(profile: CreateToneProfileRequest): Promise<ApiResponse<ToneProfile>> {
    return this.request<ToneProfile>(API_CONFIG.ENDPOINTS.TONE_PROFILES, {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  }

  // Update tone profile
  async updateToneProfile(id: string, profile: UpdateToneProfileRequest): Promise<ApiResponse<ToneProfile>> {
    return this.request<ToneProfile>(API_CONFIG.ENDPOINTS.TONE_PROFILE_BY_ID.replace(':id', id), {
      method: 'PATCH',
      body: JSON.stringify(profile),
    });
  }

  // Delete tone profile
  async deleteToneProfile(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(API_CONFIG.ENDPOINTS.TONE_PROFILE_BY_ID.replace(':id', id), {
      method: 'DELETE',
    });
  }

  // Toggle active status
  async toggleToneProfile(id: string): Promise<ApiResponse<ToneProfile>> {
    return this.request<ToneProfile>(API_CONFIG.ENDPOINTS.TONE_PROFILE_TOGGLE.replace(':id', id), {
      method: 'PATCH',
    });
  }
}

// Export singleton instance
export const toneProfilesAPI = new ToneProfilesAPI();
