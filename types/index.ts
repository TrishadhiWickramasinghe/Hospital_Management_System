// TypeScript types for the Hospital Management System

export type Role = 'ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  department?: string;
  iat?: number;
  exp?: number;
}

export interface AuthContextType {
  user: User | null;
  role: Role | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
