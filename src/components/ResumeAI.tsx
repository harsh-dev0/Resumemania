import React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Header from "./layouts/Header"
import Footer from "./layouts/Footer"

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-brand-50 to-brand-100">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-brand-950">
                Craft the Perfect Resume with AI
              </h1>
              <p className="text-lg text-gray-700">
                Build your profile once, and generate tailored resumes for
                any job description with our AI-powered platform.
              </p>
              <div className="pt-4 space-x-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Link href="/resumes">Get Started</Link>
                </Button>
                
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auhref=format&fit=crop"
                alt="Resume illustration"
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-brand-900">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition">
                <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-brand-600">
                    1
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-brand-800">
                  Create Your Profile
                </h3>
                <p className="text-gray-600">
                  Add your personal information, work experience,
                  education, skills, and projects just once.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition">
                <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-brand-600">
                    2
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-brand-800">
                  Paste Job Description
                </h3>
                <p className="text-gray-600">
                  Find a job you love and paste the description into our
                  platform.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition">
                <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-brand-600">
                    3
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-brand-800">
                  Generate Tailored Resume
                </h3>
                <p className="text-gray-600">
                  Our AI analyzes the job description and creates a
                  customized resume highlighting your relevant skills.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-brand-900">
              What Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <p className="italic text-gray-600 mb-4">
                  "CareerCraft Wizard helped me tailor my resume perfectly
                  for my dream job. I got called for an interview within
                  days!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-brand-200 rounded-full"></div>
                  <div className="ml-3">
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-sm text-gray-500">
                      Marketing Specialist
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <p className="italic text-gray-600 mb-4">
                  "The AI actually understood which of my skills were
                  relevant to each job description. Saved me hours of
                  editing!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-brand-200 rounded-full"></div>
                  <div className="ml-3">
                    <p className="font-medium">Michael Chen</p>
                    <p className="text-sm text-gray-500">
                      Software Engineer
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-12">
              <Button
                asChild
                size="lg"
                className="bg-brand-600 hover:bg-brand-700"
              >
                <Link href="/profile">Create Your Profile</Link>
              </Button>
            </div>
          </div>
        </section> */}
      </main>
      
    </div>
  )
}

export default Index
