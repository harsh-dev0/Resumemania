import React from "react"

const Footer = () => {
  return (
    <footer className="bg-navy text-white p-4">
      <div className="container mx-auto">
        <p className="text-sm text-center">
          Resume AI © {new Date().getFullYear()} | AI-Powered Resume
          Enhancement
        </p>
      </div>
    </footer>
  )
}

export default Footer
