import React, { useEffect, useRef, useState } from "react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

interface LatexPreviewProps {
  latexCode: string
}

const LatexPreview: React.FC<LatexPreviewProps> = ({ latexCode }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // In a real implementation, we would render LaTeX to PDF here
    // For now, we'll just set a placeholder PDF URL
    if (latexCode) {
      // This would normally be the URL to the rendered PDF
      setPdfUrl("#")
    } else {
      setPdfUrl(null)
    }
  }, [latexCode])

  const handleCopyToClipboard = () => {
    if (textareaRef.current) {
      textareaRef.current.select()
      document.execCommand("copy")
      // Deselect the text
      window.getSelection()?.removeAllRanges()
    }
  }

  const handleDownloadLatex = () => {
    const blob = new Blob([latexCode], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "enhanced_resume.tex"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!latexCode) {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-navy">Enhanced Resume</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="latex" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="latex">LaTeX Code</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="latex" className="mt-0">
            <div className="relative">
              <textarea
                ref={textareaRef}
                className="w-full h-[500px] p-4 font-mono text-sm bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-navy"
                value={latexCode}
                readOnly
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleCopyToClipboard}
              >
                Copy
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="preview" className="mt-0">
            <div className="bg-white p-4 border rounded-md min-h-[500px] overflow-auto">
              <p className="text-center text-gray-500 italic">
                LaTeX rendering is not available in this preview. Please
                download the LaTeX file and compile it or use an online
                LaTeX editor.
              </p>
              {/* In a full implementation, we would render the LaTeX preview here */}
              <pre className="mt-4 p-4 bg-latex-light text-sm whitespace-pre-wrap font-mono">
                {latexCode}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={handleDownloadLatex}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download LaTeX
        </Button>
        {pdfUrl && (
          <Button
            className="bg-navy hover:bg-navy-light flex items-center gap-2"
            onClick={handleDownloadLatex}
          >
            <Download className="h-4 w-4" />
            Download as PDF
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default LatexPreview
