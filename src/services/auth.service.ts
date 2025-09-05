/**
 * Authentication service for handling all authentication-related API calls
 */

import { apiClient, ApiError } from "@/lib/api-client";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserResponse,
  ProfileResponse,
  AuthStatusResponse,
  RefreshTokenResponse,
} from "@/types/auth";

/**
 * Authentication service class
 */
class AuthenticationService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        "/api/auth/session",
        credentials
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(this.getErrorMessage(error));
      }
      throw new Error("An unexpected error occurred during login");
    }
  }

  /**
   * Register a new user
   */
  async register(userData: RegisterRequest): Promise<string> {
    try {
      const response = await apiClient.post<string>("/api/users", userData);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(this.getErrorMessage(error));
      }
      throw new Error("An unexpected error occurred during registration");
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post<string>("/api/auth/logout");
    } catch (error) {
      // Even if logout fails on the server, we should clear local state
      console.error("Logout error:", error);
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(userId: string): Promise<string> {
    try {
      const response = await apiClient.post<string>("/api/auth/refresh", null, {
        "Content-Type": "application/x-www-form-urlencoded",
      });

      // Add userId as query parameter
      const url = `/api/auth/refresh?userId=${encodeURIComponent(userId)}`;
      const refreshResponse = await apiClient.post<string>(url);

      return refreshResponse.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(this.getErrorMessage(error));
      }
      throw new Error("Failed to refresh token");
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<ProfileResponse> {
    try {
      const response = await apiClient.get<ProfileResponse>("/api/profiles/me");
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(this.getErrorMessage(error));
      }
      throw new Error("Failed to get current user");
    }
  }

  /**
   * Check if user is authenticated by making a request to a protected endpoint
   */
  async checkAuthStatus(): Promise<AuthStatusResponse> {
    try {
      // Try to get current user profile - this will fail if not authenticated
      const profile = await this.getCurrentUser();
      return {
        isAuthenticated: true,
        user: profile.user,
        profile: profile,
      };
    } catch (error) {
      // Silently fail - user is not authenticated
      return {
        isAuthenticated: false,
      };
    }
  }

  /**
   * Get all teachers (for admin/staff use)
   */
  async getAllTeachers(): Promise<ProfileResponse[]> {
    try {
      const response = await apiClient.get<ProfileResponse[]>(
        "/api/users/teachers"
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(this.getErrorMessage(error));
      }
      throw new Error("Failed to get teachers");
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData: any): Promise<string> {
    try {
      const response = await apiClient.post<string>(
        "/api/profiles",
        profileData
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(this.getErrorMessage(error));
      }
      throw new Error("Failed to update profile");
    }
  }

  /**
   * Search profiles (admin function)
   */
  async searchProfiles(
    params: {
      role?: string;
      name?: string;
      page?: number;
      size?: number;
    } = {}
  ): Promise<any> {
    try {
      const queryParams = new URLSearchParams();

      if (params.role) queryParams.append("role", params.role);
      if (params.name) queryParams.append("name", params.name);
      if (params.page !== undefined)
        queryParams.append("page", params.page.toString());
      if (params.size !== undefined)
        queryParams.append("size", params.size.toString());

      const url = `/api/profiles${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(this.getErrorMessage(error));
      }
      throw new Error("Failed to search profiles");
    }
  }

  /**
   * Extract error message from ApiError
   */
  private getErrorMessage(error: ApiError): string {
    // Try to parse error details if it's a JSON string
    if (typeof error.details === "string") {
      try {
        const errorData = JSON.parse(error.details);
        return errorData.message || error.message;
      } catch {
        return error.details || error.message;
      }
    }

    // Handle different error status codes
    switch (error.status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 401:
        return "Invalid credentials. Please check your email and password.";
      case 403:
        return "Access denied. You do not have permission to perform this action.";
      case 404:
        return "Resource not found.";
      case 409:
        return "Email already exists. Please use a different email.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return error.message || "An unexpected error occurred.";
    }
  }

  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Create and export singleton instance
export const authService = new AuthenticationService();

// Export the class for testing
export { AuthenticationService };
