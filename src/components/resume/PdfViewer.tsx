import React from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface PdfViewerProps {
  pdfUrl: string
  downloadUrl: string
}

const PdfViewer = ({ pdfUrl, downloadUrl }: PdfViewerProps) => {
  return (
    <div className="w-full flex flex-col">
      <div className="border rounded-lg overflow-hidden mb-4 h-[600px] bg-white">
        <iframe
          src={pdfUrl}
          className="w-full h-full"
          title="Resume Preview"
        ></iframe>
      </div>
      <div className="flex justify-center">
        <Button className="bg-navy hover:bg-navy-light text-white" asChild>
          <a href={downloadUrl} download="resume.pdf">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </a>
        </Button>
      </div>
    </div>
  )
}

export default PdfViewer
