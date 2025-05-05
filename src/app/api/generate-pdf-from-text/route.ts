// src/app/api/generate-pdf-from-text/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateResumeWithGemini } from '@/utils/geminiAPI';

export async function POST(req: NextRequest) {
  try {
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
    
    const { rawResumeText, jobDescription, additionalInfo } = body;
    
    if (!rawResumeText || typeof rawResumeText !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid resume text' },
        { status: 400 }
      );
    }
    
    // Get API key from environment variable
    const apiKey = process.env.GOOGLE_API_KEY;
    
    if (!apiKey) {
      console.error('GOOGLE_API_KEY is not defined in environment variables');
      return NextResponse.json(
        { error: 'API key is not configured on the server' },
        { status: 500 }
      );
    }

    console.log('Processing resume generation request with valid inputs');

    // Generate LaTeX from raw resume text
    const result = await generateResumeWithGemini(
      rawResumeText,
      jobDescription || '',
      additionalInfo || '',
      { apiKey }
    );

    if (result.error) {
      console.error('Error generating resume:', result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Return the URL format that the frontend expects
    const pdfUrl = `/api/view-latex?latex=${encodeURIComponent(result.content)}`;
    
    return NextResponse.json({ 
      pdfUrl
    });
    
  } catch (error: any) {
    console.error('Unhandled error in generate-pdf-from-text API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}
