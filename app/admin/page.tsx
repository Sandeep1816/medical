// app/admin/page.tsx
"use client"

import { useState } from "react"
import { CalendarIcon, Filter, Search, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { AdminAppointmentList } from "@/components/admin-appointment-list"
import AddDoctorForm from "@/components/AddDoctorForm" // ⬅️ Import added

export default function AdminDashboard() {
  const [date, setDate] = useState<Date>()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">Manage and view all patient appointments</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="default">+ New Appointment</Button>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6 mb-8">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="grid gap-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="search" type="search" placeholder="Search by name or ID..." className="pl-8" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="in-person">In-person</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      </div>

      {/* ✅ AddDoctorForm section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Add New Doctor</h2>
        <AddDoctorForm />
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <AdminAppointmentList status="upcoming" />
        </TabsContent>

        <TabsContent value="today" className="mt-6">
          <AdminAppointmentList status="today" />
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <AdminAppointmentList status="completed" />
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          <AdminAppointmentList status="cancelled" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
