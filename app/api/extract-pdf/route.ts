import { NextRequest, NextResponse } from 'next/server'
import pdfParse from 'pdf-parse'

export const config = {
  api: { bodyParser: false },
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are supported.' }, { status: 400 })
    }

    // 10 MB limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 10 MB.' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const data = await pdfParse(buffer)

    const text = data.text
      .replace(/\r\n/g, '\n')       // normalize line endings
      .replace(/\n{3,}/g, '\n\n')   // collapse excess blank lines
      .trim()

    if (!text || text.length < 50) {
      return NextResponse.json(
        { error: 'Could not extract text from this PDF. It may be a scanned image. Please paste your resume as text instead.' },
        { status: 422 }
      )
    }

    return NextResponse.json({
      text,
      pages: data.numpages,
      wordCount: text.split(/\s+/).filter(Boolean).length,
    })
  } catch (err) {
    console.error('PDF parse error:', err)
    return NextResponse.json(
      { error: 'Failed to read the PDF. Please paste your resume as text instead.' },
      { status: 500 }
    )
  }
}
