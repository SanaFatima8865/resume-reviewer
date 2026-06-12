# ResumeCheck — AI Resume Reviewer

An AI-powered resume analysis tool built with **Next.js 14** + **Groq API (free)**. Paste a job description and your resume — or upload a PDF — and get a match score, missing keywords, and AI-rewritten bullet points in seconds.

![ResumeCheck](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js) ![Groq](https://img.shields.io/badge/Groq-free_AI-orange?style=flat-square) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss) ![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## Features

- ✅ **Match score** — 0–100 rating of how well your resume fits the job
- 🔑 **Missing keywords** — color-coded by importance (Critical / Important / Nice to have)
- 💪 **Strengths analysis** — what you're doing well
- ✍️ **AI rewrites** — 3 bullet points from your resume, rewritten with stronger impact
- ⚡ **Quick wins** — instant formatting and structure tips
- 📎 **PDF upload** — drag & drop your resume PDF, no copy-pasting needed
- 🔒 **Private** — your data is never stored

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Frontend | React 18, Tailwind CSS |
| AI | Groq API — Llama 3.3 70B (free tier) |
| PDF parsing | pdf-parse |
| API | Next.js Route Handlers (no separate backend needed) |
| Deploy | Vercel (free) |

---

## Setup & Run Locally

### 1. Clone & install

```bash
git clone https://github.com/SanaFatima8865/resume-reviewer.git
cd resume-reviewer
npm install
```

### 2. Get your free Groq API key

- Go to [console.groq.com](https://console.groq.com) → sign up (free, no credit card)
- Go to **API Keys** → **Create API Key**
- Copy the key (starts with `gsk_...`)

### 3. Add your API key

```bash
cp .env.example .env.local
```

Open `.env.local` and add your key:

```
GROQ_API_KEY=gsk_your_key_here
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
resume-reviewer/
├── app/
│   ├── api/
│   │   ├── analyze/
│   │   │   └── route.ts        ← Groq AI analysis endpoint
│   │   └── extract-pdf/
│   │       └── route.ts        ← PDF text extraction endpoint
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                ← Main two-panel UI
├── components/
│   ├── ResultsPanel.tsx        ← All analysis sections
│   ├── ScoreCircle.tsx         ← Animated SVG score gauge
│   ├── SkeletonLoader.tsx      ← Loading skeleton state
│   └── PdfUpload.tsx           ← Drag & drop PDF upload
├── lib/
│   └── types.ts                ← Shared TypeScript types
├── .env.example
└── README.md
```

---

## Deploy to Vercel (Free)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Under **Environment Variables**, add:
   - Key: `GROQ_API_KEY` → Value: `gsk_your_key_here`
4. Click **Deploy** — live in ~60 seconds at `your-project.vercel.app`

---

## How It Works

1. User pastes a job description + resume (or uploads a PDF)
2. PDF route extracts plain text using `pdf-parse`
3. Analyze route sends both to Groq's Llama 3.3 70B with a structured prompt
4. Groq returns a JSON object — match score, keywords, strengths, rewrites, tips
5. UI renders the animated score gauge and all analysis sections

---

## Extending This App

| Feature | How to add |
|---------|------------|
| Auth + history | NextAuth.js + MongoDB to save past analyses |
| Score tracking | Store results in MongoDB, chart improvement over time |
| Stripe payments | Add usage limits + $9/mo subscription |
| Multi-resume compare | Second resume input, side-by-side diff |
| Chrome extension | Analyze JDs directly from LinkedIn/Indeed |

---

## License

MIT — free to use, fork, and build on.