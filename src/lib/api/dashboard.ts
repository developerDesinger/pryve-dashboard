"use client";

import { API_CONFIG } from "@/lib/config";
import { cookieUtils } from "@/lib/cookies";

export type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

export type DashboardPeriodParam = "daily" | "weekly" | "monthly";

export type TrendPeriod = "Daily" | "Weekly" | "Monthly";

export type DashboardStat = {
  id?: string;
  title: string;
  value: number | string;
  changeText?: string;
  changePercentage?: number;
  changeDirection?: "up" | "down";
  changeClassName?: string;
  icon?: string;
};

export type DashboardOverview = {
  userActivityTrends?: {
    period?: DashboardPeriodParam | string;
    trends?: Array<{
      date?: string;
      label?: string;
      activeUsers?: number;
      messageVolume?: number;
    }>;
    summary?: {
      totalActiveUsers?: number;
      totalMessages?: number;
      averageDailyActiveUsers?: number;
      averageDailyMessages?: number;
    };
  };
  userEngagement?: {
    breakdown?: {
      activeUsers?: number;
      inactiveUsers?: number;
      totalUsers?: number;
    };
    percentages?: {
      activePercentage?: number;
      inactivePercentage?: number;
    };
    recentActivity?: {
      usersWithActivityLast30Days?: number;
      engagementRate?: string;
    };
  };
  emotionalTopicsAnalysis?: {
    summary?: {
      totalMentions?: number;
      positiveTopics?: number;
      avgGrowth?: string;
    };
    topics?: any[];
  };
  recentActivity?: {
    total?: number;
    activities?: any[];
  };
  stats?: DashboardStat[];
};

export type DashboardSummaryResponse = DashboardOverview & {
  period?: DashboardPeriodParam | TrendPeriod;
};

export type ActivityTrendPoint = {
  label: string;
  users: number;
  messages: number;
};

export type ActivityTrendsResponse = {
  period?: TrendPeriod | DashboardPeriodParam | string;
  datasets?: Partial<Record<TrendPeriod, ActivityTrendPoint[]>>;
  points?: ActivityTrendPoint[];
  trends?: Array<Record<string, any>>;
  userActivityTrends?: DashboardOverview["userActivityTrends"];
  [key: string]: any;
};

export type UserEngagementResponse = {
  breakdown?: {
    activeUsers?: number;
    inactiveUsers?: number;
    totalUsers?: number;
  };
  percentages?: {
    activePercentage?: number;
    inactivePercentage?: number;
  };
  recentActivity?: {
    usersWithActivityLast30Days?: number;
    engagementRate?: string;
  };
  activeUsers?: number;
  inactiveUsers?: number;
  active?: number;
  inactive?: number;
  [key: string]: any;
};

export type EmotionalTopic = {
  topic?: string;
  name?: string;
  members?: number;
  mentions?: number;
  percent?: number;
  percentage?: number;
  positiveCount?: number;
  color?: string;
};

export type EmotionalTopicsResponse = {
  summary?: {
    totalMentions?: number;
    positiveTopics?: number;
    avgGrowth?: string;
  };
  topics?: EmotionalTopic[];
  emotionalTopicsAnalysis?: DashboardOverview["emotionalTopicsAnalysis"];
  [key: string]: any;
};

export type RecentActivityItem = {
  id: string;
  name: string;
  desc: string;
  impact: "High Impact" | "Medium" | "Low";
};

export type RecentActivityResponse = {
  items?: RecentActivityItem[];
  activities?: any[];
  total?: number;
  recentActivity?: DashboardOverview["recentActivity"];
  [key: string]: any;
};

type QueryParams = Record<string, string | number | undefined>;

class DashboardAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  private buildUrl(endpoint: string, query?: QueryParams) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    query?: QueryParams
  ): Promise<ApiResponse<T>> {
    try {
      const url = this.buildUrl(endpoint, query);
      const token = cookieUtils.getAuthToken();
      const config: RequestInit = {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...API_CONFIG.DEFAULT_HEADERS,
          ...options.headers,
        },
      };

      const response = await fetch(url.toString(), config);
      const data = await response.json();

      if (data.hasOwnProperty("success")) {
        return {
          success: data.success,
          message:
            data.message || (data.success ? "Success" : "An error occurred"),
          data: data.success ? data.data ?? data : undefined,
          error: data.success ? undefined : data.error || data.message,
        };
      }

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
        data: data.data ?? data,
      };
    } catch (error) {
      return {
        success: false,
        message: "Network error occurred",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getDashboardSummary(period: DashboardPeriodParam = "monthly") {
    return this.request<DashboardSummaryResponse>(
      API_CONFIG.ENDPOINTS.DASHBOARD_SUMMARY,
      { method: "GET" },
      { period }
    );
  }

  async getActivityTrends(period: DashboardPeriodParam = "monthly") {
    return this.request<ActivityTrendsResponse>(
      API_CONFIG.ENDPOINTS.DASHBOARD_ACTIVITY_TRENDS,
      { method: "GET" },
      { period }
    );
  }

  async getUserEngagement() {
    return this.request<UserEngagementResponse>(
      API_CONFIG.ENDPOINTS.DASHBOARD_USER_ENGAGEMENT,
      {
        method: "GET",
      }
    );
  }

  async getEmotionalTopics() {
    return this.request<EmotionalTopicsResponse>(
      API_CONFIG.ENDPOINTS.DASHBOARD_EMOTIONAL_TOPICS,
      {
        method: "GET",
      }
    );
  }

  async getRecentActivity(limit = 20) {
    return this.request<RecentActivityResponse>(
      API_CONFIG.ENDPOINTS.DASHBOARD_RECENT_ACTIVITY,
      { method: "GET" },
      { limit }
    );
  }
}

export const dashboardAPI = new DashboardAPI();
