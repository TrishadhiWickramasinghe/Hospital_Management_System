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

// Patient Management Types
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type EmergencyRelation = 'SPOUSE' | 'PARENT' | 'SIBLING' | 'CHILD' | 'FRIEND' | 'OTHER';

export interface Address {
  street: string;
  city: string;
  postalCode: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: EmergencyRelation;
}

export interface Patient {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO date string
  gender: Gender;
  bloodGroup: BloodGroup;
  phone: string;
  email?: string;
  address: Address;
  allergies: string[];
  emergencyContact: EmergencyContact;
  insuranceNumber?: string;
  registeredBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientListItem {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  bloodGroup: BloodGroup;
  phone: string;
  createdAt: string;
}

export interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup: BloodGroup;
  nationalId: string;
  phone: string;
  email?: string;
  address: Address;
  allergies: string[];
  emergencyContact: EmergencyContact;
  insuranceNumber?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}
