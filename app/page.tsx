"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DoctorCard } from "@/components/doctor-card"
import { Button } from "@/components/ui/button"
import { Search } from "@/components/search"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Doctor {
  id: string
  specialty: string
  rating: number
  reviewCount: number
  imageUrl: string
  user: {
    name: string
  }
}

export default function Home() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctors")
        if (!response.ok) {
          throw new Error("Failed to fetch doctors")
        }
        const data = await response.json()
        setDoctors(data)
      } catch (error) {
        console.error("Error fetching doctors:", error)
        toast({
          title: "Error",
          description: "Failed to load doctors. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Find the Right Doctor & Book an Appointment</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Book appointments with top doctors for phone calls, video consultations, or in-person visits.
        </p>
        <div className="max-w-xl mx-auto">
          <Search />
        </div>
      </section>

      <section className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Popular Specialties</h2>
          <Link href="/doctors">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Link href="/doctors?specialty=cardiology" className="block">
            <div className="bg-card hover:bg-accent transition-colors p-6 rounded-lg text-center shadow-sm hover:shadow-md">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-lg">Cardiology</h3>
            </div>
          </Link>

          <Link href="/doctors?specialty=neurology" className="block">
            <div className="bg-card hover:bg-accent transition-colors p-6 rounded-lg text-center shadow-sm hover:shadow-md">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-lg">Neurology</h3>
            </div>
          </Link>

          <Link href="/doctors?specialty=orthopedics" className="block">
            <div className="bg-card hover:bg-accent transition-colors p-6 rounded-lg text-center shadow-sm hover:shadow-md">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-lg">Orthopedics</h3>
            </div>
          </Link>

          <Link href="/doctors?specialty=dermatology" className="block">
            <div className="bg-card hover:bg-accent transition-colors p-6 rounded-lg text-center shadow-sm hover:shadow-md">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-lg">Dermatology</h3>
            </div>
          </Link>
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6">Top Doctors</h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading doctors...</span>
          </div>
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.slice(0, 3).map((doctor) => (
              <DoctorCard
                key={doctor.id}
                id={doctor.id}
                name={doctor.user.name}
                specialty={doctor.specialty}
                rating={doctor.rating}
                reviewCount={doctor.reviewCount}
                imageUrl={doctor.imageUrl || "/placeholder.svg?height=300&width=300"}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No doctors found. Add doctors to get started.</p>
            <Link href="/admin/add-doctor" className="mt-4 inline-block">
              <Button>Add Doctor</Button>
            </Link>
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/doctors">
            <Button>View All Doctors</Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
