import Link from "next/link"
import { CheckCircle, Calendar, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function BookingConfirmation() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>

            <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground mb-6">Your appointment has been successfully scheduled.</p>

            <div className="rounded-lg bg-muted p-4 text-left mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Doctor:</span>
                  <span className="font-medium">Dr. Sarah Johnson</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Appointment Type:</span>
                  <span className="font-medium">Video Consultation</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">May 15, 2023</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">10:30 AM</span>
                </div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>A confirmation email has been sent to your email address.</p>
              <p className="mt-1">You will receive a reminder 24 hours before your appointment.</p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              Add to Calendar
            </Button>

            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
