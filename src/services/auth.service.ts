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
   * Get current user profile with enhanced error handling
   */
  async getCurrentUser(): Promise<ProfileResponse> {
    try {
      const response = await apiClient.get<ProfileResponse>("/api/profiles/me");
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        // Check if it's a server error (500) vs not found (404)
        if (error.status === 500) {
          console.warn(
            "🚨 Server error fetching profile - likely database/server issue:",
            error.message
          );
          // For 500 errors, we should retry or handle gracefully
          // Don't immediately assume no profile exists
          throw new Error(
            "Server error fetching profile. Please try refreshing the page."
          );
        } else if (error.status === 404) {
          console.log(
            "📭 No profile found for user (404) - user needs to create profile"
          );
          throw new Error("Profile not found");
        } else if (error.status === 403) {
          console.warn("🔒 Access denied to profile endpoint (403)");
          throw new Error("Access denied to profile");
        } else {
          console.warn(
            "❌ Unexpected error fetching profile:",
            error.status,
            error.message
          );
          throw new Error(this.getErrorMessage(error));
        }
      }
      console.error("💥 Unknown error fetching profile:", error);
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
   * Perform the actual authentication check with smart error handling
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
        // Enhanced error handling - distinguish between server errors and missing profiles
        const errorMessage =
          profileError instanceof Error
            ? profileError.message
            : String(profileError);

        if (errorMessage.includes("Server error fetching profile")) {
          // This is a 500 error - server/database issue, not missing profile
          console.warn(
            "🚨 Server error detected - attempting profile recovery..."
          );

          // First verify we're still authenticated
          try {
            await apiClient.get("/api/teachers");
            console.log(
              "✅ Authentication verified - server error is temporary"
            );

            // User is authenticated, profile likely exists but server can't fetch it
            // Get user info from localStorage and continue
            if (typeof window !== "undefined") {
              const savedState = localStorage.getItem("ctu_auth_state");
              if (savedState) {
                try {
                  const parsed = JSON.parse(savedState);
                  if (parsed.user && parsed.profile) {
                    console.log(
                      "🔄 Using cached profile data during server error"
                    );
                    return {
                      isAuthenticated: true,
                      user: parsed.user,
                      profile: parsed.profile, // Use cached profile
                    };
                  } else if (parsed.user) {
                    console.log(
                      "⚠️ User cached but no profile - will retry profile fetch later"
                    );
                    return {
                      isAuthenticated: true,
                      user: parsed.user,
                      profile: undefined,
                    };
                  }
                } catch (e) {
                  console.warn(
                    "Failed to parse saved auth state during server error"
                  );
                }
              }
            }

            // If no cached data, return authenticated but without profile temporarily
            return {
              isAuthenticated: true,
              user: undefined,
              profile: undefined,
            };
          } catch (authError) {
            console.error(
              "❌ Authentication also failed - user likely logged out"
            );
            throw new Error("Authentication failed");
          }
        } else {
          // This is likely a 404 (no profile) or other client error
          console.log(
            "⚠️ Profile fetch failed (likely user without profile):",
            errorMessage
          );

          // Verify authentication through alternative endpoints
          try {
            // Try the teachers endpoint first
            await apiClient.get("/api/teachers");
            console.log(
              "✅ Authentication verified via teachers endpoint - user is authenticated but has no profile"
            );

            // Get user info from localStorage if available
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
                      profile: undefined, // No profile found
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
