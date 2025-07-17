import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"
import Joi from "joi"

const prisma = new PrismaClient()

// Validation schema
const loginSchema = Joi.object({
  identifier: Joi.string().required(),
  password: Joi.string().required(),
})

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifier: { label: "Email or Medical Record Number", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Validate input
          const validation = loginSchema.validate(credentials)
          if (validation.error) {
            throw new Error("Invalid input")
          }
          const { identifier, password } = validation.value

          // Demo accounts for testing
          const demoAccounts = [
            {
              email: "patient1@example.com",
              password: "patient123",
              user: {
                id: "demo-patient-1",
                email: "patient1@example.com",
                name: "山田 花子",
                role: "PATIENT",
                medicalRecordNumber: "P001234",
              }
            },
            {
              email: "doctor@supnoa.com",
              password: "doctor123",
              user: {
                id: "demo-doctor-1",
                email: "doctor@supnoa.com",
                name: "Dr. 佐藤",
                role: "DOCTOR",
                medicalRecordNumber: null,
              }
            }
          ];

          // Check demo accounts first
          const demoAccount = demoAccounts.find(account => 
            account.email === identifier && account.password === password
          );

          if (demoAccount) {
            return demoAccount.user;
          }

          // If not a demo account, try database
          try {
            // Find user by email or medical record number
            const user = await prisma.user.findFirst({
              where: {
                OR: [
                  { email: identifier },
                  { medicalRecordNumber: identifier }
                ],
                isActive: true
              }
            })

            if (!user) {
              throw new Error("Invalid credentials")
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password)
            
            if (!isPasswordValid) {
              throw new Error("Invalid credentials")
            }

            // Return user data for session
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              medicalRecordNumber: user.medicalRecordNumber,
            }
          } catch (dbError) {
            // If database is not available, only demo accounts work
            console.log("Database not available, only demo accounts can login");
            return null;
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.medicalRecordNumber = user.medicalRecordNumber
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.medicalRecordNumber = token.medicalRecordNumber as string | null
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

// Type declarations for NextAuth
declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string | null
    role: string
    medicalRecordNumber: string | null
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string | null
      role: string
      medicalRecordNumber: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    medicalRecordNumber: string | null
  }
}