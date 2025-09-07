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
      // Add userId as query parameter as per API documentation
      const url = `/api/auth/refresh?userId=${encodeURIComponent(userId)}`;
      const response = await apiClient.post<string>(url);

      return response.data;
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
   * Added timeout to prevent long waits that cause logout on refresh
   */
  async checkAuthStatus(): Promise<AuthStatusResponse> {
    // Create a timeout promise to limit auth verification time
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Auth verification timeout"));
      }, 5000); // 5 second timeout
    });

    try {
      console.log("🔍 Checking authentication status with 5s timeout...");

      // Race between auth check and timeout
      const authCheck = this.performAuthCheck();
      const result = await Promise.race([authCheck, timeoutPromise]);
      return result;
    } catch (error) {
      console.warn("❌ Auth status check failed:", error);
      throw error;
    }
  }

  /**
   * Perform the actual authentication check
   */
  private async performAuthCheck(): Promise<AuthStatusResponse> {
    try {
      // Try to get current user profile first
      try {
        const profile = await this.getCurrentUser();
        console.log(
          "✅ Authentication check successful with profile:",
          profile
        );
        return {
          isAuthenticated: true,
          user: profile.user,
          profile: profile,
        };
      } catch (profileError) {
        console.log(
          "⚠️ Profile fetch failed (likely admin without profile):",
          profileError
        );

        // If profile fails, try to make any authenticated request to verify JWT is valid
        // We'll try a few different endpoints to see if we're still authenticated
        try {
          // Try the teachers endpoint first
          await apiClient.get("/api/teachers");
          console.log(
            "✅ Authentication verified via teachers endpoint - user is authenticated but has no profile"
          );

          // If we have saved user info in localStorage, use it
          if (typeof window !== "undefined") {
            const savedState = localStorage.getItem("ctu_auth_state");
            if (savedState) {
              try {
                const parsed = JSON.parse(savedState);
                if (parsed.user) {
                  console.log("✅ Using saved user info from localStorage");
                  return {
                    isAuthenticated: true,
                    user: parsed.user,
                    profile: undefined,
                  };
                }
              } catch (e) {
                console.warn("Failed to parse saved auth state");
              }
            }
          }

          // Fallback: authenticated but no user info available
          return {
            isAuthenticated: true,
            user: undefined,
            profile: undefined,
          };
        } catch (teachersError) {
          console.log("❌ Teachers endpoint also failed, trying subjects...");

          try {
            // Try subjects endpoint as another fallback
            await apiClient.get("/api/subjects");
            console.log("✅ Authentication verified via subjects endpoint");

            // Same logic as above - try to get user from localStorage
            if (typeof window !== "undefined") {
              const savedState = localStorage.getItem("ctu_auth_state");
              if (savedState) {
                try {
                  const parsed = JSON.parse(savedState);
                  if (parsed.user) {
                    console.log("✅ Using saved user info from localStorage");
                    return {
                      isAuthenticated: true,
                      user: parsed.user,
                      profile: undefined,
                    };
                  }
                } catch (e) {
                  console.warn("Failed to parse saved auth state");
                }
              }
            }

            return {
              isAuthenticated: true,
              user: undefined,
              profile: undefined,
            };
          } catch (subjectsError) {
            console.log(
              "❌ All authentication verification attempts failed:",
              subjectsError
            );
            throw subjectsError;
          }
        }
      }
    } catch (error) {
      console.log("❌ Authentication check failed:", error);
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
      const response = await apiClient.get<ProfileResponse[]>("/api/teachers");
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
