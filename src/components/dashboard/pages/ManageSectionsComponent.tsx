"use client";

import {
  DataManagementTable,
  TableColumn,
  FormField,
  FilterOption,
  BaseItem,
} from "../DataManagementTable";
import { useEffect, useState } from "react";
import { sectionsService } from "@/services/sections.service";
import { profilesService } from "@/services/profiles.service";
import { Section as ApiSection, Profile } from "@/types/api";

// Section interface extending BaseItem
interface Section extends BaseItem {
  sectionName: string;
  gradeLevel: string;
  adviserId: string;
  adviserName: string; // This will be populated based on adviserId
}

// Sample advisers data (you would fetch this from your API)
const availableAdvisers = [
  { id: "1", name: "Mr. John Doe" },
  { id: "2", name: "Ms. Jane Smith" },
  { id: "3", name: "Dr. Robert Brown" },
  { id: "4", name: "Mrs. Sarah Wilson" },
];

// Sample data
const sampleSections: Section[] = [
  {
    id: 1,
    sectionName: "Grade 7-A",
    gradeLevel: "7",
    adviserId: "1",
    adviserName: "Mr. John Doe",
    status: "active",
  },
  {
    id: 2,
    sectionName: "Grade 7-B",
    gradeLevel: "7",
    adviserId: "2",
    adviserName: "Ms. Jane Smith",
    status: "active",
  },
  {
    id: 3,
    sectionName: "Grade 8-A",
    gradeLevel: "8",
    adviserId: "3",
    adviserName: "Dr. Robert Brown",
    status: "active",
  },
  {
    id: 4,
    sectionName: "Grade 8-B",
    gradeLevel: "8",
    adviserId: "4",
    adviserName: "Mrs. Sarah Wilson",
    status: "inactive",
  },
];

const gradeLevels = ["7", "8", "9", "10", "11", "12"];

// Table columns configuration
const sectionColumns: TableColumn[] = [
  { key: "sectionName", label: "Section Name", searchable: true },
  { key: "gradeLevel", label: "Grade Level" },
  { key: "adviserName", label: "Adviser Name", searchable: true },
];

// Form fields configuration
const sectionFormFields: FormField[] = [
  {
    key: "sectionName",
    label: "Section Name",
    type: "text",
    required: true,
    placeholder: "e.g., Grade 7-A",
  },
  {
    key: "gradeLevel",
    label: "Grade Level",
    type: "select",
    required: true,
    options: gradeLevels.map((grade) => ({
      label: `Grade ${grade}`,
      value: grade,
    })),
  },
  {
    key: "adviserId",
    label: "Adviser ID",
    type: "select",
    required: true,
    options: availableAdvisers.map((adviser) => ({
      label: `${adviser.name} (ID: ${adviser.id})`,
      value: adviser.id,
    })),
  },
];

// Filter options configuration
const sectionFilterOptions: FilterOption[] = [
  {
    key: "gradeLevel",
    label: "Grade Levels",
    options: gradeLevels.map((grade) => ({
      label: `Grade ${grade}`,
      value: grade,
    })),
  },
];

