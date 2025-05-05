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

export interface Education {
  degree: string
  institution: string
  graduationDate: string
  description?: string
}

// Form schema
const educationSchema = z.object({
  degree: z.string().min(2, { message: "Degree is required" }),
  institution: z
    .string()
    .min(2, { message: "Institution name is required" }),
  graduationDate: z
    .string()
    .min(2, { message: "Graduation date is required" }),
  description: z.string().optional(),
})

interface EducationFormProps {
  educations: Education[]
  onAddEducation: (education: Education) => void
  onRemoveEducation: (index: number) => void
  onPrevious: () => void
  onNext: () => void
}

const EducationForm = ({
  educations,
  onAddEducation,
  onRemoveEducation,
  onPrevious,
  onNext,
}: EducationFormProps) => {
  const { toast } = useToast()

  const form = useForm<Education>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      degree: "",
      institution: "",
      graduationDate: "",
      description: "",
    },
  })

  const onSubmit = (data: Education) => {
    onAddEducation(data)
    form.reset()
    toast({
      title: "Education added",
      description: "Education details have been added to your profile.",
    })
  }

  return (
    <div className="space-y-8">
      {educations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Added Education</h3>
          {educations.map((edu, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-lg relative"
            >
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 p-0"
                onClick={() => onRemoveEducation(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex flex-col md:flex-row md:justify-between mb-2">
                <h4 className="font-medium">{edu.degree}</h4>
                <p className="text-gray-600 text-sm">
                  Graduated: {edu.graduationDate}
                </p>
              </div>
              <p className="text-brand-600 mb-2">{edu.institution}</p>
              {edu.description && (
                <p className="text-sm text-gray-700">{edu.description}</p>
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
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Bachelor of Science in Computer Science"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="University of Example"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="graduationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Graduation Date</FormLabel>
                  <FormControl>
                    <Input placeholder="May 2019" {...field} />
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
                <FormLabel>Additional Information (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Relevant coursework, honors, activities, etc."
                    className="min-h-[100px]"
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
                <Plus className="h-4 w-4 mr-1" /> Add Education
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

export default EducationForm
