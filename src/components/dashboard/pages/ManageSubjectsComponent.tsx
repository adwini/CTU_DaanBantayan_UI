"use client";

import {
  DataManagementTable,
  TableColumn,
  FormField,
  FilterOption,
  BaseItem,
} from "../DataManagementTable";

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
  const handleAddSubject = (subject: Omit<Subject, "id">) => {
    console.log("Add subject:", subject);
    // Here you would typically make an API call to add the subject
  };

  const handleEditSubject = (id: number, subjectData: Partial<Subject>) => {
    console.log("Edit subject:", id, subjectData);
    // Here you would typically make an API call to update the subject
  };

  return (
    <DataManagementTable
      title="Manage Subjects"
      description="Add, edit, and manage academic subjects."
      data={sampleSubjects}
      columns={subjectColumns}
      formFields={subjectFormFields}
      filterOptions={subjectFilterOptions}
      onAdd={handleAddSubject}
      onEdit={handleEditSubject}
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
        delete: false,
      }}
    />
  );
}
