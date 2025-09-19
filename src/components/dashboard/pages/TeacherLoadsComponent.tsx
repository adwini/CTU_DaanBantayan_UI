"use client";

import {
  DataManagementTable,
  TableColumn,
  FormField,
  FilterOption,
  BaseItem,
} from "../DataManagementTable";
import { Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { schedulesService } from "@/services/schedules.service";
import { usersService } from "@/services/users.service";
import { subjectsService } from "@/services/subjects.service";
import { sectionsService } from "@/services/sections.service";
import { Profile, Subject, Section, CreateScheduleRequest } from "@/types/api";

// Teacher Load interface extending BaseItem
interface TeacherLoad extends BaseItem {
  teacherName: string;
  subjectName: string;
  sectionName: string;
  startTime: string;
  endTime: string;
  teacherId?: string;
  subjectId?: string;
  sectionId?: string;
}

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

// Define form fields (will be populated with dynamic data)
const getFormFields = (
  teachers: { value: string; label: string }[],
  subjects: { value: string; label: string }[],
  sections: { value: string; label: string }[]
): FormField[] => [
  {
    key: "teacherId",
    label: "Teacher Name",
    type: "select",
    required: true,
    options: teachers,
  },
  {
    key: "subjectId",
    label: "Subject Name",
    type: "select",
    required: true,
    options: subjects,
  },
  {
    key: "sectionId",
    label: "Section Name",
    type: "select",
    required: true,
    options: sections,
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

// Define filter options (will be populated with dynamic data)
const getFilterOptions = (
  teachers: { value: string; label: string }[],
  subjects: { value: string; label: string }[],
  sections: { value: string; label: string }[]
): FilterOption[] => [
  {
    key: "teacherName",
    label: "Teacher",
    options: teachers,
  },
  {
    key: "subjectName",
    label: "Subject",
    options: subjects,
  },
  {
    key: "sectionName",
    label: "Section",
    options: sections,
  },
];

export function TeacherLoadsComponent() {
  const [teacherLoads, setTeacherLoads] = useState<TeacherLoad[]>([]);
  const [teachers, setTeachers] = useState<{ value: string; label: string }[]>(
    []
  );
  const [subjects, setSubjects] = useState<{ value: string; label: string }[]>(
    []
  );
  const [sections, setSections] = useState<{ value: string; label: string }[]>(
    []
  );
  const [subjectsData, setSubjectsData] = useState<Subject[]>([]);
  const [sectionsData, setSectionsData] = useState<Section[]>([]);
  const [teachersData, setTeachersData] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load dropdown data
  const loadDropdownData = async () => {
    try {
      // Load teachers (profiles with role TEACHER)
      const teachersResponse = await usersService.getAllUsers({
        role: "TEACHER",
        size: 100,
      });
      const teachersProfiles = teachersResponse.content;
      const teachersData = teachersProfiles.map((profile: Profile) => ({
        value: profile.id,
        label: `${profile.firstName} ${profile.lastName}`,
      }));
      setTeachers(teachersData);
      setTeachersData(teachersProfiles);

      // Load subjects
      const subjectsResponse = await subjectsService.getAllSubjects();
      const subjectsData = subjectsResponse.map((subject: Subject) => ({
        value: subject.id,
        label: subject.name,
      }));
      setSubjects(subjectsData);
      setSubjectsData(subjectsResponse);

      // Load sections
      const sectionsResponse = await sectionsService.getAllSections();
      const sectionsData = sectionsResponse.map((section: Section) => ({
        value: section.id,
        label: section.name,
      }));
      setSections(sectionsData);
      setSectionsData(sectionsResponse);
    } catch (err) {
      console.error("Error loading dropdown data:", err);
      setError("Failed to load dropdown data");
    }
  };

  // Load teacher loads (schedules)
  const loadTeacherLoads = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Note: The backend doesn't have a GET /api/schedules endpoint yet
      // For now, we'll use empty array and show a message
      setTeacherLoads([]);

      // TODO: Implement when backend adds GET /api/schedules endpoint
      // const schedules = await schedulesService.getAllSchedules();
      // const transformedLoads = schedules.map((schedule, index) => ({
      //   id: index + 1,
      //   teacherName: `${schedule.teacher.firstName} ${schedule.teacher.lastName}`,
      //   subjectName: schedule.subject.name,
      //   sectionName: schedule.section.name,
      //   startTime: new Date(schedule.startTime).toTimeString().slice(0, 5),
      //   endTime: new Date(schedule.endTime).toTimeString().slice(0, 5),
      //   status: "active",
      //   teacherId: schedule.teacher.id,
      //   subjectId: schedule.subject.id,
      //   sectionId: schedule.section.id,
      // }));
      // setTeacherLoads(transformedLoads);
    } catch (err) {
      console.error("Error loading teacher loads:", err);
      setError("Failed to load teacher loads");
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      await loadDropdownData();
      await loadTeacherLoads();
    };
    loadData();
  }, []);

  const handleAddTeacherLoad = async (newItem: Omit<TeacherLoad, "id">) => {
    try {
      setError(null);

      // Find the selected entities
      const selectedTeacher = teachersData.find(
        (t) => t.id === newItem.teacherId
      );
      const selectedSubject = subjectsData.find(
        (s) => s.id === newItem.subjectId
      );
      const selectedSection = sectionsData.find(
        (sec) => sec.id === newItem.sectionId
      );

      if (!selectedTeacher || !selectedSubject || !selectedSection) {
        throw new Error("Please select valid teacher, subject, and section");
      }

      if (!newItem.teacherId || !newItem.subjectId || !newItem.sectionId) {
        throw new Error(
          "Missing required IDs for teacher, subject, or section"
        );
      }

      // Convert time to ISO format (assuming today's date)
      const today = new Date().toISOString().split("T")[0];
      const startDateTime = `${today}T${newItem.startTime}:00`;
      const endDateTime = `${today}T${newItem.endTime}:00`;

      const scheduleData: CreateScheduleRequest = {
        teacher: selectedTeacher,
        subject: selectedSubject,
        section: selectedSection,
        startTime: startDateTime,
        endTime: endDateTime,
      };

      await schedulesService.createSchedule(scheduleData);

      // Refresh the list
      await loadTeacherLoads();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add teacher load";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleEditTeacherLoad = async (
    id: number,
    updatedItem: Partial<TeacherLoad>
  ) => {
    try {
      setError(null);

      // TODO: Implement when backend adds PUT /api/schedules endpoint
      console.log("Edit teacher load:", id, updatedItem);
      throw new Error(
        "Edit functionality not yet implemented - backend endpoint missing"
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to edit teacher load";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleDeleteTeacherLoad = async (id: number) => {
    try {
      setError(null);

      // TODO: Implement when backend adds DELETE /api/schedules endpoint
      console.log("Delete teacher load:", id);
      throw new Error(
        "Delete functionality not yet implemented - backend endpoint missing"
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete teacher load";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading teacher loads...</p>
        </div>
      </div>
    );
  }

  if (error && teacherLoads.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading teacher loads</p>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => loadTeacherLoads()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <DataManagementTable
      title="Teacher Loads"
      description="Manage teacher assignments, schedules, and workloads"
      data={teacherLoads}
      columns={columns}
      formFields={getFormFields(teachers, subjects, sections)}
      filterOptions={getFilterOptions(teachers, subjects, sections)}
      addButtonText="Add Teacher Load"
      searchPlaceholder="Search teacher loads..."
      addModalTitle="Add New Teacher Load"
      editModalTitle="Edit Teacher Load"
      addModalDescription="Assign a teacher to a subject and section with specific time schedule."
      editModalDescription="Update teacher assignment and schedule details."
      onAdd={handleAddTeacherLoad}
      onEdit={handleEditTeacherLoad}
      onDelete={handleDeleteTeacherLoad}
      actions={{
        edit: false, // Disabled until backend supports edit
        statusToggle: false,
        delete: false, // Disabled until backend supports delete
      }}
    />
  );
}
