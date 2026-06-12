'use client'

import { useState } from 'react'
import ResultsPanel from '@/components/ResultsPanel'
import SkeletonLoader from '@/components/SkeletonLoader'
import PdfUpload from '@/components/PdfUpload'

const SAMPLE_JD = `Senior Full-Stack Engineer — FinTech Startup

We're looking for a Senior Full-Stack Engineer to join our platform team.

Requirements:
- 5+ years of experience with React and TypeScript
- Strong Node.js and REST API design skills
- Experience with PostgreSQL and Redis
- Familiarity with AWS (Lambda, S3, RDS)
- CI/CD experience with GitHub Actions or similar
- Understanding of microservices architecture
- Experience with Stripe or payment systems is a plus
- Strong communication skills and ability to work in agile teams`

const SAMPLE_RESUME = `John Smith
john.smith@email.com | github.com/johnsmith

EXPERIENCE

Full-Stack Developer — Acme Corp (2021–Present)
• Built web applications using React and JavaScript
• Worked on backend APIs with Node.js and Express
• Used MongoDB for data storage
• Deployed apps to AWS
• Collaborated with design team on UI features

Junior Developer — StartupXYZ (2019–2021)
• Helped build company website
• Fixed bugs and wrote unit tests
• Used Git for version control

SKILLS
JavaScript, React, Node.js, Express, MongoDB, Git, HTML, CSS

EDUCATION
BSc Computer Science — State University, 2019`

interface AnalysisResult {
  matchScore: number
  scoreLabel: string
  summary: string
  missingKeywords: Array<{ keyword: string; importance: string; context: string }>
  strengths: Array<{ point: string; detail: string }>
  rewrites: Array<{ original: string; improved: string; reason: string }>
  quickWins: string[]
}

type ResumeInputMode = 'paste' | 'pdf'

