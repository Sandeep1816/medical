"use client"

import { useState } from "react"

type EducationItem = { degree: string; institution: string; year: string }
type ExperienceItem = { position: string; institution: string; years: string }

export default function AddDoctorForm() {
  const [doctorData, setDoctorData] = useState({
    userId: "",
    specialty: "",
    bio: "",
    languages: "",
    consultationFee: 0,
    rating: 5,
    reviewCount: 0,
  })

  const [education, setEducation] = useState<EducationItem[]>([
    { degree: "", institution: "", year: "" },
  ])
  const [experience, setExperience] = useState<ExperienceItem[]>([
    { position: "", institution: "", years: "" },
  ])

  function handleDoctorChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setDoctorData((prev) => ({ ...prev, [name]: value }))
  }

  function handleEducationChange(
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target
    setEducation((prev) => {
      const copy = [...prev]
      ;(copy[index] as any)[name] = value
      return copy
    })
  }

  function handleExperienceChange(
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
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

  function addExperienceRow() {
    setExperience((prev) => [...prev, { position: "", institution: "", years: "" }])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const payload = {
      ...doctorData,
      education: JSON.stringify(education),
      experience: JSON.stringify(experience),
      languages: doctorData.languages.split(",").map((l) => l.trim()),
    }

    const res = await fetch("/api/doctors", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    })

    if (res.ok) {
      alert("Doctor added successfully!")
    } else {
      alert("Failed to add doctor")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label>User ID</label>
        <input
          name="userId"
          value={doctorData.userId}
          onChange={handleDoctorChange}
          className="block w-full"
        />
      </div>

      <div>
        <label>Specialty</label>
        <input
          name="specialty"
          value={doctorData.specialty}
          onChange={handleDoctorChange}
          className="block w-full"
        />
      </div>

      <div>
        <label>Bio</label>
        <textarea
          name="bio"
          value={doctorData.bio}
          onChange={handleDoctorChange}
          className="block w-full"
        />
      </div>

      <div>
        <label>Languages (comma‑separated)</label>
        <input
          name="languages"
          value={doctorData.languages}
          onChange={handleDoctorChange}
          className="block w-full"
        />
      </div>

      <div>
        <label>Consultation Fee</label>
        <input
          type="number"
          name="consultationFee"
          value={doctorData.consultationFee}
          onChange={handleDoctorChange}
          className="block w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Rating</label>
          <input
            type="number"
            name="rating"
            value={doctorData.rating}
            onChange={handleDoctorChange}
            className="block w-full"
          />
        </div>
        <div>
          <label>Review Count</label>
          <input
            type="number"
            name="reviewCount"
            value={doctorData.reviewCount}
            onChange={handleDoctorChange}
            className="block w-full"
          />
        </div>
      </div>

      {/* Education Section */}
      <div>
        <h3 className="font-semibold mb-2">Education</h3>
        {education.map((ed, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 mb-2">
            <input
              name="degree"
              placeholder="Degree"
              value={ed.degree}
              onChange={(e) => handleEducationChange(i, e)}
              className="block w-full"
            />
            <input
              name="institution"
              placeholder="Institution"
              value={ed.institution}
              onChange={(e) => handleEducationChange(i, e)}
              className="block w-full"
            />
            <input
              name="year"
              placeholder="Year"
              value={ed.year}
              onChange={(e) => handleEducationChange(i, e)}
              className="block w-full"
            />
          </div>
        ))}
        <button type="button" onClick={addEducationRow} className="text-blue-600">
          + Add Education
        </button>
      </div>

      {/* Experience Section */}
      <div>
        <h3 className="font-semibold mb-2">Experience</h3>
        {experience.map((ex, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 mb-2">
            <input
              name="position"
              placeholder="Position"
              value={ex.position}
              onChange={(e) => handleExperienceChange(i, e)}
              className="block w-full"
            />
            <input
              name="institution"
              placeholder="Institution"
              value={ex.institution}
              onChange={(e) => handleExperienceChange(i, e)}
              className="block w-full"
            />
            <input
              name="years"
              placeholder="Years"
              value={ex.years}
              onChange={(e) => handleExperienceChange(i, e)}
              className="block w-full"
            />
          </div>
        ))}
        <button type="button" onClick={addExperienceRow} className="text-blue-600">
          + Add Experience
        </button>
      </div>

      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Add Doctor
      </button>
    </form>
  )
}
