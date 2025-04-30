"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function ResumeAI() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDesc, setJobDesc] = useState("")
  const [latex, setLatex] = useState("")
  const [updatedLatex, setUpdatedLatex] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [fileName, setFileName] = useState("")
  const [error, setError] = useState("")

  async function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return
    
    const file = e.target.files[0]
    const fileType = file.name.split('.').pop()?.toLowerCase()
    
    if (fileType !== 'pdf') {
      setError("Please upload a PDF file")
      return
    }
    
    setError("")
    setResumeFile(file)
    setFileName(file.name)
    setLoading(true)
    
    const formData = new FormData()
    formData.append("file", file)
    
    try {
      const res = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      })
      
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`)
      }
      
      const data = await res.json()
      
      if (data.latex) {
        localStorage.setItem("parsedLatex", data.latex)
        setLatex(data.latex)
        setStep(2)
      } else {
        setError("Failed to parse resume")
      }
    } catch (err) {
      setError("Error processing resume")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateResume() {
    if (!jobDesc.trim()) {
      setError("Please enter a job description")
      return
    }
    
    setError("")
    setLoading(true)
    
    try {
      const res = await fetch("/api/update-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latex, jobDesc }),
      })
      
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`)
      }
      
      const data = await res.json()
      
      if (data.updatedLatex) {
        setUpdatedLatex(data.updatedLatex)
        setStep(3)
      } else {
        setError("Failed to update resume")
      }
    } catch (err) {
      setError("Error optimizing resume")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setResumeFile(null)
    setJobDesc("")
    setLatex("")
    setUpdatedLatex("")
    setFileName("")
    setError("")
    setStep(1)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">ResumeMania</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Upload your resume, add a job description, and get an AI-optimized resume tailored to the position you're applying for.</p>
      </div>
      
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>1</div>
          <div className={`h-1 w-16 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>2</div>
          <div className={`h-1 w-16 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>3</div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <Card className="mb-8">
        <CardContent className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Upload Your Resume</h2>
              <p className="text-gray-600">Upload your current resume in PDF format to get started.</p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input 
                  id="resume" 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleResumeUpload}
                  className="hidden" 
                />
                
                {!fileName ? (
                  <>
                    <div className="mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <Label htmlFor="resume" className="cursor-pointer">
                      <span className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Select PDF Resume</span>
                    </Label>
                    <p className="text-sm text-gray-500 mt-2">PDF files only</p>
                  </>
                ) : (
                  <div>
                    <div className="flex items-center justify-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">{fileName}</span>
                    </div>
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Processing...</span>
                      </div>
                    ) : (
                      <Button onClick={() => setResumeFile(null)} variant="outline" className="text-sm">
                        Change File
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Enter Job Description</h2>
                <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                  Back
                </Button>
              </div>
              
              <p className="text-gray-600">Paste the job description to optimize your resume for this specific position.</p>
              
              <div>
                <Label htmlFor="jd" className="mb-2 block">Job Description</Label>
                <Textarea 
                  id="jd" 
                  value={jobDesc} 
                  onChange={e => setJobDesc(e.target.value)} 
                  rows={10}
                  placeholder="Paste the full job description here..."
                  className="resize-none"
                />
              </div>
              
              <Button 
                onClick={handleUpdateResume} 
                disabled={loading || !jobDesc.trim()} 
                className="w-full"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Optimizing Resume...
                  </div>
                ) : "Optimize Resume"}
              </Button>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Optimized Resume</h2>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Start Over
                </Button>
              </div>
              
              <p className="text-gray-600">Your resume has been optimized for the job description. You can download it in LaTeX format.</p>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
                <pre className="text-xs whitespace-pre-wrap">{updatedLatex}</pre>
              </div>
              
              <div className="flex space-x-4">
                <a
                  href={`data:application/x-latex;charset=utf-8,${encodeURIComponent(updatedLatex)}`}
                  download="optimized_resume.tex"
                  className="flex-1"
                >
                  <Button className="w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Optimized Resume
                  </Button>
                </a>
                
                <a
                  href={`data:application/x-latex;charset=utf-8,${encodeURIComponent(latex)}`}
                  download="original_resume.tex"
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full">
                    Download Original Resume
                  </Button>
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="text-center text-gray-500 text-sm">
        <p>ResumeMania - AI-powered resume optimization</p>
      </div>
    </div>
  )
}
