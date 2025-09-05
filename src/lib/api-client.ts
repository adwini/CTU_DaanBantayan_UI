/**
 * API client configuration for communicating with the CTU backend
 */

import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Debug logging for API base URL
console.log("🔍 API_BASE_URL:", API_BASE_URL);
console.log(
  "🔍 process.env.NEXT_PUBLIC_API_URL:",
  process.env.NEXT_PUBLIC_API_URL
);

/**
 * Custom error class for API-related errors
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * API response wrapper type
 */
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

/**
 * Generic API client for making HTTP requests using Axios
 */
class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string = API_BASE_URL) {
    this.axiosInstance = axios.create({
      baseURL: baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // Request interceptor for debugging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log("🔍 API Request Debug:", {
          url: config.url,
          method: config.method?.toUpperCase(),
          headers: config.headers,
          withCredentials: config.withCredentials,
          data: config.data,
        });
        return config;
      },
      (error) => {
        console.error("🔥 Request Error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for debugging and error handling
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        const isAuthEndpoint =
          response.config.url?.includes("/auth/") ||
          response.config.url?.includes("/profiles/me");

        // Only log response debug for non-auth endpoints or successful requests
        if (!isAuthEndpoint || response.status < 400) {
          console.log("🔍 API Response Debug:", {
            status: response.status,
            statusText: response.statusText,
            url: response.config.url,
            data: response.data,
          });
        }

        return response;
      },
      (error: AxiosError) => {
        const isAuthEndpoint =
          error.config?.url?.includes("/auth/") ||
          error.config?.url?.includes("/profiles/me");
        const isAuthFailure =
          error.response?.status === 401 || error.response?.status === 403;

        // Only log errors for non-auth failures
        if (!isAuthFailure || !isAuthEndpoint) {
          console.error("� API Response Error:", {
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
            data: error.response?.data,
          });
        }

        let errorMessage = `HTTP error! status: ${error.response?.status || 0}`;
        let errorDetails = null;

        if (error.response?.data) {
          if (typeof error.response.data === "string") {
            errorMessage = error.response.data;
            errorDetails = error.response.data;
          } else if (
            typeof error.response.data === "object" &&
            error.response.data &&
            "message" in error.response.data
          ) {
            errorMessage = (error.response.data as any).message;
            errorDetails = error.response.data;
          } else {
            errorDetails = error.response.data;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        throw new ApiError(
          error.response?.status || 0,
          errorMessage,
          errorDetails
        );
      }
    );
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get<T>(endpoint, {
      headers,
    });

    return {
      data: response.data,
      status: response.status,
    };
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post<T>(endpoint, data, {
      headers,
    });

    return {
      data: response.data,
      status: response.status,
    };
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put<T>(endpoint, data, {
      headers,
    });

    return {
      data: response.data,
      status: response.status,
    };
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete<T>(endpoint, {
      headers,
    });

    return {
      data: response.data,
      status: response.status,
    };
  }
}

/**
 * Singleton instance of the API client
 */
export const apiClient = new ApiClient();
