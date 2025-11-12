import { API_CONFIG } from '../config';
import { cookieUtils } from '../cookies';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Emotion item from API
export interface EmotionItem {
  emotion: string;
  count: number;
  percentage: number;
}

// First message starter item from API
export interface FirstMessageStarterItem {
  message: string;
  count: number;
  percentage: number;
}

// Filters applied
export interface FiltersApplied {
  userId: string | null;
  chatId: string | null;
  startDate: string | null;
  endDate: string | null;
}

// Complete analytics response structure
export interface EmotionsAnalyticsResponse {
  totalMessages: number;
  totalCategorized: number;
  includeAI: boolean;
  filtersApplied: FiltersApplied;
  emotions: EmotionItem[];
  firstMessageStarters: {
    total: number;
    items: FirstMessageStarterItem[];
  };
}

class AnalyticsAPI {
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

  // Get emotions analytics
  async getEmotionsAnalytics(): Promise<ApiResponse<EmotionsAnalyticsResponse>> {
    return this.request<EmotionsAnalyticsResponse>(API_CONFIG.ENDPOINTS.ANALYTICS_EMOTIONS, {
      method: 'GET',
    });
  }
}

// Export singleton instance
export const analyticsAPI = new AnalyticsAPI();

