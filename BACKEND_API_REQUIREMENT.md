# 🚨 Backend API Implementation Required

## **Issue Summary**

The frontend requires a **GET** endpoint for `/api/users` to fetch all system users with their profile data. Currently, the backend only supports **POST** `/api/users` for user creation, causing a **405 Method Not Allowed** error when the frontend tries to fetch users.

---

## **Current Error**

```
2025-09-08T22:52:44.242+08:00  WARN 8308 --- [CTU_DB_API] [nio-8080-exec-5]
.w.s.m.s.DefaultHandlerExceptionResolver : Resolved [org.springframework.web.HttpRequestMethodNotSupportedException:
Request method 'GET' is not supported]
```

**Root Cause:** Frontend calls `GET /api/users` but backend doesn't have this endpoint implemented.

---

## **Required Implementation**

### **🎯 Endpoint Specification**

**URL:** `GET /api/users`

**Query Parameters:**

- `email` (optional): Filter by email containing text
- `role` (optional): Filter by user role (ADMIN, TEACHER, STUDENT)
- `name` (optional): Filter by first name or last name containing text
- `page` (optional, default: 0): Page number for pagination
- `size` (optional, default: 20): Number of items per page

**Example Requests:**

```http
GET /api/users
GET /api/users?role=TEACHER&page=0&size=10
GET /api/users?name=john&page=1&size=20
GET /api/users?email=@gmail.com&role=STUDENT
```

---

## **Expected Response Format**

### **Success Response (200 OK):**

```json
{
  "content": [
    {
      "id": "user-uuid-123",
      "email": "john.doe@example.com",
      "role": "TEACHER",
      "isActive": true,
      "createdAt": "2025-09-08T10:00:00",
      "updatedAt": "2025-09-08T12:00:00",
      "profile": {
        "id": "profile-uuid-456",
        "firstName": "John",
        "lastName": "Doe",
        "middleName": "Michael",
        "gender": "MALE",
        "birthDate": "1990-01-15",
        "contactNumber": "+63-912-345-6789",
        "address": "123 Main Street, Cebu City"
      }
    },
    {
      "id": "user-uuid-789",
      "email": "jane.smith@example.com",
      "role": "STUDENT",
      "isActive": true,
      "createdAt": "2025-09-08T11:00:00",
      "updatedAt": null,
      "profile": null
    }
  ],
  "totalElements": 150,
  "totalPages": 8,
  "size": 20,
  "number": 0
}
```

### **Error Response (4xx/5xx):**

```json
{
  "error": "Bad Request",
  "message": "Invalid role parameter",
  "timestamp": "2025-09-08T22:52:44.242+08:00",
  "path": "/api/users"
}
```

---

## **🔄 Additional Required Endpoint - Update Profile**

### **Missing Endpoint Issue:**

Frontend calls `PUT /api/profiles/{id}` to update user profiles but gets 500 Internal Server Error.

### **🎯 Endpoint Specification**

**URL:** `PUT /api/profiles/{id}`

**Path Parameters:**

- `id` (required): Profile UUID to update

**Request Body:**

```json
{
  "firstName": "John",
  "middleName": "Michael",
  "lastName": "Doe",
  "gender": "MALE",
  "birthDate": "1990-01-15",
  "contactNumber": "+63-912-345-6789",
  "address": "123 Main Street, Cebu City"
}
```

### **Success Response (200 OK):**

```json
{
  "message": "Profile updated successfully",
  "timestamp": "2025-09-09T10:30:00.000+08:00"
}
```

### **Error Response (4xx/5xx):**

```json
{
  "error": "Bad Request",
  "message": "Profile not found",
  "timestamp": "2025-09-09T10:30:00.000+08:00",
  "path": "/api/profiles/invalid-uuid"
}
```

---

## **Implementation Guide**

### **1. Controller Method (UserController.kt)**

```kotlin
@RestController
@RequestMapping("/api/users")
class UserController @Autowired constructor(
    private val userService: UserService
) {

    @GetMapping
    fun getAllSystemUsers(
        @RequestParam(required = false) email: String?,
        @RequestParam(required = false) role: String?,
        @RequestParam(required = false) name: String?,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int
    ): ResponseEntity<SystemUsersPageResponse> {

        val pageable = PageRequest.of(page, size, Sort.by("createdAt").descending())
        val result = userService.getAllSystemUsers(email, role, name, pageable)

        return ResponseEntity.ok(result)
    }
}
```

### **2. Service Method (UserService.kt)**

