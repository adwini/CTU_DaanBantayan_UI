/**
 * Example component demonstrating Axios-based API usage
 * This component shows how to properly use all the updated services
 */

"use client";

import React, { useState, useEffect } from "react";
import { authService } from "@/services/auth.service";
import { profilesService } from "@/services/profiles.service";
import { subjectsService } from "@/services/subjects.service";
import { sectionsService } from "@/services/sections.service";
import { apiTester } from "@/services/api-tester";
import { useAuth } from "@/contexts/auth.context";
import { Gender } from "@/types/api";

export default function AxiosApiDemo() {
  const { authState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Clear previous results and errors
  const clearState = () => {
    setResults([]);
    setError(null);
  };

  // Generic error handler
  const handleError = (error: any, operation: string) => {
    console.error(`${operation} failed:`, error);
    setError(`${operation} failed: ${error.message}`);
    setLoading(false);
  };

  // Test authentication endpoints
  const testAuth = async () => {
    setLoading(true);
    clearState();

    try {
      // Check auth status
      const authStatus = await authService.checkAuthStatus();
      setResults((prev) => [
        ...prev,
        { operation: "Auth Status", data: authStatus },
      ]);

      // Get current user if authenticated
      if (authStatus.isAuthenticated) {
        const profile = await authService.getCurrentUser();
        setResults((prev) => [
          ...prev,
          { operation: "Current User", data: profile },
        ]);
      }

      // Get all teachers
      const teachers = await authService.getAllTeachers();
      setResults((prev) => [
        ...prev,
        { operation: "All Teachers", data: teachers },
      ]);

      setLoading(false);
    } catch (error) {
      handleError(error, "Authentication Test");
    }
  };

  // Test profile endpoints
  const testProfiles = async () => {
    setLoading(true);
    clearState();

    try {
      // Search profiles
      const searchResults = await profilesService.searchProfiles({
        role: "TEACHER",
        page: 0,
        size: 5,
      });
      setResults((prev) => [
        ...prev,
        { operation: "Profile Search", data: searchResults },
      ]);

      // Get profile statistics
      const stats = await profilesService.getProfileStats();
      setResults((prev) => [
        ...prev,
        { operation: "Profile Stats", data: stats },
      ]);

      setLoading(false);
    } catch (error) {
      handleError(error, "Profile Test");
    }
  };

  // Test subject endpoints
  const testSubjects = async () => {
    setLoading(true);
    clearState();

    try {
      // Search subjects
      const searchResults = await subjectsService.searchSubjects({
        page: 0,
        size: 10,
      });
      setResults((prev) => [
        ...prev,
        { operation: "Subject Search", data: searchResults },
      ]);

      // Get all subjects
      const allSubjects = await subjectsService.getAllSubjects();
      setResults((prev) => [
        ...prev,
        { operation: "All Subjects", data: allSubjects },
      ]);

      setLoading(false);
    } catch (error) {
      handleError(error, "Subject Test");
    }
  };

  // Test section endpoints
  const testSections = async () => {
    setLoading(true);
    clearState();

    try {
      // Search sections
      const searchResults = await sectionsService.searchSections({
        page: 0,
        size: 10,
      });
      setResults((prev) => [
        ...prev,
        { operation: "Section Search", data: searchResults },
      ]);

      // Get all sections
      const allSections = await sectionsService.getAllSections();
      setResults((prev) => [
        ...prev,
        { operation: "All Sections", data: allSections },
      ]);

      setLoading(false);
    } catch (error) {
      handleError(error, "Section Test");
    }
  };

  // Create a new profile (if authenticated)
  const createProfile = async () => {
    if (!authState.isAuthenticated) {
      setError("Must be authenticated to create profile");
      return;
    }

    setLoading(true);
    clearState();

    try {
      const profileData = {
        firstName: "Test",
        middleName: "User",
        lastName: "Demo",
        gender: Gender.OTHER,
        birthDate: "1990-01-01",
        contactNumber: "+1234567890",
        address: "123 Demo Street, Test City",
      };

      const result = await profilesService.createProfile(profileData);
      setResults([{ operation: "Create Profile", data: result }]);
      setLoading(false);
    } catch (error) {
      handleError(error, "Create Profile");
    }
  };

  // Create a new subject (if authenticated)
  const createSubject = async () => {
    if (!authState.isAuthenticated) {
      setError("Must be authenticated to create subject");
      return;
    }

    setLoading(true);
    clearState();

    try {
      const subjectData = {
        subjectCode: `DEMO${Date.now()}`,
        name: "Demo Subject for Axios Testing",
      };

      const result = await subjectsService.createSubject(subjectData);
      setResults([{ operation: "Create Subject", data: result }]);
      setLoading(false);
    } catch (error) {
      handleError(error, "Create Subject");
    }
  };

  // Run comprehensive API tests
  const runFullApiTest = async () => {
    setLoading(true);
    clearState();

    try {
      await apiTester.runAllTests();
      setResults([
        {
          operation: "Full API Test",
          data: "All tests completed successfully!",
        },
      ]);
      setLoading(false);
    } catch (error) {
      handleError(error, "Full API Test");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Axios API Integration Demo
        </h1>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            Authentication Status
          </h2>
          <p className="text-blue-700">
            Authenticated: {authState.isAuthenticated ? "✅ Yes" : "❌ No"}
          </p>
          {authState.user && (
            <p className="text-blue-700">
              User: {authState.user.email} ({authState.user.role})
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={testAuth}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            Test Auth
          </button>

          <button
            onClick={testProfiles}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
            Test Profiles
          </button>

          <button
            onClick={testSubjects}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50">
            Test Subjects
          </button>

          <button
            onClick={testSections}
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50">
            Test Sections
          </button>

          <button
            onClick={createProfile}
            disabled={loading || !authState.isAuthenticated}
            className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:opacity-50">
            Create Profile
          </button>

          <button
            onClick={createSubject}
            disabled={loading || !authState.isAuthenticated}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50">
            Create Subject
          </button>
        </div>

        <div className="mb-6">
          <button
            onClick={runFullApiTest}
            disabled={loading}
            className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold">
            {loading ? "Running Tests..." : "Run Full API Test Suite"}
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Results</h3>
            {results.map((result, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {result.operation}
                </h4>
                <pre className="text-sm text-gray-700 overflow-x-auto bg-white p-2 rounded border">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
