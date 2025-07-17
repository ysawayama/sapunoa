import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseBuilder } from '@/lib/api-response'
import { 
  authenticateRequest, 
  validateRequest, 
  testResultSchema,
  getPaginationParams,
  getSearchParams 
} from '@/lib/api-validation'

// GET /api/test-results - Get test results
export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req)
    if (!user) {
      return ApiResponseBuilder.unauthorized()
    }

    const { searchParams } = new URL(req.url)
    const patientId = searchParams.get('patientId')
    const testType = searchParams.get('testType')
    
    const { page, limit, skip } = getPaginationParams(req)
    const { sortBy, sortOrder } = getSearchParams(req)

    let where: any = {}

    // If user is a patient, only show their test results
    if (user.role === 'patient') {
      const patient = await prisma.patient.findFirst({
        where: { userId: user.id },
      })
      
      if (!patient) {
        return ApiResponseBuilder.badRequest('No patient profile found for user')
      }
      
      where.patientId = patient.id
    } else if (patientId) {
      // For doctors/admins, filter by patientId if provided
      where.patientId = patientId
    }

    if (testType) {
      where.testType = testType
    }

    const [testResults, total] = await Promise.all([
      prisma.testResult.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.testResult.count({ where }),
    ])

    return ApiResponseBuilder.success({
      testResults,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching test results:', error)
    return ApiResponseBuilder.serverError('Failed to fetch test results')
  }
}

// POST /api/test-results - Create new test result
export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req)
    if (!user) {
      return ApiResponseBuilder.unauthorized()
    }

    // Only doctors and admins can create test results
    if (user.role !== 'doctor' && user.role !== 'admin') {
      return ApiResponseBuilder.unauthorized('Only doctors can create test results')
    }

    const validation = await validateRequest(req, testResultSchema)
    if (validation.error) {
      return ApiResponseBuilder.badRequest(validation.error)
    }

    const { testDate, ...testData } = validation.data

    // Verify patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: testData.patientId },
    })

    if (!patient) {
      return ApiResponseBuilder.notFound('Patient')
    }

    const testResult = await prisma.testResult.create({
      data: {
        ...testData,
        testDate: new Date(testDate),
        uploadedById: user.id,
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return ApiResponseBuilder.created(testResult, 'Test result created successfully')
  } catch (error) {
    console.error('Error creating test result:', error)
    return ApiResponseBuilder.serverError('Failed to create test result')
  }
}