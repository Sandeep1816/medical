import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      specialty,
      bio,
      education,
      experience,
      languages,
      consultationFee,
      rating,
      reviewCount,
    } = await request.json()

    // If using Prisma, the `userId` would already be a valid ID or UUID
    const doctor = await prisma.doctor.create({
      data: {
        userId, // Prisma will handle ID generation based on your schema
        specialty,
        bio,
        education: education ? JSON.parse(education) : null,
        experience: experience ? JSON.parse(experience) : null,
        languages: Array.isArray(languages) ? languages : [],
        consultationFee: parseFloat(consultationFee),
        rating: Number(rating),
        reviewCount: Number(reviewCount),
      },
    })

    return NextResponse.json(doctor)
  } catch (error) {
    console.error("Error adding doctor:", error)
    return NextResponse.json({ error: "Failed to add doctor" }, { status: 500 })
  }
}
