import { NextRequest, NextResponse } from 'next/server';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

const genAI = createGoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { latex, jobDesc } = await req.json();
    
    if (!latex || !jobDesc) {
      return NextResponse.json(
        { error: 'Missing latex or job description' },
        { status: 400 }
      );
    }
    
    const prompt = `
I have a resume in LaTeX format and a job description. Please optimize my resume to match the job description better.
Make the resume more relevant to the job by:
1. Highlighting relevant skills and experiences
2. Using keywords from the job description
3. Quantifying achievements where possible
4. Removing irrelevant information
5. Maintaining the same LaTeX format

Resume LaTeX:
${latex}

Job Description:
${jobDesc}

Return only the optimized LaTeX code without any explanations or markdown formatting.
`;

    const result = await generateText({
      model: genAI('gemini-pro'),
      prompt: prompt
    });
    
    const updatedLatex = result.text;
    
    return NextResponse.json({ updatedLatex });
  } catch (error) {
    console.error('Error updating resume:', error);
    return NextResponse.json(
      { error: 'Failed to update resume' },
      { status: 500 }
    );
  }
}
