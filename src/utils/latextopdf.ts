import { pdfjs } from "react-pdf"

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

// Function to convert LaTeX to PDF-viewable content
// In a real implementation, this would use a LaTeX-to-PDF API service
export const convertLatexToPdfBlob = async (
  latexContent: string
): Promise<Blob | null> => {
  try {
    // const response = await fetch('your-latex-to-pdf-api-endpoint', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ latex: latexContent })
    // });
    // return await response.blob();

    const samplePdf = await fetch(
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    ).then((res) => res.blob())

    return samplePdf
  } catch (error) {
    console.error("Error converting LaTeX to PDF:", error)
    return null
  }
}

// Function to create a downloadable URL for the PDF
export const createPdfDownloadUrl = (pdfBlob: Blob): string => {
  return URL.createObjectURL(pdfBlob)
}
