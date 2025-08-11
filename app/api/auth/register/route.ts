import { type NextRequest, NextResponse } from "next/server"
<<<<<<< HEAD
import { authService } from "@/lib/auth"
=======
import bcrypt from "bcryptjs"
import { sql } from "@vercel/postgres"
>>>>>>> origin/dishant

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
<<<<<<< HEAD
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
=======
    const { firstName, lastName, email, password, phone, city, country, additionalInfo } = body

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const result = await sql`
      INSERT INTO users (email, password_hash, first_name, last_name, phone, city, country)
      VALUES (${email}, ${passwordHash}, ${firstName}, ${lastName}, ${phone}, ${city}, ${country})
      RETURNING id, email, first_name, last_name
    `

    const user = result.rows[0]
>>>>>>> origin/dishant

    return NextResponse.json({
      message: "User created successfully",
      user: {
<<<<<<< HEAD
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
=======
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
>>>>>>> origin/dishant
  }
}