```kotlin
@Service
class UserService @Autowired constructor(
    private val userRepository: UserRepository,
    private val profileRepository: ProfileRepository
) {

    fun getAllSystemUsers(
        email: String?,
        role: String?,
        name: String?,
        pageable: Pageable
    ): SystemUsersPageResponse {

        // Build dynamic query with filters
        val specification = buildUserSpecification(email, role, name)
        val usersPage = userRepository.findAll(specification, pageable)

        // Transform to DTOs with profile data
        val systemUsers = usersPage.content.map { user ->
            val profile = profileRepository.findByUserId(user.id)
            mapToSystemUserDTO(user, profile)
        }

        return SystemUsersPageResponse(
            content = systemUsers,
            totalElements = usersPage.totalElements,
            totalPages = usersPage.totalPages,
            size = usersPage.size,
            number = usersPage.number
        )
    }

    private fun buildUserSpecification(
        email: String?,
        role: String?,
        name: String?
    ): Specification<User> {
        return Specification.where<User>(null)
            .and(email?.let { emailContains(it) })
            .and(role?.let { roleEquals(it) })
            .and(name?.let { nameContains(it) })
    }

    private fun emailContains(email: String) =
        Specification<User> { root, _, cb ->
            cb.like(cb.lower(root.get("email")), "%${email.lowercase()}%")
        }

    private fun roleEquals(role: String) =
        Specification<User> { root, _, cb ->
            cb.equal(root.get("role"), role)
        }

    private fun nameContains(name: String) =
        Specification<User> { root, _, cb ->
            val profileJoin = root.join<User, Profile>("profile", JoinType.LEFT)
            cb.or(
                cb.like(cb.lower(profileJoin.get("firstName")), "%${name.lowercase()}%"),
                cb.like(cb.lower(profileJoin.get("lastName")), "%${name.lowercase()}%")
            )
        }

    private fun mapToSystemUserDTO(user: User, profile: Profile?): SystemUserDTO {
        return SystemUserDTO(
            id = user.id,
            email = user.email,
            role = user.role.name,
            isActive = user.isActive ?: true,
            createdAt = user.createdAt,
            updatedAt = user.updatedAt,
            profile = profile?.let {
                ProfileDTO(
                    id = it.id,
                    firstName = it.firstName,
                    lastName = it.lastName,
                    middleName = it.middleName,
                    gender = it.gender,
                    birthDate = it.birthDate,
                    contactNumber = it.contactNumber,
                    address = it.address
                )
            }
        )
    }
}
```

### **3. Data Transfer Objects**

```kotlin
// SystemUserDTO.kt
data class SystemUserDTO(
    val id: String,
    val email: String,
    val role: String,
    val isActive: Boolean,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime?,
    val profile: ProfileDTO?
)

// ProfileDTO.kt
data class ProfileDTO(
    val id: String,
    val firstName: String,
    val lastName: String,
    val middleName: String?,
    val gender: Gender,
    val birthDate: LocalDate,
    val contactNumber: String,
    val address: String
)

// SystemUsersPageResponse.kt
data class SystemUsersPageResponse(
    val content: List<SystemUserDTO>,
    val totalElements: Long,
    val totalPages: Int,
    val size: Int,
    val number: Int
)
```

### **4. Entity Relationships**

Ensure your User entity has proper relationship with Profile:

```kotlin
@Entity
@Table(name = "users")
class User {
    @Id
    val id: String = UUID.randomUUID().toString()

    @Column(unique = true)
    val email: String

    @Enumerated(EnumType.STRING)
    val role: Role

    val isActive: Boolean? = true

    @CreationTimestamp
    val createdAt: LocalDateTime = LocalDateTime.now()

    @UpdateTimestamp
    var updatedAt: LocalDateTime? = null

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    var profile: Profile? = null
}
```

---

## **Testing**

### **Test Cases to Implement:**

