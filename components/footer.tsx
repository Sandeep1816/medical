import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t py-8 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">MedBook</h3>
            <p className="text-muted-foreground">
              Book appointments with top doctors for phone calls, video consultations, or in-person visits.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/doctors" className="text-muted-foreground hover:text-foreground">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link href="/specialties" className="text-muted-foreground hover:text-foreground">
                  Specialties
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-foreground">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Contact</h4>
            <address className="not-italic text-muted-foreground">
              <p>123 Medical Plaza</p>
              <p>San Francisco, CA 94103</p>
              <p className="mt-2">contact@medbook.com</p>
              <p>+1 (555) 123-4567</p>
            </address>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} MedBook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
