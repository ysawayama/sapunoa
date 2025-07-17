import { NextResponse } from 'next/server'

export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export class ApiResponseBuilder {
  static success<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
    return NextResponse.json({
      success: true,
      data,
      message
    })
  }

  static error(error: string, status: number = 400): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        error
      },
      { status }
    )
  }

  static unauthorized(message: string = 'Unauthorized'): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        error: message
      },
      { status: 401 }
    )
  }

  static notFound(resource: string = 'Resource'): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        error: `${resource} not found`
      },
      { status: 404 }
    )
  }

  static badRequest(message: string): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        error: message
      },
      { status: 400 }
    )
  }

  static serverError(message: string = 'Internal server error'): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        error: message
      },
      { status: 500 }
    )
  }

  static created<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
      {
        success: true,
        data,
        message
      },
      { status: 201 }
    )
  }

  static noContent(): NextResponse {
    return new NextResponse(null, { status: 204 })
  }
}