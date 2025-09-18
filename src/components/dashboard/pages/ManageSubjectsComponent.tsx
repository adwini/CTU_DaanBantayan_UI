"use client";

import {
  DataManagementTable,
  TableColumn,
  FormField,
  FilterOption,
  BaseItem,
} from "../DataManagementTable";
import { useEffect, useState } from "react";
import { subjectsService } from "@/services/subjects.service";
import { TableLoading } from "@/components/utils";

// Subject interface extending BaseItem
interface Subject extends BaseItem {
  subjectCode: string;
  subjectName: string;
  uuid?: string; // Store the original UUID from API
}

// Sample data (kept for local UI fallback)
const sampleSubjects: Subject[] = [
  {
    id: 1,
    subjectCode: "MATH101",
    subjectName: "Mathematics",
    status: "active",
  },
  {
    id: 2,
    subjectCode: "ENG101",
    subjectName: "English Language",
    status: "active",
  },
  {
    id: 3,
    subjectCode: "SCI101",
    subjectName: "Science",
    status: "active",
  },
  {
    id: 4,
    subjectCode: "HIST101",
    subjectName: "History",
    status: "active",
  },
  {
    id: 5,
    subjectCode: "PE101",
    subjectName: "Physical Education",
    status: "inactive",
  },
];

// Table columns configuration
const subjectColumns: TableColumn[] = [
  { key: "subjectCode", label: "Subject Code", searchable: true },
  { key: "subjectName", label: "Subject Name", searchable: true },
];

// Form fields configuration
const subjectFormFields: FormField[] = [
  {
    key: "subjectCode",
    label: "Subject Code",
    type: "text",
    required: true,
    placeholder: "e.g., MATH101",
  },
  {
    key: "subjectName",
    label: "Subject Name",
    type: "text",
    required: true,
    placeholder: "e.g., Mathematics",
  },
];

// Filter options configuration
const subjectFilterOptions: FilterOption[] = [];

