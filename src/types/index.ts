// Common types used throughout the application

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Authentication types
export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN'
}

export interface AuthUser {
  id: string
  email: string
  name: string | null
  role: UserRole
  medicalRecordNumber?: string | null
}

export interface LoginCredentials {
  identifier: string // email or medical record number
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  role?: UserRole
  medicalRecordNumber?: string
}