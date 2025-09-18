"use client";

import {
  DataManagementTable,
  TableColumn,
  FormField,
  FilterOption,
  BaseItem,
} from "../DataManagementTable";
// Card UI not used in this component
import { Clock } from "lucide-react";

// Teacher Load interface extending BaseItem
interface TeacherLoad extends BaseItem {
  teacherName: string;
  subjectName: string;
  sectionName: string;
  startTime: string;
  endTime: string;
}

// Mock data for dropdowns
const mockTeachers = [
  { value: "Dr. Maria Santos", label: "Dr. Maria Santos" },
  { value: "Prof. Juan Dela Cruz", label: "Prof. Juan Dela Cruz" },
  { value: "Ms. Ana Rodriguez", label: "Ms. Ana Rodriguez" },
  { value: "Mr. Carlos Mendoza", label: "Mr. Carlos Mendoza" },
  { value: "Dr. Elena Reyes", label: "Dr. Elena Reyes" },
];

const mockSubjects = [
  { value: "Mathematics", label: "Mathematics" },
  { value: "English", label: "English" },
  { value: "Science", label: "Science" },
  { value: "Filipino", label: "Filipino" },
  { value: "Social Studies", label: "Social Studies" },
  { value: "Physical Education", label: "Physical Education" },
];

const mockSections = [
  { value: "Grade 7-A", label: "Grade 7-A" },
  { value: "Grade 7-B", label: "Grade 7-B" },
  { value: "Grade 8-A", label: "Grade 8-A" },
  { value: "Grade 8-B", label: "Grade 8-B" },
  { value: "Grade 9-A", label: "Grade 9-A" },
  { value: "Grade 10-A", label: "Grade 10-A" },
];

// Sample teacher load data
const sampleTeacherLoads: TeacherLoad[] = [
  {
    id: 1,
    teacherName: "Dr. Maria Santos",
    subjectName: "Mathematics",
    sectionName: "Grade 7-A",
    startTime: "08:00",
    endTime: "09:00",
    status: "active",
  },
  {
    id: 2,
    teacherName: "Prof. Juan Dela Cruz",
    subjectName: "English",
    sectionName: "Grade 7-B",
    startTime: "09:00",
    endTime: "10:00",
    status: "active",
  },
  {
    id: 3,
    teacherName: "Ms. Ana Rodriguez",
    subjectName: "Science",
    sectionName: "Grade 8-A",
    startTime: "10:00",
    endTime: "11:00",
    status: "active",
  },
  {
    id: 4,
    teacherName: "Mr. Carlos Mendoza",
    subjectName: "Physical Education",
    sectionName: "Grade 9-A",
    startTime: "14:00",
    endTime: "15:00",
    status: "inactive",
  },
];

// Define table columns
const columns: TableColumn[] = [
  {
    key: "teacherName",
    label: "Teacher Name",
    searchable: true,
  },
  {
    key: "subjectName",
    label: "Subject",
    searchable: true,
    render: (value: unknown) => (
      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
        {value as string}
      </span>
    ),
  },
  {
    key: "sectionName",
    label: "Section",
    searchable: true,
    render: (value: unknown) => (
      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
        {value as string}
      </span>
    ),
  },
  {
    key: "schedule",
    label: "Schedule",
    render: (_: unknown, item: BaseItem) => {
      const teacherLoad = item as TeacherLoad;
      const formatTime = (time: string) => {
        const [hours, minutes] = time.split(":");
        const hour12 = parseInt(hours) % 12 || 12;
        const ampm = parseInt(hours) >= 12 ? "PM" : "AM";
        return `${hour12}:${minutes} ${ampm}`;
      };

      return (
        <div className="flex items-center gap-1 text-sm">
          <Clock className="h-3 w-3" />
          {formatTime(teacherLoad.startTime)} -{" "}
          {formatTime(teacherLoad.endTime)}
        </div>
      );
    },
  },
];

// Define form fields
const formFields: FormField[] = [
  {
    key: "teacherName",
    label: "Teacher Name",
    type: "select",
    required: true,
    options: mockTeachers,
  },
  {
    key: "subjectName",
    label: "Subject Name",
    type: "select",
    required: true,
    options: mockSubjects,
  },
  {
    key: "sectionName",
    label: "Section Name",
    type: "select",
    required: true,
    options: mockSections,
  },
  {
    key: "startTime",
    label: "Start Time",
    type: "time",
    required: true,
    placeholder: "Select start time",
  },
  {
    key: "endTime",
    label: "End Time",
    type: "time",
    required: true,
    placeholder: "Select end time",
  },
];

// Define filter options
const filterOptions: FilterOption[] = [
  {
    key: "teacherName",
    label: "Teacher",
    options: mockTeachers,
  },
  {
    key: "subjectName",
    label: "Subject",
    options: mockSubjects,
  },
  {
    key: "sectionName",
    label: "Section",
    options: mockSections,
  },
];

export function TeacherLoadsComponent() {
  return (
    <DataManagementTable
      title="Teacher Loads"
      description="Manage teacher assignments, schedules, and workloads"
      data={sampleTeacherLoads}
      columns={columns}
      formFields={formFields}
      filterOptions={filterOptions}
      addButtonText="Add Teacher Load"
      searchPlaceholder="Search teacher loads..."
      addModalTitle="Add New Teacher Load"
      editModalTitle="Edit Teacher Load"
      addModalDescription="Assign a teacher to a subject and section with specific time schedule."
      editModalDescription="Update teacher assignment and schedule details."
      onAdd={(newItem) => {
        console.log("Adding new teacher load:", newItem);
        // Here you would typically call an API to add the item
      }}
      onEdit={(id, updatedItem) => {
        console.log("Editing teacher load:", id, updatedItem);
        // Here you would typically call an API to update the item
      }}
      onDelete={(id) => {
        console.log("Deleting teacher load:", id);
        // Here you would typically call an API to delete the item
      }}
      actions={{
        edit: true,
        statusToggle: false,
        delete: true,
      }}
    />
  );
}
