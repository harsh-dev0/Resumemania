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

/**
 * Generates a resume in LaTeX format by parsing raw text using Google's Generative AI (Gemini)
 * @param rawResumeText The raw text pasted by the user.
 * @param jobDescription Optional job description to tailor the resume for
 * @param additionalInfo Optional additional information or specific requirements
 * @param config Gemini API configuration
 * @returns Promise with the generated LaTeX content or error
 */
export async function generateResumeWithGemini(
  rawResumeText: string,
  jobDescription: string = "",
  additionalInfo: string = "",
  config: GeminiConfig
): Promise<GeminiResponse> {
  try {
    // Using the latest Gemini API endpoint
    const apiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent"

    const prompt = `
You are an expert LaTeX resume generator. Your task is to parse the provided raw resume text and format it using the EXACT LaTeX template structure given below. Extract contact information (Name, Email, Phone, LinkedIn if present) for the header. Identify and structure the main sections like Summary, Experience, Education, Projects, and Skills based on the input text.

${jobDescription ? `IMPORTANT: Tailor the resume content to highlight skills and experiences relevant to this job description:
"""
${jobDescription}
"""` : ''}

${additionalInfo ? `ADDITIONAL REQUIREMENTS:
"""
${additionalInfo}
"""` : ''}

USE THIS EXACT LATEX TEMPLATE STRUCTURE:

\\documentclass[11.5pt, letterpaper]{article}

\\usepackage[
    ignoreheadfoot,
    top=1.25cm,
    bottom=1.25cm,
    left=2cm,
    right=2cm,
    footskip=1.0cm,
]{geometry}
\\usepackage{titlesec}
\\usepackage{tabularx}
\\usepackage{array}
\\usepackage[dvipsnames]{xcolor}
\\definecolor{primaryColor}{RGB}{0, 79, 144}
\\usepackage{enumitem}
\\usepackage{fontawesome5}
\\usepackage{amsmath}
\\usepackage[
    pdftitle={NAME's Resume}, % Replace NAME
    pdfauthor={NAME},       % Replace NAME
    pdfcreator={LaTeX},
    colorlinks=true,
    urlcolor=primaryColor,
    pdfnewwindow=true
]{hyperref}
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\columnsep}{0cm}

\\titleformat{\\section}{\\Large\\bfseries\\color{primaryColor}}{}{0pt}{}[\\vspace{1pt}\\titlerule]
\\titlespacing{\\section}{0pt}{0.5cm}{0.2cm}

\\begin{document}

\\begin{center}
    {\\Huge\\textbf{NAME}} % Replace NAME
    \\\\[0.2cm]
    % --- Contact Info ---
    % PARSE and include Email (required), Phone (required), LinkedIn (optional)
    % Example: \\faEnvelope[regular] \\href{mailto:EMAIL}{EMAIL} \\quad \\faPhone \\href{tel:PHONE}{PHONE} \\quad \\faLinkedin \\href{https://linkedin.com/in/LINKEDIN_USER}{LINKEDIN_USER}
    CONTACT_INFO_LATEX % Replace with parsed contact info LaTeX
\\end{center}

% --- Sections ---
% PARSE the raw text and generate LaTeX for the sections found.
% Use \\section{Section Name} for each.
% Format entries appropriately (e.g., bold titles, dates, descriptions).
% If a section (like Projects) is not found in the text, OMIT the entire LaTeX \\section{...} block for it.

% Example Structure for Experience:
% \\section{Experience}
% \\textbf{Job Title} – Company Name \\hfill StartDate – EndDate \\\\
% Description line 1 \\\\
% Description line 2 (or bullet points) \\\\
% \\vspace{2mm} % Optional spacing between entries
% \\textbf{Another Job Title} – Another Company \\hfill StartDate – EndDate \\\\
% ...

% Example Structure for Education:
% \\section{Education}
% \\textbf{Degree Name} \\hfill Graduation Date \\\\
% Institution Name \\\\
% Optional details (GPA, Honors, etc.) \\\\
% \\vspace{2mm}

% Example Structure for Skills:
% \\section{Skills}
% Category Name: Skill 1, Skill 2, Skill 3 \\\\ % Optional categories
% General Skills: Skill A, Skill B, Skill C

% --- PARSED SECTIONS START HERE ---
PARSED_SECTIONS_LATEX % Replace with parsed sections formatted in LaTeX
% --- PARSED SECTIONS END HERE ---

\\end{document}

RAW RESUME TEXT TO PARSE:
"""
${rawResumeText}
"""

IMPORTANT INSTRUCTIONS:
1. Parse the RAW RESUME TEXT provided above.
2. Extract Name, Email, Phone, and LinkedIn (if available) for the header.
3. Identify standard resume sections (Summary, Experience, Education, Projects, Skills, etc.) present in the text.
4. Format the extracted information STRICTLY according to the LaTeX template structure shown. Replace placeholders like NAME, CONTACT_INFO_LATEX, and PARSED_SECTIONS_LATEX.
5. Use standard LaTeX commands like \\textbf{}, \\textit{}, \\hfill, \\\\, \\section{}, and potentially lists (itemize) for structuring content within sections.
6. If a standard section (e.g., Projects, Awards) is not clearly identifiable in the raw text, DO NOT include the corresponding \\section{} in the output.
${jobDescription ? '7. Tailor the resume content to emphasize skills and experiences that match the job description provided.' : ''}
${additionalInfo ? `${jobDescription ? '8' : '7'}. Incorporate the additional requirements specified.` : ''}
${additionalInfo && jobDescription ? '9' : additionalInfo || jobDescription ? '8' : '7'}. Return ONLY the complete, valid LaTeX code. Do not include any explanations, comments, introductory text, or markdown \`\`\`latex ... \`\`\` fences. Just the raw LaTeX source.
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
          temperature: config.temperature || 0.3,
          topK: config.topK || 32,
          topP: config.topP || 1,
          maxOutputTokens: config.maxOutputTokens || 8192,
          responseMimeType: "text/plain",
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_ONLY_HIGH",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_ONLY_HIGH",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_ONLY_HIGH",
          },
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_ONLY_HIGH",
          },
        ],
      }),
    })

    const data = await response.json()

    if (response.ok) {
      // Extract the content from the latest Gemini API response structure
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
      
      // Basic validation: Check if it looks like LaTeX
      if (content.trim().startsWith("\\documentclass")) {
        return { content }
      } else {
        console.error("Gemini API did not return expected LaTeX format:", content)
        return {
          content: "",
          error: "Failed to generate valid LaTeX resume. The AI response was not in the expected format."
        }
      }
    } else {
      console.error("Gemini API error:", data)
      return {
        content: "",
        error: data.error?.message || "Failed to generate resume",
      }
    }
  } catch (error) {
    console.error("Error generating resume with Gemini:", error)
    return {
      content: "",
      error: error instanceof Error ? error.message : "Network error or API issue occurred",
    }
  }
}

// This function generates LaTeX from structured data and is separate
// from the main workflow which parses raw text via the Gemini API.
export function generateSampleLatexResume(
  profile: any,
  jobDescription: string
): string {
  const jobTitle = jobDescription.split("\n")[0].trim() || "Position Title"
  const skills = (profile.skills || [])
    .map((skill: any) => skill.name)
    .join(" · ")

  return `\\documentclass[11.5pt, letterpaper]{article}

\\usepackage[
    ignoreheadfoot,
    top=1.25cm,
    bottom=1.25cm,
    left=2cm,
    right=2cm,
    footskip=1.0cm,
]{geometry}
\\usepackage{titlesec}
\\usepackage{tabularx}
\\usepackage{array}
\\usepackage[dvipsnames]{xcolor}
\\definecolor{primaryColor}{RGB}{0, 79, 144}
\\usepackage{enumitem}
\\usepackage{fontawesome5}
\\usepackage{amsmath}
\\usepackage[
    pdftitle={${profile.personal?.fullName || "Your Name"}'s Resume},
    pdfauthor={${profile.personal?.fullName || "Your Name"}},
    pdfcreator={LaTeX},
    colorlinks=true,
    urlcolor=primaryColor,
    pdfnewwindow=true
]{hyperref}
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\columnsep}{0cm}

\\titleformat{\\section}{\\Large\\bfseries\\color{primaryColor}}{}{0pt}{}[\\vspace{1pt}\\titlerule]
\\titlespacing{\\section}{0pt}{0.5cm}{0.2cm}

\\begin{document}

\\begin{center}
  {\\Huge\\textbf{${profile.personal?.fullName || "Your Name"}}}\\\\[0.2cm]
  \\faEnvelope[regular] \\href{mailto:${
    profile.personal?.email || "email@example.com"
  }}{${profile.personal?.email || "email@example.com"}} \\quad
  \\faPhone \\href{tel:${profile.personal?.phone || "+1234567890"}}{${
    profile.personal?.phone || "+1234567890"
  }}
  ${
    profile.personal?.linkedin
      ? `\\quad \\faLinkedin \\href{https://linkedin.com/in/${profile.personal.linkedin}}{${profile.personal.linkedin}}`
      : ""
  }
</center>

% Professional Summary
\\section{Professional Summary}
${
  profile.personal?.summary ||
  "A dedicated professional with experience in..."
}

% Experience
\\section{Experience}
${(profile.experience || [])
  .map(
    (exp: any) => `
\\textbf{${exp.title} – ${exp.company}} \\hfill ${exp.startDate} – ${exp.endDate}\\\\
${exp.description}
`
  )
  .join("\n\n")}

% Education
\\section{Education}
${(profile.education || [])
  .map(
    (edu: any) => `
\\textbf{${edu.degree}} \\hfill ${edu.graduationDate}\\\\
${edu.institution}${edu.description ? `\\\\ ${edu.description}` : ""}
`
  )
  .join("\n\n")}

% Projects
\\section{Projects}
${(profile.projects || [])
  .map(
    (proj: any) => `
\\textbf{${proj.name}}${
      proj.link ? ` \\href{${proj.link}}{\\faExternalLink*}` : ""
    }\\\\
${proj.description}\\\\
\\textit{Technologies: ${proj.technologies}}
`
  )
  .join("\n\n")}

% Skills
\\section{Technical Skills}
${skills}

\\end{document}`
}
