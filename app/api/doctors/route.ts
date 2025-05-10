import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { name, specialty, bio, education, experience, languages, consultationFee, rating, reviewCount, imageUrl } =
      await request.json()

    // First create a user for the doctor
    const user = await prisma.user.create({
      data: {
        name,
        email: `${name.toLowerCase().replace(/\s+/g, ".")}@medbook.com`, // Generate an email
        password: "defaultPassword", // You should use a secure password or auth system
        role: "DOCTOR",
      },
    })

    // Then create the doctor profile linked to the user
    const doctor = await prisma.doctor.create({
      data: {
        specialty,
        bio,
        education: education ? JSON.parse(JSON.stringify(education)) : null,
        experience: experience ? JSON.parse(JSON.stringify(experience)) : null,
        languages: Array.isArray(languages) ? languages : [],
        consultationFee: Number.parseFloat(consultationFee),
        rating: Number(rating) || 5,
        reviewCount: Number(reviewCount) || 0,
        imageUrl: imageUrl || "/placeholder.svg?height=300&width=300", // Default image if none provided
        // Connect to the user we just created
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    })

    return NextResponse.json(doctor)
  } catch (error) {
    console.error("Error adding doctor:", error)
    return NextResponse.json({ error: "Failed to add doctor", details: error }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const specialty = searchParams.get("specialty")

    const where = specialty ? { specialty } : {}

    const doctors = await prisma.doctor.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        rating: "desc",
      },
    })

    return NextResponse.json(doctors)
  } catch (error) {
    console.error("Error fetching doctors:", error)
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 })
  }
}
