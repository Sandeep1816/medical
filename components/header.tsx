"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          MedBook
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center space-x-6">
            <Link href="/doctors" className="text-sm font-medium hover:text-primary">
              Find Doctors
            </Link>
            <Link href="/specialties" className="text-sm font-medium hover:text-primary">
              Specialties
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              About Us
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </div>

        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden px-4 py-4 border-t">
          <nav className="flex flex-col space-y-4">
            <Link href="/doctors" className="text-sm font-medium hover:text-primary">
              Find Doctors
            </Link>
            <Link href="/specialties" className="text-sm font-medium hover:text-primary">
              Specialties
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              About Us
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary">
              Contact
            </Link>
            <div className="flex space-x-3 pt-2">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
