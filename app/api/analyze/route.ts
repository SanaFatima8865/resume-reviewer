import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is missing. Add it to your .env.local file then restart the dev server.' },
        { status: 500 }
      )
    }

    const { resume, jobDescription } = await req.json()

    if (!resume?.trim() || !jobDescription?.trim()) {
      return NextResponse.json(
        { error: 'Both resume and job description are required.' },
        { status: 400 }
      )
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'You are an expert technical recruiter and career coach with 15+ years of experience. Always respond with valid JSON only — no markdown, no backticks, no explanation outside the JSON.',
          },
          {
            role: 'user',
            content: `Analyze this resume against the job description.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resume}

Return this exact JSON structure:
{
  "matchScore": <integer 0-100>,
  "scoreLabel": "<one of: Weak Match | Fair Match | Good Match | Strong Match>",
  "summary": "<2-3 sentence honest overall assessment of fit>",
  "missingKeywords": [
    { "keyword": "<term>", "importance": "<Critical | Important | Nice to have>", "context": "<why this matters for the role>" }
  ],
  "strengths": [
    { "point": "<specific strength>", "detail": "<brief explanation>" }
  ],
  "rewrites": [
    {
      "original": "<exact bullet or sentence from resume to improve>",
      "improved": "<rewritten version with stronger impact, metrics, and keywords>",
      "reason": "<why this is better>"
    }
  ],
  "quickWins": [
    "<short actionable tip to immediately improve the resume>"
  ]
}

Rules:
- missingKeywords: list 4-7 terms from the JD not present (or underrepresented) in the resume
- strengths: list 3-4 genuine strengths
- rewrites: pick exactly 3 bullet points from the resume and rewrite them to be stronger
- quickWins: 3 quick tips (formatting, keywords, structure)
- Be specific and honest — do not sugarcoat a poor match`,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      return NextResponse.json({ error: errText }, { status: response.status })
    }

    const data = await response.json()
    const raw = data.choices?.[0]?.message?.content || ''
    const clean = raw.replace(/```json|```/g, '').trim()
    const result = JSON.parse(clean)

    return NextResponse.json(result)
  } catch (err: unknown) {
    console.error('Analysis error:', err)

    if (err instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      )
    }

    if (err && typeof err === 'object' && 'message' in err) {
      return NextResponse.json(
        { error: (err as { message: string }).message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    )
  }
}