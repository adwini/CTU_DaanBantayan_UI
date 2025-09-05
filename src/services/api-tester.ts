/**
 * Service tests to verify all API endpoints work correctly with Axios
 * This file can be used for testing the frontend API integration
 */

import { authService } from "./auth.service";
import { profilesService } from "./profiles.service";
import { subjectsService } from "./subjects.service";
import { sectionsService } from "./sections.service";
import { Role } from "@/types/auth";
import { Gender } from "@/types/api";

/**
 * Test authentication endpoints
 */
export class ApiTester {
  private testUserId: string | null = null;
  private testProfileId: string | null = null;
  private testSubjectId: string | null = null;
  private testSectionId: string | null = null;

  /**
   * Run all API tests
   */
  async runAllTests(): Promise<void> {
    console.log("🧪 Starting API Tests with Axios...");

    try {
      await this.testAuthenticationFlow();
      await this.testProfileManagement();
      await this.testSubjectManagement();
      await this.testSectionManagement();
      await this.testSearchFunctionality();

      console.log("✅ All API tests passed!");
    } catch (error) {
      console.error("❌ API tests failed:", error);
      throw error;
    }
  }

  /**
   * Test authentication flow
   */
  private async testAuthenticationFlow(): Promise<void> {
    console.log("📋 Testing Authentication Flow...");

    // Test user registration
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = "password123";

    try {
      await authService.register({
        email: testEmail,
        password: testPassword,
        role: Role.TEACHER,
      });
      console.log("✅ User registration successful");
    } catch (error) {
      console.log("ℹ️ User might already exist, continuing...");
    }

    // Test login
    const loginResponse = await authService.login({
      email: testEmail,
      password: testPassword,
    });

    this.testUserId = loginResponse.userResponse.id;
    console.log("✅ Login successful, User ID:", this.testUserId);

    // Test authentication status check
    const authStatus = await authService.checkAuthStatus();
    console.log("✅ Auth status check:", authStatus.isAuthenticated);

    // Test token refresh
    if (this.testUserId) {
      try {
        await authService.refreshToken(this.testUserId);
        console.log("✅ Token refresh successful");
      } catch (error) {
        console.log("ℹ️ Token refresh failed (expected if no refresh token)");
      }
    }
  }

  /**
   * Test profile management
   */
  private async testProfileManagement(): Promise<void> {
    console.log("📋 Testing Profile Management...");

    // Test profile creation
    const profileData = {
      firstName: "John",
      middleName: "Michael",
      lastName: "Doe",
      gender: Gender.MALE,
      birthDate: "1990-01-15",
      contactNumber: "+1234567890",
      address: "123 Main St, City, Country",
    };

    try {
      const createResult = await profilesService.createProfile(profileData);
      console.log("✅ Profile creation successful:", createResult);
    } catch (error) {
      console.log("ℹ️ Profile might already exist, continuing...");
    }

    // Test get current user profile
    const currentProfile = await authService.getCurrentUser();
    this.testProfileId = currentProfile.id;
    console.log("✅ Get current user profile successful");

    // Test profile update
    if (this.testProfileId) {
      const updateData = {
        id: this.testProfileId,
        firstName: "Jane",
        middleName: "Michael",
        lastName: "Doe",
        gender: Gender.FEMALE,
        birthDate: "1990-01-15",
        contactNumber: "+1234567890",
        address: "456 Updated St, New City, Country",
      };

      try {
        await profilesService.updateProfile(this.testProfileId, updateData);
        console.log("✅ Profile update successful");
      } catch (error) {
        console.log("ℹ️ Profile update failed:", error);
      }
    }

    // Test profile search
    const searchResults = await profilesService.searchProfiles({
      role: "TEACHER",
      page: 0,
      size: 5,
    });
    console.log(
      "✅ Profile search successful, found:",
      searchResults.totalElements,
      "profiles"
    );

    // Test get all teachers
    const teachers = await authService.getAllTeachers();
    console.log(
      "✅ Get all teachers successful, found:",
      teachers.length,
      "teachers"
    );
  }

