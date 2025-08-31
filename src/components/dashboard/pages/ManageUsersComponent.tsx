"use client";

import { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { IconPlus, IconSearch, IconDots } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample data - replace with real data from your backend
const sampleUsers = [
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
    role: "Adviser",
    studentId: "",
    section: "Grade 9-B",
    gradeLevel: "9",
    status: "inactive",
  },
];

const roles = ["Admin", "Teacher", "Adviser", "Student"];
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

export function ManageUsersComponent() {
  const [users, setUsers] = useState(sampleUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    studentId: "",
    section: "",
    gradeLevel: "",
  });

  const nameInputRef = useRef<HTMLInputElement>(null);

  // Prevent auto-selection when modal opens in edit mode
  useEffect(() => {
    if (isModalOpen && isEditMode && nameInputRef.current) {
      // Small delay to ensure the modal is fully rendered
      const timeoutId = setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.blur(); // Remove focus
          // If you want to completely prevent any selection, you can also do:
          nameInputRef.current.setSelectionRange(0, 0);
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [isModalOpen, isEditMode]);

  // Filter users based on search term and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.studentId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "All" || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode && editingUser !== null) {
      // Update existing user
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser ? { ...user, ...formData } : user
        )
      );
    } else {
      // Add new user to the list
      const newUser = {
        id: users.length + 1,
        ...formData,
        status: "active", // New users are active by default
      };
      setUsers((prev) => [...prev, newUser]);
    }

    // Reset form and close modal
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "",
      studentId: "",
      section: "",
      gradeLevel: "",
    });
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingUser(null);
  };

  const handleAddUser = () => {
    // Reset form to ensure clean state for adding new user
    setFormData({
      name: "",
      email: "",
      role: "",
      studentId: "",
      section: "",
      gradeLevel: "",
    });
    setIsEditMode(false);
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      // Modal is being closed - reset form
      resetForm();
    } else {
      setIsModalOpen(open);
    }
  };

  const handleEditUser = (userId: number) => {
    const userToEdit = users.find((user) => user.id === userId);
    if (userToEdit) {
      // Pre-fill the form with existing user data
      setFormData({
        name: userToEdit.name,
        email: userToEdit.email,
        role: userToEdit.role,
        studentId: userToEdit.studentId,
        section: userToEdit.section,
        gradeLevel: userToEdit.gradeLevel,
      });
      setIsEditMode(true);
      setEditingUser(userId);
      setIsModalOpen(true);
    }
  };

  const handleDeactivateUser = (userId: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user
      )
    );
    console.log("Toggled user status:", userId);
  };

  const handleRemoveUser = (userId: number) => {
    // Remove user from the list
    setUsers((prev) => prev.filter((user) => user.id !== userId));
    console.log("Remove user:", userId);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800";
      case "Teacher":
        return "bg-blue-100 text-blue-800";
      case "Adviser":
        return "bg-green-100 text-green-800";
      case "Student":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="bg-card text-card-foreground rounded-xl border shadow-sm">
        <div className="p-6">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              Manage Users
            </h2>
            <p className="text-sm text-muted-foreground">
              Add, edit, and manage system users including students and
              teachers.
            </p>
          </div>
        </div>
        <div className="p-6 pt-0">
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Add User Button */}
            <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
              <DialogTrigger asChild>
                <Button onClick={handleAddUser}>
                  <IconPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {isEditMode ? "Edit User" : "Add New User"}
                  </DialogTitle>
                  <DialogDescription>
                    {isEditMode
                      ? "Update the user details below."
                      : "Fill in the details to create a new user account."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        ref={nameInputRef}
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        autoFocus={false}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) =>
                        handleInputChange("role", value)
                      }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.role === "Student" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="studentId">Student ID *</Label>
                        <Input
                          id="studentId"
                          value={formData.studentId}
                          onChange={(e) =>
                            handleInputChange("studentId", e.target.value)
                          }
                          placeholder="e.g., 2024001"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="section">Section</Label>
                          <Select
                            value={formData.section}
                            onValueChange={(value) =>
                              handleInputChange("section", value)
                            }>
                            <SelectTrigger>
                              <SelectValue placeholder="Select section" />
                            </SelectTrigger>
                            <SelectContent>
                              {sections.map((section) => (
                                <SelectItem key={section} value={section}>
                                  {section}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gradeLevel">Grade Level</Label>
                          <Select
                            value={formData.gradeLevel}
                            onValueChange={(value) =>
                              handleInputChange("gradeLevel", value)
                            }>
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                            <SelectContent>
                              {gradeLevels.map((grade) => (
                                <SelectItem key={grade} value={grade}>
                                  Grade {grade}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {(formData.role === "Teacher" ||
                    formData.role === "Adviser") && (
                    <div className="space-y-2">
                      <Label htmlFor="section">Department/Section</Label>
                      <Input
                        id="section"
                        value={formData.section}
                        onChange={(e) =>
                          handleInputChange("section", e.target.value)
                        }
                        placeholder="e.g., Science Department"
                      />
                    </div>
                  )}

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => resetForm()}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {isEditMode ? "Update User" : "Add User"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(user.status)}>
                          {user.status.charAt(0).toUpperCase() +
                            user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0">
                              <IconDots className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem
                              onClick={() => handleEditUser(user.id)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeactivateUser(user.id)}>
                              {user.status === "active"
                                ? "Deactivate"
                                : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => handleRemoveUser(user.id)}>
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <span>
              Showing {filteredUsers.length} of {users.length} users
            </span>
            <span>{filterRole !== "All" && `Filtered by: ${filterRole}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
