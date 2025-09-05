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
import { Subject as ApiSubject } from "@/types/api";

// Subject interface extending BaseItem
interface Subject extends BaseItem {
  subjectCode: string;
  subjectName: string;
}

// Sample data
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

  // Fetch subjects on component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const apiSubjects = await subjectsService.getAllSubjects();

        // Transform API subjects to component subjects
        const transformedSubjects: Subject[] = apiSubjects.map(
          (apiSubject) => ({
            id: parseInt(apiSubject.id) || Math.random(),
            subjectCode: apiSubject.subjectCode,
            subjectName: apiSubject.name,
          })
        );

        setSubjects(transformedSubjects);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load subjects"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleAddSubject = async (subject: Omit<Subject, "id">) => {
    try {
      const newSubjectData = {
        subjectCode: subject.subjectCode as string,
        name: subject.subjectName as string,
      };

      const result = await subjectsService.createSubject(newSubjectData);
      console.log("Subject created:", result);

      // Refresh the subjects list
      const updatedSubjects = await subjectsService.getAllSubjects();
      const transformedSubjects: Subject[] = updatedSubjects.map(
        (apiSubject) => ({
          id: parseInt(apiSubject.id) || Math.random(),
          subjectCode: apiSubject.subjectCode,
          subjectName: apiSubject.name,
        })
      );
      setSubjects(transformedSubjects);
    } catch (error) {
      console.error("Failed to add subject:", error);
      setError(
        error instanceof Error ? error.message : "Failed to add subject"
      );
    }
  };

  const handleEditSubject = async (
    id: number,
    subjectData: Partial<Subject>
  ) => {
    try {
      // Find the current subject
      const currentSubject = subjects.find((s) => s.id === id);
      if (!currentSubject) return;

      const updateData = {
        id: currentSubject.id.toString(),
        subjectCode:
          (subjectData.subjectCode as string) || currentSubject.subjectCode,
        name: (subjectData.subjectName as string) || currentSubject.subjectName,
        createdAt: new Date().toISOString().slice(0, 19),
        updatedAt: new Date().toISOString().slice(0, 19),
      };

      const result = await subjectsService.updateSubject(updateData);
      console.log("Subject updated:", result);

      // Refresh the subjects list
      const updatedSubjects = await subjectsService.getAllSubjects();
      const transformedSubjects: Subject[] = updatedSubjects.map(
        (apiSubject) => ({
          id: parseInt(apiSubject.id) || Math.random(),
          subjectCode: apiSubject.subjectCode,
          subjectName: apiSubject.name,
        })
      );
      setSubjects(transformedSubjects);
    } catch (error) {
      console.error("Failed to edit subject:", error);
      setError(
        error instanceof Error ? error.message : "Failed to edit subject"
      );
    }
  };

  const handleDeleteSubject = async (id: number) => {
    try {
      await subjectsService.deleteSubject(id.toString());
      console.log("Subject deleted:", id);

      // Remove from local state
      setSubjects(subjects.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to delete subject:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete subject"
      );
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <span className="ml-2 text-gray-600">Loading subjects...</span>
      </div>
    );
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
