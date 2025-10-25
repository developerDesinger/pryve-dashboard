import { API_CONFIG, getApiUrl } from '@/lib/config';

// API Response types
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// AI Configuration types
interface AIConfig {
  id?: string;
  systemPrompt?: string;
  systemPromptActive?: boolean;
  contextNeededMessage?: string;
  contextNeededActive?: boolean;
  technicalErrorMessage?: string;
  technicalErrorActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// API service class for AI configuration
class AIConfigAPI {
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
          'Content-Type': 'application/json',
          ...options.headers,
        },
      };

      const response = await fetch(url, config);
      const data = await response.json();

      // Check if the response contains success field (API response format)
      if (data.hasOwnProperty('success')) {
        const result = {
          success: data.success,
          message: data.message || (data.success ? 'Success' : 'An error occurred'),
          data: data.success ? (data.data || data) as T : undefined,
          error: data.error || (!data.success ? data.message : undefined),
        };
        return result;
      }

      // Fallback to HTTP status check
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

  // Get AI configuration
  async getAIConfig(token: string): Promise<ApiResponse<AIConfig>> {
    return this.request<AIConfig>(API_CONFIG.ENDPOINTS.AI_CONFIG, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Update AI configuration
  async updateAIConfig(
    token: string,
    configData: Partial<AIConfig>
  ): Promise<ApiResponse<AIConfig>> {
    return this.request<AIConfig>(API_CONFIG.ENDPOINTS.AI_CONFIG, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(configData),
    });
  }

  // Create AI configuration (if it doesn't exist)
  async createAIConfig(
    token: string,
    configData: Omit<AIConfig, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<AIConfig>> {
    return this.request<AIConfig>(API_CONFIG.ENDPOINTS.AI_CONFIG, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(configData),
    });
  }
}

// Export singleton instance
export const aiConfigAPI = new AIConfigAPI();
export type { ApiResponse, AIConfig };
