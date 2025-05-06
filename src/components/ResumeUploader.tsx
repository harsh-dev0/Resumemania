import React, { useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Polyfill for DOMMatrix if not defined
if (typeof window !== "undefined" && !window.DOMMatrix) {
  class DOMMatrixPolyfill {
    a = 1
    b = 0
    c = 0
    d = 1
    e = 0
    f = 0
    m11 = 1
    m12 = 0
    m13 = 0
    m14 = 0
    m21 = 0
    m22 = 1
    m23 = 0
    m24 = 0
    m31 = 0
    m32 = 0
    m33 = 1
    m34 = 0
    m41 = 0
    m42 = 0
    m43 = 0
    m44 = 1
    is2D = true

    constructor(transform?: string | number[]) {
      // Simple implementation for basic usage
      if (Array.isArray(transform) && transform.length === 6) {
        this.a = transform[0]
        this.b = transform[1]
        this.c = transform[2]
        this.d = transform[3]
        this.e = transform[4]
        this.f = transform[5]
      }
    }

    // Add required methods
    translate() {
      return this
    }
    scale() {
      return this
    }
    multiply() {
      return this
    }
    inverse() {
      return this
    }
  }

  // Define static methods as properties of DOMMatrixPolyfill constructor
  Object.defineProperties(DOMMatrixPolyfill, {
    fromFloat32Array: {
      value: function (array32: Float32Array): DOMMatrix {
        return new DOMMatrix()
      },
      writable: true,
      configurable: true,
    },
    fromFloat64Array: {
      value: function (array64: Float64Array): DOMMatrix {
        return new DOMMatrix()
      },
      writable: true,
      configurable: true,
    },
    fromMatrix: {
      value: function (other?: DOMMatrixInit): DOMMatrix {
        return new DOMMatrix()
      },
      writable: true,
      configurable: true,
    },
  })

  // Assign to window.DOMMatrix
  window.DOMMatrix = DOMMatrixPolyfill as unknown as typeof DOMMatrix
}

// Import PDF.js after the polyfill
import * as pdfjs from "pdfjs-dist"

// Use a static worker URL instead of CDN for better reliability
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`

interface ResumeUploaderProps {
  onResumeTextExtracted: (text: string) => void
  isLoading: boolean
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  onResumeTextExtracted,
  isLoading,
}) => {
  const { toast } = useToast()

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      const allowedTypes = ["application/pdf", "text/plain"]
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file format",
          description: "Please upload a PDF or TXT file.",
          variant: "destructive",
        })
        return
      }

      // Show loading toast
      toast({
        title: "Uploading resume",
        description: "Processing your file...",
      })

      try {
        // For text files, directly read the content
        if (file.type === "text/plain") {
          const reader = new FileReader()
          reader.onload = (e) => {
            const text = e.target?.result as string
            onResumeTextExtracted(text)
            toast({
              title: "Resume uploaded successfully",
              description: "Your text file has been processed.",
            })
          }
          reader.readAsText(file)
          return
        }

        // For PDF files, use pdf.js to extract text
        if (file.type === "application/pdf") {
          try {
            // Use FileReader to get array buffer
            const fileReader = new FileReader()

            fileReader.onload = async function () {
              try {
                const typedarray = new Uint8Array(
                  this.result as ArrayBuffer
                )

                // Load the PDF document
                const pdf = await pdfjs.getDocument({ data: typedarray })
                  .promise

                let extractedText = ""

                // Iterate through each page to extract text
                for (let i = 1; i <= pdf.numPages; i++) {
                  const page = await pdf.getPage(i)
                  const textContent = await page.getTextContent()
                  const pageText = textContent.items
                    // Ensure we're handling any potential type issues
                    .filter((item: any) => item.str !== undefined)
                    .map((item: any) => item.str)
                    .join(" ")

                  extractedText += pageText + "\n"
                }

                if (extractedText.trim()) {
                  onResumeTextExtracted(extractedText)
                  toast({
                    title: "Resume uploaded successfully",
                    description: "Your PDF has been processed.",
                  })
                } else {
                  throw new Error(
                    "No text could be extracted from the PDF"
                  )
                }
              } catch (pdfError) {
                console.error("Error processing PDF content:", pdfError)
                handlePdfError()
              }
            }

            fileReader.onerror = function () {
              console.error("Error reading file as array buffer")
              handlePdfError()
            }

            // Read the file as an array buffer
            fileReader.readAsArrayBuffer(file)
          } catch (pdfError) {
            console.error("Error setting up PDF parser:", pdfError)
            handlePdfError()
          }
        }
      } catch (error) {
        console.error("Error uploading file:", error)
        toast({
          title: "Error processing file",
          description: "Please paste your resume text manually below.",
          variant: "destructive",
        })

        // Set a helpful message
        onResumeTextExtracted(
          "Unable to process this file. Please paste your resume content manually here."
        )
      }
    },
    [onResumeTextExtracted, toast]
  )

  const handlePdfError = useCallback(() => {
    toast({
      title: "PDF parsing issue",
      description:
        "Could not extract text from this PDF. Please paste your resume text manually.",
      variant: "destructive",
    })
    onResumeTextExtracted(
      "Could not extract text from this PDF. Please paste your resume content manually here."
    )
  }, [onResumeTextExtracted, toast])

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-navy-light rounded-md p-8 bg-slate-50">
          <Upload className="h-10 w-10 text-navy mb-2" />
          <h3 className="font-medium text-lg mb-1">Upload Resume</h3>
          <p className="text-sm text-gray-500 mb-4">
            Upload your PDF/TXT resume or paste content below
          </p>
          <div className="relative">
            <input
              type="file"
              id="resume-upload"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept=".pdf,.txt"
              disabled={isLoading}
            />
            <Button
              className="bg-navy hover:bg-navy-light"
              disabled={isLoading}
            >
              Select File
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            PDF parsing uses PDF.js to extract text. If extraction fails,
            you can still paste your content manually in the text area
            below.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default ResumeUploader
