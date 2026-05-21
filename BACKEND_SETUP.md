# Backend API Setup Guide

This file provides guidance on setting up the backend API that works with the Hospital Management System frontend.

## API Endpoints Required

### Authentication Endpoints

#### POST `/api/auth/login`

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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "doctor-001",
      "email": "doctor@hospital.com",
      "name": "Dr. John Smith",
      "role": "DOCTOR",
      "department": "Cardiology",
      "iat": 1234567890,
      "exp": 1234654290
    }
  },
  "statusCode": 200
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid email or password",
  "statusCode": 401
}
```

### User Endpoints

#### GET `/api/users`
Requires: `Authorization: Bearer {token}`
Response: Array of user objects

#### POST `/api/users`
Requires: `Authorization: Bearer {token}` + Admin role
Create new user

#### PUT `/api/users/:id`
Requires: `Authorization: Bearer {token}` + Admin role
Update user

#### DELETE `/api/users/:id`
Requires: `Authorization: Bearer {token}` + Admin role
Delete user

### Doctor Endpoints

#### GET `/api/patients`
Requires: `Authorization: Bearer {token}` + Doctor/Nurse role
Get list of patients

#### GET `/api/appointments`
Requires: `Authorization: Bearer {token}`
Get appointments based on role

### Admin Endpoints

#### GET `/api/departments`
Requires: `Authorization: Bearer {token}` + Admin role
Get all departments

#### POST `/api/departments`
Requires: `Authorization: Bearer {token}` + Admin role
Create new department

## JWT Token Structure

The token should contain the following claims:

```json
{
  "iss": "hospital-management-system",
  "sub": "user-id",
  "id": "user-001",
  "email": "doctor@hospital.com",
  "name": "Dr. John Smith",
  "role": "DOCTOR",
  "department": "Cardiology",
  "iat": 1234567890,
  "exp": 1234654290
}
```

**Key:** Use the same secret defined in `JWT_SECRET` environment variable.

## Example Node.js/Express Backend

Here's a basic example of how to structure your backend:

```javascript
// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Mock users database
const users = {
  'admin@hospital.com': {
    id: 'admin-001',
    email: 'admin@hospital.com',
    password: 'password', // In production: use bcrypt
    name: 'Admin User',
    role: 'ADMIN',
  },
  'doctor@hospital.com': {
    id: 'doctor-001',
    email: 'doctor@hospital.com',
    password: 'password',
    name: 'Dr. John Smith',
    role: 'DOCTOR',
    department: 'Cardiology',
  },
  'nurse@hospital.com': {
    id: 'nurse-001',
    email: 'nurse@hospital.com',
    password: 'password',
    name: 'Jane Nurse',
    role: 'NURSE',
  },
  'receptionist@hospital.com': {
    id: 'receptionist-001',
    email: 'receptionist@hospital.com',
    password: 'password',
    name: 'Sarah Reception',
    role: 'RECEPTIONIST',
  },
};

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users[email];
  
  if (!user || user.password !== password) {
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password',
      statusCode: 401,
    });
  }

  // Create JWT token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
      },
    },
    statusCode: 200,
  });
});

module.exports = router;
```

## Middleware for Backend

Add this middleware to all protected routes:

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Missing or invalid authorization header',
      statusCode: 401,
    });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
      statusCode: 401,
    });
  }
};

module.exports = authMiddleware;
```

## CORS Configuration

Add CORS headers to allow requests from the frontend:

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

## Testing the API

Use curl or Postman to test endpoints:

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@hospital.com",
    "password": "password"
  }'

# Protected request
curl -X GET http://localhost:3001/api/patients \
  -H "Authorization: Bearer {token}"
```

## Database Models (Example)

### User Model
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String (ADMIN | DOCTOR | NURSE | RECEPTIONIST),
  department: String,
  phone: String,
  active: Boolean,
  createdAt: Date,
  updatedAt: Date,
}
```

### Patient Model
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  dateOfBirth: Date,
  gender: String,
  address: String,
  medicalHistory: Array,
  registeredDate: Date,
  status: String,
  createdAt: Date,
  updatedAt: Date,
}
```

### Appointment Model
```javascript
{
  _id: ObjectId,
  patientId: ObjectId,
  doctorId: ObjectId,
  date: Date,
  time: String,
  duration: Number,
  status: String (scheduled | completed | cancelled),
  notes: String,
  createdAt: Date,
  updatedAt: Date,
}
```

## Environment Variables for Backend

```
PORT=3001
NODE_ENV=development
JWT_SECRET=your-secret-key-change-this-in-production
FRONTEND_URL=http://localhost:3000
DATABASE_URL=mongodb://localhost:27017/hospital-management
```

## Security Best Practices

1. **Hash Passwords:** Use bcrypt for password hashing
2. **JWT Secret:** Use a strong, randomly generated secret (min 32 chars)
3. **Token Expiration:** Implement token expiration (e.g., 24 hours)
4. **Refresh Tokens:** Implement refresh token mechanism
5. **Rate Limiting:** Add rate limiting to prevent brute force attacks
6. **Input Validation:** Validate all incoming data
7. **HTTPS:** Always use HTTPS in production
8. **CORS:** Configure CORS properly to only allow frontend domain
9. **Logging:** Log authentication attempts and errors
10. **Database:** Encrypt sensitive data in database

## References

- JWT (JSON Web Tokens): https://jwt.io/
- Express.js: https://expressjs.com/
- MongoDB: https://www.mongodb.com/
- OWASP Security Guidelines: https://owasp.org/
