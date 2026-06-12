'use client'

export default function SkeletonLoader() {
  return (
    <div className="space-y-4">
      {/* Score skeleton */}
      <div className="rounded-xl p-6 flex items-center gap-6" style={{ background: '#162035', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="skeleton w-[140px] h-[140px] rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="skeleton h-3 w-24 rounded" />
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-4/5 rounded" />
          <div className="skeleton h-4 w-3/5 rounded" />
        </div>
      </div>

      {/* Keywords skeleton */}
      <div className="rounded-xl p-5 space-y-3" style={{ background: '#162035', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="skeleton h-3 w-36 rounded" />
        <div className="flex flex-wrap gap-2">
          {[80, 100, 72, 88, 64, 96].map((w, i) => (
            <div key={i} className="skeleton h-7 rounded-full" style={{ width: w }} />
          ))}
        </div>
      </div>

      {/* Strengths skeleton */}
      <div className="rounded-xl p-5 space-y-3" style={{ background: '#162035', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="skeleton h-3 w-28 rounded" />
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-3">
            <div className="skeleton w-5 h-5 rounded-full flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1.5">
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Analyzing label */}
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2 text-sm" style={{ color: '#0EA5A0' }}>
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Analyzing your resume…
        </div>
      </div>
    </div>
  )
}
