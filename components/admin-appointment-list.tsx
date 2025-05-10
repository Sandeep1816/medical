"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, MoreHorizontal, Phone, User, Video, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

interface Appointment {
  id: string
  patient: {
    name: string
    phone: string
    email: string
  }
  doctor: {
    user: {
      name: string
    }
  }
  patientName?: string
  patientPhone?: string
  patientEmail?: string
  type: "VIDEO" | "PHONE" | "IN_PERSON"
  date: string
  startTime: string
  endTime: string
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED"
  notes?: string
}

interface AdminAppointmentListProps {
  status: "upcoming" | "today" | "completed" | "cancelled" | "all"
}

export function AdminAppointmentList({ status }: AdminAppointmentListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true)
      try {
        // Build query parameters based on status
        const queryParams = new URLSearchParams()

        if (status === "completed") {
          queryParams.append("status", "COMPLETED")
        } else if (status === "cancelled") {
          queryParams.append("status", "CANCELLED")
        } else if (status === "today") {
          // Format today's date as YYYY-MM-DD
          const today = new Date()
          const formattedDate = today.toISOString().split("T")[0]
          queryParams.append("date", formattedDate)
        } else if (status === "upcoming") {
          queryParams.append("status", "SCHEDULED")
        }

        const response = await fetch(`/api/appointments?${queryParams.toString()}`)

        if (!response.ok) {
          throw new Error("Failed to fetch appointments")
        }

        const data = await response.json()
        setAppointments(data)
      } catch (error) {
        console.error("Error fetching appointments:", error)
        toast({
          title: "Error",
          description: "Failed to load appointments. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
  }, [status])

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update appointment status")
      }

      // Update the appointment in the local state
      setAppointments(
        appointments.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status: newStatus as "SCHEDULED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED" }
            : appointment,
        ),
      )

      toast({
        title: "Status Updated",
        description: `Appointment status changed to ${newStatus.toLowerCase()}.`,
      })
    } catch (error) {
      console.error("Error updating appointment status:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update appointment status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const formatTime = (timeString: string) => {
    const time = new Date(timeString)
    return time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  const getPatientName = (appointment: Appointment) => {
    return appointment.patientName || appointment.patient?.name || "Unknown Patient"
  }

  const getPatientPhone = (appointment: Appointment) => {
    return appointment.patientPhone || appointment.patient?.phone || "N/A"
  }

  const getPatientEmail = (appointment: Appointment) => {
    return appointment.patientEmail || appointment.patient?.email || "N/A"
  }

  const getAppointmentTypeIcon = (type: "VIDEO" | "PHONE" | "IN_PERSON") => {
    switch (type) {
      case "VIDEO":
        return <Video className="h-4 w-4 text-blue-500" />
      case "PHONE":
        return <Phone className="h-4 w-4 text-green-500" />
      case "IN_PERSON":
        return <User className="h-4 w-4 text-purple-500" />
    }
  }

  const getStatusBadge = (status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED") => {
    switch (status) {
      case "SCHEDULED":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Scheduled
          </Badge>
        )
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        )
      case "CANCELLED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelled
          </Badge>
        )
      case "RESCHEDULED":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Rescheduled
          </Badge>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading appointments...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Appointment ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">{appointment.id.substring(0, 8)}</TableCell>
                  <TableCell>{getPatientName(appointment)}</TableCell>
                  <TableCell>{appointment.doctor.user.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getAppointmentTypeIcon(appointment.type)}
                      <span className="capitalize">{appointment.type.toLowerCase().replace("_", "-")}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{formatDate(appointment.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{formatTime(appointment.startTime)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DialogTrigger asChild>
                            <DropdownMenuItem onClick={() => setSelectedAppointment(appointment)}>
                              View Details
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          {appointment.status === "SCHEDULED" && (
                            <>
                              <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, "COMPLETED")}>
                                Mark as Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(appointment.id, "CANCELLED")}
                                className="text-red-600"
                              >
                                Cancel Appointment
                              </DropdownMenuItem>
                            </>
                          )}
                          {appointment.status === "CANCELLED" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, "SCHEDULED")}>
                              Restore Appointment
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <DialogContent>
                        {selectedAppointment && (
                          <>
                            <DialogHeader>
                              <DialogTitle>Appointment Details</DialogTitle>
                              <DialogDescription>Complete information about the appointment.</DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Appointment ID</h4>
                                  <p className="font-medium">{selectedAppointment.id}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                                  <p>{getStatusBadge(selectedAppointment.status)}</p>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Patient Information</h4>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Name</p>
                                    <p>{getPatientName(selectedAppointment)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Phone</p>
                                    <p>{getPatientPhone(selectedAppointment)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p>{getPatientEmail(selectedAppointment)}</p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Appointment Details</h4>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Doctor</p>
                                    <p>{selectedAppointment.doctor.user.name}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Type</p>
                                    <div className="flex items-center gap-2">
                                      {getAppointmentTypeIcon(selectedAppointment.type)}
                                      <span className="capitalize">
                                        {selectedAppointment.type.toLowerCase().replace("_", "-")}
                                      </span>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Date</p>
                                    <p>{formatDate(selectedAppointment.date)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Time</p>
                                    <p>{formatTime(selectedAppointment.startTime)}</p>
                                  </div>
                                </div>
                              </div>

                              {selectedAppointment.notes && (
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Notes</h4>
                                  <p className="text-sm">{selectedAppointment.notes}</p>
                                </div>
                              )}
                            </div>

                            <DialogFooter>
                              <Button variant="outline">Edit</Button>
                              <Button>Close</Button>
                            </DialogFooter>
                          </>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No appointments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
