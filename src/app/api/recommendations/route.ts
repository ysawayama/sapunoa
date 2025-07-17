import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseBuilder } from '@/lib/api-response'
import { 
  authenticateRequest, 
  validateRequest, 
  recommendationSchema,
  getPaginationParams,
  getSearchParams 
} from '@/lib/api-validation'

// GET /api/recommendations - Get recommendations
export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req)
    if (!user) {
      return ApiResponseBuilder.unauthorized()
    }

    const { searchParams } = new URL(req.url)
    const patientId = searchParams.get('patientId')
    const type = searchParams.get('type')
    const priority = searchParams.get('priority')
    const status = searchParams.get('status')
    
    const { page, limit, skip } = getPaginationParams(req)
    const { sortBy, sortOrder } = getSearchParams(req)

    let where: any = {}

    // If user is a patient, only show their recommendations
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

    if (type) {
      where.type = type
    }
    
    if (priority) {
      where.priority = priority
    }
    
    if (status) {
      where.status = status
    }

    const [recommendations, total] = await Promise.all([
      prisma.recommendation.findMany({
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
          supplements: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      prisma.recommendation.count({ where }),
    ])

    return ApiResponseBuilder.success({
      recommendations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return ApiResponseBuilder.serverError('Failed to fetch recommendations')
  }
}

// POST /api/recommendations - Create new recommendation
export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req)
    if (!user) {
      return ApiResponseBuilder.unauthorized()
    }

    // Only doctors and admins can create recommendations
    if (user.role !== 'doctor' && user.role !== 'admin') {
      return ApiResponseBuilder.unauthorized('Only doctors can create recommendations')
    }

    const validation = await validateRequest(req, recommendationSchema)
    if (validation.error) {
      return ApiResponseBuilder.badRequest(validation.error)
    }

    const { supplementIds, ...recommendationData } = validation.data

    // Verify patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: recommendationData.patientId },
    })

    if (!patient) {
      return ApiResponseBuilder.notFound('Patient')
    }

    // Verify supplements exist if provided
    if (supplementIds && supplementIds.length > 0) {
      const supplements = await prisma.supplement.findMany({
        where: { id: { in: supplementIds } },
      })

      if (supplements.length !== supplementIds.length) {
        return ApiResponseBuilder.badRequest('One or more supplements not found')
      }
    }

    const recommendation = await prisma.recommendation.create({
      data: {
        ...recommendationData,
        status: 'active',
        createdById: user.id,
        supplements: supplementIds
          ? {
              connect: supplementIds.map(id => ({ id })),
            }
          : undefined,
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        supplements: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    return ApiResponseBuilder.created(recommendation, 'Recommendation created successfully')
  } catch (error) {
    console.error('Error creating recommendation:', error)
    return ApiResponseBuilder.serverError('Failed to create recommendation')
  }
}

// PUT /api/recommendations/[id] - Update recommendation
export async function PUT(req: NextRequest) {
  try {
    const user = await authenticateRequest(req)
    if (!user) {
      return ApiResponseBuilder.unauthorized()
    }

    // Only doctors and admins can update recommendations
    if (user.role !== 'doctor' && user.role !== 'admin') {
      return ApiResponseBuilder.unauthorized('Only doctors can update recommendations')
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return ApiResponseBuilder.badRequest('Recommendation ID is required')
    }

    const validation = await validateRequest(req, recommendationSchema.partial())
    if (validation.error) {
      return ApiResponseBuilder.badRequest(validation.error)
    }

    const existingRecommendation = await prisma.recommendation.findUnique({
      where: { id },
    })

    if (!existingRecommendation) {
      return ApiResponseBuilder.notFound('Recommendation')
    }

    const { supplementIds, ...updateData } = validation.data

    const recommendation = await prisma.recommendation.update({
      where: { id },
      data: {
        ...updateData,
        supplements: supplementIds
          ? {
              set: [],
              connect: supplementIds.map(id => ({ id })),
            }
          : undefined,
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        supplements: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    return ApiResponseBuilder.success(recommendation, 'Recommendation updated successfully')
  } catch (error) {
    console.error('Error updating recommendation:', error)
    return ApiResponseBuilder.serverError('Failed to update recommendation')
  }
}

// DELETE /api/recommendations/[id] - Delete recommendation
export async function DELETE(req: NextRequest) {
  try {
    const user = await authenticateRequest(req)
    if (!user) {
      return ApiResponseBuilder.unauthorized()
    }

    // Only doctors and admins can delete recommendations
    if (user.role !== 'doctor' && user.role !== 'admin') {
      return ApiResponseBuilder.unauthorized('Only doctors can delete recommendations')
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return ApiResponseBuilder.badRequest('Recommendation ID is required')
    }

    const recommendation = await prisma.recommendation.findUnique({
      where: { id },
    })

    if (!recommendation) {
      return ApiResponseBuilder.notFound('Recommendation')
    }

    await prisma.recommendation.delete({ where: { id } })

    return ApiResponseBuilder.noContent()
  } catch (error) {
    console.error('Error deleting recommendation:', error)
    return ApiResponseBuilder.serverError('Failed to delete recommendation')
  }
}