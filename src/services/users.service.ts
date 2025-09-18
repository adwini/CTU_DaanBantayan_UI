/**
 * Users service for handling all user management operations
 */

import { apiClient, ApiError } from "@/lib/api-client";
import {
  Profile,
  ProfileSearchParams,
  ApiPaginatedResponse,
  ApiSuccessResponse,
  SystemUser,
  SystemUsersResponse,
  UserSearchParams,
} from "@/types/api";
import { RegisterRequest, Role } from "@/types/auth";

/**
 * Users service class for admin user management
 */
class UsersService {
  /**
   * Create a new user account
   */
  async createUser(userData: RegisterRequest): Promise<string> {
    try {
      console.log("👤 Creating user account with data:", userData);
      console.log("📡 Making POST request to: /api/users");

      const response = await apiClient.post<string>("/api/users", userData);

      console.log("✅ User creation response:", response);
      console.log("✅ User creation response data:", response.data);

      return response.data;
    } catch (error) {
      console.error("❌ Create user failed:", error);
      if (error instanceof ApiError) {
        console.error("❌ API Error details:", {
          status: error.status,
          message: error.message,
          details: error.details,
        });
      }
      throw error;
    }
  }

  /**
   * Get all users with profiles (paginated)
   */
  async getAllUsers(
    params: ProfileSearchParams = {}
  ): Promise<ApiPaginatedResponse<Profile>> {
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

      console.log("📡 Making GET request to:", url);
      console.log("📡 Query params:", Object.fromEntries(queryParams));

      const response = await apiClient.get<ApiPaginatedResponse<Profile>>(url);

      console.log("📊 Profiles API response:", response);
      console.log("📊 Profiles response data:", response.data);
      console.log(
        "📊 Number of profiles in response:",
        response.data.content?.length || 0
      );

      return response.data;
    } catch (error) {
      console.error("❌ getAllUsers failed:", error);
      if (error instanceof ApiError) {
        console.error("❌ API Error details:", {
          status: error.status,
          message: error.message,
          details: error.details,
        });
      }
      throw error;
    }
  }

  /**
   * Get all system users (authentication users) with optional profile data
   * Requires backend implementation of GET /api/users endpoint
   */
  async getAllSystemUsers(
    params: UserSearchParams = {}
  ): Promise<SystemUsersResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params.email) queryParams.append("email", params.email);
      if (params.role) queryParams.append("role", params.role);
      if (params.name) queryParams.append("name", params.name);
      if (params.page !== undefined)
        queryParams.append("page", params.page.toString());
      if (params.size !== undefined)
        queryParams.append("size", params.size.toString());

      const url = `/api/users${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await apiClient.get<SystemUsersResponse>(url);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(this.getErrorMessage(error));
      }
      throw new Error("Failed to get system users");
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<Profile> {
    try {
      const response = await apiClient.get<Profile>(`/api/profiles/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(this.getErrorMessage(error));
      }
      throw new Error("Failed to get user");
    }
  }

  /**
   * Update user profile
   */
  async updateUser(
    id: string,
    userData: {
      firstName: string;
      middleName?: string;
      lastName: string;
      gender: "MALE" | "FEMALE" | "OTHER";
      birthDate: string;
      contactNumber: string;
      address: string;
    }
  ): Promise<string> {
    try {
      const response = await apiClient.put<ApiSuccessResponse>(
        `/api/profiles/${id}`,
        {
          id,
          ...userData,
        }
      );
      return response.data.message;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(this.getErrorMessage(error));
      }
      throw new Error("Failed to update user");
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<string> {
    try {
      const response = await apiClient.delete<ApiSuccessResponse>(
        `/api/profiles/${id}`
      );
      return response.data.message;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(this.getErrorMessage(error));
      }
      throw new Error("Failed to delete user");
    }
  }

  /**
   * Toggle user status (activate/deactivate)
   * Note: This functionality might need backend implementation
   */
  async toggleUserStatus(id: string): Promise<string> {
    try {
      // Using PUT instead of PATCH since patch method doesn't exist
      const response = await apiClient.put<ApiSuccessResponse>(
        `/api/users/${id}/status`,
        {}
      );
      return response.data.message;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(this.getErrorMessage(error));
      }
      throw new Error("Failed to toggle user status");
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<{
    totalUsers: number;
    totalTeachers: number;
    totalStudents: number;
    totalAdmins: number;
    activeUsers: number;
    inactiveUsers: number;
  }> {
    try {
      const [allUsers, teachers, students, admins] = await Promise.all([
        this.getAllUsers({ size: 1 }),
        this.getAllUsers({ role: "TEACHER", size: 1 }),
        this.getAllUsers({ role: "STUDENT", size: 1 }),
        this.getAllUsers({ role: "ADMIN", size: 1 }),
      ]);

      return {
        totalUsers: allUsers.totalElements,
        totalTeachers: teachers.totalElements,
        totalStudents: students.totalElements,
        totalAdmins: admins.totalElements,
        activeUsers: allUsers.totalElements, // This needs backend support for status filtering
        inactiveUsers: 0, // This needs backend support for status filtering
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search users by name
   */
  async searchUsers(
    searchTerm: string,
    role?: string,
    page = 0,
    size = 10
  ): Promise<ApiPaginatedResponse<Profile>> {
    try {
      return await this.getAllUsers({
        name: searchTerm,
        role,
        page,
        size,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Extract error message from ApiError
   */
  private getErrorMessage(error: ApiError): string {
    // The ApiError class already has the processed message and details
    if (error.details) {
      // If the error details has a message, use it
      if (typeof error.details === "string") {
        return error.details;
      }
      if (
        error.details &&
        typeof error.details === "object" &&
        "message" in error.details
      ) {
        return error.details.message as string;
      }
    }
    return error.message || "An unexpected error occurred";
  }
}

// Create and export singleton instance
export const usersService = new UsersService();

// Export the class for testing
export { UsersService };