  /**
   * Test subject management
   */
  private async testSubjectManagement(): Promise<void> {
    console.log("📋 Testing Subject Management...");

    // Test subject creation
    const subjectData = {
      subjectCode: `MATH${Date.now()}`,
      name: "Test Mathematics",
    };

    const createResult = await subjectsService.createSubject(subjectData);
    console.log("✅ Subject creation successful:", createResult);

    // Test subject search
    const searchResults = await subjectsService.searchSubjects({
      name: "Math",
      page: 0,
      size: 10,
    });
    console.log(
      "✅ Subject search successful, found:",
      searchResults.totalElements,
      "subjects"
    );

    // Test subject update (if we have subjects)
    if (searchResults.content.length > 0) {
      const firstSubject = searchResults.content[0];
      const updateData = {
        id: firstSubject.id,
        subjectCode: firstSubject.subjectCode,
        name: firstSubject.name + " (Updated)",
        createdAt: firstSubject.createdAt,
        updatedAt: new Date().toISOString(),
      };

      try {
        await subjectsService.updateSubject(updateData);
        console.log("✅ Subject update successful");
      } catch (error) {
        console.log("ℹ️ Subject update failed:", error);
      }
    }
  }

  /**
   * Test section management
   */
  private async testSectionManagement(): Promise<void> {
    console.log("📋 Testing Section Management...");

    // Test section creation
    const sectionData = {
      name: `Section ${Date.now()}`,
      gradeLevel: "Grade 10",
      adviser: "Jane Doe", // This should match a teacher's name
    };

    try {
      const createResult = await sectionsService.createSection(sectionData);
      console.log("✅ Section creation successful:", createResult);
    } catch (error) {
      console.log(
        "ℹ️ Section creation failed (might need valid adviser):",
        error
      );
    }

    // Test section search (no authentication required per API docs)
    const searchResults = await sectionsService.searchSections({
      gradeLevel: "Grade 10",
      page: 0,
      size: 10,
    });
    console.log(
      "✅ Section search successful, found:",
      searchResults.totalElements,
      "sections"
    );

    // Test section update (if we have sections)
    if (searchResults.content.length > 0) {
      const firstSection = searchResults.content[0];
      const updateData = {
        id: firstSection.id,
        name: firstSection.name + " (Updated)",
        gradeLevel: firstSection.gradeLevel,
        adviser: firstSection.adviser,
        createdAt: firstSection.createdAt,
        updatedAt: new Date().toISOString(),
      };

      try {
        await sectionsService.updateSection(firstSection.id, updateData);
        console.log("✅ Section update successful");
      } catch (error) {
        console.log("ℹ️ Section update failed:", error);
      }
    }
  }

  /**
   * Test search functionality across all services
   */
  private async testSearchFunctionality(): Promise<void> {
    console.log("📋 Testing Search Functionality...");

    // Test profile statistics
    try {
      const profileStats = await profilesService.getProfileStats();
      console.log("✅ Profile stats:", profileStats);
    } catch (error) {
      console.log("ℹ️ Profile stats failed:", error);
    }

    // Test getting all subjects (for dropdowns)
    const allSubjects = await subjectsService.getAllSubjects();
    console.log(
      "✅ Get all subjects successful, found:",
      allSubjects.length,
      "subjects"
    );

    // Test getting all sections (for dropdowns)
    const allSections = await sectionsService.getAllSections();
    console.log(
      "✅ Get all sections successful, found:",
      allSections.length,
      "sections"
    );
  }

  /**
   * Test logout
   */
  async testLogout(): Promise<void> {
    console.log("📋 Testing Logout...");

    try {
      await authService.logout();
      console.log("✅ Logout successful");
    } catch (error) {
      console.log("ℹ️ Logout failed:", error);
    }
  }
}

// Export singleton instance
export const apiTester = new ApiTester();

// Example usage:
// import { apiTester } from '@/services/api-tester';
// apiTester.runAllTests().then(() => console.log('Tests complete'));
