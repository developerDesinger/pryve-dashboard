import { API_CONFIG } from '../config';
import { cookieUtils } from '../cookies';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface FeatureToggle {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'COMING_SOON';
  createdAt?: string;
  updatedAt?: string;
}

export interface SystemLanguage {
  language: string;
  availableLanguages: string[];
}

export interface SystemSettings {
  language: string;
  theme?: string;
  timezone?: string;
  [key: string]: any;
}

export interface CompleteSettings {
  featureToggles: FeatureToggle[];
  systemLanguage: SystemLanguage;
  systemSettings: SystemSettings;
}

export interface UpdateFeatureToggleRequest {
  isEnabled?: boolean;
  status?: 'ACTIVE' | 'INACTIVE' | 'COMING_SOON';
}

export interface UpdateSystemLanguageRequest {
  language: string;
}

class SettingsAPI {
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
        ...options,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
          // Ensure Content-Type is always application/json for requests with body (set last so it can't be overridden)
          'Content-Type': 'application/json',
        },
      };

      const response = await fetch(url, config);
      
      // Check if response is actually JSON before parsing
      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.includes('application/json')) {
        // If server returns HTML (like ngrok warning page), return error without parsing
        return {
          success: false,
          message: 'Server returned non-JSON response. This might be an error page or the endpoint may not exist.',
          error: `Expected JSON but received ${contentType}. Please check if the API endpoint is correct.`,
        };
      }
      
      // Clone response to read as text first if needed, otherwise parse as JSON
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        // If JSON parsing fails, the response might still be HTML
        return {
          success: false,
          message: 'Failed to parse JSON response. Server may have returned HTML or invalid JSON.',
          error: parseError instanceof Error ? parseError.message : 'JSON parse error',
        };
      }

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

  // Get complete settings
  async getCompleteSettings(): Promise<ApiResponse<CompleteSettings>> {
    return this.request<CompleteSettings>(API_CONFIG.ENDPOINTS.SETTINGS, {
      method: 'GET',
    });
  }

  // Feature Toggles
  async getAllFeatureToggles(): Promise<ApiResponse<FeatureToggle[]>> {
    return this.request<FeatureToggle[]>(API_CONFIG.ENDPOINTS.FEATURE_TOGGLES, {
      method: 'GET',
    });
  }

  async getFeatureToggleByName(featureName: string): Promise<ApiResponse<FeatureToggle>> {
    return this.request<FeatureToggle>(
      API_CONFIG.ENDPOINTS.FEATURE_TOGGLE_BY_NAME.replace(':featureName', featureName),
      {
        method: 'GET',
      }
    );
  }

  async updateFeatureToggle(
    featureName: string,
    update: UpdateFeatureToggleRequest
  ): Promise<ApiResponse<FeatureToggle>> {
    return this.request<FeatureToggle>(
      API_CONFIG.ENDPOINTS.FEATURE_TOGGLE_BY_NAME.replace(':featureName', featureName),
      {
        method: 'PATCH',
        body: JSON.stringify(update),
      }
    );
  }

  async toggleFeature(featureName: string): Promise<ApiResponse<FeatureToggle>> {
    return this.request<FeatureToggle>(
      API_CONFIG.ENDPOINTS.FEATURE_TOGGLE_TOGGLE.replace(':featureName', featureName),
      {
        method: 'PATCH',
      }
    );
  }

  async initializeDefaultFeatureToggles(): Promise<ApiResponse<FeatureToggle[]>> {
    return this.request<FeatureToggle[]>(API_CONFIG.ENDPOINTS.FEATURE_TOGGLES_INITIALIZE, {
      method: 'POST',
    });
  }

  // System Language
  async getSystemLanguage(): Promise<ApiResponse<SystemLanguage>> {
    return this.request<SystemLanguage>(API_CONFIG.ENDPOINTS.SYSTEM_LANGUAGE, {
      method: 'GET',
    });
  }

  async updateSystemLanguage(
    language: string
  ): Promise<ApiResponse<SystemLanguage>> {
    return this.request<SystemLanguage>(API_CONFIG.ENDPOINTS.SYSTEM_LANGUAGE, {
      method: 'PATCH',
      body: JSON.stringify({ language }),
    });
  }

  // System Settings
  async getAllSystemSettings(): Promise<ApiResponse<SystemSettings>> {
    return this.request<SystemSettings>(API_CONFIG.ENDPOINTS.SYSTEM_SETTINGS, {
      method: 'GET',
    });
  }
}

// Export singleton instance
export const settingsAPI = new SettingsAPI();

