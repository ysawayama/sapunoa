import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseBuilder } from '@/lib/api-response'
import { 
  authenticateRequest, 
  validateRequest, 
  testResultSchema 
} from '@/lib/api-validation'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/test-results/[id] - Get test result by ID
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await authenticateRequest(req)
    if (!user) {
      return ApiResponseBuilder.unauthorized()
    }

    const testResult = await prisma.testResult.findUnique({
      where: { id: params.id },
      include: {
        patient: true,
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        analyses: true,
      },
    })

    if (!testResult) {
      return ApiResponseBuilder.notFound('Test result')
    }

    // Check access permissions
    if (user.role === 'patient') {
      const patient = await prisma.patient.findFirst({
        where: { userId: user.id },
      })
      
      if (!patient || patient.id !== testResult.patientId) {
        return ApiResponseBuilder.unauthorized('You can only access your own test results')
      }
    }

    return ApiResponseBuilder.success(testResult)
  } catch (error) {
    console.error('Error fetching test result:', error)
    return ApiResponseBuilder.serverError('Failed to fetch test result')
  }
}

// PUT /api/test-results/[id] - Update test result
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await authenticateRequest(req)
    if (!user) {
      return ApiResponseBuilder.unauthorized()
    }

    // Only doctors and admins can update test results
    if (user.role !== 'doctor' && user.role !== 'admin') {
      return ApiResponseBuilder.unauthorized('Only doctors can update test results')
    }

    const validation = await validateRequest(req, testResultSchema.partial())
    if (validation.error) {
      return ApiResponseBuilder.badRequest(validation.error)
    }

    const existingTestResult = await prisma.testResult.findUnique({
      where: { id: params.id },
    })

    if (!existingTestResult) {
      return ApiResponseBuilder.notFound('Test result')
    }

    const { testDate, ...updateData } = validation.data

    const testResult = await prisma.testResult.update({
      where: { id: params.id },
      data: {
        ...updateData,
        testDate: testDate ? new Date(testDate) : undefined,
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

    return ApiResponseBuilder.success(testResult, 'Test result updated successfully')
  } catch (error) {
    console.error('Error updating test result:', error)
    return ApiResponseBuilder.serverError('Failed to update test result')
  }
}

// DELETE /api/test-results/[id] - Delete test result
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await authenticateRequest(req)
    if (!user) {
      return ApiResponseBuilder.unauthorized()
    }

    // Only doctors and admins can delete test results
    if (user.role !== 'doctor' && user.role !== 'admin') {
      return ApiResponseBuilder.unauthorized('Only doctors can delete test results')
    }

    const testResult = await prisma.testResult.findUnique({
      where: { id: params.id },
    })

    if (!testResult) {
      return ApiResponseBuilder.notFound('Test result')
    }

    // Delete related analyses first
    await prisma.$transaction([
      prisma.analysis.deleteMany({ 
        where: { 
          testResultIds: { 
            has: params.id 
          } 
        } 
      }),
      prisma.testResult.delete({ where: { id: params.id } }),
    ])

    return ApiResponseBuilder.noContent()
  } catch (error) {
    console.error('Error deleting test result:', error)
    return ApiResponseBuilder.serverError('Failed to delete test result')
  }
}