import React from "react"
import Latex from "react-latex"
import "katex/dist/katex.min.css"

interface LatexPreviewProps {
  latex: string
}

const LatexPreview = ({ latex }: LatexPreviewProps) => {
  return (
    <div className="bg-white p-6 rounded-md border shadow-sm whitespace-pre-wrap font-mono text-sm overflow-auto">
      <Latex>{latex}</Latex>
    </div>
  )
}

export default LatexPreview
