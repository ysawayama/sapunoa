import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseBuilder } from '@/lib/api-response'
import { 
  authenticateRequest, 
  validateRequest, 
  supplementSchema,
  getPaginationParams,
  getSearchParams 
} from '@/lib/api-validation'

// GET /api/supplements - Get all supplements
export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req)
    if (!user) {
      return ApiResponseBuilder.unauthorized()
    }

    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    
    const { page, limit, skip } = getPaginationParams(req)
    const { search, sortBy, sortOrder } = getSearchParams(req)

    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { benefits: { hasSome: [search] } },
      ]
    }
    
    if (category) {
      where.category = category
    }

    const [supplements, total] = await Promise.all([
      prisma.supplement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: {
              recommendations: true,
            },
          },
        },
      }),
      prisma.supplement.count({ where }),
    ])

    return ApiResponseBuilder.success({
      supplements,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching supplements:', error)
    return ApiResponseBuilder.serverError('Failed to fetch supplements')
  }
}

// POST /api/supplements - Create new supplement
export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req)
    if (!user) {
      return ApiResponseBuilder.unauthorized()
    }

    // Only doctors and admins can create supplements
    if (user.role !== 'doctor' && user.role !== 'admin') {
      return ApiResponseBuilder.unauthorized('Only doctors can create supplements')
    }

    const validation = await validateRequest(req, supplementSchema)
    if (validation.error) {
      return ApiResponseBuilder.badRequest(validation.error)
    }

    // Check if supplement with same name already exists
    const existingSupplement = await prisma.supplement.findFirst({
      where: { 
        name: {
          equals: validation.data.name,
          mode: 'insensitive'
        }
      },
    })

    if (existingSupplement) {
      return ApiResponseBuilder.badRequest('Supplement with this name already exists')
    }

    const supplement = await prisma.supplement.create({
      data: validation.data,
    })

    return ApiResponseBuilder.created(supplement, 'Supplement created successfully')
  } catch (error) {
    console.error('Error creating supplement:', error)
    return ApiResponseBuilder.serverError('Failed to create supplement')
  }
}

// PUT /api/supplements/[id] - Update supplement
export async function PUT(req: NextRequest) {
  try {
    const user = await authenticateRequest(req)
    if (!user) {
      return ApiResponseBuilder.unauthorized()
    }

    // Only doctors and admins can update supplements
    if (user.role !== 'doctor' && user.role !== 'admin') {
      return ApiResponseBuilder.unauthorized('Only doctors can update supplements')
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return ApiResponseBuilder.badRequest('Supplement ID is required')
    }

    const validation = await validateRequest(req, supplementSchema.partial())
    if (validation.error) {
      return ApiResponseBuilder.badRequest(validation.error)
    }

    const existingSupplement = await prisma.supplement.findUnique({
      where: { id },
    })

    if (!existingSupplement) {
      return ApiResponseBuilder.notFound('Supplement')
    }

    const supplement = await prisma.supplement.update({
      where: { id },
      data: validation.data,
    })

    return ApiResponseBuilder.success(supplement, 'Supplement updated successfully')
  } catch (error) {
    console.error('Error updating supplement:', error)
    return ApiResponseBuilder.serverError('Failed to update supplement')
  }
}

// DELETE /api/supplements/[id] - Delete supplement
export async function DELETE(req: NextRequest) {
  try {
    const user = await authenticateRequest(req)
    if (!user) {
      return ApiResponseBuilder.unauthorized()
    }

    // Only admins can delete supplements
    if (user.role !== 'admin') {
      return ApiResponseBuilder.unauthorized('Only admins can delete supplements')
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return ApiResponseBuilder.badRequest('Supplement ID is required')
    }

    const supplement = await prisma.supplement.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            recommendations: true,
          },
        },
      },
    })

    if (!supplement) {
      return ApiResponseBuilder.notFound('Supplement')
    }

    if (supplement._count.recommendations > 0) {
      return ApiResponseBuilder.badRequest(
        'Cannot delete supplement that is referenced in recommendations'
      )
    }

    await prisma.supplement.delete({ where: { id } })

    return ApiResponseBuilder.noContent()
  } catch (error) {
    console.error('Error deleting supplement:', error)
    return ApiResponseBuilder.serverError('Failed to delete supplement')
  }
}