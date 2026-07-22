# portfolio-3d

Interactive 3D portfolio for Aditya Thakare — the whole portfolio rendered as a
neural network graph with React Three Fiber. Projects, skill categories, and
skills are glowing nodes connected by edges; clicking a node flies the camera
in and opens a detail panel.

See [CLAUDE.md](CLAUDE.md) for the full architecture spec.

## Stack

Vite · React · TypeScript · React Three Fiber + drei · Zustand · Framer Motion · Tailwind CSS

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```
