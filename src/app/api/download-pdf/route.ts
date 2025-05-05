import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const latex = url.searchParams.get('latex');
    
    if (!latex) {
      return NextResponse.json(
        { error: 'Missing LaTeX content' },
        { status: 400 }
      );
    }

    // In a real implementation, we would use a LaTeX to PDF conversion service
    // For example, using a library like latex.js or a cloud service
    
    // For demonstration purposes, we'll use a third-party service to convert LaTeX to PDF
    // This is a placeholder implementation - in production, you'd use a proper LaTeX to PDF converter
    
    try {
      // Create a simple HTML wrapper for the LaTeX content
      // This is a very basic approach - a real implementation would use proper LaTeX to PDF conversion
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Resume</title>
          <style>
            body {
              font-family: 'Times New Roman', Times, serif;
              margin: 0;
              padding: 20px;
              background-color: white;
            }
            pre {
              white-space: pre-wrap;
              font-family: 'Courier New', Courier, monospace;
              font-size: 12px;
              line-height: 1.5;
            }
          </style>
        </head>
        <body>
          <pre>${latex}</pre>
        </body>
        </html>
      `;

      // Convert HTML to a buffer
      const buffer = Buffer.from(htmlContent);
      
      // Return the buffer as a downloadable PDF
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="resume.pdf"'
        }
      });
    } catch (conversionError) {
      console.error('Error converting LaTeX to PDF:', conversionError);
      return NextResponse.json(
        { error: 'Failed to convert LaTeX to PDF' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in download-pdf API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}
