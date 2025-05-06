import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export interface Skill {
  name: string
  category?: string
}

interface SkillsFormProps {
  skills: Skill[]
  onAddSkill: (skill: Skill) => void
  onRemoveSkill: (index: number) => void
}

const SkillsForm = ({
  skills,
  onAddSkill,
  onRemoveSkill,
}: SkillsFormProps) => {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name) {
      onAddSkill({
        name,
        category: category || undefined,
      })
      // Reset form
      setName("")
    }
  }

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "General"
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Add Skills</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skill
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. JavaScript, Project Management, etc."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category (Optional)
            </label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Programming Languages, Soft Skills, etc."
            />
          </div>

          <Button type="submit" className="w-full">
            Add Skill
          </Button>
        </form>
      </div>

      {skills.length > 0 && (
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Your Skills</h3>

          {Object.entries(groupedSkills).map(
            ([category, categorySkills]) => (
              <div key={category} className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">
                  {category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill) => {
                    const skillIndex = skills.findIndex((s) => s === skill)
                    return (
                      <div
                        key={skillIndex}
                        className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center"
                      >
                        <span>{skill.name}</span>
                        <button
                          onClick={() => onRemoveSkill(skillIndex)}
                          className="ml-2 text-gray-500 hover:text-red-500"
                          type="button"
                          aria-label="Remove skill"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}

export default SkillsForm
