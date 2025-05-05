// src/app/api/view-latex/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Get the LaTeX content from the query parameter
    const url = new URL(req.url);
    const latex = url.searchParams.get('latex');
    
    if (!latex) {
      return NextResponse.json(
        { error: 'LaTeX content is required' },
        { status: 400 }
      );
    }

    // Return the LaTeX content with appropriate headers for rendering
    return new NextResponse(latex, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error rendering LaTeX:', error);
    return NextResponse.json(
      { error: 'Failed to render LaTeX content' },
      { status: 500 }
    );
  }
}
