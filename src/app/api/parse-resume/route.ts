// src/app/api/parse-resume/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

export async function POST(req: NextRequest) {
  try {
    console.log('Received request to parse resume');
    
    // Make sure we can read the formData
    let data;
    try {
      data = await req.formData();
      console.log('Successfully read form data');
    } catch (formError) {
      console.error('Error reading form data:', formError);
      return NextResponse.json(
        { error: 'Unable to read form data' },
        { status: 400 }
      );
    }
    
    const file = data.get('file') as File | null;
    
    if (!file) {
      console.error('No file found in form data');
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    console.log('File received:', file.name, 'Size:', file.size);

    // Validate file type
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (fileType !== 'pdf') {
      console.error('Invalid file type:', fileType);
      return NextResponse.json(
        { error: 'Please upload a PDF file' },
        { status: 400 }
      );
    }

    // Get file content as buffer
    let buffer;
    try {
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
      console.log('Successfully converted file to buffer, size:', buffer.length);
    } catch (fileError) {
      console.error('Error reading file content:', fileError);
      return NextResponse.json(
        { error: 'Unable to read file content' },
        { status: 400 }
      );
    }
    
    // Parse PDF content
    let pdfData;
    try {
      console.log('Parsing PDF content');
      pdfData = await pdfParse(buffer);
      console.log('PDF parsed successfully, text length:', pdfData.text.length);
    } catch (pdfError) {
      console.error('Error parsing PDF:', pdfError);
      return NextResponse.json(
        { error: 'Unable to parse PDF content. The file might be corrupted or password-protected.' },
        { status: 400 }
      );
    }
    
    const text = pdfData.text;
    
    // Convert to LaTeX
    let latex;
    try {
      console.log('Converting text to LaTeX');
      latex = await convertToLatex(text);
      console.log('Successfully converted to LaTeX');
    } catch (latexError) {
      console.error('Error converting to LaTeX:', latexError);
      return NextResponse.json(
        { error: 'Error converting resume to LaTeX format' },
        { status: 500 }
      );
    }
    
    // Return the LaTeX content
    return NextResponse.json({ latex });
    
  } catch (error) {
    console.error('Unexpected error parsing resume:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your resume' },
      { status: 500 }
    );
  }
}

async function convertToLatex(text: string): Promise<string> {
  try {
    const sections = extractSections(text);
    
    let latex = `\\documentclass{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}

\\begin{document}

`;

    // Name and contact section with better formatting
    if (sections.name) {
      latex += `\\begin{center}
  {\\LARGE \\textbf{${sanitizeLatex(sections.name)}}}\\\\[0.3em]
`;

      if (sections.contact) {
        const contactInfo = sections.contact.split('\n')
          .filter(line => line.trim())
          .map(line => sanitizeLatex(line.trim()))
          .join(' | ');
        
        latex += `  ${contactInfo}
`;
      }
      
      latex += `\\end{center}

`;
    }

    // Summary section
    if (sections.summary && sections.summary.trim()) {
      latex += `\\section*{Professional Summary}
${formatLatexContent(sections.summary)}

`;
    }

    // Experience section with better formatting
    if (sections.experience && sections.experience.trim()) {
      latex += `\\section*{Experience}
${formatLatexContent(sections.experience)}

`;
    }

    // Education section with better formatting
    if (sections.education && sections.education.trim()) {
      latex += `\\section*{Education}
${formatLatexContent(sections.education)}

`;
    }

    // Skills section with better formatting
    if (sections.skills && sections.skills.trim()) {
      latex += `\\section*{Skills}
${formatLatexContent(sections.skills)}

`;
    }

    // Add any additional sections found during parsing
    for (const [key, value] of Object.entries(sections)) {
      if (!['name', 'contact', 'summary', 'experience', 'education', 'skills'].includes(key) && value && value.trim()) {
        latex += `\\section*{${capitalizeFirstLetter(key)}}
${formatLatexContent(value as string)}

`;
      }
    }

    latex += `\\end{document}`;
    
    return latex;
  } catch (error) {
    console.error('Error in convertToLatex:', error);
    throw new Error('Failed to convert resume to LaTeX format');
  }
}

