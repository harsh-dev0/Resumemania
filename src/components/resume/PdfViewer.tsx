import { useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import "react-pdf/dist/esm/Page/TextLayer.css"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"

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
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setIsLoading(false)
  }

  const goToPrevPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1))
  }

  const goToNextPage = () => {
    setPageNumber((prevPageNumber) =>
      Math.min(prevPageNumber + 1, numPages || 1)
    )
  }

  if (!pdfUrl) {
    return (
      <div className="text-center py-8">No PDF available to display</div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="border rounded-md p-2 bg-white shadow-sm">
        {isLoading && (
          <div className="w-[612px] h-[792px] flex items-center justify-center">
            <Skeleton className="w-full h-full" />
          </div>
        )}
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="w-[612px] h-[792px] flex items-center justify-center">
              Loading PDF...
            </div>
          }
          error={
            <div className="w-[612px] h-[792px] flex items-center justify-center text-red-500">
              Failed to load PDF
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            width={612}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>

      {numPages && numPages > 1 && (
        <div className="flex items-center mt-2 space-x-2">
          <Button
            variant="outline"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
          >
            Previous
          </Button>
          <div className="text-sm">
            Page {pageNumber} of {numPages}
          </div>
          <Button
            variant="outline"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
          >
            Next
          </Button>
        </div>
      )}

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
