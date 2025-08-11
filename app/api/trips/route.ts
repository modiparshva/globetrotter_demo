import { type NextRequest, NextResponse } from "next/server"
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
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
  }
}

export async function GET(request: NextRequest) {
  try {
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
  }
}
