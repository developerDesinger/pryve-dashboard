import { API_CONFIG } from '../config';
import { cookieUtils } from '../cookies';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: 'BROADCAST' | 'PAYMENT' | 'ACCOUNT';
  eventType?: 'MANUAL' | 'PAYMENT_RECEIVED' | 'PAYMENT_FAILED' | 'USER_REGISTERED';
  isRead: boolean;
  recipientId?: string;
  senderId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedNotifications {
  data: Notification[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
}

export interface BroadcastRequest {
  title: string;
  message: string;
  sendToAll?: boolean;
  recipientIds?: string[];
  category?: 'BROADCAST';
  filters?: {
    role?: string;
    status?: string;
    search?: string;
  };
  metadata?: Record<string, any>;
}

class NotificationsAPI {
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
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      };

      const response = await fetch(url, config);
      
      // Check if response is actually JSON before parsing
      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.includes('application/json')) {
        return {
          success: false,
          message: 'Server returned non-JSON response',
          error: `Expected JSON but received ${contentType}`,
        };
      }
      
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        return {
          success: false,
          message: 'Failed to parse JSON response',
          error: parseError instanceof Error ? parseError.message : 'JSON parse error',
        };
      }

      if (data.hasOwnProperty('success')) {
        return {
          success: data.success,
          message: data.message || (data.success ? 'Success' : 'An error occurred'),
          data: data.success ? (data.data || data) as T : undefined,
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
        data: (data.data || data) as T,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Network error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Send broadcast notification
  async sendBroadcast(broadcastData: BroadcastRequest): Promise<ApiResponse<any>> {
    return this.request<any>(API_CONFIG.ENDPOINTS.NOTIFICATIONS_BROADCAST, {
      method: 'POST',
      body: JSON.stringify(broadcastData),
    });
  }

  // Get notifications
  async getNotifications(params: {
    scope?: 'inbox' | 'sent' | 'all';
    category?: 'BROADCAST' | 'PAYMENT' | 'ACCOUNT';
    eventType?: 'MANUAL' | 'PAYMENT_RECEIVED' | 'PAYMENT_FAILED' | 'USER_REGISTERED';
    page?: number;
    pageSize?: number;
  } = {}): Promise<ApiResponse<PaginatedNotifications>> {
    const queryParams = new URLSearchParams();
    if (params.scope) queryParams.append('scope', params.scope);
    if (params.category) queryParams.append('category', params.category);
    if (params.eventType) queryParams.append('eventType', params.eventType);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    const endpoint = `${API_CONFIG.ENDPOINTS.NOTIFICATIONS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<PaginatedNotifications>(endpoint, {
      method: 'GET',
    });
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<ApiResponse<Notification>> {
    return this.request<Notification>(
      API_CONFIG.ENDPOINTS.NOTIFICATION_MARK_READ.replace(':notificationId', notificationId),
      {
        method: 'PATCH',
      }
    );
  }
}

// Export singleton instance
export const notificationsAPI = new NotificationsAPI();

