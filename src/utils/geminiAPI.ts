export interface GeminiConfig {
  apiKey: string
  temperature?: number
  topK?: number
  topP?: number
  maxOutputTokens?: number
}

export interface GeminiResponse {
  content: string
  error?: string
}

export async function generateResumeWithGemini(
  profile: any,
  jobDescription: string,
  config: GeminiConfig
): Promise<GeminiResponse> {
  try {
    const apiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

    const prompt = `
      Create a professional resume based on the following profile and job description.
      Format the resume in LaTeX format, ready to be rendered into a PDF.
      
      PROFILE:
      ${JSON.stringify(profile, null, 2)}
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      Please return ONLY the LaTeX code without any explanations or markdown.
      `

    const response = await fetch(`${apiUrl}?key=${config.apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: config.temperature || 0.4,
          topK: config.topK || 32,
          topP: config.topP || 1,
          maxOutputTokens: config.maxOutputTokens || 4096,
        },
      }),
    })

    const data = await response.json()

    if (response.ok) {
      // Extract the content from Gemini's response structure
      const content = data.candidates?.[0].content?.parts?.[0]?.text || ""
      return { content }
    } else {
      return {
        content: "",
        error: data.error?.message || "Failed to generate resume",
      }
    }
  } catch (error) {
    console.error("Error generating resume with Gemini:", error)
    return {
      content: "",
      error: "Network error or API issue occurred",
    }
  }
}