1. **Get all users:** `GET /api/users`
2. **Filter by role:** `GET /api/users?role=TEACHER`
3. **Filter by email:** `GET /api/users?email=gmail`
4. **Filter by name:** `GET /api/users?name=john`
5. **Pagination:** `GET /api/users?page=1&size=5`
6. **Combined filters:** `6. **Combined filters:** `GET /api/users?role=STUDENT&name=doe&page=0&size=10`

---

## **📝 Implementation Guide for PUT /api/profiles/{id}**

### **1. Controller Method (ProfileController.kt)**

```kotlin
@RestController
@RequestMapping("/api/profiles")
class ProfileController @Autowired constructor(
    private val profileService: ProfileService
) {

    @PutMapping("/{id}")
    fun updateProfile(
        @PathVariable id: String,
        @RequestBody @Valid updateRequest: UpdateProfileRequest
    ): ResponseEntity<ApiSuccessResponse> {

        profileService.updateProfile(id, updateRequest)

        return ResponseEntity.ok(
            ApiSuccessResponse(
                message = "Profile updated successfully",
                timestamp = LocalDateTime.now()
            )
        )
    }
}
```

### **2. Service Method (ProfileService.kt)**

```kotlin
@Service
class ProfileService @Autowired constructor(
    private val profileRepository: ProfileRepository
) {

    @Transactional
    fun updateProfile(id: String, updateRequest: UpdateProfileRequest) {
        val profile = profileRepository.findById(id)
            .orElseThrow { ProfileNotFoundException("Profile not found with id: $id") }

        // Update profile fields
        profile.firstName = updateRequest.firstName
        profile.middleName = updateRequest.middleName
        profile.lastName = updateRequest.lastName
        profile.gender = Gender.valueOf(updateRequest.gender)
        profile.birthDate = LocalDate.parse(updateRequest.birthDate)
        profile.contactNumber = updateRequest.contactNumber
        profile.address = updateRequest.address
        profile.updatedAt = LocalDateTime.now()

        profileRepository.save(profile)
    }
}
```

### **3. Request DTO**

```kotlin
data class UpdateProfileRequest(
    @field:NotBlank(message = "First name is required")
    val firstName: String,

    val middleName: String?,

    @field:NotBlank(message = "Last name is required")
    val lastName: String,

    @field:NotBlank(message = "Gender is required")
    val gender: String, // MALE, FEMALE, OTHER

    @field:NotBlank(message = "Birth date is required")
    @field:Pattern(regexp = "\d{4}-\d{2}-\d{2}", message = "Birth date must be in YYYY-MM-DD format")
    val birthDate: String,

    @field:NotBlank(message = "Contact number is required")
    val contactNumber: String,

    @field:NotBlank(message = "Address is required")
    val address: String
)
```

### **4. Response DTO**

```kotlin
data class ApiSuccessResponse(
    val message: String,
    val timestamp: LocalDateTime
)
```

### **5. Exception Handling**

```kotlin
class ProfileNotFoundException(message: String) : RuntimeException(message)

@ControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(ProfileNotFoundException::class)
    fun handleProfileNotFound(ex: ProfileNotFoundException): ResponseEntity<ErrorResponse> {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            ErrorResponse(
                error = "Not Found",
                message = ex.message ?: "Profile not found",
                timestamp = LocalDateTime.now(),
                path = "/api/profiles"
            )
        )
    }

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationErrors(ex: MethodArgumentNotValidException): ResponseEntity<ErrorResponse> {
        val errors = ex.bindingResult.fieldErrors.map { "${it.field}: ${it.defaultMessage}" }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            ErrorResponse(
                error = "Validation Failed",
                message = errors.joinToString(", "),
                timestamp = LocalDateTime.now(),
                path = "/api/profiles"
            )
        )
    }
}
```

---

## **Notes**`

7. **Empty results:** Should return empty content array
8. **Invalid parameters:** Should return appropriate error responses

### **Sample Test Data:**

```sql
-- Users with profiles
INSERT INTO users (id, email, role, is_active) VALUES
('user-1', 'john.doe@ctu.edu.ph', 'TEACHER', true),
('user-2', 'jane.smith@ctu.edu.ph', 'STUDENT', true);

INSERT INTO profiles (id, user_id, first_name, last_name, gender, birth_date, contact_number, address) VALUES
('profile-1', 'user-1', 'John', 'Doe', 'MALE', '1985-06-15', '+63-912-123-4567', 'Cebu City'),
('profile-2', 'user-2', 'Jane', 'Smith', 'FEMALE', '2000-03-22', '+63-912-765-4321', 'Mandaue City');

-- User without profile
INSERT INTO users (id, email, role, is_active) VALUES
('user-3', 'admin@ctu.edu.ph', 'ADMIN', true);
```

---

## **Priority**

🔴 **HIGH PRIORITY** - The user management feature in the frontend is currently broken without this endpoint.

---

## **Dependencies**

- Spring Boot Web
- Spring Data JPA
- JPA Specifications (for dynamic querying)
- Existing User and Profile entities
- Existing UserRepository and ProfileRepository

---

## **Notes**

- Users without profiles should still be returned with `profile: null`
- Implement proper error handling for invalid parameters
- Use pagination to handle large datasets efficiently
- Consider adding sorting options (by name, email, createdAt)
- The frontend expects this exact response format for proper data transformation

---

## **Questions?**

If you need clarification on any part of this implementation, please let me know:

- Database schema questions
- Specific Spring Boot configuration
- Additional filtering requirements
- Error handling preferences

**Contact:** Frontend Development Team
**Priority:** High
**Estimated Implementation Time:** 2-4 hours
