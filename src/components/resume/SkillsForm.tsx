import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash } from "lucide-react"

export interface Skill {
  name: string
  category?: string
}

interface SkillsFormProps {
  skills: Skill[]
  onAddSkill: (skill: Skill) => void
  onRemoveSkill: (index: number) => void
}

const SkillsForm: React.FC<SkillsFormProps> = ({
  skills,
  onAddSkill,
  onRemoveSkill,
}) => {
  const [skillName, setSkillName] = useState("")
  const [skillCategory, setSkillCategory] = useState("")

  const handleAddSkill = () => {
    if (skillName.trim()) {
      onAddSkill({
        name: skillName,
        category: skillCategory || "Technical",
      })

      // Reset skill name but keep category
      setSkillName("")
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
      <div className="space-y-4">
        <div>
          <label
            htmlFor="skill-name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Skill Name *
          </label>
          <Input
            id="skill-name"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            placeholder="Enter skill name"
            className="w-full"
          />
        </div>

        <div>
          <label
            htmlFor="skill-category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <Input
            id="skill-category"
            value={skillCategory}
            onChange={(e) => setSkillCategory(e.target.value)}
            placeholder="e.g. Programming, Languages, Tools"
            className="w-full"
          />
        </div>

        <Button
          onClick={handleAddSkill}
          disabled={!skillName.trim()}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Skill
        </Button>
      </div>

      {Object.keys(groupedSkills).length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Added Skills</h4>
          {Object.entries(groupedSkills).map(
            ([category, categorySkills]) => (
              <div key={category} className="space-y-2">
                <h5 className="text-sm font-medium text-gray-600">
                  {category}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill, index) => {
                    const skillIndex = skills.findIndex((s) => s === skill)
                    return (
                      <div
                        key={skillIndex}
                        className="flex items-center bg-gray-50 rounded-md border px-3 py-1"
                      >
                        <span className="mr-2">{skill.name}</span>
                        <button
                          onClick={() => onRemoveSkill(skillIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="h-3 w-3" />
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
