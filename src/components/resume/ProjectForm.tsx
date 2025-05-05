import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export interface Project {
  name: string
  description: string
  technologies: string
  link?: string
}

interface ProjectFormProps {
  projects: Project[]
  onAddProject: (project: Project) => void
  onRemoveProject: (index: number) => void
}

const ProjectForm = ({
  projects,
  onAddProject,
  onRemoveProject,
}: ProjectFormProps) => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [technologies, setTechnologies] = useState("")
  const [link, setLink] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && description && technologies) {
      onAddProject({
        name,
        description,
        technologies,
        link: link || undefined,
      })
      // Reset form
      setName("")
      setDescription("")
      setTechnologies("")
      setLink("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Add Project</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project Name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the project"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Technologies Used
            </label>
            <Input
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="e.g. React, Node.js, MongoDB"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Link (Optional)
            </label>
            <Input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              type="url"
            />
          </div>
          
          <Button type="submit" className="w-full">
            Add Project
          </Button>
        </form>
      </div>

      {projects.length > 0 && (
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Your Projects</h3>
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md relative">
                <button
                  onClick={() => onRemoveProject(index)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                  type="button"
                  aria-label="Remove project"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="font-medium">{project.name}</div>
                <div className="text-sm mt-1">{project.description}</div>
                <div className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">Technologies:</span> {project.technologies}
                </div>
                {project.link && (
                  <div className="text-sm mt-2">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Project
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectForm
