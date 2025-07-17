import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseBuilder } from '@/lib/api-response'
import { 
  authenticateRequest, 
  validateRequest, 
  analysisRequestSchema 
} from '@/lib/api-validation'
import { generateOpenAIAnalysis } from '@/lib/openai'

// GET /api/analysis - Get analyses
export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req)
    if (!user) {
      return ApiResponseBuilder.unauthorized()
    }

    const { searchParams } = new URL(req.url)
    const patientId = searchParams.get('patientId')
    const analysisId = searchParams.get('id')

    // If specific analysis ID is requested
    if (analysisId) {
      const analysis = await prisma.analysis.findUnique({
        where: { id: analysisId },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          testResults: true,
          recommendations: {
            include: {
              supplements: true,
            },
          },
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

      if (!analysis) {
        return ApiResponseBuilder.notFound('Analysis')
      }

      // Check access permissions
      if (user.role === 'patient') {
        const patient = await prisma.patient.findFirst({
          where: { userId: user.id },
        })
        
        if (!patient || patient.id !== analysis.patientId) {
          return ApiResponseBuilder.unauthorized('You can only access your own analyses')
        }
      }

      return ApiResponseBuilder.success(analysis)
    }

    // Otherwise, return list of analyses
    let where: any = {}

    if (user.role === 'patient') {
      const patient = await prisma.patient.findFirst({
        where: { userId: user.id },
      })
      
      if (!patient) {
        return ApiResponseBuilder.badRequest('No patient profile found for user')
      }
      
      where.patientId = patient.id
    } else if (patientId) {
      where.patientId = patientId
    }

    const analyses = await prisma.analysis.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        testResults: {
          select: {
            id: true,
            testType: true,
            testDate: true,
          },
        },
        recommendations: {
          select: {
            id: true,
            type: true,
            title: true,
            priority: true,
          },
        },
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

    return ApiResponseBuilder.success(analyses)
  } catch (error) {
    console.error('Error fetching analyses:', error)
    return ApiResponseBuilder.serverError('Failed to fetch analyses')
  }
}

// POST /api/analysis - Create new analysis
export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req)
    if (!user) {
      return ApiResponseBuilder.unauthorized()
    }

    // Only doctors and admins can create analyses
    if (user.role !== 'doctor' && user.role !== 'admin') {
      return ApiResponseBuilder.unauthorized('Only doctors can create analyses')
    }

    const validation = await validateRequest(req, analysisRequestSchema)
    if (validation.error) {
      return ApiResponseBuilder.badRequest(validation.error)
    }

    const { patientId, testResultIds, analysisType, focusAreas } = validation.data

    // Verify patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        testResults: {
          where: { id: { in: testResultIds } },
        },
      },
    })

    if (!patient) {
      return ApiResponseBuilder.notFound('Patient')
    }

    if (patient.testResults.length !== testResultIds.length) {
      return ApiResponseBuilder.badRequest('One or more test results not found for this patient')
    }

    try {
      // Generate AI analysis
      const aiAnalysis = await generateOpenAIAnalysis({
        patient,
        testResults: patient.testResults,
        analysisType,
        focusAreas,
      })

      // Create analysis record
      const analysis = await prisma.analysis.create({
        data: {
          patientId,
          testResultIds,
          analysisType,
          focusAreas,
          findings: aiAnalysis.findings,
          recommendations: {
            create: aiAnalysis.recommendations.map((rec: any) => ({
              patientId,
              type: rec.type,
              title: rec.title,
              description: rec.description,
              priority: rec.priority,
              status: 'active',
              createdById: user.id,
              supplementIds: rec.supplementIds || [],
            })),
          },
          summary: aiAnalysis.summary,
          riskFactors: aiAnalysis.riskFactors,
          createdById: user.id,
        },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          testResults: true,
          recommendations: {
            include: {
              supplements: true,
            },
          },
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

      return ApiResponseBuilder.created(analysis, 'Analysis created successfully')
    } catch (aiError) {
      console.error('AI analysis error:', aiError)
      return ApiResponseBuilder.serverError('Failed to generate AI analysis')
    }
  } catch (error) {
    console.error('Error creating analysis:', error)
    return ApiResponseBuilder.serverError('Failed to create analysis')
  }
}

// DELETE /api/analysis/[id] - Delete analysis
export async function DELETE(req: NextRequest) {
  try {
    const user = await authenticateRequest(req)
    if (!user) {
      return ApiResponseBuilder.unauthorized()
    }

    // Only admins can delete analyses
    if (user.role !== 'admin') {
      return ApiResponseBuilder.unauthorized('Only admins can delete analyses')
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return ApiResponseBuilder.badRequest('Analysis ID is required')
    }

    const analysis = await prisma.analysis.findUnique({
      where: { id },
    })

    if (!analysis) {
      return ApiResponseBuilder.notFound('Analysis')
    }

    // Delete related recommendations first
    await prisma.$transaction([
      prisma.recommendation.deleteMany({ 
        where: { 
          analysisId: id 
        } 
      }),
      prisma.analysis.delete({ where: { id } }),
    ])

    return ApiResponseBuilder.noContent()
  } catch (error) {
    console.error('Error deleting analysis:', error)
    return ApiResponseBuilder.serverError('Failed to delete analysis')
  }
}