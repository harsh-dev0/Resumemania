"use client"

import React, { useState, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Header from "@/components/layouts/Header"
import Footer from "@/components/layouts/Footer"
import PdfViewer from "@/components/resume/PdfViewer"
import ProjectForm, { Project } from "@/components/resume/ProjectForm"
import SkillsForm, { Skill } from "@/components/resume/SkillsForm"

export default function ResumesPage() {
  const [activeTab, setActiveTab] = useState("upload")
  const [additionalTab, setAdditionalTab] = useState("projects")
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isParsingPdf, setIsParsingPdf] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { toast } = useToast()

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      })
      return
    }

    try {
      setIsParsingPdf(true)

      const reader = new FileReader()

      reader.onload = async (event) => {
        try {
          const text = (event.target?.result as string) || ""

          setResumeText(text)
          setActiveTab("job")

          toast({
            title: "Resume uploaded",
            description: "Your resume has been successfully parsed",
          })
        } catch (error) {
          console.error("Error processing PDF content:", error)
          toast({
            title: "Error",
            description:
              "Failed to process the PDF content. Please try again or paste your resume text manually.",
            variant: "destructive",
          })
        } finally {
          setIsParsingPdf(false)
        }
      }

      reader.onerror = () => {
        console.error("Error reading file")
        toast({
          title: "Error",
          description:
            "Failed to read the PDF file. Please try again or paste your resume text manually.",
          variant: "destructive",
        })
        setIsParsingPdf(false)
      }
      reader.readAsText(file)
    } catch (error) {
      console.error("Error handling file upload:", error)
      toast({
        title: "Error",
        description:
          "Failed to process the PDF file. Please try again or paste your resume text manually.",
        variant: "destructive",
      })
      setIsParsingPdf(false)
    }
  }

  const handleAddProject = (project: Project) => {
    setProjects([...projects, project])
  }

  const handleRemoveProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index))
  }

  const handleAddSkill = (skill: Skill) => {
    setSkills([...skills, skill])
  }

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  const handleNext = () => {
    if (activeTab === "upload") {
      if (!resumeText.trim()) {
        toast({
          title: "Error",
          description: "Please upload your resume or paste resume text",
          variant: "destructive",
        })
        return
      }
      setActiveTab("job")
    } else if (activeTab === "job") {
      setActiveTab("additional")
    } else if (activeTab === "additional") {
      handleGeneratePdf()
    }
  }

  const handlePrevious = () => {
    if (activeTab === "job") {
      setActiveTab("upload")
    } else if (activeTab === "additional") {
      setActiveTab("job")
    } else if (activeTab === "preview") {
      setActiveTab("additional")
    }
  }

  const prepareResumeData = () => {
    let formattedProjects = ""
    if (projects.length > 0) {
      formattedProjects = "PROJECTS:\n\n"
      projects.forEach((project, index) => {
        formattedProjects += `${project.name}\n`
        if (project.description)
          formattedProjects += `${project.description}\n`
        if (project.technologies)
          formattedProjects += `Technologies: ${project.technologies}\n`
        if (project.link) formattedProjects += `Link: ${project.link}\n`
        if (index < projects.length - 1) formattedProjects += "\n"
      })
    }

    let formattedSkills = ""
    if (skills.length > 0) {
      formattedSkills = "SKILLS:\n\n"

      const groupedSkills = skills.reduce((acc, skill) => {
        const category = skill.category || "General"
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(skill.name)
        return acc
      }, {} as Record<string, string[]>)

      Object.entries(groupedSkills).forEach(
        ([category, categorySkills]) => {
          formattedSkills += `${category}: ${categorySkills.join(", ")}\n`
        }
      )
    }

    const combinedAdditionalInfo = [
      formattedProjects,
      formattedSkills,
      additionalInfo,
    ]
      .filter(Boolean)
      .join("\n\n")

    return combinedAdditionalInfo
  }

  const handleGeneratePdf = async () => {
    if (!resumeText.trim()) {
      toast({
        title: "Error",
        description: "Please upload your resume or paste resume text",
        variant: "destructive",
      })
      return
    }

    try {
      setIsGenerating(true)
      setPdfUrl(null)

      const combinedAdditionalInfo = prepareResumeData()

      const response = await fetch("/api/generate-pdf-from-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rawResumeText: resumeText,
          jobDescription,
          additionalInfo: combinedAdditionalInfo,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate PDF")
      }

      const data = await response.json()
      setPdfUrl(data.pdfUrl)
      setActiveTab("preview")

      toast({
        title: "Success",
        description: "Your resume has been generated!",
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate PDF",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 pt-16 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-900 mb-2">
              AI Resume Generator
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Upload your resume and provide job details to generate a
              professionally formatted resume tailored to your target role
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="upload">Resume</TabsTrigger>
              <TabsTrigger value="job">Job Details</TabsTrigger>
              <TabsTrigger value="additional">Additional Info</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Upload Your Resume
                </h2>

                <div className="mb-6">
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    {isParsingPdf ? (
                      <div className="flex flex-col items-center">
                        <svg
                          className="animate-spin h-10 w-10 text-blue-500 mb-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <p className="text-lg font-medium">
                          Parsing PDF...
                        </p>
                      </div>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 mx-auto mb-4 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="text-lg font-medium">
                          Click to upload your resume (PDF)
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          or drag and drop
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">
                    Or paste your resume text
                  </h3>
                  <Textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="min-h-[250px] w-full resize-y"
                    placeholder="Paste your current resume text here"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-2"
                >
                  Next
                </Button>
              </div>
            </TabsContent>

            {/* Job Description Tab */}
            <TabsContent value="job" className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Job Details</h2>

                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">
                    Job Description
                  </h3>
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[250px] w-full resize-y"
                    placeholder="Paste the job description to tailor your resume"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  className="px-6 py-2"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-2"
                >
                  Next
                </Button>
              </div>
            </TabsContent>

            {/* Additional Info Tab */}
            <TabsContent value="additional" className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Additional Information
                </h2>

                {/* Sub-tabs for Projects, Skills, and Other */}
                <div className="mb-6">
                  <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                      <button
                        onClick={() => setAdditionalTab("projects")}
                        className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                          additionalTab === "projects"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Projects
                      </button>
                      <button
                        onClick={() => setAdditionalTab("skills")}
                        className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                          additionalTab === "skills"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Skills
                      </button>
                      <button
                        onClick={() => setAdditionalTab("other")}
                        className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                          additionalTab === "other"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Other
                      </button>
                    </nav>
                  </div>
                </div>

                {/* Projects Tab */}
                {additionalTab === "projects" && (
                  <ProjectForm
                    projects={projects}
                    onAddProject={handleAddProject}
                    onRemoveProject={handleRemoveProject}
                  />
                )}

                {/* Skills Tab */}
                {additionalTab === "skills" && (
                  <SkillsForm
                    skills={skills}
                    onAddSkill={handleAddSkill}
                    onRemoveSkill={handleRemoveSkill}
                  />
                )}

                {/* Other Tab */}
                {additionalTab === "other" && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">
                      Additional Requirements
                    </h3>
                    <Textarea
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      className="min-h-[200px] w-full resize-y"
                      placeholder="Add any additional information or specific requirements for your resume (optional)"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  className="px-6 py-2"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleGeneratePdf}
                  disabled={isGenerating}
                  className="bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-2"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    "Generate Resume"
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Resume Preview
                </h2>

                <div className="bg-gray-50 rounded-lg min-h-[500px] flex items-center justify-center">
                  {pdfUrl ? (
                    <PdfViewer
                      pdfUrl={pdfUrl}
                      downloadUrl={`/api/download-pdf?latex=${encodeURIComponent(
                        pdfUrl.split("latex=")[1] || ""
                      )}`}
                    />
                  ) : (
                    <div className="text-center text-gray-500 p-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto mb-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p>Your generated resume will appear here</p>
                      <p className="text-sm mt-2">
                        Click "Generate Resume" to start
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  className="px-6 py-2"
                >
                  Previous
                </Button>
                {pdfUrl && (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-2"
                    asChild
                  >
                    <a
                      href={`/api/download-pdf?latex=${encodeURIComponent(
                        pdfUrl.split("latex=")[1] || ""
                      )}`}
                      download="resume.pdf"
                    >
                      Download PDF
                    </a>
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
