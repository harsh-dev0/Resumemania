// src/utils/pdfUtils.ts

/**
 * Utility functions for handling PDF text extraction and cleaning
 */

/**
 * Cleans PDF extracted text to remove common artifacts and formatting issues
 * 
 * @param text Raw text extracted from PDF
 * @returns Cleaned text
 */
export function cleanPDFText(text: string): string {
    if (!text) return '';
    
    return text
      // Replace multiple spaces with a single space
      .replace(/\s+/g, ' ')
      // Fix common PDF text extraction artifacts
      .replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, ' ')
      // Replace nonstandard hyphens and dashes with standard ones
      .replace(/[\u2010-\u2015]/g, '-')
      // Remove zero-width spaces
      .replace(/\u200B/g, '')
      // Fix ligatures
      .replace(/ﬁ/g, 'fi')
      .replace(/ﬂ/g, 'fl')
      .replace(/ﬀ/g, 'ff')
      .replace(/ﬃ/g, 'ffi')
      .replace(/ﬄ/g, 'ffl')
      // Replace bullet points with standard asterisks
      .replace(/[•◦○●]/g, '* ')
      // Fix paragraph breaks (replace multiple newlines with double newlines)
      .replace(/\n{2,}/g, '\n\n')
      // Remove control and non-printable characters
      .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
      // Replace smart quotes with regular quotes
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      // Trim whitespace
      .trim();
  }
  
  /**
   * Extracts sections from resume text
   * 
   * @param text The cleaned resume text
   * @returns Object with resume sections
   */
  export function extractResumeSections(text: string): Record<string, string> {
    // Common section headers in resumes
    const sectionPatterns = [
      { name: 'contactInfo', regex: /^\s*(.*?)\s*(?:Email|Phone|Address|LinkedIn|GitHub):/mi },
      { name: 'education', regex: /\b(?:EDUCATION|Academic Background|Degrees)\b/i },
      { name: 'experience', regex: /\b(?:EXPERIENCE|Work Experience|Employment History|PROFESSIONAL EXPERIENCE)\b/i },
      { name: 'skills', regex: /\b(?:SKILLS|Technical Skills|Key Skills|Core Competencies)\b/i },
      { name: 'projects', regex: /\b(?:PROJECTS|Personal Projects|Key Projects)\b/i },
      { name: 'certifications', regex: /\b(?:CERTIFICATIONS|Certificates|Licenses)\b/i },
      { name: 'languages', regex: /\b(?:LANGUAGES|Language Proficiency)\b/i },
      { name: 'awards', regex: /\b(?:AWARDS|Honors|Achievements)\b/i },
      { name: 'publications', regex: /\b(?:PUBLICATIONS|Research|Papers)\b/i },
      { name: 'references', regex: /\b(?:REFERENCES|Professional References)\b/i },
    ];
  
    const sections: Record<string, string> = {
      fullText: text
    };
  
    // Find where each section starts
    const sectionIndices: Array<{ name: string, index: number }> = [];
    sectionPatterns.forEach(section => {
      const match = text.match(section.regex);
      if (match && match.index !== undefined) {
        sectionIndices.push({ name: section.name, index: match.index });
      }
    });
  
    // Sort sections by their position in the text
    sectionIndices.sort((a, b) => a.index - b.index);
  
    // Extract each section's content
    for (let i = 0; i < sectionIndices.length; i++) {
      const currentSection = sectionIndices[i];
      const nextSection = sectionIndices[i + 1];
      
      const startIndex = currentSection.index;
      const endIndex = nextSection ? nextSection.index : text.length;
      
      sections[currentSection.name] = text.substring(startIndex, endIndex).trim();
    }
  
    return sections;
  }
  
  /**
   * Extracts key information from resume text
   * 
   * @param text The cleaned resume text
   * @returns Object with extracted information
   */
  export function extractResumeInfo(text: string): Record<string, any> {
    const info: Record<string, any> = {};
    
    // Extract name (usually at the beginning)
    const nameMatch = text.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/);
    if (nameMatch) {
      info.name = nameMatch[1].trim();
    }
    
    // Extract email
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    if (emailMatch) {
      info.email = emailMatch[0];
    }
    
    // Extract phone number
    const phoneMatch = text.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) {
      info.phone = phoneMatch[0];
    }
    
    // Extract LinkedIn
    const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9-]+/);
    if (linkedinMatch) {
      info.linkedin = linkedinMatch[0];
    }
    
    // Extract GitHub
    const githubMatch = text.match(/github\.com\/[a-zA-Z0-9-]+/);
    if (githubMatch) {
      info.github = githubMatch[0];
    }
    
    return info;
  }
  
  /**
   * Formats extracted resume information into a structured format
   * 
   * @param sections The extracted resume sections
   * @param info Additional extracted information
   * @returns Structured resume data
   */
  export function formatResumeData(
    sections: Record<string, string>,
    info: Record<string, any>
  ): Record<string, any> {
    return {
      personalInfo: {
        name: info.name || 'Unknown',
        email: info.email || '',
        phone: info.phone || '',
        linkedin: info.linkedin || '',
        github: info.github || '',
      },
      sections: {
        ...sections
      }
    };
  }