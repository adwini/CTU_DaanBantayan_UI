"use client";

import {
  DataManagementTable,
  TableColumn,
  FormField,
  FilterOption,
  BaseItem,
} from "../DataManagementTable";

// Course interface extending BaseItem
interface Course extends BaseItem {
  name: string;
  code: string;
  instructor: string;
  department: string;
  credits: number;
  semester: string;
}

// Sample course data
const sampleCourses: Course[] = [
  {
    id: 1,
    name: "Introduction to Computer Science",
    code: "CS101",
    instructor: "Dr. Smith",
    department: "Computer Science",
    credits: 3,
    semester: "Fall 2025",
    status: "active",
  },
  {
    id: 2,
    name: "Calculus I",
    code: "MATH201",
    instructor: "Prof. Johnson",
    department: "Mathematics",
    credits: 4,
    semester: "Fall 2025",
    status: "active",
  },
  {
    id: 3,
    name: "Physics Lab",
    code: "PHYS150",
    instructor: "Dr. Brown",
    department: "Physics",
    credits: 1,
    semester: "Spring 2025",
    status: "inactive",
  },
];

const departments = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
];
const semesters = ["Fall 2025", "Spring 2025", "Summer 2025"];
const creditOptions = ["1", "2", "3", "4", "5"];

// Table columns configuration
const courseColumns: TableColumn[] = [
  { key: "name", label: "Course Name", searchable: true },
  { key: "code", label: "Course Code", searchable: true },
  { key: "instructor", label: "Instructor", searchable: true },
  { key: "department", label: "Department" },
  { key: "credits", label: "Credits" },
  { key: "status", label: "Status" },
];

// Form fields configuration
const courseFormFields: FormField[] = [
  {
    key: "name",
    label: "Course Name",
    type: "text",
    required: true,
    gridColumn: 2,
  },
  {
    key: "code",
    label: "Course Code",
    type: "text",
    required: true,
    placeholder: "e.g., CS101",
    gridColumn: 2,
  },
  {
    key: "instructor",
    label: "Instructor",
    type: "text",
    required: true,
    placeholder: "e.g., Dr. Smith",
  },
  {
    key: "department",
    label: "Department",
    type: "select",
    required: true,
    options: departments,
  },
  {
    key: "credits",
    label: "Credits",
    type: "select",
    required: true,
    options: creditOptions,
    gridColumn: 2,
  },
  {
    key: "semester",
    label: "Semester",
    type: "select",
    required: true,
    options: semesters,
    gridColumn: 2,
  },
];

// Filter options configuration
const courseFilterOptions: FilterOption[] = [
  { key: "department", label: "Departments", options: departments },
  { key: "semester", label: "Semesters", options: semesters },
];

// Badge color function
const getCourseBadgeColor = (key: string, value: unknown) => {
  if (key === "department") {
    switch (value) {
      case "Computer Science":
        return "bg-blue-100 text-blue-800";
      case "Mathematics":
        return "bg-green-100 text-green-800";
      case "Physics":
        return "bg-purple-100 text-purple-800";
      case "Chemistry":
        return "bg-yellow-100 text-yellow-800";
      case "Biology":
        return "bg-emerald-100 text-emerald-800";
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

export function ManageCoursesComponent() {
  const handleAddCourse = (course: Omit<Course, "id">) => {
    console.log("Add course:", course);
    // Here you would typically make an API call to add the course
  };

  const handleEditCourse = (id: number, courseData: Partial<Course>) => {
    console.log("Edit course:", id, courseData);
    // Here you would typically make an API call to update the course
  };

  const handleDeleteCourse = (id: number) => {
    console.log("Delete course:", id);
    // Here you would typically make an API call to delete the course
  };

  const handleToggleCourseStatus = (id: number) => {
    console.log("Toggle course status:", id);
    // Here you would typically make an API call to toggle course status
  };

  return (
    <DataManagementTable
      title="Manage Courses"
      description="Add, edit, and manage course offerings and schedules."
      data={sampleCourses}
      columns={courseColumns}
      formFields={courseFormFields}
      filterOptions={courseFilterOptions}
      onAdd={handleAddCourse}
      onEdit={handleEditCourse}
      onDelete={handleDeleteCourse}
      onStatusToggle={handleToggleCourseStatus}
      searchPlaceholder="Search courses..."
      addButtonText="Add Course"
      editModalTitle="Edit Course"
      addModalTitle="Add New Course"
      editModalDescription="Update the course details below."
      addModalDescription="Fill in the details to create a new course."
      getBadgeColor={getCourseBadgeColor}
      actions={{
        edit: true,
        statusToggle: true,
        delete: true,
      }}
    />
  );
}
