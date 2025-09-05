/**
 * Dashboard service for aggregating data from multiple services
 */

import { subjectsService } from "./subjects.service";
import { sectionsService } from "./sections.service";
import { profilesService } from "./profiles.service";
import {
  DashboardStats,
  SubjectsByGradeData,
  StudentsPerSectionData,
  TeacherLoadStatusData,
  Subject,
  Section,
  Profile,
} from "@/types/api";

/**
 * Dashboard service class
 */
class DashboardService {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [subjectsResponse, sectionsResponse, profileStats] =
        await Promise.all([
          subjectsService.searchSubjects({ size: 1 }),
          sectionsService.searchSections({ size: 1 }),
          profilesService.getProfileStats(),
        ]);

      return {
        totalSubjects: subjectsResponse.totalElements,
        totalSections: sectionsResponse.totalElements,
        totalTeachers: profileStats.totalTeachers,
        totalStudents: profileStats.totalStudents,
        assignedLoads: 0, // TODO: Implement when teacher loads API is available
        pendingLoads: 0, // TODO: Implement when teacher loads API is available
      };
    } catch (error) {
      throw new Error("Failed to get dashboard statistics");
    }
  }

  /**
   * Get subjects overview data
   */
  async getSubjectsOverview(): Promise<
    Array<{
      id: string;
      subject: string;
      grade: string;
      teacher: string;
      sections: number;
      students: number;
    }>
  > {
    try {
      const [subjects, sections] = await Promise.all([
        subjectsService.getAllSubjects(),
        sectionsService.getAllSections(),
      ]);

      // Create overview data by combining subjects with section information
      const overview = subjects.map((subject) => {
        const subjectSections = sections.filter(
          (section) =>
            // This is a basic assumption - you might need to adjust based on your data model
            section.name.toLowerCase().includes(subject.name.toLowerCase()) ||
            section.gradeLevel
        );

        return {
          id: subject.id,
          subject: subject.name,
          grade: "Multiple", // You might need to determine this differently
          teacher: subjectSections[0]?.adviser || "Unassigned",
          sections: subjectSections.length,
          students: subjectSections.length * 25, // Estimated students per section
        };
      });

      return overview;
    } catch (error) {
      throw new Error("Failed to get subjects overview");
    }
  }

  /**
   * Get teacher loads overview data
   */
  async getTeacherLoadsOverview(): Promise<
    Array<{
      id: string;
      teacher: string;
      subject: string;
      section: string;
      schedule: string;
      status: string;
    }>
  > {
    try {
      const [teachers, sections] = await Promise.all([
        profilesService.getAllTeachers(),
        sectionsService.getAllSections(),
      ]);

      // Create mock teacher loads based on sections and teachers
      const loads = sections.map((section, index) => {
        const teacher =
          teachers.find(
            (t) => `${t.firstName} ${t.lastName}` === section.adviser
          ) || teachers[index % teachers.length];

        return {
          id: section.id,
          teacher: section.adviser,
          subject: "Mathematics", // This would come from actual teacher load data
          section: section.name,
          schedule: "08:00 AM - 09:00 AM", // This would come from actual schedule data
          status: Math.random() > 0.5 ? "Assigned" : "Pending",
        };
      });

      return loads;
    } catch (error) {
      throw new Error("Failed to get teacher loads overview");
    }
  }

  /**
   * Get sections overview data
   */
  async getSectionsOverview(): Promise<
    Array<{
      id: string;
      section: string;
      grade: string;
      adviser: string;
      students: number;
      status: string;
    }>
  > {
    try {
      const sections = await sectionsService.getAllSections();

      const overview = sections.map((section) => ({
        id: section.id,
        section: section.name,
        grade: section.gradeLevel,
        adviser: section.adviser,
        students: Math.floor(Math.random() * 15) + 20, // Random 20-35 students
        status: "Active",
      }));

      return overview;
    } catch (error) {
      throw new Error("Failed to get sections overview");
    }
  }

  /**
   * Get subjects by grade level data for charts
   */
  async getSubjectsByGradeData(): Promise<SubjectsByGradeData[]> {
    try {
      const sections = await sectionsService.getAllSections();

      // Group sections by grade level and count unique subjects
      const gradeGroups = sections.reduce((acc, section) => {
        const grade = section.gradeLevel;
        if (!acc[grade]) {
          acc[grade] = new Set();
        }
        // This is a simplified assumption - you might need actual subject-section relationships
        acc[grade].add("Mathematics");
        acc[grade].add("English");
        acc[grade].add("Science");
        acc[grade].add("Filipino");
        return acc;
      }, {} as Record<string, Set<string>>);

      return Object.entries(gradeGroups).map(([grade, subjects]) => ({
        grade,
        subjects: subjects.size,
      }));
    } catch (error) {
      throw new Error("Failed to get subjects by grade data");
    }
  }

  /**
   * Get students per section data for pie chart
   */
  async getStudentsPerSectionData(): Promise<StudentsPerSectionData[]> {
    try {
      const sections = await sectionsService.getAllSections();

      const colors = [
        "url(#blueGradient)",
        "url(#greenGradient)",
        "url(#purpleGradient)",
        "url(#orangeGradient)",
        "url(#redGradient)",
      ];

      return sections.slice(0, 5).map((section, index) => ({
        name: section.name,
        value: Math.floor(Math.random() * 15) + 20, // Random 20-35 students
        fill: colors[index % colors.length],
      }));
    } catch (error) {
      throw new Error("Failed to get students per section data");
    }
  }

  /**
   * Get teacher load status data for line chart
   */
  async getTeacherLoadStatusData(): Promise<TeacherLoadStatusData[]> {
    try {
      // This is mock data - replace with actual API when available
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

      return months.map((month) => ({
        month,
        assigned: Math.floor(Math.random() * 20) + 40,
        pending: Math.floor(Math.random() * 10) + 5,
      }));
    } catch (error) {
      throw new Error("Failed to get teacher load status data");
    }
  }

  /**
   * Get all dashboard data in one call
   */
  async getAllDashboardData(): Promise<{
    stats: DashboardStats;
    subjectsOverview: Array<{
      id: string;
      subject: string;
      grade: string;
      teacher: string;
      sections: number;
      students: number;
    }>;
    teacherLoadsOverview: Array<{
      id: string;
      teacher: string;
      subject: string;
      section: string;
      schedule: string;
      status: string;
    }>;
    sectionsOverview: Array<{
      id: string;
      section: string;
      grade: string;
      adviser: string;
      students: number;
      status: string;
    }>;
    subjectsByGrade: SubjectsByGradeData[];
    studentsPerSection: StudentsPerSectionData[];
    teacherLoadStatus: TeacherLoadStatusData[];
  }> {
    try {
      const [
        stats,
        subjectsOverview,
        teacherLoadsOverview,
        sectionsOverview,
        subjectsByGrade,
        studentsPerSection,
        teacherLoadStatus,
      ] = await Promise.all([
        this.getDashboardStats(),
        this.getSubjectsOverview(),
        this.getTeacherLoadsOverview(),
        this.getSectionsOverview(),
        this.getSubjectsByGradeData(),
        this.getStudentsPerSectionData(),
        this.getTeacherLoadStatusData(),
      ]);

      return {
        stats,
        subjectsOverview,
        teacherLoadsOverview,
        sectionsOverview,
        subjectsByGrade,
        studentsPerSection,
        teacherLoadStatus,
      };
    } catch (error) {
      throw new Error("Failed to get dashboard data");
    }
  }
}

// Create and export singleton instance
export const dashboardService = new DashboardService();

// Export the class for testing
export { DashboardService };
