"use client"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Header from "@/components/layouts/Header"
import Footer from "@/components/layouts/Footer"

const NotFound = () => {
  const location = usePathname()

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location
    )
  }, [location])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-16">
        <div className="text-center max-w-md px-4">
          <div className="mb-6">
            <div className="bg-brand-100 text-brand-600 inline-block p-4 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-brand-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Sorry, the page you're looking for doesn't exist or has been
            moved.
          </p>
          <Button asChild className="bg-brand-600 hover:bg-brand-700">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default NotFound
