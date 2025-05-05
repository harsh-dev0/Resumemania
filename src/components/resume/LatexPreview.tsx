import React from "react"
import Latex from "react-latex"
import "katex/dist/katex.min.css"

interface LatexPreviewProps {
  content: string
}

const LatexPreview = ({ content }: LatexPreviewProps) => {
  return (
    <div className="bg-white p-6 rounded-md border shadow-sm whitespace-pre-wrap font-mono text-sm overflow-auto">
      <Latex>{content}</Latex>
    </div>
  )
}

export default LatexPreview
