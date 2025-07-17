import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ApiResponseBuilder } from './api-response'
import { NextRequest } from 'next/server'

export const patientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  address: z.string().optional(),
  medicalHistory: z.string().optional(),
})

export const testResultSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  testType: z.string().min(1, 'Test type is required'),
  testDate: z.string().datetime(),
  results: z.record(z.any()),
  notes: z.string().optional(),
  attachmentUrl: z.string().optional(),
})

export const supplementSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  category: z.string().optional(),
  benefits: z.array(z.string()).optional(),
  sideEffects: z.array(z.string()).optional(),
  contraindications: z.array(z.string()).optional(),
})

export const recommendationSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  type: z.enum(['supplement', 'lifestyle', 'diet', 'exercise', 'medical']),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  supplementIds: z.array(z.string()).optional(),
  duration: z.string().optional(),
  notes: z.string().optional(),
})

export const analysisRequestSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  testResultIds: z.array(z.string()).min(1, 'At least one test result is required'),
  analysisType: z.enum(['comprehensive', 'specific', 'followup']).default('comprehensive'),
  focusAreas: z.array(z.string()).optional(),
})

export async function authenticateRequest(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    return null
  }
  
  return session.user
}

export async function validateRequest<T>(
  req: NextRequest,
  schema: z.ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: string }> {
  try {
    const body = await req.json()
    const validatedData = schema.parse(body)
    return { data: validatedData, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      return { data: null, error: errorMessages.join(', ') }
    }
    return { data: null, error: 'Invalid request body' }
  }
}

export function getPaginationParams(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const skip = (page - 1) * limit
  
  return { page, limit, skip }
}

export function getSearchParams(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const sortBy = searchParams.get('sortBy') || 'createdAt'
  const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc'
  
  return { search, sortBy, sortOrder }
}