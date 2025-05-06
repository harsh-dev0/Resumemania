export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const resumeFile = formData.get("resume") as File

    if (!resumeFile) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Check file type
    if (
      resumeFile.type !== "application/pdf" &&
      resumeFile.type !== "text/plain"
    ) {
      return new Response(
        JSON.stringify({
          error: "Invalid file type. Only PDF and TXT files are allowed",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    // Extract text from file
    let text

    if (resumeFile.type === "text/plain") {
      text = await resumeFile.text()
    } else {
      // For PDF files, we need proper PDF parsing libraries on the server
      // Return a clear message that this needs server-side implementation
      text =
        "To properly extract text from PDF files, we need a server-side PDF parsing library. Please paste your resume content manually."
    }

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error parsing resume file:", error)
    return new Response(
      JSON.stringify({ error: "Failed to parse resume file" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
