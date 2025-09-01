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
  studentId?: string;
  section?: string;
  gradeLevel?: string;
}

// Sample data
const sampleUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@school.edu",
    role: "Teacher",
    studentId: "",
    section: "Science Dept",
    gradeLevel: "",
    status: "active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@school.edu",
    role: "Student",
    studentId: "2024001",
    section: "Grade 10-A",
    gradeLevel: "10",
    status: "active",
  },
  {
    id: 3,
    name: "Admin User",
    email: "admin@school.edu",
    role: "Admin",
    studentId: "",
    section: "",
    gradeLevel: "",
    status: "active",
  },
  {
    id: 4,
    name: "Mary Johnson",
    email: "mary.johnson@school.edu",
    role: "Student",
    studentId: "2024002",
    section: "Grade 9-B",
    gradeLevel: "9",
    status: "inactive",
  },
];

const roles = ["Admin", "Teacher", "Student"];
const gradeLevels = ["7", "8", "9", "10", "11", "12"];
const sections = [
  "Grade 7-A",
  "Grade 7-B",
  "Grade 8-A",
  "Grade 8-B",
  "Grade 9-A",
  "Grade 9-B",
  "Grade 10-A",
  "Grade 10-B",
];

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
  {
    key: "studentId",
    label: "Student ID",
    type: "text",
    required: true,
    placeholder: "e.g., 2024001",
    dependsOn: "role",
    dependsOnValue: "Student",
  },
  {
    key: "section",
    label: "Section",
    type: "select",
    options: sections,
    dependsOn: "role",
    dependsOnValue: "Student",
    gridColumn: 2,
  },
  {
    key: "gradeLevel",
    label: "Grade Level",
    type: "select",
    options: gradeLevels.map((grade) => ({
      value: grade,
      label: `Grade ${grade}`,
    })),
    dependsOn: "role",
    dependsOnValue: "Student",
    gridColumn: 2,
  },
  {
    key: "section",
    label: "Department/Section",
    type: "text",
    placeholder: "e.g., Science Department",
    dependsOn: "role",
    dependsOnValue: ["Teacher"],
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
      title="Manage Users (Reusable)"
      description="Add, edit, and manage system users including students and teachers."
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
