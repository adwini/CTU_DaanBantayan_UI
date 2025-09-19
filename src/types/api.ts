/**
 * API TypeScript interfaces for all backend entities
 * Based on the CTU Database API documentation
 */

// Enums
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum SectionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

// Base interfaces
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Subject interfaces
export interface Subject extends BaseEntity {
  subjectCode: string;
  name: string;
}

export interface CreateSubjectRequest {
  subjectCode: string;
  name: string;
}

export interface UpdateSubjectRequest extends CreateSubjectRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectSearchParams {
  subjectCode?: string;
  name?: string;
  page?: number;
  size?: number;
}

// Section interfaces
export interface Section extends BaseEntity {
  name: string;
  gradeLevel: string;
  adviser: string;
}

export interface CreateSectionRequest {
  name: string;
  gradeLevel: string;
  adviser: string; // Full name of existing teacher profile
}

export interface UpdateSectionRequest extends CreateSectionRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface SectionSearchParams {
  name?: string;
  gradeLevel?: string;
  adviserName?: string;
  page?: number;
  size?: number;
}

// Profile interfaces
export interface Profile extends BaseEntity {
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: Gender;
  birthDate: string; // YYYY-MM-DD format
  contactNumber: string;
  address: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
  // Backend compatibility - actual response uses 'userEntity'
  userEntity?: {
    id: string;
    email: string;
    password: string;
    membershipCode: string;
    role: string;
    createdAt: string;
    updatedAt: string | null;
  };
}

export interface CreateProfileRequest {
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: Gender;
  birthDate: string; // YYYY-MM-DD format
  contactNumber: string;
  address: string;
}

export interface UpdateProfileRequest extends CreateProfileRequest {
  id?: string; // Optional since it's in URL path, not request body
}

export interface ProfileSearchParams {
  role?: string;
  name?: string;
  page?: number;
  size?: number;
}

// Schedule interfaces (backend API)
export interface Schedule extends BaseEntity {
  teacher: Profile;
  subject: Subject;
  section: Section;
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
}

export interface CreateScheduleRequest {
  teacher: Partial<Profile>;
  subject: Partial<Subject>;
  section: Partial<Section>;
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
}

// Teacher Load interfaces (frontend-specific)
export interface TeacherLoad extends BaseEntity {
  teacherName: string;
  subjectName: string;
  sectionName: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  status?: "assigned" | "pending";
}

export interface CreateTeacherLoadRequest {
  teacherId: string;
  subjectId: string;
  sectionId: string;
  startTime: string;
  endTime: string;
}

// API Response wrappers
export interface ApiPaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface ApiSuccessResponse {
  message: string;
  id?: string;
}

// Dashboard Data interfaces
export interface DashboardStats {
  totalSubjects: number;
  totalSections: number;
  totalTeachers: number;
  totalStudents: number;
  assignedLoads: number;
  pendingLoads: number;
}

// Chart data interfaces
export interface SubjectsByGradeData {
  grade: string;
  subjects: number;
}

export interface StudentsPerSectionData {
  name: string;
  value: number;
  fill: string;
}

export interface TeacherLoadStatusData {
  month: string;
  assigned: number;
  pending: number;
}

// System User interfaces for user management
export interface SystemUser {
  id: string;
  email: string;
  role: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
  profile?: {
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    gender: Gender;
    birthDate: string;
    contactNumber: string;
    address: string;
  };
}

export interface SystemUsersResponse {
  content: SystemUser[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface UserSearchParams {
  email?: string;
  role?: string;
  name?: string;
  page?: number;
  size?: number;
}
