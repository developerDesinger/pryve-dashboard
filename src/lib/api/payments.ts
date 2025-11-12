import { API_CONFIG } from '../config';
import { cookieUtils } from '../cookies';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Payment data structure
export interface Payment {
  id: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  userAvatar?: string;
  plan?: string;
  planName?: string;
  amount?: number;
  currency?: string;
  status?: string;
  paymentDate?: string;
  createdAt?: string;
  nextBilling?: string;
  nextBillingDate?: string;
  transactionId?: string;
  [key: string]: any; // Allow for additional fields from API
}

// Payment stats structure
export interface PaymentStats {
  monthlyRevenue?: number;
  activeSubscriptions?: number;
  freeUsers?: number;
  failedPayments?: number;
  [key: string]: any; // Allow for additional fields from API
}

// Pagination meta structure
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
}

// Payments response structure
export interface PaymentsResponse {
  data: Payment[];
  meta: PaginationMeta;
}

class PaymentsAPI {
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

  // Get payments with pagination
  async getPayments(page: number = 1, pageSize: number = 50): Promise<ApiResponse<PaymentsResponse>> {
    const endpoint = `${API_CONFIG.ENDPOINTS.REVENUECAT_PAYMENTS}?page=${page}&pageSize=${pageSize}`;
    return this.request<PaymentsResponse>(endpoint, {
      method: 'GET',
    });
  }
}

// Export singleton instance
export const paymentsAPI = new PaymentsAPI();

