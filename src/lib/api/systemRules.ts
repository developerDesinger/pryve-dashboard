import { API_CONFIG, getApiUrl } from "@/lib/config";

export interface SystemRule {
  id?: string;
  name: string;
  category: string;
  ruleType: string;
  content: string;
  description: string;
  isActive: boolean;
  priority: number;
  severity: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SystemRuleResponse {
  success: boolean;
  message: string;
  data?: SystemRule;
}

export interface SystemRulesListResponse {
  success: boolean;
  message: string;
  data?: {
    data: SystemRule[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      limit: number;
    };
  };
}

export const systemRulesAPI = {
  // Get all system rules with pagination and filtering
  async getSystemRules(
    token: string,
    page: number = 1,
    limit: number = 10,
    category?: string
  ): Promise<SystemRulesListResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (category) {
        params.append('category', category);
      }

      const response = await fetch(`${getApiUrl('/api/v1/system-rules')}?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to fetch system rules',
        };
      }

      // Transform the response to match our expected format
      return {
        success: true,
        message: data.message || 'System rules fetched successfully',
        data: {
          data: data.data || [],
          pagination: {
            currentPage: page,
            totalPages: Math.ceil((data.data?.length || 0) / limit),
            totalItems: data.data?.length || 0,
            limit: limit,
          },
        },
      };
    } catch (error) {
      console.error('Error fetching system rules:', error);
      return {
        success: false,
        message: 'Network error occurred while fetching system rules',
      };
    }
  },

  // Get active system rules only
  async getActiveSystemRules(token: string): Promise<SystemRulesListResponse> {
    try {
      const response = await fetch(`${getApiUrl('/api/v1/system-rules/active')}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to fetch active system rules',
        };
      }

      return {
        success: true,
        message: data.message || 'Active system rules fetched successfully',
        data: {
          data: data.data || [],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: data.data?.length || 0,
            limit: data.data?.length || 0,
          },
        },
      };
    } catch (error) {
      console.error('Error fetching active system rules:', error);
      return {
        success: false,
        message: 'Network error occurred while fetching active system rules',
      };
    }
  },

  // Get system rules by category
  async getSystemRulesByCategory(token: string, category: string): Promise<SystemRulesListResponse> {
    try {
      const response = await fetch(`${getApiUrl('/api/v1/system-rules/category')}/${category}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to fetch system rules by category',
        };
      }

      return {
        success: true,
        message: data.message || 'System rules fetched successfully',
        data: {
          data: data.data || [],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: data.data?.length || 0,
            limit: data.data?.length || 0,
          },
        },
      };
    } catch (error) {
      console.error('Error fetching system rules by category:', error);
      return {
        success: false,
        message: 'Network error occurred while fetching system rules',
      };
    }
  },

  // Get single system rule by ID
  async getSystemRuleById(token: string, id: string): Promise<SystemRuleResponse> {
    try {
      const response = await fetch(`${getApiUrl('/api/v1/system-rules')}/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to fetch system rule',
        };
      }

      return {
        success: true,
        message: data.message || 'System rule fetched successfully',
        data: data.data,
      };
    } catch (error) {
      console.error('Error fetching system rule:', error);
      return {
        success: false,
        message: 'Network error occurred while fetching system rule',
      };
    }
  },

  // Create new system rule
  async createSystemRule(token: string, rule: Omit<SystemRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<SystemRuleResponse> {
    try {
      const response = await fetch(`${getApiUrl('/api/v1/system-rules')}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rule),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to create system rule',
        };
      }

      return {
        success: true,
        message: data.message || 'System rule created successfully',
        data: data.data,
      };
    } catch (error) {
      console.error('Error creating system rule:', error);
      return {
        success: false,
        message: 'Network error occurred while creating system rule',
      };
    }
  },

  // Update system rule
  async updateSystemRule(token: string, id: string, updates: Partial<SystemRule>): Promise<SystemRuleResponse> {
    try {
      const response = await fetch(`${getApiUrl('/api/v1/system-rules')}/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to update system rule',
        };
      }

      return {
        success: true,
        message: data.message || 'System rule updated successfully',
        data: data.data,
      };
    } catch (error) {
      console.error('Error updating system rule:', error);
      return {
        success: false,
        message: 'Network error occurred while updating system rule',
      };
    }
  },

  // Toggle system rule status
  async toggleSystemRule(token: string, id: string): Promise<SystemRuleResponse> {
    try {
      const response = await fetch(`${getApiUrl('/api/v1/system-rules')}/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to toggle system rule status',
        };
      }

      return {
        success: true,
        message: data.message || 'System rule status updated successfully',
        data: data.data,
      };
    } catch (error) {
      console.error('Error toggling system rule status:', error);
      return {
        success: false,
        message: 'Network error occurred while updating system rule status',
      };
    }
  },

  // Delete system rule
  async deleteSystemRule(token: string, id: string): Promise<SystemRuleResponse> {
    try {
      const response = await fetch(`${getApiUrl('/api/v1/system-rules')}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to delete system rule',
        };
      }

      return {
        success: true,
        message: data.message || 'System rule deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting system rule:', error);
      return {
        success: false,
        message: 'Network error occurred while deleting system rule',
      };
    }
  },
};