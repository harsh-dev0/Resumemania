"use client"
import React, { useState, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Header from "@/components/layouts/Header"
import Footer from "@/components/layouts/Footer"
import { Input } from "@/components/ui/input"
import { FileText, Upload } from "lucide-react"
import ResumeUploader from "@/components/ResumeUploader"

import ProjectForm, { Project } from "@/components/resume/ProjectForm"
import SkillsForm, { Skill } from "@/components/resume/SkillsForm"
import LatexPreview from "@/components/LatexPreview"

const Index = () => {
  const [activeTab, setActiveTab] = useState("upload")
  const [additionalTab, setAdditionalTab] = useState("projects")
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isParsingPdf, setIsParsingPdf] = useState(false)
  const [latexCode, setLatexCode] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { toast } = useToast()

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ["application/pdf", "text/plain"]
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file format",
        description: "Please upload a PDF or TXT file.",
        variant: "destructive",
      })
      return
    }

    // Show loading toast
    toast({
      title: "Uploading resume",
      description: "Extracting text from your resume...",
    })

    try {
      setIsParsingPdf(true)
      const formData = new FormData()
      formData.append("resume", file)

      const response = await fetch("/api/parse", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to extract text from resume")
      }

      const data = await response.json()
      setResumeText(data.text)
      setActiveTab("job")

      toast({
        title: "Resume uploaded successfully",
        description: "Your resume text has been extracted.",
      })
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "Error uploading resume",
        description:
          "Failed to extract text from your resume. Please try again or paste your resume text manually.",
        variant: "destructive",
      })
    } finally {
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
      handleGenerateResume()
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

  const handleGenerateResume = async () => {
    if (!resumeText.trim()) {
      toast({
        title: "Error",
        description: "Please upload your resume or paste resume text",
        variant: "destructive",
      })
      return
    }

    if (!jobDescription.trim()) {
      toast({
        title: "No job description",
        description: "Please enter a job description.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    toast({
      title: "Generating enhanced resume",
      description: "This may take a moment...",
    })

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          additionalNotes: prepareResumeData(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate LaTeX resume")
      }

      const data = await response.json()
      setLatexCode(data.latexCode)
      setActiveTab("preview")

      toast({
        title: "Success!",
        description: "Your enhanced resume has been generated.",
      })
    } catch (error) {
      console.error("Error generating LaTeX:", error)
      toast({
        title: "Error generating resume",
        description:
          "Failed to generate your enhanced resume. Please try again.",
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
            <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">
              Resume AI
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
                  <ResumeUploader
                    onResumeTextExtracted={setResumeText}
                    isLoading={isParsingPdf}
                  />
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
                  className="bg-navy hover:bg-navy-light transition-colors px-6 py-2"
                >
                  Next
                </Button>
              </div>
            </TabsContent>

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
                  className="bg-navy hover:bg-navy-light transition-colors px-6 py-2"
                >
                  Next
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="additional" className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Additional Information
                </h2>

                <div className="mb-6">
                  <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                      <button
                        onClick={() => setAdditionalTab("projects")}
                        className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                          additionalTab === "projects"
                            ? "border-navy text-navy"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Projects
                      </button>
                      <button
                        onClick={() => setAdditionalTab("skills")}
                        className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                          additionalTab === "skills"
                            ? "border-navy text-navy"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Skills
                      </button>
                      <button
                        onClick={() => setAdditionalTab("other")}
                        className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                          additionalTab === "other"
                            ? "border-navy text-navy"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Other
                      </button>
                    </nav>
                  </div>
                </div>

                {additionalTab === "projects" && (
                  <ProjectForm
                    projects={projects}
                    onAddProject={handleAddProject}
                    onRemoveProject={handleRemoveProject}
                  />
                )}

                {additionalTab === "skills" && (
                  <SkillsForm
                    skills={skills}
                    onAddSkill={handleAddSkill}
                    onRemoveSkill={handleRemoveSkill}
                  />
                )}

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
                  onClick={handleGenerateResume}
                  disabled={isGenerating}
                  className="bg-navy hover:bg-navy-light transition-colors px-6 py-2"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin -ml-1 mr-3 h-5 w-5 text-white">
                        <svg
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
                      </div>
                      Generating...
                    </span>
                  ) : (
                    "Generate Resume"
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Resume Preview
                </h2>

                <div className="bg-gray-50 rounded-lg min-h-[500px]">
                  {latexCode ? (
                    <LatexPreview latexCode={latexCode} />
                  ) : (
                    <div className="text-center text-gray-500 p-6 flex flex-col items-center justify-center h-[500px]">
                      <FileText className="h-12 w-12 mb-4 text-gray-400" />
                      <p>Your enhanced resume will appear here</p>
                      <p className="text-sm mt-2">
                        Click &quot;Generate Resume&quot; to continue
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
                {latexCode && (
                  <Button className="bg-navy hover:bg-navy-light transition-colors px-6 py-2">
                    Download PDF
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

export default Index
