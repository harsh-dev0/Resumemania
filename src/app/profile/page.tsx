"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Header from "@/components/layouts/Header"
import Footer from "@/components/layouts/Footer"
import ProfileTabCard from "@/components/profile/ProfileTabCard"
import PersonalInfoForm, {
  PersonalInfoFormValues,
} from "@/components/profile/PersonalInfoForm"
import ExperienceForm, {
  Experience,
} from "@/components/profile/ExperienceForm"
import EducationForm, {
  Education,
} from "@/components/profile/EducationForm"
import ProjectForm, { Project } from "@/components/profile/ProjectForm"
import SkillForm, { Skill } from "@/components/profile/SkillForm"

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("personal")
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [educations, setEducations] = useState<Education[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const { toast } = useToast()
  const router = useRouter()

  const handlePersonalInfoSubmit = (data: PersonalInfoFormValues) => {
    console.log("Personal info submitted:", data)
    setActiveTab("experience")
  }

  const handleAddExperience = (experience: Experience) => {
    setExperiences([...experiences, experience])
  }

  const handleRemoveExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index))
  }

  const handleAddEducation = (education: Education) => {
    setEducations([...educations, education])
  }

  const handleRemoveEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index))
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

  const completeProfile = () => {
    // In a real app, we would save the entire profile to a database
    localStorage.setItem("profileComplete", "true")
    toast({
      title: "Profile completed",
      description:
        "Your profile has been saved. Now you can generate resumes!",
    })
    router.push("/resumes")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-brand-900 mb-2">
              Create Your Profile
            </h1>
            <p className="text-gray-600">
              Complete your profile once to generate tailored resumes for
              any job.
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <ProfileTabCard
                title="Personal Information"
                description="Tell us about yourself to get started."
              >
                <PersonalInfoForm
                  onSubmitComplete={handlePersonalInfoSubmit}
                />
              </ProfileTabCard>
            </TabsContent>

            <TabsContent value="experience">
              <ProfileTabCard
                title="Work Experience"
                description="Add your professional experience details."
              >
                <ExperienceForm
                  experiences={experiences}
                  onAddExperience={handleAddExperience}
                  onRemoveExperience={handleRemoveExperience}
                  onPrevious={() => setActiveTab("personal")}
                  onNext={() => setActiveTab("education")}
                />
              </ProfileTabCard>
            </TabsContent>

            <TabsContent value="education">
              <ProfileTabCard
                title="Education"
                description="Add your educational background."
              >
                <EducationForm
                  educations={educations}
                  onAddEducation={handleAddEducation}
                  onRemoveEducation={handleRemoveEducation}
                  onPrevious={() => setActiveTab("experience")}
                  onNext={() => setActiveTab("projects")}
                />
              </ProfileTabCard>
            </TabsContent>

            <TabsContent value="projects">
              <ProfileTabCard
                title="Projects"
                description="Showcase your portfolio projects."
              >
                <ProjectForm
                  projects={projects}
                  onAddProject={handleAddProject}
                  onRemoveProject={handleRemoveProject}
                  onPrevious={() => setActiveTab("education")}
                  onNext={() => setActiveTab("skills")}
                />
              </ProfileTabCard>
            </TabsContent>

            <TabsContent value="skills">
              <ProfileTabCard
                title="Skills"
                description="Add your technical and soft skills."
              >
                <SkillForm
                  skills={skills}
                  onAddSkill={handleAddSkill}
                  onRemoveSkill={handleRemoveSkill}
                  onPrevious={() => setActiveTab("projects")}
                  onComplete={completeProfile}
                />
              </ProfileTabCard>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ProfilePage
