import { ReactNode } from "react"

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-full flex-col justify-center">
        <div className="mx-auto w-full max-w-md px-4 py-8">
          <div className="bg-white shadow-lg rounded-lg p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}