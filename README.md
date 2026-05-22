# Hospital Management System

A comprehensive, full-stack Hospital Management System featuring a **Next.js 14 frontend** with role-based access control and a **Spring Boot 3 backend** with JWT authentication and MongoDB integration.

## Stack Overview

### Frontend - Next.js 14
- React 18 with TypeScript
- Server-side rendering with App Router
- Tailwind CSS & shadcn/ui components
- react-hook-form with Zod validation
- Axios HTTP client with JWT interceptors

### Backend - Spring Boot 3
- Java 17 with Maven
- Spring Security with JWT (HS256)
- MongoDB with Spring Data
- Role-based access control
- Comprehensive exception handling

## Project Structure

```
hospital-management-system/
├── frontend/         # Next.js 14 Application
├── backend/          # Spring Boot 3 Application
├── mobile-app/       # (Future) React Native/Flutter
└── README.md
```

## Features

### 🔐 Authentication & Authorization
- **JWT Tokens:** HS256 signed tokens with 24-hour expiration
- **Role-Based Access:** ADMIN, DOCTOR, NURSE, RECEPTIONIST
- **Stateless Sessions:** Secure, scalable authentication
- **Password Security:** BCrypt hashing for all passwords
- **Token Validation:** Frontend middleware + backend filters

### 👥 Role-Based Dashboards
- **Admin Dashboard:** User management, departments, system reports
- **Doctor Dashboard:** Patient management, appointments, medical records
- **Nurse Dashboard:** Patient monitoring, task management
- **Receptionist Dashboard:** Appointment scheduling, patient check-in

### 🎨 Modern UI & UX
- Responsive design for desktop and mobile
- Built with Tailwind CSS and shadcn/ui
- Real-time form validation
- Conditional navigation based on user role
- Professional sidebar navigation

### 🔌 API Integration
- Axios with automatic Bearer token injection
- Request/response interceptors
- Automatic 401 redirect to login
- Standardized API response format
- Comprehensive error handling

## Project Structure

```
hospital-management-system/
├── frontend/                  # Next.js 14 Frontend
│   ├── app/
│   │   ├── (auth)/login/
│   │   ├── (dashboard)/admin/
│   │   ├── (dashboard)/doctor/
│   │   ├── (dashboard)/nurse/
│   │   ├── (dashboard)/receptionist/
│   │   ├── context/AuthContext.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   └── Sidebar.tsx
│   ├── lib/
│   │   ├── api.ts          # Axios client with interceptors
│   │   └── validations.ts  # Zod schemas
│   ├── types/
│   │   └── index.ts        # TypeScript types
│   ├── middleware.ts        # JWT verification
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── README.md
│
├── backend/                   # Spring Boot 3 Backend
│   ├── src/main/java/com/hospital/
│   │   ├── auth/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   └── service/
│   │   ├── config/
│   │   │   ├── SecurityConfig.java
│   │   │   ├── JwtUtil.java
│   │   │   ├── JwtAuthFilter.java
│   │   │   └── CustomUserDetailsService.java
│   │   ├── shared/
│   │   │   ├── document/
│   │   │   ├── dto/
│   │   │   ├── exception/
│   │   │   └── repository/
│   │   └── HospitalManagementSystemApplication.java
│   ├── src/main/resources/
│   │   └── application.yml
│   ├── pom.xml              # Maven dependencies
│   ├── README.md
│   ├── QUICKSTART.md
│   ├── API_DOCUMENTATION.md
│   ├── .env.example
│   ├── .gitignore
│   └── .env
│
├── mobile-app/              # (Future) Mobile Application
│
└── README.md                 # This file
│   │   └── layout.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── unauthorized/
│       └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── form.tsx
│   └── Sidebar.tsx
├── lib/
│   ├── api.ts
│   ├── utils.ts
│   └── validations.ts
├── types/
│   └── index.ts
├── middleware.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
└── .env.local
```

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   JWT_SECRET=your-secret-key-change-this-in-production
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:3000/login`

## Authentication

### Demo Credentials

The system comes with demo credentials for testing different roles:

- **Admin:** `admin@hospital.com` / `password`
- **Doctor:** `doctor@hospital.com` / `password`
- **Nurse:** `nurse@hospital.com` / `password`
- **Receptionist:** `receptionist@hospital.com` / `password`

### How Authentication Works

1. **Login:** User provides email and password on the login page
2. **Token Generation:** Backend returns JWT token and user info
3. **Storage:** Token stored in localStorage and httpOnly cookie
4. **API Requests:** Axios interceptor automatically adds Bearer token
5. **Route Protection:** Middleware validates JWT and checks role permissions
6. **Token Expiry:** 401 response triggers automatic redirect to login

## TypeScript Types

### User Role
```typescript
type Role = 'ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST';
```

### User Interface
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  department?: string;
  iat?: number;
  exp?: number;
}
```

