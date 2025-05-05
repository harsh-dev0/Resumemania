// src/app/api/update-resume/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

// Initialize Google Generative AI with better error handling
let genAI: ReturnType<typeof createGoogleGenerativeAI> | null = null;

try {
  if (!process.env.GOOGLE_API_KEY) {
    console.error('GOOGLE_API_KEY is not defined in environment variables');
  } else {
    genAI = createGoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    console.log('Google Generative AI initialized successfully');
  }
} catch (error) {
  console.error('Failed to initialize Google Generative AI:', error);
}

export async function POST(req: NextRequest) {
  try {
    // Check if API is properly initialized
    if (!genAI) {
      console.error('AI service not available - missing or invalid API key');
      return NextResponse.json(
        { error: 'AI service is not available. Please check server configuration.' },
        { status: 503 }
      );
    }

    // Validate request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }
    
    const { latex, jobDesc } = body;
    
    if (!latex || typeof latex !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid LaTeX content' },
        { status: 400 }
      );
    }
    
    if (!jobDesc || typeof jobDesc !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid job description' },
        { status: 400 }
      );
    }

    console.log('Processing resume update request with valid inputs');

    // Set timeout for request handling (not for AI specifically)
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), 60000); // 60 second timeout
    });

    // Craft a detailed prompt for the AI to optimize the resume
    const prompt = `
I need to optimize a resume in LaTeX format for a specific job description. Please help me tailor it effectively.

INSTRUCTIONS:
1. Review the LaTeX resume and job description carefully
2. Modify the resume to better match the job requirements by:
   - Highlighting relevant skills, experiences, and qualifications
   - Reorganizing content to emphasize most relevant information first
   - Using keywords and terminology from the job description
   - Adding quantifiable achievements where possible
   - Removing or minimizing irrelevant details
3. Maintain proper LaTeX syntax and formatting throughout
4. Keep the same overall document structure and commands
5. Ensure the result is compilable and professional looking
6. Return ONLY the updated LaTeX code without any explanations

RESUME (LaTeX format):
${latex}

JOB DESCRIPTION:
${jobDesc}

Optimized Resume (LaTeX format):
`;

    try {
      console.log('Sending request to Google AI');
      
      // Racing the AI request against a timeout
      const result = await Promise.race([
        generateText({
          model: genAI('gemini-pro'),
          prompt: prompt,
          maxTokens: 4000
        }),
        timeoutPromise
      ]);
      
      if (!result || !result.text || result.text.trim().length === 0) {
        console.error('Empty response received from AI service');
        throw new Error('Empty response from AI service');
      }

      console.log('Received response from AI, validating LaTeX');

      // Ensure result is valid LaTeX
      const updatedLatex = validateAndCleanLatex(result.text);
      
      return NextResponse.json({ updatedLatex });
    } catch (genError: any) {
      if (genError.message === 'Request timed out') {
        console.error('AI request timed out');
        return NextResponse.json(
          { error: 'Request timed out. Please try again with a shorter resume or job description.' },
          { status: 408 }
        );
      }
      
      console.error('AI generation error:', genError);
      return NextResponse.json(
        { error: 'Failed to optimize resume: ' + (genError.message || 'Unknown error') },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Unhandled error in update-resume API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}

// Function to validate and clean LaTeX output
function validateAndCleanLatex(latex: string): string {
  try {
    // Remove any markdown code fence that might be included
    let cleanLatex = latex.replace(/```(?:latex)?\s*([\s\S]*?)\s*```/g, '$1').trim();
    
    // Ensure document has required LaTeX structure
    const hasDocumentClass = /\\documentclass/.test(cleanLatex);
    const hasBeginDocument = /\\begin\{document\}/.test(cleanLatex);
    const hasEndDocument = /\\end\{document\}/.test(cleanLatex);
    
    if (!hasDocumentClass || !hasBeginDocument || !hasEndDocument) {
      console.error('Generated content is not valid LaTeX');
      throw new Error('Generated content is not valid LaTeX');
    }
    
    return cleanLatex;
  } catch (error) {
    console.error('Error validating LaTeX:', error);
    throw error;
  }
}