// Badge color function
const getSectionBadgeColor = (key: string, value: unknown) => {
  if (key === "gradeLevel") {
    const gradeNum = parseInt(value as string);
    if (gradeNum <= 8) {
      return "bg-blue-100 text-blue-800";
    } else if (gradeNum <= 10) {
      return "bg-green-100 text-green-800";
    } else {
      return "bg-purple-100 text-purple-800";
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

export function ManageSectionsComponent() {
  const [sections, setSections] = useState<Section[]>([]);
  const [advisers, setAdvisers] = useState<Array<{ id: string; name: string }>>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch sections and advisers on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch sections and teachers in parallel
        const [sectionsResponse, teachersResponse] = await Promise.all([
          sectionsService.getAllSections(),
          profilesService.getAllTeachers(),
        ]);

        // Transform API sections to component sections
        const transformedSections: Section[] = sectionsResponse.map(
          (apiSection) => ({
            id: parseInt(apiSection.id) || Math.random(),
            sectionName: apiSection.name,
            gradeLevel: apiSection.gradeLevel,
            adviserId: apiSection.id, // Using section ID as a placeholder
            adviserName: apiSection.adviser,
          })
        );

        // Transform teachers to adviser options
        const adviserOptions = teachersResponse.map((teacher) => ({
          id: teacher.id,
          name: `${teacher.firstName} ${teacher.lastName}`,
        }));

        setSections(transformedSections);
        setAdvisers(adviserOptions);
      } catch (error) {
        console.error("Failed to fetch sections data:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load sections data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddSection = async (
    section: Omit<Section, "id" | "adviserName">
  ) => {
    try {
      // Find the adviser name based on adviserId
      const adviser = advisers.find((a) => a.id === section.adviserId);

      const newSectionData = {
        name: section.sectionName as string,
        gradeLevel: section.gradeLevel as string,
        adviser: adviser?.name || "Unknown Adviser",
      };

      const result = await sectionsService.createSection(newSectionData);
      console.log("Section created:", result);

      // Refresh the sections list
      const updatedSections = await sectionsService.getAllSections();
      const transformedSections: Section[] = updatedSections.map(
        (apiSection) => ({
          id: parseInt(apiSection.id) || Math.random(),
          sectionName: apiSection.name,
          gradeLevel: apiSection.gradeLevel,
          adviserId: apiSection.id,
          adviserName: apiSection.adviser,
        })
      );
      setSections(transformedSections);
    } catch (error) {
      console.error("Failed to add section:", error);
      setError(
        error instanceof Error ? error.message : "Failed to add section"
      );
    }
  };

  const handleEditSection = async (
    id: number,
    sectionData: Partial<Section>
  ) => {
    try {
      // Find the current section
      const currentSection = sections.find((s) => s.id === id);
      if (!currentSection) return;

      // Update adviser name if adviserId is being updated
      let adviserName = currentSection.adviserName;
      if (sectionData.adviserId) {
        const adviser = advisers.find((a) => a.id === sectionData.adviserId);
        adviserName = adviser?.name || "Unknown Adviser";
      }

      const updateData = {
        id: currentSection.adviserId, // Using the stored adviserId as the actual section ID
        name: sectionData.sectionName || currentSection.sectionName,
        gradeLevel: sectionData.gradeLevel || currentSection.gradeLevel,
        adviser: adviserName,
        createdAt: new Date().toISOString().slice(0, 19),
        updatedAt: new Date().toISOString().slice(0, 19),
      };

      const result = await sectionsService.updateSection(
        currentSection.adviserId,
        updateData
      );
      console.log("Section updated:", result);

      // Refresh the sections list
      const updatedSections = await sectionsService.getAllSections();
      const transformedSections: Section[] = updatedSections.map(
        (apiSection) => ({
          id: parseInt(apiSection.id) || Math.random(),
          sectionName: apiSection.name,
          gradeLevel: apiSection.gradeLevel,
          adviserId: apiSection.id,
          adviserName: apiSection.adviser,
        })
      );
      setSections(transformedSections);
    } catch (error) {
      console.error("Failed to edit section:", error);
      setError(
        error instanceof Error ? error.message : "Failed to edit section"
      );
    }
  };

  const handleDeleteSection = async (id: number) => {
    try {
      const section = sections.find((s) => s.id === id);
      if (!section) return;

      await sectionsService.deleteSection(section.adviserId);
      console.log("Section deleted:", id);

      // Remove from local state
      setSections(sections.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to delete section:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete section"
      );
    }
  };

  const handleViewSection = (id: number) => {
    console.log("View section details:", id);
    // Here you would typically navigate to a section details page or open a modal
  };

  // Update form fields with real adviser data
  const updatedFormFields: FormField[] = [
    {
      key: "sectionName",
      label: "Section Name",
      type: "text",
      required: true,
      placeholder: "e.g., Grade 7-A",
    },
    {
      key: "gradeLevel",
      label: "Grade Level",
      type: "select",
      required: true,
      options: gradeLevels.map((grade) => ({
        label: `Grade ${grade}`,
        value: grade,
      })),
    },
    {
      key: "adviserId",
      label: "Adviser",
      type: "select",
      required: true,
      options: advisers.map((adviser) => ({
        label: adviser.name,
        value: adviser.id,
      })),
    },
  ];

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <span className="ml-2 text-gray-600">Loading sections data...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading sections data</p>
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
      title="Manage Sections"
      description="Add, edit, and manage class sections and their advisers."
      data={sections}
      columns={sectionColumns}
      formFields={updatedFormFields}
      filterOptions={sectionFilterOptions}
      onAdd={handleAddSection}
      onEdit={handleEditSection}
      onDelete={handleDeleteSection}
      searchPlaceholder="Search sections..."
      addButtonText="Add Section"
      editModalTitle="Edit Section"
      addModalTitle="Add New Section"
      editModalDescription="Update the section details below."
      addModalDescription="Fill in the details to create a new section."
      getBadgeColor={getSectionBadgeColor}
      actions={{
        edit: true,
        statusToggle: false,
        delete: true,
      }}
    />
  );
}
