'use client'

import { useEffect, useState } from 'react'

interface ScoreCircleProps {
  score: number
  label: string
}

function getColor(score: number) {
  if (score >= 75) return '#0EA5A0'   // teal — strong
  if (score >= 55) return '#F59E0B'   // amber — fair/good
  return '#EF4444'                     // red — weak
}

function getTrackColor(score: number) {
  if (score >= 75) return 'rgba(14,165,160,0.15)'
  if (score >= 55) return 'rgba(245,158,11,0.15)'
  return 'rgba(239,68,68,0.15)'
}

export default function ScoreCircle({ score, label }: ScoreCircleProps) {
  const [displayed, setDisplayed] = useState(0)
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  useEffect(() => {
    // Count up animation
    const duration = 1200
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(eased * score))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [score])

  const color = getColor(score)
  const trackColor = getTrackColor(score)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width="140" height="140" viewBox="0 0 140 140">
          {/* Background track */}
          <circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth="10"
          />
          {/* Animated arc */}
          <circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            transform="rotate(-90 70 70)"
            style={{
              '--target-offset': `${offset}`,
              transition: `stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)`,
              strokeDashoffset: offset,
            } as React.CSSProperties}
          />
          {/* Score number */}
          <text
            x="70" y="65"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={color}
            fontSize="28"
            fontWeight="700"
            fontFamily="Inter, sans-serif"
          >
            {displayed}
          </text>
          <text
            x="70" y="87"
            textAnchor="middle"
            fill="rgba(255,255,255,0.4)"
            fontSize="11"
            fontFamily="Inter, sans-serif"
          >
            / 100
          </text>
        </svg>
      </div>
      <span
        className="text-sm font-semibold tracking-wide px-3 py-1 rounded-full"
        style={{ color, background: trackColor }}
      >
        {label}
      </span>
    </div>
  )
}
