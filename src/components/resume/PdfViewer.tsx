import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import LatexPreview from "./LatexPreview"

interface PdfViewerProps {
  pdfUrl: string | null
  downloadUrl?: string
  fileName?: string
}

const PdfViewer = ({
  pdfUrl,
  downloadUrl,
  fileName = "resume.pdf",
}: PdfViewerProps) => {
  const [latexContent, setLatexContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!pdfUrl) {
      setIsLoading(false)
      return
    }

    const fetchLatexContent = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch the LaTeX content from the API
        const response = await fetch(pdfUrl)
        if (!response.ok) {
          throw new Error(`Failed to fetch LaTeX content: ${response.status}`)
        }
        
        const data = await response.json()
        if (data.latexContent) {
          setLatexContent(data.latexContent)
        } else {
          throw new Error("No LaTeX content found in response")
        }
      } catch (err) {
        console.error("Error fetching LaTeX content:", err)
        setError(err instanceof Error ? err.message : "Failed to load LaTeX content")
      } finally {
        setIsLoading(false)
      }
    }

    fetchLatexContent()
  }, [pdfUrl])

  if (!pdfUrl) {
    return (
      <div className="text-center py-8">No resume content available to display</div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading resume content...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="border rounded-md p-4 bg-white shadow-sm w-full overflow-auto max-h-[600px]">
        <LatexPreview latex={latexContent} />
      </div>

      {downloadUrl && (
        <Button className="mt-4" asChild>
          <a href={downloadUrl} download={fileName}>
            Download PDF
          </a>
        </Button>
      )}
    </div>
  )
}

export default PdfViewer
