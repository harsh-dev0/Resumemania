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

export interface Experience {
  title: string
  company: string
  startDate: string
  endDate: string
  description: string
}

// Form schema
const experienceSchema = z.object({
  title: z.string().min(2, { message: "Job title is required" }),
  company: z.string().min(2, { message: "Company name is required" }),
  startDate: z.string().min(2, { message: "Start date is required" }),
  endDate: z.string().min(2, { message: "End date is required" }),
  description: z
    .string()
    .min(10, { message: "Please describe your responsibilities" }),
})

interface ExperienceFormProps {
  experiences: Experience[]
  onAddExperience: (experience: Experience) => void
  onRemoveExperience: (index: number) => void
  onPrevious: () => void
  onNext: () => void
}

const ExperienceForm = ({
  experiences,
  onAddExperience,
  onRemoveExperience,
  onPrevious,
  onNext,
}: ExperienceFormProps) => {
  const { toast } = useToast()

  const form = useForm<Experience>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  })

  const onSubmit = (data: Experience) => {
    onAddExperience(data)
    form.reset()
    toast({
      title: "Experience added",
      description: "Work experience has been added to your profile.",
    })
  }

  return (
    <div className="space-y-8">
      {experiences.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Added Experiences</h3>
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-lg relative"
            >
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 p-0"
                onClick={() => onRemoveExperience(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex flex-col md:flex-row md:justify-between mb-2">
                <h4 className="font-medium">{exp.title}</h4>
                <p className="text-gray-600 text-sm">
                  {exp.startDate} - {exp.endDate}
                </p>
              </div>
              <p className="text-brand-600 mb-2">{exp.company}</p>
              <p className="text-sm text-gray-700">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input placeholder="June 2020" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input placeholder="Present" {...field} />
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
                <FormLabel>Responsibilities and Achievements</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your key responsibilities and achievements in this role."
                    className="min-h-[120px]"
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
                <Plus className="h-4 w-4 mr-1" /> Add Experience
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

export default ExperienceForm
