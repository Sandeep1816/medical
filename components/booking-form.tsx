"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Phone, Video, User, Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { BookingStepper } from "@/components/booking-stepper"
import { toast } from "@/components/ui/use-toast"

interface BookingFormProps {
  doctorId: string
  doctorName: string
}

export function BookingForm({ doctorId, doctorName }: BookingFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingData, setBookingData] = useState({
    appointmentType: "video",
    date: "",
    timeSlot: "",
    name: "",
    phone: "",
    email: "",
    notes: "",
  })

  // Mock time slots - would come from API based on doctor availability
  const availableTimeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBookingData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setBookingData((prev) => ({ ...prev, appointmentType: value }))
  }

  const handleTimeSlotSelect = (slot: string) => {
    setBookingData((prev) => ({ ...prev, timeSlot: slot }))
  }

  const handleNextStep = () => {
    setStep((prev) => prev + 1)
  }

  const handlePrevStep = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Convert time slot to 24-hour format for database
      const [time, period] = bookingData.timeSlot.split(" ")
      const [hour, minute] = time.split(":")
      let hour24 = Number.parseInt(hour)

      if (period === "PM" && hour24 < 12) {
        hour24 += 12
      } else if (period === "AM" && hour24 === 12) {
        hour24 = 0
      }

      const startTimeStr = `${bookingData.date}T${hour24.toString().padStart(2, "0")}:${minute}:00`
      const startTime = new Date(startTimeStr)

      // End time is 30 minutes after start time
      const endTime = new Date(startTime)
      endTime.setMinutes(endTime.getMinutes() + 30)

      // Map appointment type to enum value
      const appointmentTypeMap: Record<string, string> = {
        video: "VIDEO",
        phone: "PHONE",
        "in-person": "IN_PERSON",
      }

      // Create appointment data
      const appointmentData = {
        patientId: "64f5a53e9d312a1d34e9fc68", // This would normally come from the authenticated user
        doctorId: doctorId,
        date: bookingData.date,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        type: appointmentTypeMap[bookingData.appointmentType],
        notes: bookingData.notes,
        // Additional patient info that would be stored in a real application
        patientInfo: {
          name: bookingData.name,
          phone: bookingData.phone,
          email: bookingData.email,
        },
      }

      // Send data to API
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to book appointment")
      }

      // Redirect to confirmation page
      router.push(`/booking/confirmation?id=${doctorId}`)
    } catch (error) {
      console.error("Error booking appointment:", error)
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Failed to book appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <BookingStepper currentStep={step} />

      <form onSubmit={handleSubmit} className="mt-6">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Select Appointment Type</h4>
              <RadioGroup
                defaultValue={bookingData.appointmentType}
                onValueChange={handleRadioChange}
                className="grid grid-cols-1 gap-4"
              >
                <Label
                  htmlFor="video"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                    bookingData.appointmentType === "video" && "border-primary",
                  )}
                >
                  <RadioGroupItem value="video" id="video" className="sr-only" />
                  <Video className="mb-3 h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Video Consultation</div>
                    <div className="text-sm text-muted-foreground">Meet online via video call</div>
                  </div>
                </Label>

                <Label
                  htmlFor="phone"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                    bookingData.appointmentType === "phone" && "border-primary",
                  )}
                >
                  <RadioGroupItem value="phone" id="phone" className="sr-only" />
                  <Phone className="mb-3 h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Phone Consultation</div>
                    <div className="text-sm text-muted-foreground">Talk over a phone call</div>
                  </div>
                </Label>

                <Label
                  htmlFor="in-person"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                    bookingData.appointmentType === "in-person" && "border-primary",
                  )}
                >
                  <RadioGroupItem value="in-person" id="in-person" className="sr-only" />
                  <User className="mb-3 h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">In-Person Visit</div>
                    <div className="text-sm text-muted-foreground">Visit the doctor's office</div>
                  </div>
                </Label>
              </RadioGroup>
            </div>

            <div>
              <h4 className="font-medium mb-3">Select Date</h4>
              <div className="grid gap-2">
                <Label htmlFor="date" className="sr-only">
                  Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    className="pl-10"
                    value={bookingData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {bookingData.date && (
              <div>
                <h4 className="font-medium mb-3">Select Time Slot</h4>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimeSlots.map((slot) => (
                    <Button
                      key={slot}
                      type="button"
                      variant={bookingData.timeSlot === slot ? "default" : "outline"}
                      className="text-xs h-10"
                      onClick={() => handleTimeSlotSelect(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="button"
              className="w-full"
              onClick={handleNextStep}
              disabled={!bookingData.appointmentType || !bookingData.date || !bookingData.timeSlot}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={bookingData.name} onChange={handleInputChange} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={bookingData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={bookingData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Any specific concerns or questions for the doctor"
                  value={bookingData.notes}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={handlePrevStep}>
                Back
              </Button>

              <Button
                type="button"
                className="flex-1"
                onClick={handleNextStep}
                disabled={!bookingData.name || !bookingData.phone || !bookingData.email}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="rounded-lg border p-4">
              <h4 className="font-medium mb-4">Booking Summary</h4>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Doctor:</span>
                  <span className="font-medium">{doctorName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Appointment Type:</span>
                  <span className="font-medium capitalize">{bookingData.appointmentType} Consultation</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{bookingData.date}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">{bookingData.timeSlot}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Patient:</span>
                  <span className="font-medium">{bookingData.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{bookingData.phone}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{bookingData.email}</span>
                </div>

                {bookingData.notes && (
                  <div className="pt-2">
                    <span className="text-muted-foreground">Notes:</span>
                    <p className="mt-1">{bookingData.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={handlePrevStep}>
                Back
              </Button>

              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Confirm Booking"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
