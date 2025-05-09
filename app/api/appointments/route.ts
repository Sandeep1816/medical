import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { AppointmentStatus, AppointmentType } from "@prisma/client";


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status") as AppointmentStatus | null
    const type = searchParams.get("type") as AppointmentType | null
    const date = searchParams.get("date")
    const doctorId = searchParams.get("doctorId")
    const patientId = searchParams.get("patientId")

    // Build filter object
    const filter: any = {}

    if (status) {
      filter.status = status
    }

    if (type) {
      filter.type = type
    }

    if (date) {
      // Parse date string to Date object
      const parsedDate = new Date(date)
      const nextDay = new Date(parsedDate)
      nextDay.setDate(nextDay.getDate() + 1)

      filter.date = {
        gte: parsedDate,
        lt: nextDay,
      }
    }

    if (doctorId) {
      filter.doctorId = doctorId
    }

    if (patientId) {
      filter.patientId = patientId
    }

    const appointments = await prisma.appointment.findMany({
      where: filter,
      include: {
        doctor: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        patient: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { patientId, doctorId, date, startTime, endTime, type, notes } = body

    // Validate required fields
    if (!patientId || !doctorId || !date || !startTime || !endTime || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check for appointment conflicts
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        date: new Date(date),
        status: "SCHEDULED",
        OR: [
          {
            // New appointment starts during an existing appointment
            AND: [{ startTime: { lte: new Date(startTime) } }, { endTime: { gt: new Date(startTime) } }],
          },
          {
            // New appointment ends during an existing appointment
            AND: [{ startTime: { lt: new Date(endTime) } }, { endTime: { gte: new Date(endTime) } }],
          },
          {
            // New appointment completely contains an existing appointment
            AND: [{ startTime: { gte: new Date(startTime) } }, { endTime: { lte: new Date(endTime) } }],
          },
        ],
      },
    })

    if (conflictingAppointment) {
      return NextResponse.json({ error: "This time slot is already booked" }, { status: 409 })
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        type,
        notes,
        status: "SCHEDULED",
      },
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 })
  }
}
