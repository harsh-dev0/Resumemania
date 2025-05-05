import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { GeminiConfig } from "@/utils/geminiAPI"

interface GeminiApiConfigProps {
  apiKey: string
  onApiKeyChange: (apiKey: string) => void
}

const GeminiApiConfig = ({
  apiKey,
  onApiKeyChange,
}: GeminiApiConfigProps) => {
  const [tempApiKey, setTempApiKey] = useState<string>(apiKey || "")
  const [open, setOpen] = useState<boolean>(false)

  const handleSave = () => {
    if (tempApiKey) {
      // Save to localStorage for persistence
      localStorage.setItem("geminiApiKey", tempApiKey)

      // Update the parent component's state
      onApiKeyChange(tempApiKey)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {apiKey ? "Change API Key" : "Configure Gemini API"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gemini API Configuration</DialogTitle>
          <DialogDescription>
            Enter your Gemini API key to enable AI-powered resume
            generation.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              type="password"
            />
            <p className="text-xs text-gray-500">
              You can get a Gemini API key from{" "}
              <a
                href="https://ai.google.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={!tempApiKey}>
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GeminiApiConfig
