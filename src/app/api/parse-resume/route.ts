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
    
    // Return the extracted text directly without converting to LaTeX
    return NextResponse.json({ 
      text,
      message: 'PDF successfully parsed'
    });
    
  } catch (error) {
    console.error('Unexpected error parsing resume:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your resume' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};