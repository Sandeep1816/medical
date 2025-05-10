"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Plus, Trash2 } from "lucide-react"

type EducationItem = { degree: string; institution: string; year: string }
type ExperienceItem = { position: string; institution: string; years: string }

export default function AddDoctorPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [doctorData, setDoctorData] = useState({
    name: "",
    specialty: "",
    bio: "",
    languages: "",
    consultationFee: "100",
    rating: "5",
    reviewCount: "0",
    imageUrl: "",
  })

  const [education, setEducation] = useState<EducationItem[]>([{ degree: "", institution: "", year: "" }])

  const [experience, setExperience] = useState<ExperienceItem[]>([{ position: "", institution: "", years: "" }])

  function handleDoctorChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setDoctorData((prev) => ({ ...prev, [name]: value }))
  }

  function handleEducationChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setEducation((prev) => {
      const copy = [...prev]
      ;(copy[index] as any)[name] = value
      return copy
    })
  }

  function handleExperienceChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setExperience((prev) => {
      const copy = [...prev]
      ;(copy[index] as any)[name] = value
      return copy
    })
  }

  function addEducationRow() {
    setEducation((prev) => [...prev, { degree: "", institution: "", year: "" }])
  }

  function removeEducationRow(index: number) {
    if (education.length > 1) {
      setEducation((prev) => prev.filter((_, i) => i !== index))
    }
  }

  function addExperienceRow() {
    setExperience((prev) => [...prev, { position: "", institution: "", years: "" }])
  }

  function removeExperienceRow(index: number) {
    if (experience.length > 1) {
      setExperience((prev) => prev.filter((_, i) => i !== index))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!doctorData.name || !doctorData.specialty) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      const payload = {
        name: doctorData.name,
        specialty: doctorData.specialty,
        bio: doctorData.bio,
        education: education,
        experience: experience,
        languages: doctorData.languages.split(",").map((l) => l.trim()),
        consultationFee: doctorData.consultationFee,
        rating: doctorData.rating,
        reviewCount: doctorData.reviewCount,
        imageUrl: doctorData.imageUrl || "/placeholder.svg?height=300&width=300",
      }

      const res = await fetch("/api/doctors", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to add doctor")
      }

      const doctorDataResponse = await res.json()
      // Add default time slots for the doctor

      // Add some default time slots for the doctor (Mon-Fri, 9 AM - 5 PM)
      for (let day = 1; day <= 5; day++) {
        await fetch("/api/time-slots", {
          method: "POST",
          body: JSON.stringify({
            doctorId: doctorDataResponse.id,
            day,
            startTime: "09:00",
            endTime: "17:00",
          }),
          headers: { "Content-Type": "application/json" },
        })
      }

      toast({
        title: "Doctor added successfully",
        description: "The doctor has been added to the system with default time slots.",
      })

      // Redirect to doctors list
      router.push("/admin")
    } catch (error) {
      console.error("Error adding doctor:", error)
      toast({
        title: "Failed to add doctor",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Doctor</h1>

      <Card>
        <CardHeader>
          <CardTitle>Doctor Information</CardTitle>
          <CardDescription>Enter the doctor's details to add them to the system.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Doctor's Name <span className="text-red-500">*</span>
                </Label>
                <Input id="name" name="name" value={doctorData.name} onChange={handleDoctorChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">
                  Specialty <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="specialty"
                  name="specialty"
                  value={doctorData.specialty}
                  onChange={handleDoctorChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Profile Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={doctorData.imageUrl}
                onChange={handleDoctorChange}
                placeholder="https://example.com/doctor-image.jpg"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use a default image. For best results, use a square image (1:1 ratio).
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" value={doctorData.bio} onChange={handleDoctorChange} rows={4} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="languages">Languages (comma-separated)</Label>
              <Input
                id="languages"
                name="languages"
                value={doctorData.languages}
                onChange={handleDoctorChange}
                placeholder="English, Spanish, French"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="consultationFee">Consultation Fee ($)</Label>
                <Input
                  id="consultationFee"
                  name="consultationFee"
                  type="number"
                  value={doctorData.consultationFee}
                  onChange={handleDoctorChange}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  value={doctorData.rating}
                  onChange={handleDoctorChange}
                  min="0"
                  max="5"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewCount">Review Count</Label>
                <Input
                  id="reviewCount"
                  name="reviewCount"
                  type="number"
                  value={doctorData.reviewCount}
                  onChange={handleDoctorChange}
                  min="0"
                />
              </div>
            </div>

            {/* Education Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-medium">Education</Label>
                <Button type="button" variant="outline" size="sm" onClick={addEducationRow}>
                  <Plus className="h-4 w-4 mr-1" /> Add Education
                </Button>
              </div>

              {education.map((ed, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md relative">
                  <div className="space-y-2">
                    <Label htmlFor={`degree-${i}`}>Degree</Label>
                    <Input
                      id={`degree-${i}`}
                      name="degree"
                      value={ed.degree}
                      onChange={(e) => handleEducationChange(i, e)}
                      placeholder="MD, PhD, etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`institution-${i}`}>Institution</Label>
                    <Input
                      id={`institution-${i}`}
                      name="institution"
                      value={ed.institution}
                      onChange={(e) => handleEducationChange(i, e)}
                      placeholder="University name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`year-${i}`}>Year</Label>
                    <Input
                      id={`year-${i}`}
                      name="year"
                      value={ed.year}
                      onChange={(e) => handleEducationChange(i, e)}
                      placeholder="2020"
                    />
                  </div>

                  {education.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      onClick={() => removeEducationRow(i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Experience Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-medium">Experience</Label>
                <Button type="button" variant="outline" size="sm" onClick={addExperienceRow}>
                  <Plus className="h-4 w-4 mr-1" /> Add Experience
                </Button>
              </div>

              {experience.map((ex, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md relative">
                  <div className="space-y-2">
                    <Label htmlFor={`position-${i}`}>Position</Label>
                    <Input
                      id={`position-${i}`}
                      name="position"
                      value={ex.position}
                      onChange={(e) => handleExperienceChange(i, e)}
                      placeholder="Senior Cardiologist"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`institution-${i}`}>Institution</Label>
                    <Input
                      id={`institution-${i}`}
                      name="institution"
                      value={ex.institution}
                      onChange={(e) => handleExperienceChange(i, e)}
                      placeholder="Hospital name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`years-${i}`}>Years</Label>
                    <Input
                      id={`years-${i}`}
                      name="years"
                      value={ex.years}
                      onChange={(e) => handleExperienceChange(i, e)}
                      placeholder="2015-2020"
                    />
                  </div>

                  {experience.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      onClick={() => removeExperienceRow(i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Add Doctor"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
