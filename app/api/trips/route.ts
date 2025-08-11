import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { sql } from "@vercel/postgres"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, startDate, endDate, coverImage } = body

    const result = await sql`
      INSERT INTO trips (user_id, name, description, start_date, end_date, cover_image)
      VALUES (${session.user.id}, ${name}, ${description}, ${startDate}, ${endDate}, ${coverImage})
      RETURNING *
    `

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Create trip error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await sql`
      SELECT t.*, 
             COUNT(ts.id) as destination_count
      FROM trips t
      LEFT JOIN trip_stops ts ON t.id = ts.trip_id
      WHERE t.user_id = ${session.user.id}
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Get trips error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
