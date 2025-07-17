import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"
import Joi from "joi"
import { ApiResponse } from "@/types"

const prisma = new PrismaClient()

// Validation schema for registration
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().required(),
  medicalRecordNumber: Joi.string().optional(),
  phoneNumber: Joi.string().optional(),
  dateOfBirth: Joi.date().optional(),
  gender: Joi.string().valid("MALE", "FEMALE", "OTHER").optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = registerSchema.validate(body)
    if (validation.error) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: validation.error.details[0].message,
      }, { status: 400 })
    }

    const { email, password, name, medicalRecordNumber, phoneNumber, dateOfBirth, gender } = validation.value

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { medicalRecordNumber: medicalRecordNumber || undefined }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "User with this email or medical record number already exists",
      }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        medicalRecordNumber,
        phoneNumber,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        role: "PATIENT", // Default role
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        medicalRecordNumber: true,
        createdAt: true,
      }
    })

    // Create empty profile for the user
    await prisma.profile.create({
      data: {
        userId: user.id,
      }
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: user,
      message: "User registered successfully",
    }, { status: 201 })

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to register user",
    }, { status: 500 })
  }
}