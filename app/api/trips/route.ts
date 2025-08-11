import { type NextRequest, NextResponse } from "next/server"
<<<<<<< HEAD
import { authService } from "@/lib/auth"
import { tripService } from "@/lib/trips"

export async function POST(request: NextRequest) {
  try {
    // Get authentication header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // For now, we'll get the user from the auth service
    // In a production app, you'd validate the token properly
    const user = await authService.getCurrentUser()
    if (!user) {
=======
import { getServerSession } from "next-auth"
import { sql } from "@vercel/postgres"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
>>>>>>> origin/dishant
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
<<<<<<< HEAD
    const { name, description, destination, startDate, endDate, budget, image } = body

    const trip = await tripService.createTrip(user.account.$id, {
      name,
      description,
      destination,
      startDate,
      endDate,
      budget: budget || 0,
      status: 'planning',
      image: image || '',
    })

    return NextResponse.json(trip)
  } catch (error: any) {
    console.error("Create trip error:", error)
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 })
=======
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
>>>>>>> origin/dishant
  }
}

export async function GET(request: NextRequest) {
  try {
<<<<<<< HEAD
    // Get authentication header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // For now, we'll get the user from the auth service
    const user = await authService.getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const trips = await tripService.getUserTrips(user.account.$id)

    return NextResponse.json(trips)
  } catch (error: any) {
    console.error("Get trips error:", error)
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 })
=======
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
>>>>>>> origin/dishant
  }
}
