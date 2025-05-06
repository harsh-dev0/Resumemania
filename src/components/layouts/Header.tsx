import React from "react"
import { FileText } from "lucide-react"

const Header = () => {
  return (
    <header className="bg-navy text-white p-4 shadow-md">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6" />
            <h1 className="text-xl font-bold">Resume AI</h1>
          </div>
          <p className="text-sm opacity-75">
            AI-Powered Resume Enhancement
          </p>
        </div>
      </div>
    </header>
  )
}

export default Header
