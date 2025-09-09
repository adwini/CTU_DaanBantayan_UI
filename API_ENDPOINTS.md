# CTU Database API - Endpoints Documentation

This document provides a comprehensive guide to all available API endpoints, request payloads, and response formats for the CTU Database API.

## Base URL

```
http://localhost:8080
```

## Authentication

Most endpoints require JWT authentication via cookies. After logging in, the JWT token will be automatically set as a cookie and used for subsequent requests.

---

## 🔐 Authentication Endpoints

### 1. Login

Authenticate a user and receive a JWT token.

**Endpoint:** `POST /api/auth/session`  
**Authentication:** None required  
**Headers:** `Content-Type: application/json`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Returns user information and sets JWT cookie

---

### 2. Refresh Token

Refresh an expired access token using a refresh token.

**Endpoint:** `POST /api/auth/refresh`  
**Authentication:** None required  
**Query Parameters:**

- `userId` (required): UUID of the user

**Example:**

```
POST /api/auth/refresh?userId=123e4567-e89b-12d3-a456-426614174000
```

**Response:** Returns new access token and updates JWT cookie

---

### 3. Logout

Logout the current user and invalidate the JWT token.

**Endpoint:** `POST /api/auth/logout`  
**Authentication:** Required (JWT Cookie)  
**Headers:** `Cookie: jwt=YOUR_JWT_TOKEN`

**Response:** Confirmation message and clears JWT cookie

---

## 👤 User Management Endpoints

### 4. Register User

Create a new user account.

**Endpoint:** `POST /api/users`  
**Authentication:** None required  
**Headers:** `Content-Type: application/json`

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "role": "STUDENT"
}
```

**Role Options:**

- `ADMIN`
- `TEACHER`
- `STUDENT`

**Response:** Success message with user ID

---

### 5. Get All Teachers

Retrieve a list of all teacher profiles.

**Endpoint:** `GET /api/teachers`  
**Authentication:** Required (JWT Cookie)  
**Headers:** `Cookie: jwt=YOUR_JWT_TOKEN`

**Response:** Array of teacher profile objects

---

## 👨‍💼 Profile Management Endpoints

### 6. Get My Profile

Retrieve the current user's profile information.

**Endpoint:** `GET /api/profiles/me`  
**Authentication:** Required (JWT Cookie)  
**Headers:** `Cookie: jwt=YOUR_JWT_TOKEN`

**Response:** Current user's profile data

---

### 7. Create Profile

Create a profile for the current user.

**Endpoint:** `POST /api/profiles`  
**Authentication:** Required (JWT Cookie)  
**Headers:**

- `Content-Type: application/json`
- `Cookie: jwt=YOUR_JWT_TOKEN`

**Request Body:**

```json
{
  "firstName": "John",
  "middleName": "Michael",
  "lastName": "Doe",
  "gender": "MALE",
  "birthDate": "1990-01-15",
  "contactNumber": "+1234567890",
  "address": "123 Main St, City, Country"
}
```

**Gender Options:**

- `MALE`
- `FEMALE`
- `OTHER`

**Date Format:** `YYYY-MM-DD`

**Response:** Success message with profile ID

---

### 8. Update Profile

Update the current user's profile information.

**Endpoint:** `PUT /api/profiles/{id}`  
**Authentication:** Required (JWT Cookie)  
**Headers:**

- `Content-Type: application/json`
- `Cookie: jwt=YOUR_JWT_TOKEN`

**Request Body:** Same as Create Profile

**Response:** Success message

---

### 9. Search Profiles

Search and filter profiles with pagination.

**Endpoint:** `GET /api/profiles`  
**Authentication:** Required (JWT Cookie)  
**Headers:** `Cookie: jwt=YOUR_JWT_TOKEN`

**Query Parameters (all optional):**

- `role`: Filter by role (`ADMIN`, `TEACHER`, `STUDENT`)
- `name`: Search by name (partial match)
- `page`: Page number (default: 0)
- `size`: Page size (default: 10)

**Example:**

```
GET /api/profiles?role=TEACHER&name=John&page=0&size=5
```

**Response:** Paginated list of profiles

---

## 📚 Subject Management Endpoints

### 10. Create Subject

Create a new subject.

**Endpoint:** `POST /api/subjects`  
**Authentication:** Required (JWT Cookie)  
**Headers:**

- `Content-Type: application/json`
- `Cookie: jwt=YOUR_JWT_TOKEN`

**Request Body:**

```json
{
  "subjectCode": "MATH101",
  "name": "Mathematics 101"
}
```

**Response:** Success message with subject ID

---

### 11. Update Subject

Update an existing subject.

**Endpoint:** `PUT /api/subjects`  
**Authentication:** Required (JWT Cookie)  
**Headers:**

- `Content-Type: application/json`
- `Cookie: jwt=YOUR_JWT_TOKEN`

**Request Body:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "subjectCode": "MATH102",
  "name": "Advanced Mathematics",
  "createdAt": "2025-09-05T10:00:00",
  "updatedAt": "2025-09-05T15:30:00"
}
```

