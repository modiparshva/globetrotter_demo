import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { sql } from "@vercel/postgres"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
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

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
