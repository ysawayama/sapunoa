import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseBuilder } from '@/lib/api-response'
import { 
  authenticateRequest, 
  validateRequest, 
  patientSchema 
} from '@/lib/api-validation'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/patients/[id] - Get patient by ID
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await authenticateRequest(req)
    if (!user) {
      return ApiResponseBuilder.unauthorized()
    }

    const patient = await prisma.patient.findUnique({
      where: { id: params.id },
      include: {
        testResults: {
          orderBy: { testDate: 'desc' },
        },
        recommendations: {
          orderBy: { createdAt: 'desc' },
          include: {
            supplements: true,
          },
        },
        analyses: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!patient) {
      return ApiResponseBuilder.notFound('Patient')
    }

    // Check access permissions
    if (user.role === 'patient' && patient.userId !== user.id) {
      return ApiResponseBuilder.unauthorized('You can only access your own patient data')
    }

    return ApiResponseBuilder.success(patient)
  } catch (error) {
    console.error('Error fetching patient:', error)
    return ApiResponseBuilder.serverError('Failed to fetch patient')
  }
}

// PUT /api/patients/[id] - Update patient
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await authenticateRequest(req)
    if (!user) {
      return ApiResponseBuilder.unauthorized()
    }

    const validation = await validateRequest(req, patientSchema.partial())
    if (validation.error) {
      return ApiResponseBuilder.badRequest(validation.error)
    }

    // Check if patient exists
    const existingPatient = await prisma.patient.findUnique({
      where: { id: params.id },
    })

    if (!existingPatient) {
      return ApiResponseBuilder.notFound('Patient')
    }

    // Check permissions
    if (user.role === 'patient' && existingPatient.userId !== user.id) {
      return ApiResponseBuilder.unauthorized('You can only update your own patient data')
    }

    const { dateOfBirth, ...updateData } = validation.data

    const patient = await prisma.patient.update({
      where: { id: params.id },
      data: {
        ...updateData,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      },
    })

    return ApiResponseBuilder.success(patient, 'Patient updated successfully')
  } catch (error) {
    console.error('Error updating patient:', error)
    return ApiResponseBuilder.serverError('Failed to update patient')
  }
}

// DELETE /api/patients/[id] - Delete patient
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await authenticateRequest(req)
    if (!user) {
      return ApiResponseBuilder.unauthorized()
    }

    // Only admins can delete patients
    if (user.role !== 'admin') {
      return ApiResponseBuilder.unauthorized('Only admins can delete patients')
    }

    const patient = await prisma.patient.findUnique({
      where: { id: params.id },
    })

    if (!patient) {
      return ApiResponseBuilder.notFound('Patient')
    }

    // Delete related records first (if not using cascade)
    await prisma.$transaction([
      prisma.recommendation.deleteMany({ where: { patientId: params.id } }),
      prisma.analysis.deleteMany({ where: { patientId: params.id } }),
      prisma.testResult.deleteMany({ where: { patientId: params.id } }),
      prisma.patient.delete({ where: { id: params.id } }),
    ])

    return ApiResponseBuilder.noContent()
  } catch (error) {
    console.error('Error deleting patient:', error)
    return ApiResponseBuilder.serverError('Failed to delete patient')
  }
}