**DateTime Format:** `YYYY-MM-DDTHH:mm:ss`

**Response:** Success message

---

### 12. Search Subjects

Search and filter subjects with pagination.

**Endpoint:** `GET /api/subjects`  
**Authentication:** Required (JWT Cookie)  
**Headers:** `Cookie: jwt=YOUR_JWT_TOKEN`

**Query Parameters (all optional):**

- `subjectCode`: Search by subject code (partial match)
- `name`: Search by subject name (partial match)
- `page`: Page number (default: 0)
- `size`: Page size (default: 10)

**Example:**

```
GET /api/subjects?subjectCode=MATH&name=Mathematics&page=0&size=10
```

**Response:** Paginated list of subjects

---

## 🏫 Section Management Endpoints

### 13. Create Section

Create a new class section.

**Endpoint:** `POST /api/sections`  
**Authentication:** Required (JWT Cookie)  
**Headers:**

- `Content-Type: application/json`
- `Cookie: jwt=YOUR_JWT_TOKEN`

**Request Body:**

```json
{
  "name": "Section A",
  "gradeLevel": "Grade 10",
  "adviser": "John Doe"
}
```

**Note:** The `adviser` field should contain the full name of an existing teacher profile.

**Response:** Success message with section ID

---

### 14. Search Sections

Search and filter sections with pagination.

**Endpoint:** `GET /api/sections`  
**Authentication:** None required

**Query Parameters (all optional):**

- `name`: Search by section name (partial match)
- `gradeLevel`: Search by grade level (partial match)
- `adviserName`: Search by adviser name (partial match)
- `page`: Page number (default: 0)
- `size`: Page size (default: 10)

**Example:**

```
GET /api/sections?gradeLevel=Grade%2010&name=Section%20A&page=0&size=10
```

**Note:** URL encode spaces as `%20`

**Response:** Paginated list of sections

---

### 15. Update Section

Update an existing section.

**Endpoint:** `POST /api/sections/{id}`  
**Authentication:** None required  
**Headers:** `Content-Type: application/json`

**URL Parameters:**

- `id`: UUID of the section to update

**Request Body:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Section B",
  "gradeLevel": "Grade 11",
  "adviser": "Jane Smith",
  "createdAt": "2025-09-05T10:00:00",
  "updatedAt": "2025-09-05T15:30:00"
}
```

**Response:** Success message

---

## 🔧 Testing with Postman

### Setting up Authentication

1. **Register a user** using `POST /api/users`
2. **Login** using `POST /api/auth/session`
3. The JWT token will be automatically set as a cookie
4. For subsequent requests, ensure cookies are enabled in Postman

### Cookie Configuration

- Enable "Send cookies" in Postman settings
- Or manually add `Cookie: jwt=YOUR_JWT_TOKEN` header for authenticated endpoints

### Common Headers

```
Content-Type: application/json
Cookie: jwt=YOUR_JWT_TOKEN_HERE
```

### UUID Format

All UUIDs should follow the standard format:

```
123e4567-e89b-12d3-a456-426614174000
```

### Date/DateTime Formats

- **Date:** `YYYY-MM-DD` (e.g., `2025-09-05`)
- **DateTime:** `YYYY-MM-DDTHH:mm:ss` (e.g., `2025-09-05T15:30:00`)

---

## 📋 Example Test Flow

1. **Register a new user:**

   ```
   POST /api/users
   Body: {"email": "test@example.com", "password": "password123", "role": "TEACHER"}
   ```

2. **Login with the user:**

   ```
   POST /api/auth/session
   Body: {"email": "test@example.com", "password": "password123"}
   ```

3. **Create a profile:**

   ```
   POST /api/profiles
   Body: {"firstName": "John", "lastName": "Doe", "gender": "MALE"}
   ```

4. **Create a subject:**

   ```
   POST /api/subjects
   Body: {"subjectCode": "MATH101", "name": "Mathematics 101"}
   ```

5. **Create a section:**
   ```
   POST /api/sections
   Body: {"name": "Section A", "gradeLevel": "Grade 10", "adviser": "John Doe"}
   ```

---

## ⚠️ Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

Error responses typically include a message describing the issue.

---

## 🚀 Environment Setup

Make sure the following environment variables are configured:

- `JWT_SECRET` - Base64 encoded JWT secret key
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - Database configuration

For development, the API runs on `http://localhost:8080` by default.
