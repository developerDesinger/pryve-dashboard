import { API_CONFIG } from "../config";

export interface FavoriteMessage {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

class MemoryAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  async getFavoriteMessagesByUserId(
    token: string,
    userId: string
  ): Promise<ApiResponse<FavoriteMessage[]>> {
    const url = `${
      this.baseURL
    }/api/v1/chats/favorites/messages/${encodeURIComponent(userId)}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...API_CONFIG.DEFAULT_HEADERS,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data?.message || "Failed to fetch favorite messages",
          error: data?.error || "Unknown error",
        };
      }
      return {
        success: !!data?.success || true,
        message: data?.message || "Success",
        data: (data?.data ?? data) as FavoriteMessage[],
      };
    } catch (error) {
      return {
        success: false,
        message: "Network error occurred",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

export const memoryAPI = new MemoryAPI();
export type {};
