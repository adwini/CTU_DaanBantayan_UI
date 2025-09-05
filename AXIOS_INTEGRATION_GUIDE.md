# Axios API Integration Guide

This document explains how to use the updated frontend services that now use Axios for all API communication.

## 🚀 Quick Start

All services now use a centralized Axios-based `apiClient` that automatically handles:

- JSON serialization/deserialization
- Cookie-based JWT authentication
- Request/response logging
- Error handling
- CORS credentials

## 📁 Updated Services

### 1. Authentication Service (`auth.service.ts`)

```typescript
import { authService } from "@/services/auth.service";

// Login
const loginResponse = await authService.login({
  email: "user@example.com",
  password: "password123",
});

// Register
await authService.register({
  email: "newuser@example.com",
  password: "password123",
  role: Role.TEACHER,
});

// Get current user
const profile = await authService.getCurrentUser();

// Refresh token
await authService.refreshToken(userId);

// Get all teachers
const teachers = await authService.getAllTeachers();

// Logout
await authService.logout();
```

### 2. Profile Service (`profiles.service.ts`)

```typescript
import { profilesService } from "@/services/profiles.service";
import { Gender } from "@/types/api";

// Create profile
await profilesService.createProfile({
  firstName: "John",
  middleName: "Michael",
  lastName: "Doe",
  gender: Gender.MALE,
  birthDate: "1990-01-15",
  contactNumber: "+1234567890",
  address: "123 Main St, City, Country",
});

// Update profile
await profilesService.updateProfile(profileId, {
  id: profileId,
  firstName: "Updated Name",
  // ... other fields
});

// Search profiles
const results = await profilesService.searchProfiles({
  role: "TEACHER",
  name: "John",
  page: 0,
  size: 10,
});

// Get profile statistics
const stats = await profilesService.getProfileStats();
```

### 3. Subject Service (`subjects.service.ts`)

```typescript
import { subjectsService } from "@/services/subjects.service";

// Create subject
await subjectsService.createSubject({
  subjectCode: "MATH101",
  name: "Mathematics 101",
});

// Update subject
await subjectsService.updateSubject({
  id: subjectId,
  subjectCode: "MATH102",
  name: "Advanced Mathematics",
  createdAt: "2025-09-05T10:00:00",
  updatedAt: "2025-09-05T15:30:00",
});

// Search subjects
const results = await subjectsService.searchSubjects({
  subjectCode: "MATH",
  name: "Mathematics",
  page: 0,
  size: 10,
});

// Get all subjects (for dropdowns)
const allSubjects = await subjectsService.getAllSubjects();
```

### 4. Section Service (`sections.service.ts`)

```typescript
import { sectionsService } from "@/services/sections.service";

// Create section
await sectionsService.createSection({
  name: "Section A",
  gradeLevel: "Grade 10",
  adviser: "John Doe", // Must match existing teacher name
});

// Update section
await sectionsService.updateSection(sectionId, {
  id: sectionId,
  name: "Section B",
  gradeLevel: "Grade 11",
  adviser: "Jane Smith",
  createdAt: "2025-09-05T10:00:00",
  updatedAt: "2025-09-05T15:30:00",
});

// Search sections (no authentication required)
const results = await sectionsService.searchSections({
  gradeLevel: "Grade 10",
  name: "Section A",
  page: 0,
  size: 10,
});

// Get all sections (for dropdowns)
const allSections = await sectionsService.getAllSections();
```

## 🔧 API Client Configuration

The `apiClient` is configured with:

```typescript
// Automatic JSON handling
headers: {
  'Content-Type': 'application/json',
}

// Cookie-based authentication
withCredentials: true

// Request/Response interceptors for debugging
// Error handling with custom ApiError class
```

## 📊 Testing Your Implementation

Use the included API tester:

```typescript
import { apiTester } from "@/services/api-tester";

// Run comprehensive tests
await apiTester.runAllTests();

// Test individual components
const tester = new ApiTester();
await tester.testAuthenticationFlow();
await tester.testProfileManagement();
await tester.testSubjectManagement();
await tester.testSectionManagement();
```

## 🎯 Demo Component

Try the `AxiosApiDemo` component:

```tsx
import AxiosApiDemo from "@/components/demo/AxiosApiDemo";

export default function TestPage() {
  return <AxiosApiDemo />;
}
```

## 🔒 Authentication Flow

1. **Register/Login**: User credentials are sent to `/api/auth/session`
2. **JWT Cookie**: Server sets `HttpOnly` cookie automatically
3. **Authenticated Requests**: Axios sends cookies automatically with `withCredentials: true`
4. **Token Refresh**: When needed, refresh using `/api/auth/refresh?userId=...`
5. **Logout**: Clear cookie via `/api/auth/logout`

## 🛠️ Error Handling

All services use consistent error handling:

```typescript
try {
  const result = await authService.login(credentials);
  // Handle success
} catch (error) {
  if (error instanceof ApiError) {
    console.error("API Error:", error.status, error.message);
    // Handle specific HTTP errors
  } else {
    console.error("Network Error:", error.message);
    // Handle network/unexpected errors
  }
}
```

## 📝 Type Safety

All requests and responses are fully typed:

```typescript
// Request types
LoginRequest,
  RegisterRequest,
  CreateProfileRequest,
  // Response types
  etc.LoginResponse,
  ProfileResponse,
  ApiPaginatedResponse<T>,
  // Enum types
  etc.Role.ADMIN |
    Role.TEACHER |
    Role.STUDENT;
Gender.MALE | Gender.FEMALE | Gender.OTHER;
```

## 🔍 Debugging

The API client includes comprehensive logging:

```typescript
// Request logs
🔍 API Request Debug: { url, method, headers, data }

// Response logs
🔍 API Response Debug: { status, url, data }

// Error logs
🔥 API Response Error: { status, url, data }
```

## 📋 Migration Checklist

- ✅ All services converted to use Axios
- ✅ Consistent error handling across all endpoints
- ✅ Request/Response interceptors for debugging
- ✅ Cookie-based JWT authentication
- ✅ Type-safe API calls
- ✅ Comprehensive test suite
- ✅ Demo component for testing
- ✅ Updated type definitions
- ✅ Aligned with API documentation

## 🚨 Common Issues

1. **CORS Errors**: Ensure `withCredentials: true` is set
2. **Authentication**: Make sure JWT cookies are being sent
3. **Type Errors**: Verify request/response types match API documentation
4. **Network Errors**: Check if backend is running on correct port

## 📞 API Endpoints Reference

All endpoints are documented in `API_ENDPOINTS.md` and implemented in the services:

- **Auth**: `/api/auth/*` - Login, logout, refresh
- **Users**: `/api/users` - Register, get teachers
- **Profiles**: `/api/profiles/*` - CRUD operations, search
- **Subjects**: `/api/subjects/*` - CRUD operations, search
- **Sections**: `/api/sections/*` - CRUD operations, search

Your frontend is now fully integrated with Axios and ready for production use! 🎉
