"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Search() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/doctors?search=${encodeURIComponent(searchTerm)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <Input
        type="text"
        placeholder="Search for doctors, specialties..."
        className="pl-10 h-12"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10">
        Search
      </Button>
    </form>
  )
}
