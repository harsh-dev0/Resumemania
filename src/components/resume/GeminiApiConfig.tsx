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
  onConfigSaved: (config: GeminiConfig) => void
  initialConfig?: GeminiConfig
}

const GeminiApiConfig = ({
  onConfigSaved,
  initialConfig,
}: GeminiApiConfigProps) => {
  const [apiKey, setApiKey] = useState<string>(initialConfig?.apiKey || "")
  const [open, setOpen] = useState<boolean>(false)

  const handleSave = () => {
    if (apiKey) {
      const newConfig: GeminiConfig = {
        apiKey,
        temperature: initialConfig?.temperature || 0.4,
        topK: initialConfig?.topK || 32,
        topP: initialConfig?.topP || 1,
        maxOutputTokens: initialConfig?.maxOutputTokens || 4096,
      }

      // Save to localStorage for persistence
      localStorage.setItem("geminiApiConfig", JSON.stringify(newConfig))

      onConfigSaved(newConfig)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Configure Gemini API
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
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
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
          <Button onClick={handleSave} disabled={!apiKey}>
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GeminiApiConfig