### AuthContext
```typescript
interface AuthContextType {
  user: User | null;
  role: Role | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
```

### API Response
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
}
```

## Middleware Configuration

The middleware (`middleware.ts`) handles:

- **JWT Verification:** Validates token signature and expiration
- **Role-Based Access:** Checks user role against requested route
- **Route Protection:** Redirects unauthorized users to login or unauthorized page
- **Token Refresh:** Can be extended to refresh expired tokens

### Protected Routes

- `/admin/*` - Admin dashboard and management pages
- `/doctor/*` - Doctor dashboard and patient management
- `/nurse/*` - Nurse dashboard and tasks
- `/receptionist/*` - Receptionist dashboard and appointments

### Public Routes

- `/login` - Login page
- `/register` - Registration page (optional)
- `/forgot-password` - Password reset (optional)

## Using the AuthContext

```tsx
'use client';

import { useAuth } from '@/app/context/AuthContext';

export default function MyComponent() {
  const { user, role, login, logout, isLoading } = useAuth();

  return (
    <div>
      {user && <p>Welcome, {user.name}!</p>}
    </div>
  );
}
```

## API Client

The Axios instance in `lib/api.ts` automatically:

1. **Adds Authorization Header:** `Bearer {token}`
2. **Handles 401 Responses:** Redirects to login
3. **Manages Errors:** Returns standardized error responses

### Example API Call

```tsx
import apiClient from '@/lib/api';

// Automatic Bearer token injection
const response = await apiClient.get('/api/patients');
```

## Form Validation

Using react-hook-form and Zod:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validations';

const form = useForm({
  resolver: zodResolver(loginSchema),
});
```

## Building for Production

```bash
npm run build
npm start
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Reusable component library
- **react-hook-form** - Efficient form management
- **Zod** - TypeScript-first schema validation
- **Axios** - HTTP client
- **jose** - JWT validation
- **Lucide React** - Icon library

## Configuration

### Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (public)
- `JWT_SECRET` - Secret key for JWT verification (must match backend)

### Tailwind Configuration

The project uses Tailwind CSS for styling. Customize theme in `tailwind.config.ts`.

### Next.js Configuration

Modify `next.config.js` for additional Next.js features.

## Security Considerations

1. **JWT Secret:** Change `JWT_SECRET` in production
2. **HTTPS Only:** Use HTTPS in production
3. **Cookie Flags:** Set secure and httpOnly flags on auth cookies
4. **Token Expiration:** Implement token refresh mechanism
5. **Input Validation:** All inputs validated with Zod schemas
6. **CSRF Protection:** Consider implementing CSRF tokens for mutations

## Extending the Project

### Adding New Roles

1. Add role to `Role` type in `types/index.ts`
2. Add menu items in `components/Sidebar.tsx`
3. Create dashboard folder in `app/(dashboard)/`
4. Update middleware role checks in `middleware.ts`

### Adding New API Endpoints

1. Use `apiClient` from `lib/api.ts`
2. Create request/response types
3. Add validation schemas if needed
4. Implement error handling

### Customizing UI

All UI components are customizable shadcn/ui components in `components/ui/`. Modify styling in `tailwind.config.ts` or individual component files.

## License

This project is provided as-is for educational and development purposes.

## Support

For issues or questions, refer to the documentation or contact the development team.
"# Hospital_Management_System" 
