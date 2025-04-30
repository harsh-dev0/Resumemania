import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text;
    
    const latex = await convertToLatex(text);
    
    return NextResponse.json({ latex });
  } catch (error) {
    console.error('Error parsing resume:', error);
    return NextResponse.json(
      { error: 'Failed to parse resume' },
      { status: 500 }
    );
  }
}

async function convertToLatex(text: string): Promise<string> {
  const sections = extractSections(text);
  
  let latex = `\\documentclass{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}

\\begin{document}

\\begin{center}
  {\\LARGE \\textbf{${sections.name || 'Your Name'}}}\\\\
  ${sections.contact || 'your.email@example.com | Phone Number | Location'}
\\end{center}

`;

  if (sections.summary) {
    latex += `\\section*{Professional Summary}
${sections.summary}

`;
  }

  if (sections.experience) {
    latex += `\\section*{Experience}
${sections.experience}

`;
  }

  if (sections.education) {
    latex += `\\section*{Education}
${sections.education}

`;
  }

  if (sections.skills) {
    latex += `\\section*{Skills}
${sections.skills}

`;
  }

  latex += `\\end{document}`;
  
  return latex;
}

function extractSections(text: string) {
  const lines = text.split('\n').filter(line => line.trim());
  
  const sections: any = {
    name: lines[0] || '',
    contact: lines.length > 1 ? lines.slice(1, Math.min(3, lines.length)).join(' | ') : '',
  };
  
  let currentSection = '';
  
  for (let i = 3; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.toUpperCase() === line && line.length > 3) {
      if (line.includes('EXPERIENCE') || line.includes('WORK')) {
        currentSection = 'experience';
        sections[currentSection] = '';
      } else if (line.includes('EDUCATION')) {
        currentSection = 'education';
        sections[currentSection] = '';
      } else if (line.includes('SKILLS')) {
        currentSection = 'skills';
        sections[currentSection] = '';
      } else if (line.includes('SUMMARY') || line.includes('PROFILE')) {
        currentSection = 'summary';
        sections[currentSection] = '';
      }
    } else if (currentSection) {
      sections[currentSection] += line + '\n';
    }
  }
  
  return sections;
}

export const config = {
  api: {
    bodyParser: false,
  },
};