// Badge color function
const getSubjectBadgeColor = (key: string, value: unknown) => {
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

export function ManageSubjectsComponent() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  // Load subjects function - used for initial load and refresh
  const loadSubjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("🔄 Loading subjects...");

      const apiSubjects = await subjectsService.getAllSubjects();
      console.log("📊 Raw API response:", apiSubjects);

      // Transform API subjects to component subjects
      const transformedSubjects: Subject[] = apiSubjects.map((apiSubject) => {
        console.log("📊 Processing subject:", apiSubject);
        const transformedId = parseInt(apiSubject.id) || Math.random();
        console.log(
          "📊 Transformed ID:",
          transformedId,
          "from UUID:",
          apiSubject.id,
          "preserved UUID:",
          apiSubject.id
        );

        return {
          id: transformedId,
          subjectCode: apiSubject.subjectCode,
          subjectName: apiSubject.name,
          uuid: apiSubject.id, // Preserve original UUID
        };
      });

      setSubjects(transformedSubjects);
      console.log("✅ Subjects loaded successfully:", transformedSubjects);
    } catch (error) {
      console.error("❌ Failed to fetch subjects - detailed error:", error);

      // More detailed error information
      let errorMessage = "Failed to load subjects";
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error("❌ Error message:", error.message);
        console.error("❌ Error stack:", error.stack);
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch subjects on component mount
  useEffect(() => {
    loadSubjects();
  }, []);

  const handleAddSubject = async (subject: Omit<Subject, "id">) => {
    try {
      setError(null);
      // Local duplicate check
      const duplicate = subjects.find(
        (s) =>
          s.subjectCode.trim().toLowerCase() ===
            String(subject.subjectCode).trim().toLowerCase() ||
          s.subjectName.trim().toLowerCase() ===
            String(subject.subjectName).trim().toLowerCase()
      );
      if (duplicate) {
        setError(
          "A subject with this code or name already exists. Please choose a different code or name."
        );
        throw new Error(
          "A subject with this code or name already exists. Please choose a different code or name."
        );
      }
      const newSubjectData = {
        subjectCode: subject.subjectCode as string,
        name: subject.subjectName as string,
      };

      const result = await subjectsService.createSubject(newSubjectData);
      console.log("Subject created:", result);

      // Refresh the subjects list
      await loadSubjects();
    } catch (error) {
      let errorMessage =
        error instanceof Error ? error.message : "Failed to add subject";
      if (
        errorMessage.includes("already exists") ||
        errorMessage.includes("duplicate")
      ) {
        errorMessage =
          "A subject with this code or name already exists. Please choose a different code or name.";
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleEditSubject = async (
    id: number,
    subjectData: Partial<Subject>
  ) => {
    try {
      setError(null);
      // Find the current subject
      const currentSubject = subjects.find((s) => s.id === id);
      if (!currentSubject) {
        throw new Error("Subject not found in local state");
      }
      // Local duplicate check (exclude current subject)
      const duplicate = subjects.find(
        (s) =>
          s.id !== id &&
          (s.subjectCode.trim().toLowerCase() ===
            (subjectData.subjectCode?.trim().toLowerCase() ||
              currentSubject.subjectCode.trim().toLowerCase()) ||
            s.subjectName.trim().toLowerCase() ===
              (subjectData.subjectName?.trim().toLowerCase() ||
                currentSubject.subjectName.trim().toLowerCase()))
      );
      if (duplicate) {
        setError(
          "A subject with this code or name already exists. Please choose a different code or name."
        );
        throw new Error(
          "A subject with this code or name already exists. Please choose a different code or name."
        );
      }

      const updateData = {
        id: currentSubject.uuid || currentSubject.id.toString(), // Use original UUID
        subjectCode:
          (subjectData.subjectCode as string) || currentSubject.subjectCode,
        name: (subjectData.subjectName as string) || currentSubject.subjectName,
        createdAt: new Date().toISOString().slice(0, 19),
        updatedAt: new Date().toISOString().slice(0, 19),
      };

      console.log("📝 Using UUID for update:", currentSubject.uuid);
      console.log("📝 Update data:", updateData);

      console.log("📝 Updating subject with data:", updateData);

      const result = await subjectsService.updateSubject(updateData);
      console.log("✅ Subject updated successfully:", result);

      // Refresh the subjects list
      await loadSubjects();
    } catch (error) {
      let errorMessage =
        error instanceof Error ? error.message : "Failed to edit subject";
      if (
        errorMessage.includes("already exists") ||
        errorMessage.includes("duplicate")
      ) {
        errorMessage =
          "A subject with this code or name already exists. Please choose a different code or name.";
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleDeleteSubject = async (id: number) => {
    // Add to deleting set to show loading state
    setDeletingIds(prev => new Set(prev).add(id));

    try {
      setError(null);

      // Find the subject to get its UUID
      const subject = subjects.find((s) => s.id === id);
      if (!subject) {
        throw new Error("Subject not found in local state");
      }

      console.log("🗑️ Deleting subject with UUID:", subject.uuid);
      console.log("🗑️ Subject details:", subject);

      const deleteId = subject.uuid || subject.id.toString();
      console.log("🗑️ Final delete ID:", deleteId);

      // Make the API call
      await subjectsService.deleteSubject(deleteId);
      console.log("✅ Subject deleted successfully:", deleteId);

      // Only refresh the subjects list after successful deletion
      await loadSubjects();
    } catch (error) {
      console.error("❌ Failed to delete subject - detailed error:", error);

      // More detailed error information
      let errorMessage = "Failed to delete subject";
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error("❌ Error message:", error.message);
        console.error("❌ Error stack:", error.stack);

        // Handle specific error cases
        if (
          errorMessage.includes("403") ||
          errorMessage.toLowerCase().includes("forbidden")
        ) {
          errorMessage =
            "You do not have permission to delete this subject. Please contact your administrator.";
        } else if (
          errorMessage.includes("400") ||
          errorMessage.toLowerCase().includes("bad request")
        ) {
          errorMessage =
            "This subject cannot be deleted as it may be in use by classes, grades, or other records.";
        }
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      // Remove from deleting set regardless of success/failure
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // Show loading state
  if (isLoading) {
    return <TableLoading text="Loading subjects..." />;
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading subjects</p>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <DataManagementTable
      title="Manage Subjects"
      description="Add, edit, and manage academic subjects."
      data={subjects}
      columns={subjectColumns}
      formFields={subjectFormFields}
      filterOptions={subjectFilterOptions}
      onAdd={handleAddSubject}
      onEdit={handleEditSubject}
      onDelete={handleDeleteSubject}
      onRefresh={loadSubjects}
      searchPlaceholder="Search subjects..."
      addButtonText="Add Subject"
      editModalTitle="Edit Subject"
      addModalTitle="Add New Subject"
      editModalDescription="Update the subject details below."
      addModalDescription="Fill in the details to create a new subject."
      getBadgeColor={getSubjectBadgeColor}
      actions={{
        edit: true,
        statusToggle: false,
        delete: true,
      }}
    />
  );
}