export default function Home() {
  const [resume, setResume] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'jd' | 'resume'>('jd')
  const [resumeMode, setResumeMode] = useState<ResumeInputMode>('paste')
  const [pdfFilename, setPdfFilename] = useState('')

  const analyze = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setError('Please fill in both the job description and your resume.')
      return
    }
    setError('')
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setResult(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const loadSamples = () => {
    setJobDescription(SAMPLE_JD)
    setResume(SAMPLE_RESUME)
    setResumeMode('paste')
    setPdfFilename('')
    setResult(null)
    setError('')
  }

  const reset = () => {
    setResume('')
    setJobDescription('')
    setPdfFilename('')
    setResult(null)
    setError('')
  }

  const handlePdfExtracted = (text: string, filename: string) => {
    setResume(text)
    setPdfFilename(filename)
    setError('')
  }

  const handlePdfError = (msg: string) => {
    setError(msg)
  }

  const switchResumeMode = (mode: ResumeInputMode) => {
    setResumeMode(mode)
    // Clear resume text when switching modes to avoid stale data
    setResume('')
    setPdfFilename('')
    setError('')
  }

  const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="min-h-screen" style={{ background: '#0F1729' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(22,32,53,0.8)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: 'rgba(14,165,160,0.2)', color: '#0EA5A0', border: '1px solid rgba(14,165,160,0.3)' }}>
              R
            </div>
            <span className="font-semibold text-white text-sm tracking-tight">ResumeCheck</span>
            <span className="text-xs px-2 py-0.5 rounded-full hidden sm:inline" style={{ background: 'rgba(14,165,160,0.1)', color: '#0EA5A0', border: '1px solid rgba(14,165,160,0.2)' }}>
              AI-powered
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadSamples} className="text-xs px-3 py-1.5 rounded-lg transition-all" style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              Load sample
            </button>
            {(result || resume || jobDescription) && (
              <button onClick={reset} className="text-xs px-3 py-1.5 rounded-lg transition-all" style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                Clear all
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero */}
        {!result && !loading && (
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
              Does your resume match<br />
              <span style={{ color: '#0EA5A0' }}>the job?</span>
            </h1>
            <p className="text-white/50 text-base max-w-md mx-auto">
              Paste a job description and your resume — or upload a PDF. Get a match score, missing keywords, and AI-rewritten bullet points in seconds.
            </p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left panel — inputs */}
          <div className="w-full lg:w-[420px] xl:w-[460px] flex-shrink-0">
            <div className="rounded-2xl overflow-hidden" style={{ background: '#162035', border: '1px solid rgba(255,255,255,0.08)' }}>

              {/* Mobile tab switcher */}
              <div className="flex lg:hidden border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                {(['jd', 'resume'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className="flex-1 py-3 text-sm font-medium transition-all"
                    style={{
                      color: activeTab === tab ? '#0EA5A0' : 'rgba(255,255,255,0.4)',
                      borderBottom: activeTab === tab ? '2px solid #0EA5A0' : '2px solid transparent',
                      background: 'transparent',
                    }}>
                    {tab === 'jd' ? 'Job Description' : 'Resume'}
                  </button>
                ))}
              </div>

              <div className="p-5 space-y-5">
                {/* ── Job Description ── */}
                <div className={activeTab !== 'jd' ? 'hidden lg:block' : ''}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      Job Description
                    </label>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{wordCount(jobDescription)} words</span>
                  </div>
                  <textarea
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here..."
                    rows={10}
                    className="w-full rounded-xl px-4 py-3 text-sm text-white/80 placeholder-white/20 focus-teal transition-all"
                    style={{ background: '#0F1729', border: '1px solid rgba(255,255,255,0.08)', resize: 'none', outline: 'none', lineHeight: '1.7' }}
                  />
                </div>

                {/* ── Resume section ── */}
                <div className={activeTab !== 'resume' ? 'hidden lg:block' : ''}>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      Your Resume
                    </label>
                    {/* Paste / PDF toggle */}
                    <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                      {(['paste', 'pdf'] as const).map(mode => (
                        <button
                          key={mode}
                          onClick={() => switchResumeMode(mode)}
                          className="px-3 py-1 text-xs font-medium transition-all"
                          style={{
                            background: resumeMode === mode ? 'rgba(14,165,160,0.2)' : 'transparent',
                            color: resumeMode === mode ? '#0EA5A0' : 'rgba(255,255,255,0.4)',
                          }}
                        >
                          {mode === 'paste' ? '✏️ Paste' : '📎 PDF'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {resumeMode === 'paste' ? (
                    <>
                      <textarea
                        value={resume}
                        onChange={e => setResume(e.target.value)}
                        placeholder="Paste your resume as plain text..."
                        rows={14}
                        className="w-full resume-textarea rounded-xl px-4 py-3 text-white/80 placeholder-white/20 focus-teal transition-all"
                        style={{ background: '#0F1729', border: '1px solid rgba(255,255,255,0.08)', outline: 'none' }}
                      />
                      <p className="text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.2)' }}>
                        {wordCount(resume)} words
                      </p>
                    </>
                  ) : (
                    <>
                      <PdfUpload
                        onExtracted={handlePdfExtracted}
                        onError={handlePdfError}
                      />
                      {/* Show extracted text preview when PDF is loaded */}
                      {resume && pdfFilename && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                              Extracted text · {wordCount(resume)} words
                            </span>
                            <button
                              onClick={() => setResumeMode('paste')}
                              className="text-xs underline underline-offset-2"
                              style={{ color: 'rgba(14,165,160,0.7)' }}
                            >
                              Edit text
                            </button>
                          </div>
                          <div
                            className="rounded-xl px-4 py-3 text-xs font-mono overflow-y-auto max-h-48"
                            style={{
                              background: '#0F1729',
                              border: '1px solid rgba(255,255,255,0.06)',
                              color: 'rgba(255,255,255,0.45)',
                              lineHeight: '1.7',
                              whiteSpace: 'pre-wrap',
                            }}
                          >
                            {resume.slice(0, 600)}{resume.length > 600 ? '\n\n… (truncated preview)' : ''}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-lg px-4 py-3 text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                    {error}
                  </div>
                )}

                {/* Analyze button */}
                <button
                  onClick={analyze}
                  disabled={loading || !resume.trim() || !jobDescription.trim()}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: loading ? 'rgba(14,165,160,0.6)' : '#0EA5A0', color: '#fff' }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Analyzing…
                    </span>
                  ) : 'Analyze My Resume →'}
                </button>

                {/* Trust indicators */}
                <div className="flex items-center justify-center gap-4 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  <span>🔒 Private</span>
                  <span>·</span>
                  <span>⚡ ~5 sec</span>
                  <span>·</span>
                  <span>🤖 Claude AI</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel — results */}
          <div className="flex-1 w-full min-w-0">
            {!result && !loading && (
              <div className="hidden lg:flex flex-col items-center justify-center h-full min-h-[400px] rounded-2xl"
                style={{ border: '1px dashed rgba(255,255,255,0.1)', background: 'rgba(22,32,53,0.4)' }}>
                <div className="text-center space-y-3 p-8">
                  <div className="text-5xl mb-2">📋</div>
                  <p className="text-white/40 text-sm">
                    Fill in the job description and resume,<br />then click Analyze to see your results.
                  </p>
                  <button onClick={loadSamples} className="text-xs mt-2 underline underline-offset-4" style={{ color: 'rgba(14,165,160,0.7)' }}>
                    Try with sample data →
                  </button>
                </div>
              </div>
            )}
            {loading && <SkeletonLoader />}
            {result && !loading && <ResultsPanel result={result} />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t py-6 text-center" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Built with Next.js + Claude AI · Your data is never stored
        </p>
      </footer>
    </div>
  )
}
