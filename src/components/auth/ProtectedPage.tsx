"use client"

import { useAuth } from "@/hooks/useAuth"
import { UserRole } from "@/types"
import { ReactNode, useEffect } from "react"

interface ProtectedPageProps {
  children: ReactNode
  roles?: UserRole[]
  redirectTo?: string
}

export function ProtectedPage({ 
  children, 
  roles, 
  redirectTo = "/login" 
}: ProtectedPageProps) {
  const { isAuthenticated, isLoading, user, requireAuth, requireRole } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      requireAuth(redirectTo)
      
      if (roles && roles.length > 0) {
        requireRole(roles.map(role => role.toString()), "/unauthorized")
      }
    }
  }, [isLoading, requireAuth, requireRole, roles, redirectTo])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (roles && roles.length > 0 && user && !roles.includes(user.role as UserRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Unauthorized</h1>
          <p className="mt-2 text-gray-600">You do not have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}