import { API_CONFIG } from '../config';
import { cookieUtils } from '../cookies';

export interface ChatSettings {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  // Message Limits
  dailyReset: boolean;
  freeTierMessageLimit: number;
  gracePeriodMessages: number;
  // Upgrade Prompt Text
  upgradePromptText?: string | null;
  // Upgrade Prompt Timings (mutually exclusive booleans)
  showPromptOnLimit: boolean;
  showPromptAfterGrace: boolean;
  showPromptOnReturn: boolean;
  // First Messages
  newUserMessage?: string | null;
  returningUserMessage?: string | null;
}

export interface UpdateChatSettingsRequest extends Partial<ChatSettings> {}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

class ChatSettingsAPI {
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

  // Get chat settings
  async getChatSettings(): Promise<ApiResponse<ChatSettings>> {
    return this.request<ChatSettings>(API_CONFIG.ENDPOINTS.CHAT_SETTINGS, {
      method: 'GET',
    });
  }

  // Update chat settings
  async updateChatSettings(settings: UpdateChatSettingsRequest): Promise<ApiResponse<ChatSettings>> {
    return this.request<ChatSettings>(API_CONFIG.ENDPOINTS.CHAT_SETTINGS, {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  }
}

// Export singleton instance
export const chatSettingsAPI = new ChatSettingsAPI();

