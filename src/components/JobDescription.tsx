import React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface JobDescriptionInputProps {
  jobDescription: string
  additionalNotes: string
  onJobDescriptionChange: (value: string) => void
  onAdditionalNotesChange: (value: string) => void
  isLoading: boolean
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  jobDescription,
  additionalNotes,
  onJobDescriptionChange,
  onAdditionalNotesChange,
  isLoading,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-navy">Job Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="job-description">Job Description</Label>
          <Textarea
            id="job-description"
            placeholder="Paste the job description here..."
            className="min-h-[200px] resize-y"
            value={jobDescription}
            onChange={(e) => onJobDescriptionChange(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="additional-notes">
            Additional Notes (Optional)
          </Label>
          <Textarea
            id="additional-notes"
            placeholder="Add any additional information or keywords you want to highlight..."
            className="min-h-[100px] resize-y"
            value={additionalNotes}
            onChange={(e) => onAdditionalNotesChange(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default JobDescriptionInput
