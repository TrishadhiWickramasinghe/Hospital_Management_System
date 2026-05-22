# Hospital Management System - Spring Boot 3 Backend

A comprehensive Spring Boot 3 backend for the Hospital Management System with JWT authentication, MongoDB integration, and role-based access control.

## Features

- **Spring Boot 3** - Latest Spring Boot framework with Java 17
- **Spring Security** - Secure authentication and authorization
- **JWT Authentication** - Token-based authentication with HS256
- **MongoDB** - NoSQL database integration with Spring Data MongoDB
- **Role-Based Access Control** - Admin, Doctor, Nurse, and Receptionist roles
- **Validation** - Input validation with Jakarta Validation
- **Exception Handling** - Global exception handler with standardized responses
- **CORS Support** - Configured for frontend communication
- **Lombok** - Reduce boilerplate code
- **MapStruct** - Object mapping (ready for use)

## Project Structure

```
backend/
├── src/main/java/com/hospital/
│   ├── HospitalManagementSystemApplication.java
│   ├── auth/
│   │   ├── controller/
│   │   │   └── AuthController.java
│   │   ├── dto/
│   │   │   ├── LoginRequest.java
│   │   │   ├── RegisterRequest.java
│   │   │   ├── LoginResponse.java
│   │   │   └── UserDto.java
│   │   └── service/
│   │       └── AuthService.java
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── JwtUtil.java
│   │   ├── JwtAuthFilter.java
│   │   └── CustomUserDetailsService.java
│   └── shared/
│       ├── document/
│       │   └── UserDocument.java
│       ├── dto/
│       │   └── ApiResponse.java
│       ├── exception/
│       │   └── GlobalExceptionHandler.java
│       └── repository/
│           └── UserRepository.java
├── src/main/resources/
│   └── application.yml
├── build.gradle.kts
├── settings.gradle.kts
├── gradlew
├── gradlew.bat
├── gradle/
│   └── wrapper/
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
└── .gitignore
```

## Prerequisites

- **Java 17+**
- **Gradle Wrapper** (included)
- **MongoDB 5.0+**
- **Git**

## Installation & Setup

### 1. Clone the Repository

```bash
cd hospital-management-system/backend
```

### 2. Set Environment Variables

Create a `.env` file or export variables:

```bash
# MongoDB Connection
export MONGO_URI="mongodb://localhost:27017/hospital_db"

# JWT Configuration
export JWT_SECRET="your-super-secret-key-change-this-in-production"
```

### 3. Install Dependencies

```bash
./gradlew clean build
```

### 4. Run the Application

```bash
./gradlew bootRun
```

The server will start on `http://localhost:3001/api`

## API Endpoints

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "doctor@hospital.com",
  "password": "password"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-id",
      "name": "Dr. John Smith",
      "email": "doctor@hospital.com",
      "role": "DOCTOR",
      "iat": 1234567890,
      "exp": 1234654290
    }
  },
  "statusCode": 200
}
```

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Jane Nurse",
  "email": "jane@hospital.com",
  "password": "password123",
  "role": "NURSE"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-id",
      "name": "Jane Nurse",
      "email": "jane@hospital.com",
      "role": "NURSE",
      "iat": 1234567890,
      "exp": 1234654290
    }
  },
  "statusCode": 201
}
```

#### Health Check
```http
GET /api/auth/health
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": "Backend is running",
  "statusCode": 200
}
```

## Security Configuration

### Public Routes
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/health`

### Protected Routes
- All other routes require valid JWT token in `Authorization: Bearer {token}` header

### JWT Token Structure

```json
{
  "sub": "user-id",
  "role": "DOCTOR",
  "userId": "user-id",
  "iat": 1234567890,
  "exp": 1234654290
}
```

- **Algorithm:** HS256
- **Expiration:** 24 hours (configurable)
- **Secret:** From `JWT_SECRET` environment variable

## Password Security

All passwords are hashed using **BCrypt** before storage. During login:
1. User provides plain text password
2. System extracts hash from database
3. BCrypt compares plain text with stored hash
4. If match, JWT token is generated

## MongoDB Collections

### users
```javascript
{
  "_id": ObjectId,
  "name": String,
  "email": String (unique),
  "passwordHash": String,
  "role": String (ADMIN | DOCTOR | NURSE | RECEPTIONIST),
  "createdAt": ISODate,
  "updatedAt": ISODate,
  "active": Boolean
}
```

## Error Handling

All errors return standardized responses:

```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400,
  "timestamp": 1234567890
}
```

### Status Codes

- **200** - OK
- **201** - Created
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (invalid credentials)
- **403** - Forbidden (insufficient permissions)
- **409** - Conflict (user already exists)
- **500** - Internal Server Error

## Building for Production

### Create Optimized JAR

```bash
./gradlew clean bootJar
```

### Run Production Build

```bash
java -jar build/libs/hospital-management-system-1.0.0.jar
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/hospital_db` | Yes |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | `your-super-secret-key-change-this-in-production` | Yes |
| `SERVER_PORT` | Server port | `3001` | No |

## Development

### Hot Reload
Spring Boot DevTools are included. Changes to source files trigger automatic restart.

### Logging
Configure logging level in `application.yml`:

```yaml
logging:
  level:
    com.hospital: DEBUG
```

## Testing

Run unit tests:

```bash
mvn test
```

Run integration tests:

```bash
mvn verify
```

## Dependencies

### Core
- `spring-boot-starter-web` - Web development
- `spring-boot-starter-security` - Authentication & Authorization
- `spring-boot-starter-data-mongodb` - MongoDB integration
- `spring-boot-starter-validation` - Input validation

### Security
- `jjwt-api`, `jjwt-impl`, `jjwt-jackson` - JWT handling

### Development
- `lombok` - Boilerplate reduction
- `mapstruct` - Object mapping
- `spring-boot-devtools` - Hot reload

### Testing
- `spring-boot-starter-test` - Unit testing
- `spring-security-test` - Security testing

## Troubleshooting

### MongoDB Connection Error

**Error:** `Connection refused to localhost:27017`

**Solution:** 
```bash
# Make sure MongoDB is running
# Windows
mongod

# macOS/Linux
brew services start mongodb-community
```

### JWT Token Expired

**Error:** `Invalid or expired token`

**Solution:** Generate a new token by logging in again. Token expires after 24 hours.

### Password Not Matching

**Error:** `Invalid email or password`

**Solution:** Ensure password is at least 6 characters. Note that passwords are case-sensitive.

## API Documentation

For detailed API documentation, run the application and visit:

```
http://localhost:3001/swagger-ui.html
```

*(Swagger integration can be added by including `springdoc-openapi` dependency)*

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## Security Best Practices

1. **Change JWT_SECRET** to a strong, randomly generated value in production
2. **Use HTTPS** in production
3. **Validate all inputs** using Bean Validation
4. **Implement rate limiting** for authentication endpoints
5. **Use environment variables** for sensitive configuration
6. **Regularly update dependencies** for security patches
7. **Implement CSRF protection** for stateful operations
8. **Log authentication attempts** for audit purposes

## License

This project is provided as-is for educational purposes.

## Support

For issues or questions, refer to the documentation or contact the development team.
