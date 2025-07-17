import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Define protected routes and their required roles
const protectedRoutes = {
  "/dashboard": ["PATIENT", "DOCTOR", "ADMIN"],
  "/admin": ["ADMIN"],
  "/doctor": ["DOCTOR", "ADMIN"],
  "/profile": ["PATIENT", "DOCTOR", "ADMIN"],
  "/test-results": ["PATIENT", "DOCTOR", "ADMIN"],
  "/recommendations": ["PATIENT", "DOCTOR", "ADMIN"],
  "/orders": ["PATIENT", "ADMIN"],
}

// Public routes that don't require authentication
const publicRoutes = ["/", "/login", "/register", "/api/auth"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if it's a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Get the token
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })

  // Check if user is authenticated
  if (!token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check role-based access
  for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route)) {
      const userRole = token.role as string
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/", request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
}