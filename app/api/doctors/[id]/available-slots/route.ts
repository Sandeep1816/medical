import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const doctorId = params.id

    const doctor = await prisma.doctor.findUnique({
      where: {
        id: doctorId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        availableSlots: true,
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

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const doctorId = params.id
    const data = await request.json()

    // Update the doctor
    const doctor = await prisma.doctor.update({
      where: {
        id: doctorId,
      },
      data: {
        specialty: data.specialty,
        bio: data.bio,
        education: data.education,
        experience: data.experience,
        languages: data.languages,
        consultationFee: data.consultationFee ? Number.parseFloat(data.consultationFee) : undefined,
        rating: data.rating ? Number.parseFloat(data.rating) : undefined,
        reviewCount: data.reviewCount ? Number.parseInt(data.reviewCount) : undefined,
      },
    })

    // If name is provided, update the user as well
    if (data.name) {
      await prisma.user.update({
        where: {
          id: doctor.userId,
        },
        data: {
          name: data.name,
        },
      })
    }

    return NextResponse.json(doctor)
  } catch (error) {
    console.error("Error updating doctor:", error)
    return NextResponse.json({ error: "Failed to update doctor" }, { status: 500 })
  }
}
