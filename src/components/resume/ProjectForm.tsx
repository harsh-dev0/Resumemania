import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash } from "lucide-react"

export interface Project {
  name: string
  description?: string
  technologies?: string
  link?: string
}

interface ProjectFormProps {
  projects: Project[]
  onAddProject: (project: Project) => void
  onRemoveProject: (index: number) => void
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  projects,
  onAddProject,
  onRemoveProject,
}) => {
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [projectTechnologies, setProjectTechnologies] = useState("")
  const [projectLink, setProjectLink] = useState("")

  const handleAddProject = () => {
    if (projectName.trim()) {
      onAddProject({
        name: projectName,
        description: projectDescription,
        technologies: projectTechnologies,
        link: projectLink,
      })

      // Reset form
      setProjectName("")
      setProjectDescription("")
      setProjectTechnologies("")
      setProjectLink("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="project-name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Project Name *
          </label>
          <Input
            id="project-name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            className="w-full"
          />
        </div>

        <div>
          <label
            htmlFor="project-description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <Textarea
            id="project-description"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Describe your project"
            className="w-full"
          />
        </div>

        <div>
          <label
            htmlFor="project-technologies"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Technologies Used
          </label>
          <Input
            id="project-technologies"
            value={projectTechnologies}
            onChange={(e) => setProjectTechnologies(e.target.value)}
            placeholder="e.g. React, Node.js, MongoDB"
            className="w-full"
          />
        </div>

        <div>
          <label
            htmlFor="project-link"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Project Link
          </label>
          <Input
            id="project-link"
            value={projectLink}
            onChange={(e) => setProjectLink(e.target.value)}
            placeholder="https://..."
            className="w-full"
          />
        </div>

        <Button
          onClick={handleAddProject}
          disabled={!projectName.trim()}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>

      {projects.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Added Projects</h4>
          <div className="space-y-2">
            {projects.map((project, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md border"
              >
                <div>
                  <p className="font-medium">{project.name}</p>
                  {project.technologies && (
                    <p className="text-sm text-gray-600">
                      {project.technologies}
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveProject(index)}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectForm
