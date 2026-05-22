# Hospital Management System - Backend API Documentation

## Base URL

```
http://localhost:3001/api
```

## Authentication

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Authentication Endpoints

### 1. Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user with email and password

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTAwMSIsInJvbGUiOiJET0NUT1IiLCJ1c2VySWQiOiJ1c2VyLTAwMSIsImlhdCI6MTcxNjI5NDAwMCwiZXhwIjoxNzE2MzgwNDAwfQ...",
    "user": {
      "id": "user-001",
      "name": "Dr. John Smith",
      "email": "doctor@hospital.com",
      "role": "DOCTOR",
      "iat": 1716294000,
      "exp": 1716380400
    }
  },
  "statusCode": 200,
  "timestamp": 1716294000123
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid email or password",
  "statusCode": 401,
  "timestamp": 1716294000123
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@hospital.com",
    "password": "password"
  }'
```

---

### 2. Register

**Endpoint:** `POST /auth/register`

**Description:** Register a new user

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Jane Nurse",
  "email": "jane@hospital.com",
  "password": "password123",
  "role": "NURSE"
}
```

**Valid Roles:**
- `ADMIN`
- `DOCTOR`
- `NURSE`
- `RECEPTIONIST`

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-002",
      "name": "Jane Nurse",
      "email": "jane@hospital.com",
      "role": "NURSE",
      "iat": 1716294000,
      "exp": 1716380400
    }
  },
  "statusCode": 201,
  "timestamp": 1716294000123
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Email already registered",
  "statusCode": 400,
  "timestamp": 1716294000123
}
```

**Validation Errors (400 Bad Request):**
```json
{
  "success": false,
  "error": "Validation failed",
  "data": {
    "email": "Email must be valid",
    "password": "Password must be at least 6 characters",
    "name": "Name is required"
  },
  "statusCode": 400,
  "timestamp": 1716294000123
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Nurse",
    "email": "jane@hospital.com",
    "password": "password123",
    "role": "NURSE"
  }'
```

---

### 3. Health Check

**Endpoint:** `GET /auth/health`

**Description:** Check if backend is running

**Response (200 OK):**
```json
{
  "success": true,
  "data": "Backend is running",
  "statusCode": 200,
  "timestamp": 1716294000123
}
```

**cURL Example:**
```bash
curl http://localhost:3001/api/auth/health
```

---

## Demo Users

Pre-configured demo users for testing (once registered):

| Email | Password | Role | Notes |
|-------|----------|------|-------|
| admin@hospital.com | password | ADMIN | System administrator |
| doctor@hospital.com | password | DOCTOR | Medical doctor |
| nurse@hospital.com | password | NURSE | Hospital nurse |
| receptionist@hospital.com | password | RECEPTIONIST | Front desk receptionist |

## JWT Token Structure

The token contains the following claims:

```json
{
  "sub": "user-001",                 // User ID
  "role": "DOCTOR",                  // User role
  "userId": "user-001",              // User ID (duplicate)
  "iat": 1716294000,                 // Issued at (Unix timestamp)
  "exp": 1716380400                  // Expires at (Unix timestamp)
}
```

**Token Expiration:** 24 hours from issuance

**Algorithm:** HS256 (HMAC with SHA-256)

## Error Handling

All errors follow this standard format:

```json
{
  "success": false,
  "error": "Error description",
  "statusCode": 400,
  "timestamp": 1716294000123
}
```

### HTTP Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | OK | Successful request |
| 201 | Created | User registered successfully |
| 400 | Bad Request | Validation error, duplicate email |
| 401 | Unauthorized | Invalid credentials |
| 403 | Forbidden | User doesn't have required role |
| 409 | Conflict | Resource already exists |
| 500 | Internal Server Error | Unexpected server error |

## Rate Limiting

Currently not implemented. Recommended for production:
- Login: 5 requests per 15 minutes
- Register: 3 requests per hour
- General API: 100 requests per minute

## CORS Configuration

Frontend can make requests from:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://127.0.0.1:3000`

**Allowed Methods:** GET, POST, PUT, DELETE, PATCH, OPTIONS

**Allowed Headers:** All (`*`)

## Request/Response Examples

### JavaScript/Fetch

```javascript
// Login
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'doctor@hospital.com',
    password: 'password'
  })
});

const data = await response.json();
const token = data.data.token;

// Use token in subsequent requests
const protectedResponse = await fetch('http://localhost:3001/api/protected-endpoint', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Python/Requests

```python
import requests

# Login
response = requests.post(
    'http://localhost:3001/api/auth/login',
    json={
        'email': 'doctor@hospital.com',
        'password': 'password'
    }
)

data = response.json()
token = data['data']['token']

# Use token
headers = {
    'Authorization': f'Bearer {token}'
}

protected_response = requests.get(
    'http://localhost:3001/api/protected-endpoint',
    headers=headers
)
```

### cURL with Token

```bash
# Login and extract token
TOKEN=$(curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@hospital.com","password":"password"}' \
  | jq -r '.data.token')

# Use token in protected request
curl -X GET http://localhost:3001/api/protected-endpoint \
  -H "Authorization: Bearer $TOKEN"
```

### Axios (Frontend)

```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api'
});

// Login
const loginResponse = await apiClient.post('/auth/login', {
  email: 'doctor@hospital.com',
  password: 'password'
});

const token = loginResponse.data.data.token;

// Add token to all requests
apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Make protected request
const response = await apiClient.get('/protected-endpoint');
```

## Password Requirements

- **Minimum Length:** 6 characters
- **Maximum Length:** No limit
- **Case Sensitive:** Yes
- **Special Characters:** Optional
- **Numbers:** Optional

**Examples of Valid Passwords:**
- `password`
- `Pass123`
- `MyP@ss!Word`

## Email Validation

- Must be a valid email format
- Unique across all users
- Used as login identifier
- Case-insensitive for login

**Valid Email Examples:**
- `doctor@hospital.com`
- `john.smith@hospital.co.uk`
- `user+tag@example.com`

## User Roles & Permissions

| Role | Description | Features |
|------|-------------|----------|
| **ADMIN** | System administrator | Manage users, system settings, reports |
| **DOCTOR** | Medical professional | Manage patients, medical records, appointments |
| **NURSE** | Clinical staff | Patient monitoring, task management |
| **RECEPTIONIST** | Front desk staff | Appointment booking, patient check-in |

## Security Best Practices

1. **Token Storage:** Store token securely (localStorage/cookies)
2. **HTTPS Only:** Always use HTTPS in production
3. **Token Refresh:** Implement refresh token mechanism
4. **Logout:** Clear token from client on logout
5. **Rate Limiting:** Implement on login endpoint
6. **Input Validation:** Validate all inputs
7. **CSRF Protection:** Implement CSRF tokens for mutations
8. **Logging:** Log all authentication attempts

## Troubleshooting

### "Invalid email or password"
- Check email exists in system
- Verify password is correct (case-sensitive)
- Ensure user is active

### "Email already registered"
- Use a different email address
- Or login with existing account
- Password reset if forgotten

### "Invalid or expired token"
- Token has expired (24 hours)
- Login again to get new token
- Token format is incorrect
- Token was modified

### "Access Denied"
- User role lacks permission
- Token is invalid
- User account is disabled

### "Connection refused"
- Backend server not running
- Check if port 3001 is accessible
- Verify MongoDB is running

## Support & Documentation

For more information:
- See `README.md` for setup instructions
- See `QUICKSTART.md` for quick start guide
- Check application logs for detailed errors
