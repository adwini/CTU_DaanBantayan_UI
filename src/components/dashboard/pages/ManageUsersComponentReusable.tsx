"use client";

import {
  DataManagementTable,
  TableColumn,
  FormField,
  FilterOption,
  BaseItem,
} from "../DataManagementTable";

// User interface extending BaseItem
interface User extends BaseItem {
  name: string;
  email: string;
  role: string;
}

// Sample data
const sampleUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@school.edu",
    role: "Teacher",
    status: "active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@school.edu",
    role: "Student",
    status: "active",
  },
  {
    id: 3,
    name: "Admin User",
    email: "admin@school.edu",
    role: "Admin",
    status: "active",
  },
  {
    id: 4,
    name: "Mary Johnson",
    email: "mary.johnson@school.edu",
    role: "Student",
    status: "inactive",
  },
];

const roles = ["Admin", "Teacher", "Student"];

// Table columns configuration
const userColumns: TableColumn[] = [
  { key: "name", label: "Name", searchable: true },
  { key: "email", label: "Email", searchable: true },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
];

// Form fields configuration
const userFormFields: FormField[] = [
  { key: "name", label: "Name", type: "text", required: true },
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
      case "Admin":
        return "bg-red-100 text-red-800";
      case "Teacher":
        return "bg-blue-100 text-blue-800";
      case "Student":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
  if (key === "status") {
    switch (value) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
  return "bg-gray-100 text-gray-800";
};

export function ManageUsersComponent() {
  const handleAddUser = (user: Omit<User, "id">) => {
    console.log("Add user:", user);
    // Here you would typically make an API call to add the user
  };

  const handleEditUser = (id: number, userData: Partial<User>) => {
    console.log("Edit user:", id, userData);
    // Here you would typically make an API call to update the user
  };

  const handleDeleteUser = (id: number) => {
    console.log("Delete user:", id);
    // Here you would typically make an API call to delete the user
  };

  const handleToggleUserStatus = (id: number) => {
    console.log("Toggle user status:", id);
    // Here you would typically make an API call to toggle user status
  };

  return (
    <DataManagementTable
      title="Manage Users"
      description="Add, edit, and manage system users including students, teachers, and admins."
      data={sampleUsers}
      columns={userColumns}
      formFields={userFormFields}
      filterOptions={userFilterOptions}
      onAdd={handleAddUser}
      onEdit={handleEditUser}
      onDelete={handleDeleteUser}
      onStatusToggle={handleToggleUserStatus}
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
  );
}
