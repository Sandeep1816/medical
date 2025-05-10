import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { doctorId, day, startTime, endTime } = await request.json()

    const timeSlot = await prisma.timeSlot.create({
      data: {
        doctorId,
        day: Number(day),
        startTime,
        endTime,
        isAvailable: true,
      },
    })

    return NextResponse.json(timeSlot)
  } catch (error) {
    console.error("Error creating time slot:", error)
    return NextResponse.json({ error: "Failed to create time slot" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const doctorId = searchParams.get("doctorId")
    const day = searchParams.get("day")

    if (!doctorId) {
      return NextResponse.json({ error: "Doctor ID is required" }, { status: 400 })
    }

    const where: any = { doctorId }
    if (day !== null) {
      where.day = Number(day)
    }

    const timeSlots = await prisma.timeSlot.findMany({
      where,
      orderBy: [{ day: "asc" }, { startTime: "asc" }],
    })

    return NextResponse.json(timeSlots)
  } catch (error) {
    console.error("Error fetching time slots:", error)
    return NextResponse.json({ error: "Failed to fetch time slots" }, { status: 500 })
  }
}
