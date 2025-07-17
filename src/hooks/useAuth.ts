"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const isAuthenticated = !!session?.user
  const isLoading = status === "loading"
  const user = session?.user || null

  const login = useCallback(
    async (identifier: string, password: string) => {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error("Invalid credentials")
      }

      router.push("/dashboard")
      router.refresh()
    },
    [router]
  )

  const logout = useCallback(async () => {
    await signOut({ redirect: false })
    router.push("/login")
    router.refresh()
  }, [router])

  const checkRole = useCallback(
    (allowedRoles: string[]) => {
      if (!user) return false
      return allowedRoles.includes(user.role)
    },
    [user]
  )

  const requireAuth = useCallback(
    (redirectTo = "/login") => {
      if (!isLoading && !isAuthenticated) {
        router.push(redirectTo)
      }
    },
    [isAuthenticated, isLoading, router]
  )

  const requireRole = useCallback(
    (allowedRoles: string[], redirectTo = "/") => {
      if (!isLoading && isAuthenticated && !checkRole(allowedRoles)) {
        router.push(redirectTo)
      }
    },
    [isAuthenticated, isLoading, checkRole, router]
  )

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkRole,
    requireAuth,
    requireRole,
  }
}