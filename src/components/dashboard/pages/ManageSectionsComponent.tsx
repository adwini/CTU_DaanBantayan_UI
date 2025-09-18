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
import { TableLoading } from "@/components/utils";

// Adviser object interface for API response
interface AdviserObject {
  id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  fullName?: string;
  [key: string]: unknown; // Allow additional properties
}

// Section interface extending BaseItem
interface Section extends BaseItem {
  sectionName: string;
  gradeLevel: string;
  adviserId: string;
  adviserName: string;
  apiId?: string; // Store the original API ID as string
}

const gradeLevels = ["7", "8", "9", "10", "11", "12"];

// Table columns configuration
const sectionColumns: TableColumn[] = [
  { key: "sectionName", label: "Section Name", searchable: true },
  { key: "gradeLevel", label: "Grade Level" },
  { key: "adviserName", label: "Adviser Name", searchable: true },
];

// Form fields configuration

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

  // Load sections and advisers function - used for initial load and refresh
  const loadSections = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("🔄 Loading sections data...");

      // Fetch sections and teachers in parallel
      const [sectionsResponse, teachersResponse] = await Promise.all([
        sectionsService.getAllSections(),
        profilesService.getAllTeachers(),
      ]);

      // Transform API sections to component sections
      const transformedSections: Section[] = sectionsResponse.map(
        (apiSection) => {
          console.log("🔍 Processing API section:", apiSection);
          console.log("🔍 Adviser field type:", typeof apiSection.adviser);
          console.log("🔍 Adviser field value:", apiSection.adviser);

          // Handle adviser field - could be string or object
          let adviserName = "Unknown Adviser";
          let adviserId = apiSection.id; // Default to section ID

          try {
            if (typeof apiSection.adviser === "string") {
              adviserName = apiSection.adviser;
              console.log("✅ Adviser is string:", adviserName);
            } else if (
              apiSection.adviser &&
              typeof apiSection.adviser === "object" &&
              !Array.isArray(apiSection.adviser)
            ) {
              // If adviser is an object, try to extract name and id
              const adviserObj: AdviserObject = apiSection.adviser;

              // Handle different object structures
              if (adviserObj.firstName && adviserObj.lastName) {
                // Structure: {firstName, lastName, ...}
                adviserName =
                  `${adviserObj.firstName} ${adviserObj.lastName}`.trim();
                adviserId = adviserObj.id || apiSection.id;
                console.log(
                  "✅ Adviser object with firstName/lastName, constructed name:",
                  adviserName
                );
              } else if (adviserObj.name) {
                // Structure: {name, ...}
                adviserName = adviserObj.name;
                adviserId = adviserObj.id || apiSection.id;
                console.log(
                  "✅ Adviser object with name property:",
                  adviserName
                );
              } else if (adviserObj.fullName) {
                // Structure: {fullName, ...}
                adviserName = adviserObj.fullName;
                adviserId = adviserObj.id || apiSection.id;
                console.log(
                  "✅ Adviser object with fullName property:",
                  adviserName
                );
              } else {
                console.log(
                  "❌ Adviser object doesn't have expected name properties:",
                  adviserObj
                );
                adviserName = "Unknown Adviser";
              }
            } else {
              console.log(
                "❌ Adviser field is neither string nor valid object:",
                apiSection.adviser
              );
              adviserName = "Unknown Adviser";
            }
          } catch (error) {
            console.error("🚨 Error processing adviser field:", error);
            adviserName = "Unknown Adviser";
          }

          // Final safeguard: ensure adviserName is always a string
          if (
            typeof adviserName !== "string" ||
            adviserName === "[object Object]"
          ) {
            console.error("🚨 CRITICAL: adviserName is not a valid string!", {
              adviserName,
              type: typeof adviserName,
              adviserField: apiSection.adviser,
            });
            adviserName = "Unknown Adviser";
          }

          const transformedSection = {
            id: parseInt(apiSection.id) || Math.random(),
            apiId: apiSection.id, // Store original string ID for API calls
            sectionName: apiSection.name,
            gradeLevel: apiSection.gradeLevel,
            adviserId: adviserId,
            adviserName:
              typeof adviserName === "string" ? adviserName : "Unknown Adviser",
          };

          console.log("📋 Final transformed section:", transformedSection);
          return transformedSection;
        }
      );

      // Transform teachers to adviser options
      const adviserOptions = teachersResponse.map((teacher) => ({
        id: teacher.id,
        name: `${teacher.firstName} ${teacher.lastName}`,
      }));

      setSections(transformedSections);
      setAdvisers(adviserOptions);
      console.log("✅ Sections data loaded successfully:", transformedSections);
    } catch (error) {
      console.error("❌ Failed to fetch sections data:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load sections data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch sections and advisers on component mount
  useEffect(() => {
    loadSections();
  }, []);

  const handleAddSection = async (
    section: Omit<Section, "id" | "adviserName">
  ) => {
    try {
      setError(null);
      console.log("🔄 Creating section with data:", section);
      console.log("📋 Available advisers:", advisers);

      // Find the adviser name based on adviserId
      const adviser = advisers.find((a) => a.id === section.adviserId);
      console.log("👤 Selected adviser:", adviser);
      console.log("🔍 Looking for adviserId:", section.adviserId);

      const adviserName = adviser?.name || "Unknown Adviser";
      console.log("📝 Using adviser name:", adviserName);

      const newSectionData = {
        name: section.sectionName as string,
        gradeLevel: section.gradeLevel as string,
        adviser: adviserName,
      };

      console.log("📤 Sending to API:", newSectionData);
      const result = await sectionsService.createSection(newSectionData);
      console.log("✅ Section created result:", result);

      // Refresh the sections list
      await loadSections();
    } catch (error) {
      console.error("❌ Failed to add section:", error);
      setError(
        error instanceof Error ? error.message : "Failed to add section"
      );
      throw new Error(
        error instanceof Error ? error.message : "Failed to add section"
      );
    }
  };

  const handleEditSection = async (
    id: number,
    sectionData: Partial<Section>
  ) => {
    try {
      setError(null);
      console.log("🔄 Editing section with id:", id);
      console.log("📝 Section data to update:", sectionData);

      // Find the current section
      const currentSection = sections.find((s) => s.id === id);
      if (!currentSection) {
        console.error("❌ Section not found with id:", id);
        return;
      }

      console.log("📋 Current section:", currentSection);
      console.log(
        "🔑 Using API ID:",
        currentSection.apiId || currentSection.id.toString()
      );

      // Update adviser name if adviserId is being updated
      let adviserName = currentSection.adviserName;
      if (sectionData.adviserId) {
        const adviser = advisers.find((a) => a.id === sectionData.adviserId);
        adviserName = adviser?.name || "Unknown Adviser";
        console.log("👤 Updated adviser:", adviser);
      }

      const updateData = {
        id: currentSection.apiId || currentSection.id.toString(), // Use the API string ID
        name: sectionData.sectionName || currentSection.sectionName,
        gradeLevel: sectionData.gradeLevel || currentSection.gradeLevel,
        adviser: adviserName,
        createdAt: new Date().toISOString().slice(0, 19),
        updatedAt: new Date().toISOString().slice(0, 19),
      };

      console.log("📤 Sending update data to API:", updateData);
      const result = await sectionsService.updateSection(
        currentSection.apiId || currentSection.id.toString(), // Use the API string ID
        updateData
      );
      console.log("✅ Section updated result:", result);

      // Refresh the sections list
      await loadSections();
    } catch (error) {
      console.error("❌ Failed to edit section:", error);
      setError(
        error instanceof Error ? error.message : "Failed to edit section"
      );
      throw new Error(
        error instanceof Error ? error.message : "Failed to edit section"
      );
    }
  };

  const handleDeleteSection = async (id: number) => {
    try {
      setError(null);
      const section = sections.find((s) => s.id === id);
      if (!section) return;

      await sectionsService.deleteSection(
        section.apiId || section.id.toString() // Use the API string ID
      );
      console.log("Section deleted:", id);

      // Refresh the sections list to ensure consistency
      await loadSections();
    } catch (error) {
      console.error("Failed to delete section:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete section"
      );
      throw new Error(
        error instanceof Error ? error.message : "Failed to delete section"
      );
    }
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
    return <TableLoading text="Loading sections data..." />;
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
      onRefresh={loadSections}
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
