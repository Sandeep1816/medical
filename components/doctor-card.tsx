import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <Image src={imageUrl || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-muted-foreground">{specialty}</p>

        <div className="flex items-center mt-2 mb-4">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm font-medium">{rating}</span>
          </div>
          <span className="text-sm text-muted-foreground ml-2">({reviewCount} reviews)</span>
        </div>

        <Link href={`/doctors/${id}`}>
          <Button className="w-full">View Profile</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
