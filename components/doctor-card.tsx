import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DoctorCardProps {
  id: string
  name: string
  specialty: string
  rating: number
  reviewCount: number
  imageUrl: string
}

export function DoctorCard({ id, name, specialty, rating, reviewCount, imageUrl }: DoctorCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="aspect-square relative">
        <Image src={imageUrl || "/placeholder.svg?height=300&width=300"} alt={name} fill className="object-cover" />
        <div className="absolute top-2 right-2">
          <Badge className="bg-primary text-white">{specialty}</Badge>
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-muted-foreground text-sm mb-2">{specialty} Specialist</p>

        <div className="flex items-center mt-2 mb-4">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-muted-foreground ml-2">({reviewCount} reviews)</span>
        </div>

        <Link href={`/doctors/${id}`} className="block w-full">
          <Button className="w-full">Book Appointment</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
