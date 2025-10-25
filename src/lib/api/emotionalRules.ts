import { API_CONFIG, getApiUrl } from '@/lib/config';

// API Response types
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Emotional Rule types
interface EmotionalRule {
  id?: string;
  trigger: string;
  responseType: string;
  tone: string;
  description: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

interface PaginatedEmotionalRulesResponse {
  data: EmotionalRule[];
  pagination: PaginationInfo;
}

// API service class for emotional rules
class EmotionalRulesAPI {
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

  // Get all emotional rules with pagination
  async getEmotionalRules(
    token: string,
    page: number = 1,
    limit: number = 10,
    trigger?: string
  ): Promise<ApiResponse<PaginatedEmotionalRulesResponse>> {
    const url = new URL(`${this.baseURL}${API_CONFIG.ENDPOINTS.EMOTIONAL_RULES}`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());
    if (trigger) {
      url.searchParams.append('trigger', trigger);
    }

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.data) {
        return {
          success: data.success,
          message: data.message,
          data: {
            data: data.data as EmotionalRule[],
            pagination: data.pagination || {
              currentPage: page,
              totalPages: 1,
              totalItems: data.data.length,
              limit: limit,
            }
          }
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to fetch emotional rules',
          error: data.message || 'Unknown error',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Get emotional rule by ID
  async getEmotionalRuleById(
    token: string,
    ruleId: string
  ): Promise<ApiResponse<EmotionalRule>> {
    return this.request<EmotionalRule>(`${API_CONFIG.ENDPOINTS.EMOTIONAL_RULE_BY_ID.replace(':id', ruleId)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Create new emotional rule
  async createEmotionalRule(
    token: string,
    ruleData: Omit<EmotionalRule, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<EmotionalRule>> {
    return this.request<EmotionalRule>(API_CONFIG.ENDPOINTS.EMOTIONAL_RULES, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ruleData),
    });
  }

  // Update emotional rule
  async updateEmotionalRule(
    token: string,
    ruleId: string,
    ruleData: Partial<Omit<EmotionalRule, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<ApiResponse<EmotionalRule>> {
    return this.request<EmotionalRule>(`${API_CONFIG.ENDPOINTS.EMOTIONAL_RULE_BY_ID.replace(':id', ruleId)}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ruleData),
    });
  }

  // Delete emotional rule
  async deleteEmotionalRule(
    token: string,
    ruleId: string
  ): Promise<ApiResponse<void>> {
    return this.request<void>(`${API_CONFIG.ENDPOINTS.EMOTIONAL_RULE_BY_ID.replace(':id', ruleId)}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Delete multiple emotional rules
  async deleteEmotionalRules(
    token: string,
    ruleIds: string[]
  ): Promise<ApiResponse<void>> {
    return this.request<void>(API_CONFIG.ENDPOINTS.EMOTIONAL_RULES, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ruleIds }),
    });
  }
}

// Export singleton instance
export const emotionalRulesAPI = new EmotionalRulesAPI();
export type { ApiResponse, EmotionalRule, PaginationInfo, PaginatedEmotionalRulesResponse };
