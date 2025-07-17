import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseBuilder } from '@/lib/api-response'
import { 
  authenticateRequest, 
  validateRequest, 
  patientSchema,
  getPaginationParams,
  getSearchParams 
} from '@/lib/api-validation'

// GET /api/patients - Get all patients (for doctors)
export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req)
    if (!user) {
      return ApiResponseBuilder.unauthorized()
    }

    // Only doctors can see all patients
    if (user.role !== 'doctor' && user.role !== 'admin') {
      return ApiResponseBuilder.unauthorized('Only doctors can access patient list')
    }

    const { page, limit, skip } = getPaginationParams(req)
    const { search, sortBy, sortOrder } = getSearchParams(req)

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          testResults: {
            select: {
              id: true,
              testType: true,
              testDate: true,
            },
            orderBy: { testDate: 'desc' },
            take: 5,
          },
          recommendations: {
            select: {
              id: true,
              type: true,
              title: true,
              priority: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      }),
      prisma.patient.count({ where }),
    ])

    return ApiResponseBuilder.success({
      patients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching patients:', error)
    return ApiResponseBuilder.serverError('Failed to fetch patients')
  }
}

// POST /api/patients - Create new patient
export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req)
    if (!user) {
      return ApiResponseBuilder.unauthorized()
    }

    // Only doctors and admins can create patients
    if (user.role !== 'doctor' && user.role !== 'admin') {
      return ApiResponseBuilder.unauthorized('Only doctors can create patients')
    }

    const validation = await validateRequest(req, patientSchema)
    if (validation.error) {
      return ApiResponseBuilder.badRequest(validation.error)
    }

    const { dateOfBirth, ...patientData } = validation.data

    // Check if patient with email already exists
    const existingPatient = await prisma.patient.findUnique({
      where: { email: patientData.email },
    })

    if (existingPatient) {
      return ApiResponseBuilder.badRequest('Patient with this email already exists')
    }

    const patient = await prisma.patient.create({
      data: {
        ...patientData,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        userId: user.id,
      },
    })

    return ApiResponseBuilder.created(patient, 'Patient created successfully')
  } catch (error) {
    console.error('Error creating patient:', error)
    return ApiResponseBuilder.serverError('Failed to create patient')
  }
}