'use client'

import { useState } from 'react'
import ScoreCircle from './ScoreCircle'

interface Keyword {
  keyword: string
  importance: 'Critical' | 'Important' | 'Nice to have'
  context: string
}

interface Strength {
  point: string
  detail: string
}

interface Rewrite {
  original: string
  improved: string
  reason: string
}

interface AnalysisResult {
  matchScore: number
  scoreLabel: string
  summary: string
  missingKeywords: Keyword[]
  strengths: Strength[]
  rewrites: Rewrite[]
  quickWins: string[]
}

interface ResultsPanelProps {
  result: AnalysisResult
}

const importanceStyle = {
  'Critical':      { bg: 'rgba(239,68,68,0.12)',  text: '#F87171', border: 'rgba(239,68,68,0.25)' },
  'Important':     { bg: 'rgba(245,158,11,0.12)', text: '#FBB040', border: 'rgba(245,158,11,0.25)' },
  'Nice to have':  { bg: 'rgba(14,165,160,0.1)',  text: '#2EC4BF', border: 'rgba(14,165,160,0.2)' },
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <button
      onClick={copy}
      className="text-xs px-2 py-1 rounded transition-all"
      style={{ background: copied ? 'rgba(14,165,160,0.2)' : 'rgba(255,255,255,0.06)', color: copied ? '#0EA5A0' : 'rgba(255,255,255,0.5)' }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

function Section({ title, icon, children, delay }: { title: string; icon: string; children: React.ReactNode; delay: number }) {
  return (
    <div className={`fade-up fade-up-${delay} rounded-xl p-5`} style={{ background: '#162035', border: '1px solid rgba(255,255,255,0.07)' }}>
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  )
}

export default function ResultsPanel({ result }: ResultsPanelProps) {
  const [expandedRewrite, setExpandedRewrite] = useState<number | null>(0)

  return (
    <div className="space-y-4">
      {/* Score header */}
      <div className={`fade-up fade-up-1 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6`}
        style={{ background: 'linear-gradient(135deg, #162035 0%, #1E2D47 100%)', border: '1px solid rgba(14,165,160,0.2)' }}>
        <ScoreCircle score={result.matchScore} label={result.scoreLabel} />
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm font-medium text-white/50 uppercase tracking-widest mb-2">Match Analysis</p>
          <p className="text-white/85 leading-relaxed text-sm">{result.summary}</p>
        </div>
      </div>

      {/* Missing Keywords */}
      <Section title="Missing Keywords" icon="🔑" delay={2}>
        <div className="flex flex-wrap gap-2">
          {result.missingKeywords.map((kw, i) => {
            const style = importanceStyle[kw.importance]
            return (
              <div key={i} title={kw.context}
                className="keyword-pill cursor-default"
                style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}
              >
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: style.text }} />
                {kw.keyword}
                <span className="opacity-60 text-[10px]">{kw.importance === 'Critical' ? '!' : ''}</span>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-white/30 mt-3">Hover any keyword for context. Red = Critical, Amber = Important, Teal = Nice to have.</p>
      </Section>

      {/* Strengths */}
      <Section title="Your Strengths" icon="💪" delay={2}>
        <ul className="space-y-3">
          {result.strengths.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                style={{ background: 'rgba(14,165,160,0.15)', color: '#0EA5A0' }}>
                ✓
              </span>
              <div>
                <p className="text-sm font-medium text-white/90">{s.point}</p>
                <p className="text-xs text-white/45 mt-0.5">{s.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Rewrites */}
      <Section title="Suggested Rewrites" icon="✍️" delay={3}>
        <div className="space-y-3">
          {result.rewrites.map((r, i) => (
            <div key={i}
              className="rounded-lg overflow-hidden cursor-pointer"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}
              onClick={() => setExpandedRewrite(expandedRewrite === i ? null : i)}
            >
              <div className="flex items-center justify-between p-3"
                style={{ background: expandedRewrite === i ? 'rgba(14,165,160,0.08)' : 'rgba(255,255,255,0.03)' }}>
                <p className="text-xs text-white/50 truncate flex-1 mr-3 font-mono">{r.original}</p>
                <span className="text-white/30 text-xs flex-shrink-0">{expandedRewrite === i ? '▲' : '▼'}</span>
              </div>
              {expandedRewrite === i && (
                <div className="p-3 space-y-3" style={{ background: '#0F1729' }}>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Original</p>
                    <p className="text-xs text-white/50 font-mono leading-relaxed">{r.original}</p>
                  </div>
                  <div className="h-px" style={{ background: 'rgba(14,165,160,0.2)' }} />
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[10px] uppercase tracking-widest" style={{ color: '#0EA5A0' }}>Improved</p>
                      <CopyButton text={r.improved} />
                    </div>
                    <p className="text-xs text-white/80 font-mono leading-relaxed">{r.improved}</p>
                  </div>
                  <div className="rounded-md p-2 text-xs" style={{ background: 'rgba(245,158,11,0.08)', color: '#FBB040' }}>
                    💡 {r.reason}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Quick Wins */}
      <Section title="Quick Wins" icon="⚡" delay={4}>
        <ul className="space-y-2">
          {result.quickWins.map((win, i) => (
            <li key={i} className="flex gap-3 text-sm text-white/70">
              <span className="text-xs font-bold mt-0.5 flex-shrink-0" style={{ color: '#0EA5A0' }}>0{i + 1}</span>
              {win}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}
