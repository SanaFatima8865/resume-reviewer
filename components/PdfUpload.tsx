'use client'

import { useRef, useState, DragEvent } from 'react'

interface PdfUploadProps {
  onExtracted: (text: string, filename: string) => void
  onError: (msg: string) => void
}

export default function PdfUpload({ onExtracted, onError }: PdfUploadProps) {
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      onError('Only PDF files are supported.')
      return
    }

    setLoading(true)
    setUploadedFile(null)

    try {
      const form = new FormData()
      form.append('file', file)

      const res = await fetch('/api/extract-pdf', { method: 'POST', body: form })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'PDF extraction failed.')

      setUploadedFile(file.name)
      onExtracted(data.text, file.name)
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : 'Failed to read PDF.')
    } finally {
      setLoading(false)
    }
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    // Reset so same file can be re-uploaded
    e.target.value = ''
  }

  const clear = () => {
    setUploadedFile(null)
    onExtracted('', '')
  }

  return (
    <div>
      {uploadedFile ? (
        // Uploaded state
        <div
          className="flex items-center justify-between rounded-xl px-4 py-3"
          style={{ background: 'rgba(14,165,160,0.08)', border: '1px solid rgba(14,165,160,0.25)' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm"
              style={{ background: 'rgba(14,165,160,0.15)', color: '#0EA5A0' }}
            >
              📄
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white/90 truncate">{uploadedFile}</p>
              <p className="text-xs" style={{ color: '#0EA5A0' }}>Text extracted successfully</p>
            </div>
          </div>
          <button
            onClick={clear}
            className="text-xs px-3 py-1 rounded-lg flex-shrink-0 transition-all ml-3"
            style={{ color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            Remove
          </button>
        </div>
      ) : (
        // Drop zone
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className="rounded-xl cursor-pointer transition-all select-none"
          style={{
            border: `1.5px dashed ${dragging ? '#0EA5A0' : 'rgba(255,255,255,0.12)'}`,
            background: dragging ? 'rgba(14,165,160,0.06)' : 'rgba(255,255,255,0.02)',
            padding: '18px 16px',
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={onFileChange}
          />
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-1">
              <svg className="animate-spin w-4 h-4" style={{ color: '#0EA5A0' }} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm" style={{ color: '#0EA5A0' }}>Extracting text…</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-center">
              <div className="text-2xl">📎</div>
              <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {dragging ? 'Drop your PDF here' : 'Upload PDF resume'}
              </p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Drag & drop or click · PDF only · Max 10 MB
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
