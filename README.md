# Zain Rizvi portfolio

Next.js 16 + TypeScript + [Motion](https://motion.dev). All the text on the site lives in `app/content.ts`.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy on Vercel

1. Push this folder to a new GitHub repo.
2. On vercel.com, click Add New > Project, import the repo, and hit Deploy. No settings to change.
3. Every push to `main` redeploys.

## Common edits

- Change any text, links, jobs, projects, or skills: edit `app/content.ts`.
- Swap the resume: replace `public/resume.pdf` (it's public, so anything on it is too).
- Add a project: add an entry to `projects`. `art` picks its tile drawing (`network`, `ultrasound`, `bars`, `candles`), and `tone` picks its color (`grid` blue, `lab` purple, `heart` red).
- Reword the intro: keep `introHighlights` matching phrases in the new text, or they won't light up.

## How the page moves

- **Hero** (`app/components/Hero.tsx`): scrolling scrubs the scene. Your name flies into the nav, then the line draws a day of grid demand and turns into a heartbeat. The timing is the fractions at the top of the file. The line's shape is in `signal.ts`.
- **Intro** (`Statement.tsx`): lights up word by word.
- **Experience** (`Experience.tsx`): sticky cards that stack. On phones and short screens they fall back to a plain column.
- **Projects** (`Projects.tsx`): tiles expand into a card and shrink back. Drag the card down, press Escape, or click outside to close.
- Everything respects Reduce Motion (a still version), Reduce Transparency, and Increase Contrast.

The `apple-design` skill (from [emilkowalski/skills](https://github.com/emilkowalski/skills)) is installed in `.claude/skills/`, so Claude Code follows its rules when editing this project.
