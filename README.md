# portfolio-3d

Portfolio for Aditya Thakare. Visitors land on a fast, readable page (light or
dark, following their OS) with projects, experience, teaching, skills and
certifications, plus a job-description matcher. The same content can be
explored as an interactive 3D neural network built with React Three Fiber:
projects, skill categories and skills are glowing nodes connected by edges,
and clicking a node flies the camera in and opens a detail panel. The 3D view
lives at `#explore` and is only downloaded when opened.

All content (projects, skills, experience, certifications, blog posts) lives in
`src/data/` (mainly `portfolio.ts`). To update it from your browser, start with
[EDITING_GUIDE.md](EDITING_GUIDE.md); deeper changes are in
[MAINTENANCE_GUIDE.md](MAINTENANCE_GUIDE.md).

## Stack

Vite · React · TypeScript · React Three Fiber + drei · Zustand · Framer Motion · Tailwind CSS

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```
