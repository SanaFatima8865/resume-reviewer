# ResumeCheck — AI Resume Reviewer

An AI-powered resume analysis tool built with **Next.js 14** + **Claude API**. Paste a job description and resume, get back a match score, missing keywords, and AI-rewritten bullet points.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Frontend | React 18, Tailwind CSS |
| AI | Anthropic Claude (claude-sonnet-4-6) |
| API | Next.js Route Handlers (no separate backend) |
| Deploy | Vercel (recommended) |

---

## Setup & Run Locally

### 1. Clone & install

```bash
git clone <your-repo-url>
cd resume-reviewer
npm install
```

### 2. Add your API key

```bash
cp .env.example .env.local
```

Open `.env.local` and replace `your_api_key_here` with your real key from [console.anthropic.com](https://console.anthropic.com).

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the app.

---

## Project Structure

```
resume-reviewer/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts      ← Claude API call lives here
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              ← Main two-panel UI
├── components/
│   ├── ResultsPanel.tsx      ← All analysis sections
│   ├── ScoreCircle.tsx       ← Animated SVG score gauge
│   └── SkeletonLoader.tsx    ← Loading state
├── .env.example
└── README.md
```

---

## Deploy to Vercel (Free)

1. Push your code to GitHub (make sure `.env.local` is in `.gitignore` — it already is)
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. In **Environment Variables**, add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your key from Anthropic console
4. Click **Deploy** — done in ~60 seconds

Your app will be live at `your-project.vercel.app`.

---

## How the AI Analysis Works

The API route (`app/api/analyze/route.ts`) sends both inputs to Claude with a carefully engineered prompt that instructs it to return a structured JSON object with:

- `matchScore` — 0–100 integer
- `scoreLabel` — human label (Weak / Fair / Good / Strong Match)
- `summary` — 2–3 sentence overall assessment
- `missingKeywords` — keywords in JD not found in resume, with importance level
- `strengths` — what the candidate does well
- `rewrites` — 3 bullet points from the resume, rewritten with stronger impact
- `quickWins` — 3 quick formatting/keyword tips

---

## LinkedIn Post Template

> 🚀 Built an AI resume reviewer in one day using Next.js + Claude AI
>
> You paste a job description + your resume → it gives you:
> ✅ A match score (0–100)
> 🔑 Missing keywords with importance levels
> ✍️ AI-rewritten bullet points with stronger impact metrics
>
> Stack: Next.js 14, React, Tailwind, Anthropic Claude API
> API route acts as the backend — no separate Express server needed.
>
> Live demo: [your-link]
> GitHub: [your-repo]
>
> #buildinpublic #nextjs #react #ai #webdev

---

## Extending This App

| Feature | How to add |
|---------|-----------|
| PDF upload | Use `pdf-parse` npm package to extract text from uploaded PDF |
| Auth + history | Add NextAuth.js + MongoDB to save past analyses |
| Score tracking | Store results in MongoDB, show improvement over time |
| Multi-resume compare | Add a second resume input, compare side by side |
| LinkedIn scraping | Use Puppeteer to scrape job postings by URL |
