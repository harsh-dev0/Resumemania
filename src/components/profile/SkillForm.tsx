import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Plus } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export interface Skill {
  name: string
  level?: string
}

// Form schema
const skillSchema = z.object({
  name: z.string().min(1, { message: "Skill name is required" }),
  level: z.string().optional(),
})

interface SkillFormProps {
  skills: Skill[]
  onAddSkill: (skill: Skill) => void
  onRemoveSkill: (index: number) => void
  onPrevious: () => void
  onComplete: () => void
}

const SkillForm = ({
  skills,
  onAddSkill,
  onRemoveSkill,
  onPrevious,
  onComplete,
}: SkillFormProps) => {
  const form = useForm<Skill>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      level: "",
    },
  })

  const onSubmit = (data: Skill) => {
    onAddSkill(data)
    form.reset()
  }

  return (
    <div className="space-y-8">
      {skills.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Added Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="bg-brand-100 text-brand-800 px-3 py-1 rounded-full flex items-center gap-1"
              >
                <span>{skill.name}</span>
                {skill.level && (
                  <span className="text-xs">({skill.level})</span>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-5 w-5 p-0 ml-1"
                  onClick={() => onRemoveSkill(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
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
                  <FormLabel>Skill Name</FormLabel>
                  <FormControl>
                    <Input placeholder="JavaScript" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proficiency Level (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Expert" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-between pt-4">
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onPrevious}>
                Previous
              </Button>
              <Button type="submit" variant="outline">
                <Plus className="h-4 w-4 mr-1" /> Add Skill
              </Button>
            </div>
            <Button onClick={onComplete}>Complete Profile</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default SkillForm
