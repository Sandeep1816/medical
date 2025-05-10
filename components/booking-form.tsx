"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Phone, Video, User, Calendar, ArrowRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { BookingStepper } from "@/components/booking-stepper"
import { toast } from "@/components/ui/use-toast"
import { format, addMinutes, parse } from "date-fns"

interface BookingFormProps {
  doctorId: string
  doctorName: string
}

interface TimeSlot {
  startTime: string
  endTime: string
  isAvailable: boolean
}

export function BookingForm({ doctorId, doctorName }: BookingFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])

  const [bookingData, setBookingData] = useState({
    appointmentType: "video",
    date: format(new Date(), "yyyy-MM-dd"),
    timeSlot: "",
    name: "",
    phone: "",
    email: "",
    notes: "",
  })

  // Fetch available time slots when date changes
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!bookingData.date) return

      setIsLoadingSlots(true)
      try {
        // Get the day of week (0-6, where 0 is Sunday)
        const selectedDate = new Date(bookingData.date)
        const dayOfWeek = selectedDate.getDay()

        // Fetch time slots for this doctor and day
        const response = await fetch(`/api/time-slots?doctorId=${doctorId}&day=${dayOfWeek}`)

        if (!response.ok) {
          throw new Error("Failed to fetch time slots")
        }

        const slots = await response.json()

        // Generate 30-minute intervals from the time slots
        const timeSlots: TimeSlot[] = []

        slots.forEach((slot: any) => {
          const [startHour, startMinute] = slot.startTime.split(":").map(Number)
          const [endHour, endMinute] = slot.endTime.split(":").map(Number)

          let currentTime = new Date()
          currentTime.setHours(startHour, startMinute, 0, 0)

          const endTime = new Date()
          endTime.setHours(endHour, endMinute, 0, 0)

          while (currentTime < endTime) {
            const slotStartTime = format(currentTime, "HH:mm")
            const slotEndTime = format(addMinutes(currentTime, 30), "HH:mm")

            timeSlots.push({
              startTime: slotStartTime,
              endTime: slotEndTime,
              isAvailable: true,
            })

            currentTime = addMinutes(currentTime, 30)
          }
        })

        // Now check which slots are already booked
        const bookingsResponse = await fetch(`/api/appointments?doctorId=${doctorId}&date=${bookingData.date}`)

        if (bookingsResponse.ok) {
          const bookings = await bookingsResponse.json()

          // Mark booked slots as unavailable
          bookings.forEach((booking: any) => {
            const bookingStart = new Date(booking.startTime)
            const bookingEnd = new Date(booking.endTime)

            timeSlots.forEach((slot) => {
              const slotDate = new Date(bookingData.date)
              const [slotStartHour, slotStartMinute] = slot.startTime.split(":").map(Number)
              const [slotEndHour, slotEndMinute] = slot.endTime.split(":").map(Number)

              const slotStart = new Date(slotDate)
              slotStart.setHours(slotStartHour, slotStartMinute, 0, 0)

              const slotEnd = new Date(slotDate)
              slotEnd.setHours(slotEndHour, slotEndMinute, 0, 0)

              // Check if slot overlaps with booking
              if (
                (slotStart >= bookingStart && slotStart < bookingEnd) ||
                (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
                (slotStart <= bookingStart && slotEnd >= bookingEnd)
              ) {
                slot.isAvailable = false
              }
            })
          })
        }

        setAvailableTimeSlots(timeSlots)
      } catch (error) {
        console.error("Error fetching time slots:", error)
        toast({
          title: "Error",
          description: "Failed to load available time slots. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingSlots(false)
      }
    }

    fetchTimeSlots()
  }, [doctorId, bookingData.date])

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
      // Get the selected time slot
      const selectedSlot = availableTimeSlots.find(
        (slot) => `${slot.startTime} - ${slot.endTime}` === bookingData.timeSlot,
      )

      if (!selectedSlot) {
        throw new Error("Invalid time slot selected")
      }

      // Convert time slot to 24-hour format for database
      const [startTime, endTime] = bookingData.timeSlot.split(" - ")

      // Create date objects for start and end times
      const startDate = new Date(bookingData.date)
      const [startHour, startMinute] = startTime.split(":").map(Number)
      startDate.setHours(startHour, startMinute, 0, 0)

      const endDate = new Date(bookingData.date)
      const [endHour, endMinute] = endTime.split(":").map(Number)
      endDate.setHours(endHour, endMinute, 0, 0)

      // Map appointment type to enum value
      const appointmentTypeMap: Record<string, string> = {
        video: "VIDEO",
        phone: "PHONE",
        "in-person": "IN_PERSON",
      }

      // Create appointment data
      const appointmentData = {
        doctorId: doctorId,
        date: bookingData.date,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        type: appointmentTypeMap[bookingData.appointmentType],
        notes: bookingData.notes,
        patientName: bookingData.name,
        patientEmail: bookingData.email,
        patientPhone: bookingData.phone,
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

  // Format time slots for display
  const formatTimeSlot = (slot: TimeSlot) => {
    const startTime = parse(slot.startTime, "HH:mm", new Date())
    return `${slot.startTime} - ${slot.endTime}`
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
                    min={format(new Date(), "yyyy-MM-dd")}
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Select Time Slot</h4>
              {isLoadingSlots ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="ml-2">Loading available slots...</span>
                </div>
              ) : availableTimeSlots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableTimeSlots.map((slot, index) => {
                    const timeSlotString = `${slot.startTime} - ${slot.endTime}`
                    return (
                      <Button
                        key={index}
                        type="button"
                        variant={bookingData.timeSlot === timeSlotString ? "default" : "outline"}
                        className={cn(
                          "text-xs h-10 flex items-center justify-center",
                          !slot.isAvailable && "opacity-50 cursor-not-allowed",
                        )}
                        onClick={() => slot.isAvailable && handleTimeSlotSelect(timeSlotString)}
                        disabled={!slot.isAvailable}
                      >
                        <Clock className="mr-1 h-3 w-3" />
                        {timeSlotString}
                      </Button>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center p-4 border rounded-md">
                  <p className="text-muted-foreground">No available time slots for this date.</p>
                  <p className="text-sm mt-1">Please select a different date.</p>
                </div>
              )}
            </div>

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
                  <span className="font-medium">{format(new Date(bookingData.date), "MMMM d, yyyy")}</span>
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
