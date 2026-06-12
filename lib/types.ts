export interface Keyword {
  keyword: string
  importance: 'Critical' | 'Important' | 'Nice to have'
  context: string
}

export interface Strength {
  point: string
  detail: string
}

export interface Rewrite {
  original: string
  improved: string
  reason: string
}

export interface AnalysisResult {
  matchScore: number
  scoreLabel: string
  summary: string
  missingKeywords: Keyword[]
  strengths: Strength[]
  rewrites: Rewrite[]
  quickWins: string[]
}