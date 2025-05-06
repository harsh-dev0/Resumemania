"use client"
import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

const Header = () => {
  const { toast } = useToast()

  const handleHelp = () => {
    toast({
      title: "Need help?",
      description:
        "We're here to help! Contact contactcareercraft1@gmail.com",
    })
  }

  return (
    <header className="border-b bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-brand-600 text-white rounded-md p-1 font-bold">
            CW
          </div>
          <span className="text-lg font-semibold text-brand-900">
            CareerCraft Wizard
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/resumes"
            className="text-gray-700 hover:text-brand-600 transition"
          >
            Generate Resume
          </Link>
          <Button variant="outline" size="sm" onClick={handleHelp}>
            Help
          </Button>
        </nav>
      </div>
    </header>
  )
}

export default Header
