# MONA_SYS — Hackable Terminal Resume

TRON-inspired interactive resume built with **Next.js App Router + TypeScript + Tailwind CSS**. Visitors can explore a virtual filesystem, unlock security layers, or use the recruiter fast-path command `resume`.

## Features

- TRON neon terminal aesthetic with animated CSS grid background.
- Virtual filesystem with files, hidden directories, locking, and unlocking.
- Command parser with quoted args, case-insensitive commands, history (up/down), and tab autocomplete (commands + paths).
- Four progression layers: **Identity**, **Skills**, **Projects**, **Vision**.
- Required commands implemented: `help`, `clear`, `scan`, `connect`, `decrypt`, `unlock`, `ls`, `cd`, `pwd`, `cat`, `open`, `projects`, `experience`, `skills`, `timeline`, `contact`, `download`, `print`, `theme`, `glow`, `grid`, `matrix`, `fortune`, `coffee`, `sudo hire mona`, and `resume`.
- Achievement overlay when fully unlocked with shareable URL payload (`/?ach=...`).
- `/print` clean resume page.
- `/api/resume` JSON endpoint.
- `robots.txt` and `sitemap.xml` via Next metadata routes.
- Persistent local state: boot sequence viewed, theme/glow/grid/matrix preferences, unlocked layers, cwd, completion times.
- Mobile-friendly terminal layout and reduced-motion support.

## Local setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands quick start

- `help` — full command list
- `hint` — progression hints
- `resume` — instant recruiter fast path (unlock all layers)

Puzzle path:
1. `connect mona`
2. `decrypt skills`
3. `open /home/guest/projects`
4. `unlock future`

## Edit resume content (single source of truth)

All resume data is stored in:

- `src/content/resume.json`

Update this file to change basics, links, experience, projects, skills, and contact. Terminal, API, and print page all render from this source.

## Replace CV download file

Currently included:

- `public/Monalisa_Whalin_CV_PLACEHOLDER.txt`

To use a real file:

1. Add `public/Monalisa_Whalin_CV.pdf`
2. Optionally remove the placeholder.
3. `download` command will open the file path.

## Share links (URL payload)

When achievement is unlocked, the app creates a link like:

`/?ach=<payload>`

Payload contains completion stats in compact base64url with a lightweight checksum for integrity (fun/security-lite, no backend required).

## Customization

- Theme colors and neon tokens: `src/app/globals.css`
- Terminal engine: `src/terminal/*`
- UI components: `src/components/*`

User controls via system menu or commands:

- `theme cyan|magenta|amber`
- `glow 0-100`
- `grid on|off` and `grid 0-100`
- `matrix`

## Deploy to Vercel

### A) Git import

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Vercel, choose **Add New Project**.
3. Import the repo.
4. Accept defaults and deploy.

No custom server or extra config required.

### B) Vercel CLI

```bash
npm i -g vercel
vercel
vercel --prod
```

