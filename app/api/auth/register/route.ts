import { type NextRequest, NextResponse } from "next/server"
import { authService } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, password, phone, city, country } = body

    // Create user with Appwrite
    const result = await authService.createAccount(
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      city, 
      country
    )

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: result.account.$id,
        email: result.account.email,
        name: result.account.name,
      },
    })
  } catch (error: any) {
    console.error("Registration error:", error)
    
    let errorMessage = "Internal server error"
    if (error?.code === 409) {
      errorMessage = "User already exists"
    } else if (error?.message) {
      errorMessage = error.message
    }
    
    return NextResponse.json({ error: errorMessage }, { status: error?.code || 500 })
  }
}
