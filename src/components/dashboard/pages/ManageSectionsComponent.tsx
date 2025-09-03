"use client";

import {
  DataManagementTable,
  TableColumn,
  FormField,
  FilterOption,
  BaseItem,
} from "../DataManagementTable";

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
  const handleAddSection = (section: Omit<Section, "id" | "adviserName">) => {
    // Find the adviser name based on adviserId
    const adviser = availableAdvisers.find((a) => a.id === section.adviserId);
    const newSection = {
      ...section,
      adviserName: adviser?.name || "Unknown Adviser",
    };
    console.log("Add section:", newSection);
    // Here you would typically make an API call to add the section
  };

  const handleEditSection = (id: number, sectionData: Partial<Section>) => {
    // If adviserId is being updated, also update adviserName
    if (sectionData.adviserId) {
      const adviser = availableAdvisers.find(
        (a) => a.id === sectionData.adviserId
      );
      sectionData.adviserName = adviser?.name || "Unknown Adviser";
    }
    console.log("Edit section:", id, sectionData);
    // Here you would typically make an API call to update the section
  };

  const handleViewSection = (id: number) => {
    console.log("View section details:", id);
    // Here you would typically navigate to a section details page or open a modal
  };

  return (
    <DataManagementTable
      title="Manage Sections"
      description="Add, edit, and manage class sections and their advisers."
      data={sampleSections}
      columns={sectionColumns}
      formFields={sectionFormFields}
      filterOptions={sectionFilterOptions}
      onAdd={handleAddSection}
      onEdit={handleEditSection}
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
        delete: false,
      }}
    />
  );
}
