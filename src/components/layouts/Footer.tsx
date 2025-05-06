import React from "react"
import Link from "next/link"

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-brand-600 mb-4">
              CareerCraft Wizard
            </h3>
            <p className="text-gray-600 text-sm">
              AI-powered resume generator tailored to job descriptions.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-brand-600 transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/resumes"
                  className="text-gray-600 hover:text-brand-600 transition"
                >
                  Generate Resumes
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Contact</h4>
            <p className="text-gray-600 text-sm">
              contactcareercraft1@gmail.com
            </p>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} CareerCraft Wizard. All rights
          reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
