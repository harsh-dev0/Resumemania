export async function POST(request: Request) {
  try {
    const { resumeText, jobDescription, additionalNotes } =
      await request.json()

    // Validation
    if (!resumeText) {
      return new Response(
        JSON.stringify({ error: "Resume text is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    if (!jobDescription) {
      return new Response(
        JSON.stringify({ error: "Job description is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    console.log("Generating resume with:", {
      resumeText: resumeText.substring(0, 50) + "...",
      jobDescription: jobDescription.substring(0, 50) + "...",
    })

    // Parse the resume text to extract information
    const name = extractName(resumeText) || "Your Name"
    const email = extractEmail(resumeText) || "your.email@example.com"
    const phone = extractPhone(resumeText) || "Your Phone Number"
    const experience = extractExperience(resumeText)
    const skills = extractSkills(resumeText, jobDescription)
    const education = extractEducation(resumeText)

    // Create a LaTeX document using the extracted information
    const latexCode = `
\\documentclass{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{hyperref}
\\usepackage{enumitem}

\\begin{document}

\\noindent\\textbf{\\Large ${name}} \\hfill \\textbf{${email}} \\\\
\\noindent\\textbf{} \\hfill ${phone}

\\section*{Professional Summary}
${generateSummary(resumeText, jobDescription)}

${experience}

${skills}

${education}

${
  additionalNotes
    ? `\\section*{Additional Information}\n${formatAdditionalNotes(
        additionalNotes
      )}`
    : ""
}

\\end{document}
    `

    return new Response(JSON.stringify({ latexCode }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error generating LaTeX resume:", error)
    return new Response(
      JSON.stringify({ error: "Failed to generate LaTeX resume" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}

// Helper functions to extract information from resume text
function extractName(resumeText: string): string | null {
  // Basic extraction - look for a name at the beginning of the resume
  const lines = resumeText
    .split("\n")
    .filter((line) => line.trim().length > 0)
  if (lines.length > 0) {
    // Assume the first non-empty line might be the name
    // Filter out common resume headers
    const firstLine = lines[0].trim()
    if (
      !firstLine.toLowerCase().includes("resume") &&
      !firstLine.toLowerCase().includes("curriculum")
    ) {
      // Basic validation - names typically have 2+ words and are relatively short
      const words = firstLine.split(" ").filter((word) => word.length > 0)
      if (words.length >= 2 && firstLine.length < 50) {
        return firstLine
      }
    }
  }
  return null
}

function extractEmail(resumeText: string): string | null {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  const match = resumeText.match(emailRegex)
  return match ? match[0] : null
}

function extractPhone(resumeText: string): string | null {
  // Look for phone numbers in various formats
  const phoneRegex =
    /(\+?[\d]{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
  const match = resumeText.match(phoneRegex)
  return match ? match[0] : null
}

function extractExperience(resumeText: string): string {
  // Look for common section headers
  const experienceSectionRegex =
    /(?:experience|employment|work history|work experience|professional experience)/i
  const sections = resumeText.split(/\n(?=[A-Z])/)

  let experienceText = ""
  let foundExperience = false

  for (let i = 0; i < sections.length; i++) {
    if (experienceSectionRegex.test(sections[i])) {
      foundExperience = true
      let j = i + 1
      while (j < sections.length && !sections[j].match(/^[A-Z\s]+:?$/)) {
        experienceText += sections[j] + "\n"
        j++
      }
      break
    }
  }

  if (!foundExperience || experienceText.trim().length === 0) {
    return "\\section*{Experience}\nYour work experience will appear here."
  }

  // Format experience for LaTeX
  const formattedExperience =
    "\\section*{Experience}\n" +
    experienceText
      .split(/\n(?=[A-Z])/)
      .filter((job) => job.trim().length > 0)
      .map((job) => {
        const jobLines = job
          .split("\n")
          .filter((line) => line.trim().length > 0)
        if (jobLines.length < 2) return ""

        const position = jobLines[0]
        const company = jobLines.length > 1 ? jobLines[1] : ""
        const details = jobLines.slice(2).join("\n")

        return `\\textbf{${position}} \\hfill \\\\
\\textbf{${company}}
\\begin{itemize}[leftmargin=0.2in, itemsep=0pt]
  \\item ${details.replace(/\n/g, "\n  \\item ")}
\\end{itemize}\n`
      })
      .join("\n")

  return formattedExperience
}

function extractSkills(
  resumeText: string,
  jobDescription: string
): string {
  // Extract skills from resume
  let skillsSet = new Set<string>()

  // Common technical skills to look for
  const commonSkills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Angular",
    "Vue",
    "Node.js",
    "Express",
    "Python",
    "Java",
    "C\\+\\+",
    "C#",
    "PHP",
    "Ruby",
    "Go",
    "Rust",
    "Swift",
    "HTML",
    "CSS",
    "SASS",
    "LESS",
    "Tailwind",
    "Bootstrap",
    "SQL",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Firebase",
    "Supabase",
    "AWS",
    "Azure",
    "Google Cloud",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "Git",
    "GitHub",
    "GitLab",
    "Agile",
    "Scrum",
    "Kanban",
  ]

  // Look for skills in resume
  commonSkills.forEach((skill) => {
    try {
      // Escape special regex characters safely
      const safeSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const regex = new RegExp(`\\b${safeSkill}\\b`, "i")
      if (regex.test(resumeText) || regex.test(jobDescription)) {
        // Add the original skill name (not the escaped version)
        skillsSet.add(skill.replace(/\\/g, ""))
      }
    } catch (error) {
      console.warn(`Skipping skill regex for: ${skill}`, error)
      // Try a simple string match as fallback
      if (
        resumeText.toLowerCase().includes(skill.toLowerCase()) ||
        jobDescription.toLowerCase().includes(skill.toLowerCase())
      ) {
        skillsSet.add(skill.replace(/\\/g, ""))
      }
    }
  })

  // If no skills were found, return empty section
  if (skillsSet.size === 0) {
    return ""
  }

  // Group skills by category
  const programmingLanguages = Array.from(skillsSet).filter((skill) =>
    [
      "JavaScript",
      "TypeScript",
      "Python",
      "Java",
      "C++",
      "C#",
      "PHP",
      "Ruby",
      "Go",
      "Rust",
      "Swift",
    ].includes(skill)
  )

  const frameworks = Array.from(skillsSet).filter((skill) =>
    [
      "React",
      "Angular",
      "Vue",
      "Node.js",
      "Express",
      "Django",
      "Flask",
      "Spring",
      "ASP.NET",
    ].includes(skill)
  )

  const other = Array.from(skillsSet).filter(
    (skill) =>
      !programmingLanguages.includes(skill) && !frameworks.includes(skill)
  )

  let skillsText = "\\section*{Skills}\n"

  if (programmingLanguages.length > 0) {
    skillsText += `\\textbf{Languages:} ${programmingLanguages.join(
      ", "
    )}\\\\\n`
  }

  if (frameworks.length > 0) {
    skillsText += `\\textbf{Frameworks/Libraries:} ${frameworks.join(
      ", "
    )}\\\\\n`
  }

  if (other.length > 0) {
    skillsText += `\\textbf{Tools \& Technologies:} ${other.join(", ")}\n`
  }

  return skillsText
}

function extractEducation(resumeText: string): string {
  // Look for common education section headers
  const educationSectionRegex =
    /(?:education|academic background|academic history|qualifications)/i
  const sections = resumeText.split(/\n(?=[A-Z])/)

  let educationText = ""
  let foundEducation = false

  for (let i = 0; i < sections.length; i++) {
    if (educationSectionRegex.test(sections[i])) {
      foundEducation = true
      let j = i + 1
      while (j < sections.length && !sections[j].match(/^[A-Z\s]+:?$/)) {
        educationText += sections[j] + "\n"
        j++
      }
      break
    }
  }

  if (!foundEducation || educationText.trim().length === 0) {
    return "\\section*{Education}\nYour education details will appear here."
  }

  // Format education for LaTeX
  const formattedEducation =
    "\\section*{Education}\n" +
    educationText
      .split(/\n(?=[A-Z])/)
      .filter((edu) => edu.trim().length > 0)
      .map((edu) => {
        const eduLines = edu
          .split("\n")
          .filter((line) => line.trim().length > 0)
        if (eduLines.length < 2) return ""

        const degree = eduLines[0]
        const institution = eduLines.length > 1 ? eduLines[1] : ""
        const details = eduLines.slice(2).join(" ")

        let year = ""
        // Try to extract a year
        const yearMatch = details.match(/\b(19|20)\d{2}\b/)
        if (yearMatch) {
          year = yearMatch[0]
        }

        return `\\textbf{${degree}} ${year ? "\\hfill " + year : ""}\\\\
\\textbf{${institution}}\n`
      })
      .join("\n\n")

  return formattedEducation
}

function generateSummary(
  resumeText: string,
  jobDescription: string
): string {
  // Extract years of experience
  const experienceMatch = resumeText.match(
    /\b(\d+)(?:\+)?\s+years?\s+(?:of\s+)?experience\b/i
  )
  const yearsOfExperience = experienceMatch ? experienceMatch[1] : ""

  // Look for common roles mentioned in the resume
  const roleMatches = [
    "software engineer",
    "developer",
    "frontend",
    "backend",
    "full stack",
    "product manager",
    "designer",
    "data scientist",
    "analyst",
    "marketer",
    "sales",
    "support",
    "customer",
    "manager",
  ].filter(
    (role) =>
      new RegExp(`\\b${role}\\b`, "i").test(resumeText) ||
      new RegExp(`\\b${role}\\b`, "i").test(jobDescription)
  )

  const role = roleMatches.length > 0 ? roleMatches[0] : "professional"

  // Extract skills from job description as focus areas
  const skillKeywords = [
    "JavaScript",
    "TypeScript",
    "React",
    "Angular",
    "Vue",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "C#",
    "PHP",
    "Ruby",
    "Go",
    "Rust",
    "AWS",
    "Azure",
    "Google Cloud",
    "Docker",
    "Kubernetes",
    "CI/CD",
  ]

  const matchedSkills = skillKeywords
    .filter((skill) =>
      new RegExp(`\\b${skill}\\b`, "i").test(jobDescription)
    )
    .slice(0, 3)

  const skillsPhrase =
    matchedSkills.length > 0
      ? `specializing in ${matchedSkills.join(", ")}`
      : "with a passion for developing robust solutions"

  return `${yearsOfExperience ? "Experienced " : "Motivated "}${role} ${
    yearsOfExperience
      ? `with ${yearsOfExperience}+ years of experience`
      : ""
  } ${skillsPhrase}. Dedicated to delivering high-quality results and continuously improving skills to meet project requirements and business objectives.`
}

function formatAdditionalNotes(additionalNotes: string): string {
  // Remove any LaTeX special characters to prevent issues
  const sanitized = additionalNotes
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/[&%$#_{}]/g, "\\$&")
    .replace(/\^/g, "\\^{}")
    .replace(/~/g, "\\~{}")

  return sanitized
}
