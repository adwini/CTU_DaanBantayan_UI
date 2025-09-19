# CTU_DB_API - API Documentation

This document provides a comprehensive reference for all API endpoints, including request/response formats, authentication, and edge cases. Use this for team integration, Postman, or future maintenance.

---

## Authentication

### Login

- **Method:** POST
- **Path:** `/api/auth/session`
- **Description:** Authenticate user and receive JWT cookie.
- **Request Payload:**

```json
{
  "email": "user@example.com",
  "password": "secure123"
}
```

- **Response:**
  - **200 OK**
  - Sets `jwt` cookie
  - Body:

```json
{
  "userResponse": {
    /* user info */
  },
  "authorization": {
    /* token info */
  }
}
```

- **Edge Cases:**
  - Returns 401 for invalid credentials
  - Rate limiting may apply

### Refresh Token

- **Method:** POST
- **Path:** `/api/auth/refresh?userId=UUID`
- **Description:** Refresh JWT token for a user.
- **Request Payload:** None (userId as query param)
- **Response:**
  - **200 OK**
  - Sets new `jwt` cookie
  - Body: new JWT string
- **Edge Cases:**
  - 400 if userId missing/invalid
  - 401 if refresh fails

### Logout

- **Method:** POST
- **Path:** `/api/auth/logout`
- **Description:** Invalidate JWT and clear cookie.
- **Request Payload:** None
- **Response:**
  - **200 OK**
  - Body: `"Logged out successfully"`
- **Edge Cases:**
  - Requires valid `jwt` cookie

---

## Users

### Register User

- **Method:** POST
- **Path:** `/api/users`
- **Description:** Register a new user (admin only).
- **Request Payload:**

```json
{
  "email": "user@example.com",
  "password": "secure123",
  "role": "STUDENT" // or "TEACHER", "ADMIN"
}
```

- **Response:**
  - **201 Created**
  - Body: user ID or success message
- **Edge Cases:**
  - Requires valid admin `jwt` cookie
  - 400 if email already exists

### Get All Teachers

- **Method:** GET
- **Path:** `/api/users/teachers`
- **Description:** List all teacher profiles.
- **Response:**
  - **200 OK**
  - Body: array of teacher profiles
- **Edge Cases:**
  - Requires valid `jwt` cookie

### Update User Status

- **Method:** PUT
- **Path:** `/api/users?id=UUID`
- **Description:** Update user status (e.g., activate/deactivate).
- **Request Payload:** None (id as query param)
- **Response:**
  - **200 OK**
  - Body: success message
- **Edge Cases:**
  - Requires valid `jwt` cookie
  - 400 if id missing/invalid

---

## Profiles

### Get My Profile

- **Method:** GET
- **Path:** `/api/profiles/me`
- **Description:** Get the profile of the authenticated user.
- **Response:**
  - **200 OK**
  - Body: profile object
- **Edge Cases:**
  - Requires valid `jwt` cookie

### Create Profile

- **Method:** POST
- **Path:** `/api/profiles`
- **Description:** Create a profile for the authenticated user.
- **Request Payload:**

```json
{
  "firstName": "John",
  "middleName": "A.",
  "lastName": "Doe",
  "gender": "MALE", // or "FEMALE", "OTHER"
  "birthDate": "1990-01-01",
  "contactNumber": "+1234567890",
  "address": "123 Main St"
}
```

- **Response:**
  - **201 Created**
  - Body: profile ID or success message
- **Edge Cases:**
  - Requires valid `jwt` cookie
  - 400 for missing required fields

### Update Profile

- **Method:** PUT
- **Path:** `/api/profiles/{id}`
- **Description:** Update the profile of the authenticated user.
- **Request Payload:** Same as Create Profile
- **Response:**
  - **201 Created**
  - Body: profile ID or success message
- **Edge Cases:**
  - Requires valid `jwt` cookie
  - 400 for missing/invalid fields

### Search Profiles

- **Method:** GET
- **Path:** `/api/profiles`
- **Description:** Search/filter profiles with pagination.
- **Query Params:**
  - `role` (optional): `ADMIN`, `TEACHER`, `STUDENT`
  - `name` (optional): string
  - `page` (default 0): int
  - `size` (default 10): int
- **Response:**
  - **200 OK**
  - Body: paginated list of profiles
- **Edge Cases:**
  - Requires valid `jwt` cookie

---

## Sections

### Create Section

- **Method:** POST
- **Path:** `/api/sections`
- **Description:** Create a new section.
- **Request Payload:**

