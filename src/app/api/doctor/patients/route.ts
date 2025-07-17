import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseBuilder } from '@/lib/api-response'
import { 
  authenticateRequest, 
  getPaginationParams,
  getSearchParams 
} from '@/lib/api-validation'

// GET /api/doctor/patients - Get doctor's patient list with analytics
export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req)
    if (!user) {
      return ApiResponseBuilder.unauthorized()
    }

    // Only doctors can access this endpoint
    if (user.role !== 'doctor') {
      return ApiResponseBuilder.unauthorized('Only doctors can access this endpoint')
    }

    const { page, limit, skip } = getPaginationParams(req)
    const { search, sortBy, sortOrder } = getSearchParams(req)
    
    const { searchParams } = new URL(req.url)
    const filter = searchParams.get('filter') // active, inactive, critical
    const dateRange = searchParams.get('dateRange') // 7d, 30d, 90d, all

    let where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Date range filter for recent activity
    let dateFilter = {}
    if (dateRange && dateRange !== 'all') {
      const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      
      dateFilter = {
        OR: [
          { 
            testResults: {
              some: {
                createdAt: { gte: startDate }
              }
            }
          },
          {
            recommendations: {
              some: {
                createdAt: { gte: startDate }
              }
            }
          }
        ]
      }
    }

    if (Object.keys(dateFilter).length > 0) {
      where = { ...where, ...dateFilter }
    }

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
              createdAt: true,
            },
            orderBy: { testDate: 'desc' },
            take: 5,
          },
          recommendations: {
            where: { status: 'active' },
            select: {
              id: true,
              type: true,
              title: true,
              priority: true,
              status: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
          },
          analyses: {
            select: {
              id: true,
              analysisType: true,
              createdAt: true,
              riskFactors: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          _count: {
            select: {
              testResults: true,
              recommendations: true,
              analyses: true,
            },
          },
        },
      }),
      prisma.patient.count({ where }),
    ])

    // Calculate analytics for each patient
    const patientsWithAnalytics = patients.map(patient => {
      const lastTestDate = patient.testResults[0]?.testDate || null
      const daysSinceLastTest = lastTestDate 
        ? Math.floor((new Date().getTime() - new Date(lastTestDate).getTime()) / (1000 * 60 * 60 * 24))
        : null

      const activeRecommendations = patient.recommendations.filter(r => r.status === 'active')
      const highPriorityRecommendations = activeRecommendations.filter(r => r.priority === 'high')
      
      const latestAnalysis = patient.analyses[0]
      const riskLevel = latestAnalysis?.riskFactors?.length 
        ? latestAnalysis.riskFactors.length >= 3 ? 'high' 
          : latestAnalysis.riskFactors.length >= 1 ? 'medium' 
          : 'low'
        : 'unknown'

      return {
        ...patient,
        analytics: {
          lastTestDate,
          daysSinceLastTest,
          totalTests: patient._count.testResults,
          activeRecommendations: activeRecommendations.length,
          highPriorityRecommendations: highPriorityRecommendations.length,
          totalAnalyses: patient._count.analyses,
          riskLevel,
          status: daysSinceLastTest && daysSinceLastTest > 90 ? 'inactive' 
            : highPriorityRecommendations.length > 0 ? 'attention_needed'
            : 'active',
        },
      }
    })

    // Apply status filter if provided
    let filteredPatients = patientsWithAnalytics
    if (filter) {
      filteredPatients = patientsWithAnalytics.filter(patient => {
        switch (filter) {
          case 'active':
            return patient.analytics.status === 'active'
          case 'inactive':
            return patient.analytics.status === 'inactive'
          case 'critical':
            return patient.analytics.status === 'attention_needed' || patient.analytics.riskLevel === 'high'
          default:
            return true
        }
      })
    }

    // Summary statistics
    const summary = {
      totalPatients: total,
      activePatients: patientsWithAnalytics.filter(p => p.analytics.status === 'active').length,
      inactivePatients: patientsWithAnalytics.filter(p => p.analytics.status === 'inactive').length,
      attentionNeeded: patientsWithAnalytics.filter(p => p.analytics.status === 'attention_needed').length,
      highRiskPatients: patientsWithAnalytics.filter(p => p.analytics.riskLevel === 'high').length,
    }

    return ApiResponseBuilder.success({
      patients: filteredPatients,
      summary,
      pagination: {
        page,
        limit,
        total: filteredPatients.length,
        totalPages: Math.ceil(filteredPatients.length / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching doctor patients:', error)
    return ApiResponseBuilder.serverError('Failed to fetch patients')
  }
}