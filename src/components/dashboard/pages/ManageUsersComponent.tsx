"use client";

import React, { useState, useEffect } from "react";
import {
  DataManagementTable,
  TableColumn,
  FormField,
  FilterOption,
  BaseItem,
} from "../DataManagementTable";
import { usersService } from "@/services/users.service";
import { profilesService } from "@/services/profiles.service";
import { Profile } from "@/types/api";
import { Role } from "@/types/auth";
import { Gender } from "@/types/api";

// User interface extending BaseItem - Simple setup as originally specified
interface User extends BaseItem {
  name: string;
  email: string;
  role: string;
}

// Sample data (will be replaced by API data)
const sampleUsers: User[] = [];

const roles = ["ADMIN", "TEACHER", "STUDENT"];
const genders = ["MALE", "FEMALE", "OTHER"];

// Table columns configuration
const userColumns: TableColumn[] = [
  { key: "name", label: "Name", searchable: true },
  { key: "email", label: "Email", searchable: true },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
];

// Form fields configuration - Simple 3-field setup as originally specified
const userFormFields: FormField[] = [
  {
    key: "name",
    label: "Name",
    type: "text",
    required: true,
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    required: true,
  },
  {
    key: "role",
    label: "Role",
    type: "select",
    required: true,
    options: roles,
  },
];

// Filter options configuration
const userFilterOptions: FilterOption[] = [
  { key: "role", label: "Roles", options: roles },
];

// Badge color function
const getUserBadgeColor = (key: string, value: unknown) => {
  if (key === "role") {
    switch (value) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "TEACHER":
        return "bg-blue-100 text-blue-800";
      case "STUDENT":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
  if (key === "status") {
    switch (value) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending_profile":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
  return "bg-gray-100 text-gray-800";
};

export function ManageUsersComponent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the proper getAllUsers method instead of profilesService
      const response = await usersService.getAllUsers({ size: 100 });
      console.log("📊 Raw API Response:", JSON.stringify(response, null, 2));

      // Check if response has the expected structure
      if (!response || !response.content || !Array.isArray(response.content)) {
        throw new Error("Invalid response structure from API");
      }

      console.log("📊 Number of users:", response.content.length);

      // Transform all users (whether they have profiles or not)
      const transformedUsers: User[] = response.content.map(
        (profile: Profile) => {
          // Check if user has profile data
          const hasProfile = profile.firstName && profile.lastName;
          const displayName = hasProfile
            ? `${profile.firstName} ${profile.lastName}`
            : profile.user?.email || "No Name";

          console.log(`📊 User:`, {
            id: profile?.id,
            email: profile?.user?.email,
            role: profile?.user?.role,
            hasProfile: hasProfile,
            displayName: displayName,
          });

          return {
            id: parseInt(profile.id),
            name: displayName,
            email: profile.user?.email || "",
            role: profile.user?.role || "",
            status: hasProfile ? "active" : "pending_profile",
          };
        }
      );

      console.log("📊 Final transformed users:", transformedUsers);
      setUsers(transformedUsers);
    } catch (err) {
      console.error("❌ Failed to load users - full error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load users";
      setError(errorMessage);
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (user: Omit<User, "id">) => {
    try {
      setError(null);

      // Create user account only with default password
      const newUser = await usersService.createUser({
        email: user.email as string,
        password: "password123", // Default password as specified
        role: user.role as Role,
      });

      console.log("User created successfully:", newUser);

      // Note: Profile will be created when user logs in for the first time
      // through the profile guard popup

      // Reload users to get the updated list
      await loadUsers();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add user";
      setError(errorMessage);
      console.error("Failed to add user:", err);
      throw new Error(errorMessage);
    }
  };

  const handleEditUser = async (id: number, userData: Partial<User>) => {
    try {
      setError(null);

      const user = users.find((u) => u.id === id);
      if (!user) {
        throw new Error("User not found");
      }

      // Extract first and last name from the full name
      const nameParts = userData.name
        ? userData.name.split(" ")
        : user.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Update user profile
      await usersService.updateUser(user.id.toString(), {
        firstName: firstName,
        middleName: "",
        lastName: lastName,
        gender: Gender.OTHER,
        birthDate: new Date().toISOString().split("T")[0],
        contactNumber: "",
        address: "",
      });

      console.log("User updated successfully:", id, userData);

      // Reload users to get the updated list
      await loadUsers();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to edit user";
      setError(errorMessage);
      console.error("Failed to edit user:", err);
      throw new Error(errorMessage);
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      setError(null);

      const user = users.find((u) => u.id === id);
      if (!user) {
        throw new Error("User not found");
      }

      await usersService.deleteUser(user.id.toString());

      console.log("User deleted successfully:", id);

      // Reload users to get the updated list
      await loadUsers();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete user";
      setError(errorMessage);
      console.error("Failed to delete user:", err);
      throw new Error(errorMessage);
    }
  };

  const handleToggleUserStatus = async (id: number) => {
    try {
      setError(null);

      const user = users.find((u) => u.id === id);
      if (!user) {
        throw new Error("User not found");
      }

      await usersService.toggleUserStatus(user.id.toString());

      console.log("User status toggled successfully:", id);

      // Reload users to get the updated list
      await loadUsers();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to toggle user status";
      setError(errorMessage);
      console.error("Failed to toggle user status:", err);
      // Don't throw here since this feature might not be implemented in backend yet
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <span className="ml-4 text-gray-600">Loading users...</span>
      </div>
    );
  }

  // Show error state
  if (error && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-red-600 text-lg font-semibold">
          Failed to load users
        </div>
        <div className="text-gray-600">{error}</div>
        <button
          onClick={loadUsers}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="text-red-800 font-medium">Error</div>
          <div className="text-red-600 text-sm">{error}</div>
        </div>
      )}

      <DataManagementTable
        title="Manage Users"
        description="Add, edit, and manage system users including students, teachers, and admins."
        data={users}
        columns={userColumns}
        formFields={userFormFields}
        filterOptions={userFilterOptions}
        onAdd={handleAddUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onStatusToggle={handleToggleUserStatus}
        onRefresh={loadUsers}
        searchPlaceholder="Search users..."
        addButtonText="Add User"
        editModalTitle="Edit User"
        addModalTitle="Add New User"
        editModalDescription="Update the user details below."
        addModalDescription="Fill in the details to create a new user account."
        getBadgeColor={getUserBadgeColor}
        actions={{
          edit: true,
          statusToggle: true,
          delete: true,
        }}
      />
    </>
  );
}
