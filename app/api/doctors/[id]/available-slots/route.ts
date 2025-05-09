import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: {
        id: params.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 })
    }

    return NextResponse.json(doctor)
  } catch (error) {
    console.error("Error fetching doctor:", error)
    return NextResponse.json({ error: "Failed to fetch doctor" }, { status: 500 })
  }
}
