/**
 * API Client Service
 * Centralized HTTP client for all API requests
 * Handles authentication, error handling, and request formatting
 */

export interface ApiClientConfig {
  baseURL?: string;
  includeCredentials?: boolean;
  headers?: Record<string, string>;
}

export interface ApiError extends Error {
  status?: number;
  data?: any;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private includeCredentials: boolean;

  constructor(config: ApiClientConfig = {}) {
    this.baseURL =
      config.baseURL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:4001";
    this.defaultHeaders = config.headers || {};
    this.includeCredentials = config.includeCredentials ?? true;
  }

  /**
   * Make HTTP GET request
   */
  async get<T = any>(
    endpoint: string,
    options: {
      headers?: Record<string, string>;
      includeCredentials?: boolean;
    } = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
      ...options,
    });
  }

  /**
   * Make HTTP POST request
   */
  async post<T = any>(
    endpoint: string,
    body?: any,
    options: {
      headers?: Record<string, string>;
      includeCredentials?: boolean;
    } = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body,
      ...options,
    });
  }

  /**
   * Make HTTP PUT request
   */
  async put<T = any>(
    endpoint: string,
    body?: any,
    options: {
      headers?: Record<string, string>;
      includeCredentials?: boolean;
    } = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body,
      ...options,
    });
  }

  /**
   * Make HTTP PATCH request
   */
  async patch<T = any>(
    endpoint: string,
    body?: any,
    options: {
      headers?: Record<string, string>;
      includeCredentials?: boolean;
    } = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body,
      ...options,
    });
  }

  /**
   * Make HTTP DELETE request
   */
  async delete<T = any>(
    endpoint: string,
    options: {
      headers?: Record<string, string>;
      includeCredentials?: boolean;
    } = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      ...options,
    });
  }

  /**
   * Core request method
   */
  private async request<T>(
    endpoint: string,
    options: {
      method: string;
      body?: any;
      headers?: Record<string, string>;
      includeCredentials?: boolean;
    }
  ): Promise<T> {
    const { method, body, headers = {}, includeCredentials } = options;

    const url = `${this.baseURL}/api${endpoint}`;
    const isFormData = body instanceof FormData;

    try {
      const response = await fetch(url, {
        method,
        headers: isFormData
          ? {
              ...this.defaultHeaders,
              ...headers,
            }
          : {
              "Content-Type": "application/json",
              ...this.defaultHeaders,
              ...headers,
            },
        body:
          method !== "GET" && body
            ? isFormData
              ? body
              : JSON.stringify(body)
            : undefined,
        credentials:
          includeCredentials ?? this.includeCredentials ? "include" : "omit",
      });

      if (!response.ok) {
        let errorMsg = `Error ${response.status}`;

        try {
          const errorData = await response.json();
          errorMsg = errorData?.message || errorData?.error || errorMsg;
        } catch {
          // If error response is not JSON, use status text
          errorMsg = response.statusText || errorMsg;
        }

        const error = new Error(errorMsg) as ApiError;
        error.status = response.status;
        throw error;
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred");
    }
  }
}

/**
 * Create a new API client instance
 */
export function createApiClient(config?: ApiClientConfig): ApiClient {
  return new ApiClient(config);
}

/**
 * Default API client instance
 */
export const apiClient = createApiClient();
