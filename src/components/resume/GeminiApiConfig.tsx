import { useState, useEffect } from "react"
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
  DialogFooter,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

interface GeminiApiConfigProps {
  apiKey: string
  onApiKeyChange: (apiKey: string) => void
  rateLimited?: boolean
}

const GeminiApiConfig = ({
  apiKey,
  onApiKeyChange,
  rateLimited = false,
}: GeminiApiConfigProps) => {
  const [tempApiKey, setTempApiKey] = useState<string>(apiKey || "")
  const [open, setOpen] = useState<boolean>(false)
  const [showRateLimitInfo, setShowRateLimitInfo] =
    useState<boolean>(rateLimited)

  // Show rate limit info dialog when the rateLimited prop changes
  useEffect(() => {
    if (rateLimited) {
      setShowRateLimitInfo(true)
    }
  }, [rateLimited])

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
    <>
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
              <p>Here&apos;s how to get your API key:</p>
            </div>

            <Alert className="mt-2 bg-amber-50 border-amber-200">
              <ExclamationTriangleIcon className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-700">
                Free Tier Limitations
              </AlertTitle>
              <AlertDescription className="text-amber-600 text-sm">
                The free tier of Gemini API has rate limits (typically 60
                requests/minute and ~1000 requests/day). If you encounter
                rate limiting, please wait a few minutes before trying
                again.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={!tempApiKey}>
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rate Limit Information Dialog */}
      <Dialog open={showRateLimitInfo} onOpenChange={setShowRateLimitInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-amber-700">
              API Rate Limit Reached
            </DialogTitle>
            <DialogDescription>
              You've reached the rate limit for the Gemini API.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Alert className="bg-amber-50 border-amber-200">
              <ExclamationTriangleIcon className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-700">
                Free Tier Limitations
              </AlertTitle>
              <AlertDescription className="text-amber-600 text-sm">
                The free tier of Gemini API has the following limits:
                <ul className="list-disc pl-5 mt-2">
                  <li>60 requests per minute</li>
                  <li>~1000 requests per day</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h4 className="font-medium">Solutions:</h4>
              <ol className="list-decimal pl-5">
                <li>Wait for a few minutes before trying again</li>
                <li>Use a different API key if you have one</li>
                <li>Upgrade to a paid tier for higher limits</li>
              </ol>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowRateLimitInfo(false)}>
              OK, I Understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default GeminiApiConfig
