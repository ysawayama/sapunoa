"use client"

import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/Button"

export function AuthHeader() {
  const { user, isAuthenticated, logout } = useAuth()

  if (!isAuthenticated) {
    return null
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <a href="/dashboard" className="text-xl font-semibold">
              Sapunoa
            </a>
            <nav className="hidden md:flex space-x-4">
              {user?.role === "PATIENT" && (
                <>
                  <a href="/test-results" className="text-gray-600 hover:text-gray-900">
                    Test Results
                  </a>
                  <a href="/recommendations" className="text-gray-600 hover:text-gray-900">
                    Recommendations
                  </a>
                  <a href="/orders" className="text-gray-600 hover:text-gray-900">
                    Orders
                  </a>
                </>
              )}
              {user?.role === "DOCTOR" && (
                <>
                  <a href="/doctor/patients" className="text-gray-600 hover:text-gray-900">
                    Patients
                  </a>
                  <a href="/doctor/test-results" className="text-gray-600 hover:text-gray-900">
                    Test Results
                  </a>
                </>
              )}
              {user?.role === "ADMIN" && (
                <>
                  <a href="/admin/users" className="text-gray-600 hover:text-gray-900">
                    Users
                  </a>
                  <a href="/admin/products" className="text-gray-600 hover:text-gray-900">
                    Products
                  </a>
                  <a href="/admin/orders" className="text-gray-600 hover:text-gray-900">
                    Orders
                  </a>
                </>
              )}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user?.name || user?.email}
            </span>
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}