function extractSections(text: string): Record<string, string> {
  try {
    // Clean up text - remove excessive whitespace and normalize line breaks
    const cleanText = text.replace(/\r\n/g, '\n')
                          .replace(/\s+\n/g, '\n')
                          .replace(/\n\s+/g, '\n')
                          .replace(/\n{3,}/g, '\n\n');
    
    const lines = cleanText.split('\n').filter(line => line.trim());
    
    // Initialize with default sections
    const sections: Record<string, string> = {
      name: '',
      contact: '',
      summary: '',
      experience: '',
      education: '',
      skills: '',
    };
    
    // Safety check for empty resume
    if (lines.length === 0) {
      sections.name = 'Name Not Found';
      sections.contact = 'Contact Information Not Found';
      return sections;
    }
    
    // Assume first non-empty line is the name
    sections.name = lines[0];
    
    // Collect potential contact information from next few lines
    let contactEndIndex = 1;
    const potentialContactLines = [];
    
    for (let i = 1; i < Math.min(5, lines.length); i++) {
      const line = lines[i];
      // Contact info typically contains emails, phone numbers, LinkedIn, or addresses
      if (
        line.includes('@') || 
        /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(line) || 
        line.includes('linkedin.com') ||
        /^[A-Za-z\s]+,\s*[A-Za-z\s]+$/.test(line) // City, State pattern
      ) {
        potentialContactLines.push(line);
        contactEndIndex = i + 1;
      } else if (line.toUpperCase() === line && line.length > 3) {
        // We've probably hit a section header, stop collecting contact info
        break;
      }
    }
    
    sections.contact = potentialContactLines.join('\n');
    
    // More robust section detection
    let currentSection = '';
    const sectionKeywords = {
      summary: ['summary', 'profile', 'objective', 'about'],
      experience: ['experience', 'work', 'employment', 'history', 'professional'],
      education: ['education', 'academic', 'degree', 'university', 'college', 'school'],
      skills: ['skills', 'expertise', 'technologies', 'competencies', 'qualifications', 'abilities'],
      projects: ['projects', 'portfolio'],
      certifications: ['certifications', 'certificates', 'licenses'],
      awards: ['awards', 'honors', 'achievements'],
      publications: ['publications', 'papers', 'research'],
      languages: ['languages'],
      volunteering: ['volunteer', 'community']
    };
    
    for (let i = contactEndIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;
      
      // Check if line is a potential section header
      if (line.toUpperCase() === line && line.length > 3 || 
          /^[A-Z][a-z]+([\s-][A-Z][a-z]+)*\s*:/.test(line) || // Title Case with colon
          /^[A-Z][A-Z\s]+$/.test(line)) { // All caps
        
        let foundSection = false;
        // Determine which section this belongs to
        for (const [section, keywords] of Object.entries(sectionKeywords)) {
          if (keywords.some(keyword => line.toLowerCase().includes(keyword.toLowerCase()))) {
            currentSection = section;
            sections[currentSection] = '';
            foundSection = true;
            break;
          }
        }
        
        // If we didn't match a predefined section, create a custom one
        if (!foundSection && line.length < 30) { // Likely a header if not too long
          // Create a sanitized key name
          const customSection = line.toLowerCase()
            .replace(/[^a-z0-9]/g, '_')
            .replace(/:$/, '')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
          
          if (customSection) {
            currentSection = customSection;
            sections[currentSection] = '';
          }
        } else if (!foundSection) {
          // If not a header, add the line to the current section
          if (currentSection && sections[currentSection] !== undefined) {
            sections[currentSection] += sections[currentSection] ? '\n' + line : line;
          }
        }
      } else if (currentSection && sections[currentSection] !== undefined) {
        // Add content to the current section
        sections[currentSection] += sections[currentSection] ? '\n' + line : line;
      }
    }
    
    return sections;
  } catch (error) {
    console.error('Error in extractSections:', error);
    // Return basic structure with error messages as content
    return {
      name: 'Error Processing Resume',
      contact: 'Unable to extract contact information',
      summary: 'An error occurred while processing your resume. Please try again with a different file.',
      experience: '',
      education: '',
      skills: '',
    };
  }
}

// Helper functions for LaTeX formatting

function sanitizeLatex(text: string): string {
  try {
    if (!text) return '';
    
    // Escape LaTeX special characters
    return text
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/([&%$#_{}~^])/g, '\\$1')
      .replace(/>/g, '\\textgreater{}')
      .replace(/</g, '\\textless{}');
  } catch (error) {
    console.error('Error in sanitizeLatex:', error);
    return text || ''; // Return original text if error
  }
}

function formatLatexContent(content: string): string {
  try {
    if (!content || !content.trim()) return '';
    
    // Split into paragraphs
    const paragraphs = content.split(/\n{2,}/).filter(p => p.trim());
    
    // Format each paragraph
    return paragraphs
      .map(paragraph => {
        // Check if this paragraph looks like a list
        if (/^[\s•\-*]\s+/.test(paragraph)) {
          // Format as itemize environment
          return '\\begin{itemize}[leftmargin=*]\n' + 
            paragraph
              .split('\n')
              .filter(item => item.trim())
              .map(item => {
                let cleanItem = item.trim().replace(/^[\s•\-*]\s+/, '');
                return `  \\item ${sanitizeLatex(cleanItem)}`;
              })
              .join('\n') + 
            '\n\\end{itemize}';
        }
        
        // Otherwise, format as regular paragraph
        return sanitizeLatex(paragraph);
      })
      .join('\n\n');
  } catch (error) {
    console.error('Error in formatLatexContent:', error);
    return content || ''; // Return original content if error
  }
}

function capitalizeFirstLetter(string: string): string {
  try {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  } catch (error) {
    console.error('Error in capitalizeFirstLetter:', error);
    return string || ''; // Return original string if error
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};