import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Plus } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"

export interface Project {
  name: string
  description: string
  technologies: string
  link?: string
}

// Form schema
const projectSchema = z.object({
  name: z.string().min(2, { message: "Project name is required" }),
  description: z
    .string()
    .min(10, { message: "Please describe the project" }),
  technologies: z
    .string()
    .min(2, { message: "Technologies used are required" }),
  link: z.string().optional(),
})

interface ProjectFormProps {
  projects: Project[]
  onAddProject: (project: Project) => void
  onRemoveProject: (index: number) => void
  onPrevious: () => void
  onNext: () => void
}

const ProjectForm = ({
  projects,
  onAddProject,
  onRemoveProject,
  onPrevious,
  onNext,
}: ProjectFormProps) => {
  const { toast } = useToast()

  const form = useForm<Project>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      technologies: "",
      link: "",
    },
  })

  const onSubmit = (data: Project) => {
    onAddProject(data)
    form.reset()
    toast({
      title: "Project added",
      description: "Project has been added to your profile.",
    })
  }

  return (
    <div className="space-y-8">
      {projects.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Added Projects</h3>
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-lg relative"
            >
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 p-0"
                onClick={() => onRemoveProject(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              <h4 className="font-medium mb-2">{project.name}</h4>
              <p className="text-sm text-gray-700 mb-2">
                {project.description}
              </p>
              <p className="text-brand-600 text-sm mb-1">
                Technologies: {project.technologies}
              </p>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Project
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Personal Portfolio Website"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="technologies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technologies Used</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="React, Node.js, MongoDB"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the project, your role, and its impact."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Link (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://github.com/yourusername/project"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onPrevious}>
              Previous
            </Button>
            <div className="flex gap-2">
              <Button type="submit" variant="outline">
                <Plus className="h-4 w-4 mr-1" /> Add Project
              </Button>
              <Button type="button" onClick={onNext}>
                Next
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ProjectForm