```json
{
  "name": "Section A",
  "gradeLevel": "Grade 10",
  "adviser": "Jane Smith"
}
```

- **Response:**
  - **201 Created**
  - Body: section ID or success message
- **Edge Cases:**
  - Requires valid `jwt` cookie
  - Adviser must exist

### Search Sections

- **Method:** GET
- **Path:** `/api/sections`
- **Description:** Search/filter sections with pagination.
- **Query Params:**
  - `name`, `gradeLevel`, `adviserName` (all optional)
  - `page` (default 0), `size` (default 10)
- **Response:**
  - **200 OK**
  - Body: paginated list of sections
- **Edge Cases:**
  - No auth required

### Update Section

- **Method:** POST
- **Path:** `/api/sections/{id}`
- **Description:** Update a section.
- **Request Payload:**

```json
{
  "id": "uuid",
  "name": "Section B",
  "gradeLevel": "Grade 11",
  "adviser": "Jane Smith",
  "createdAt": "2025-09-05T10:00:00",
  "updatedAt": "2025-09-05T15:30:00"
}
```

- **Response:**
  - **200 OK**
  - Body: success message
- **Edge Cases:**
  - Adviser must exist

---

## Subjects

### Create Subject

- **Method:** POST
- **Path:** `/api/subjects`
- **Description:** Create a new subject.
- **Request Payload:**

```json
{
  "subjectCode": "MATH101",
  "name": "Mathematics 101"
}
```

- **Response:**
  - **201 Created**
  - Body: subject ID or success message
- **Edge Cases:**
  - Requires valid `jwt` cookie

### Update Subject

- **Method:** PUT
- **Path:** `/api/subjects`
- **Description:** Update a subject.
- **Request Payload:**

```json
{
  "subjectCode": "MATH102",
  "name": "Advanced Math",
  "id": "uuid",
  "createdAt": "2025-09-05T10:00:00",
  "updatedAt": "2025-09-05T15:30:00"
}
```

- **Response:**
  - **201 Created**
  - Body: success message
- **Edge Cases:**
  - Requires valid `jwt` cookie

### Search Subjects

- **Method:** GET
- **Path:** `/api/subjects`
- **Description:** Search/filter subjects with pagination.
- **Query Params:**
  - `subjectCode`, `name` (optional)
  - `page` (default 0), `size` (default 10)
- **Response:**
  - **200 OK**
  - Body: paginated list of subjects
- **Edge Cases:**
  - Requires valid `jwt` cookie

### Delete Subject

- **Method:** DELETE
- **Path:** `/api/subjects?id=UUID`
- **Description:** Delete a subject by ID.
- **Response:**
  - **200 OK**
  - Body: empty
- **Edge Cases:**
  - Requires valid `jwt` cookie
  - 400 if id missing/invalid

---

## General Notes

- All authenticated endpoints require a valid `jwt` cookie.
- All dates/times use ISO 8601 format.
- All UUIDs must be valid.
- Validation errors return 400 with error details.
- Unauthorized access returns 401.
- Not found returns 404.
- Server errors return 500.

---

## Example Error Response

```json
{
  "status": "error",
  "message": "Invalid credentials"
}
```

---

For further details, see the DTO classes in `src/main/kotlin/com/kapston/CTU_DB_API/domain/dto/`.

After installing, set up your environment variables:

➤ Set JAVA_HOME

<details> <summary>📍 Windows Instructions</summary>
Press the <kbd>Windows</kbd> key and search for env, then press Enter

Click on Environment Variables

Under User Variables or System Variables, click New

Add the following:

Variable Name: JAVA_HOME

Variable Value: C:\Program Files\Java\jdk-21 --change the version you're using

Find and select the Path variable, then click Edit

Click New and add: %JAVA_HOME%\bin

</details>
*******************************************
✅ Install PostgreSQL
Download PostgreSQL from:
👉 https://www.postgresql.org/download/

For visual guidance, see this YouTube tutorial:
▶️ PostgreSQL Installation Guide

✅ Set Up the Database
Once PostgreSQL is installed, open a terminal and run:

<details> createdb ctu_db </details>

This will create a new database named ctu_db.

---

📦 .env Template
Create a .env in the root folder:

--Paste this

<details>
spring.datasource.url=jdbc:postgresql://localhost:5432/ctu_db
  
spring.datasource.username={yourusername}

spring.datasource.password={yourpassword}

spring.datasource.driver-class-name=org.postgresql.Driver

</details>
