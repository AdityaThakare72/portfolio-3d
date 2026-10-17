# Maintenance Guide

How to update this portfolio without knowing React or Three.js.

Almost everything you'll ever change lives in **one file**:
`src/data/portfolio.ts`. The 3D graph, the detail panels, and the
Overview page are all generated from it — edit the data once and every
view updates automatically.

**Golden rules:**

1. After any change, run `npm run dev` and check http://localhost:5173
   in your browser before pushing.
2. Watch the commas. Every `{ ... }` block in a list ends with `},` —
   copy an existing block and you can't go wrong.
3. Text goes inside quotes: `'like this'`. If your text contains an
   apostrophe, use double quotes: `"Word2Vec's architecture"`.
4. IDs (like `'legal-agent'`) are lowercase-with-dashes, must be unique,
   and are how nodes connect to each other. Never reuse one.

---

## 1. Adding a new project

**File:** `src/data/portfolio.ts` — find `const projectDefs` (around
line 77). It's a list of 7 project blocks, in display order. Copy one,
paste it before the closing `]`, and edit:

```ts
  {
    id: 'my-new-project',                      // unique, lowercase-with-dashes
    label: 'My New Project',                   // name shown in the graph
    description:
      'One or two sentences about what it does and how it was built.',
    links: {
      live: 'https://my-demo-url.app',         // delete this line if no demo
      source: 'https://github.com/AdityaThakare72/My-Repo',
    },
    tags: ['RAG', 'FastAPI', 'Docker'],        // shown as pills in the panel
  },
```

For a client project with no public links, delete the whole `links: { ... },`
block — the panel will automatically show a "Client Project" badge instead
of buttons.

**Work in progress?** Add `status: 'in-progress',` to the block. The panel
and Overview then show an "In progress" badge. Delete that one line when
the project is done.

**Connect it to skills.** Find `const projectSkillEdges` (around line 534).
Each row is `['project-id', ['skill-id', 'skill-id', ...]]`. Add a row:

```ts
  ['my-new-project', ['rag', 'fastapi', 'docker']],
```

The skill IDs must already exist (see section 3 for the full list of
skill IDs — or search the file for the skill's label).

**Connect it to categories.** Find `const projectCategoryEdges` (around
line 546) and add:

```ts
  ['my-new-project', ['cat-genai', 'cat-backend']],
```

Category IDs: `cat-languages`, `cat-genai`, `cat-vectorstores`,
`cat-mldl`, `cat-backend`, `cat-mlops`, `cat-dataviz`.

**Layout:** positions are computed automatically — projects spread
evenly around a ring and the vertical spread stays centered, so another
project just works. If the graph ever
feels crowded, increase `const PROJECT_RADIUS = 10` (line ~66) to `11`
or `12`.

Done. The project appears in the graph, the detail panel, and the
Overview page.

---

## 2. Removing a project

Three deletions, all in `src/data/portfolio.ts`:

1. Delete its whole `{ ... },` block from `projectDefs`.
2. Delete its row from `projectSkillEdges`.
3. Delete its row from `projectCategoryEdges`.

Search the file for the project's id (e.g. `ceo-dashboard`) to make
sure nothing is left. If anything still references a deleted id, that
edge is silently skipped — but keep the file clean anyway.

---

## 3. Adding a new skill

**File:** `src/data/portfolio.ts` — find `const categoryDefs` (around
line 183). Each category has a `skills:` list. Add yours to the right
category:

Before:

```ts
    skills: [
      { id: 'fastapi', label: 'FastAPI' },
      { id: 'rest-apis', label: 'REST APIs' },
      { id: 'streamlit', label: 'Streamlit' },
      { id: 'pydantic', label: 'Pydantic' },
    ],
```

After (added Flask):

```ts
    skills: [
      { id: 'fastapi', label: 'FastAPI' },
      { id: 'rest-apis', label: 'REST APIs' },
      { id: 'streamlit', label: 'Streamlit' },
      { id: 'pydantic', label: 'Pydantic' },
      { id: 'flask', label: 'Flask' },
    ],
```

That's it — the category→skill edge, the position (clustered around its
category), the color (inherited from the category), and the Overview
listing all happen automatically.

**If a project uses the new skill,** add its id to that project's row in
`projectSkillEdges`:

```ts
  ['legal-agent', ['rag', 'langchain', 'chromadb', 'gemini-api', 'streamlit', 'nginx', 'flask']],
```

---

## 4. Adding a new blog post

**File:** `src/data/portfolio.ts` — find `const blogDefs` (around line
327). Copy a block, paste before the closing `]`:

```ts
  {
    id: 'blog-my-topic',
    label: 'Short Title For The Graph',
    description:
      'One sentence describing what the article covers.',
    links: {
      live: 'https://medium.com/@adityathakare72/your-article-url-here',
    },
    tags: ['LLM', 'RAG'],
  },
```

Optionally connect it to a related skill in `const blogSkillEdges`
(around line 558):

```ts
  { source: 'blog-my-topic', target: 'llm' },
```

---

## 5. Adding a new certification

**File:** `src/data/portfolio.ts` — find `const certDefs` (around line
388). All certification data lives in that list. Copy a block:

```ts
  {
    id: 'cert-aws-ml',
    label: 'AWS ML Specialty',                  // short — shown in the graph
    description: 'AWS Certified Machine Learning — Amazon · Jan 2027',
    credentialId: 'ABC123',                     // delete if there is none
    links: {
      live: 'https://your-verification-url',    // delete links if there is none
    },
  },
```

The `description` follows the pattern `Course Name — Issuer · Month Year`
and is what shows in the panel and Overview. `credentialId` shows under
it, and `links.live` becomes the "View" button. Optionally connect it to a
skill in `const certSkillEdges` (around line 565):

```ts
  { source: 'cert-aws-ml', target: 'sklearn' },
```

---

## 6. Updating experience / education

**File:** `src/data/portfolio.ts` — find `const infoDefs` (around line
471). Three blocks: `experience`, `edu-cdac`, `edu-sppu`. Edit the
`description` text; the experience block also has a `highlights` list,
one string per bullet:

```ts
  {
    id: 'experience',
    label: 'MITU Skillologies',
    description: 'Data Scientist · Pune · Sep 2023 – Present',
    highlights: [
      'One bullet point.',
      'Another bullet point.',
    ],
    size: 0.7,
  },
```

Note: the **About modal** has its own copy of experience/education —
update it too: `src/components/ui/AboutOverlay.tsx`, the lines under
"Experience" and "Education" (plain text, safe to edit).

---

## 7. Changing the bio / summary / stat line

The intro text appears in a few places (each is plain text — edit
between the `>` and `<` or inside the quotes):

| What | File | What to look for |
|---|---|---|
| Big name + subtitle on landing | `src/components/ui/HeroOverlay.tsx` | `Aditya Thakare` / `Data Scientist \| GenAI &amp; Agentic AI \| MLOps` |
| Stat line on landing | `src/components/ui/HeroOverlay.tsx` | `3+ years · 4 deployed AI systems · ...` |
| Bio paragraph in About modal | `src/components/ui/AboutOverlay.tsx` | `Data Scientist with 3+ years of experience...` |
| Stat line + header in Overview page | `src/components/ui/OverviewPanel.tsx` | `3+ years experience · 4 deployed GenAI/ML systems · ...` |
| Page title, description, social share tags | `index.html` | `<title>`, `og:*`, `twitter:*` (site URL is `https://adityathakare.app`) |

---

## 8. Changing social links

Two places define GitHub / LinkedIn / Email:

**Landing buttons:** `src/components/ui/HeroOverlay.tsx`, top of file:

```ts
const socials = [
  { label: 'GitHub', href: 'https://github.com/AdityaThakare72' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aditya-thakare72/' },
  { label: 'Email', href: 'mailto:adityathakare72@gmail.com' },
]
```

**Contact modal:** `src/components/ui/ContactOverlay.tsx`, the
`const items = [` list at the top — same idea, edit the `href` and
`label` values.

The Overview page (`src/components/ui/OverviewPanel.tsx`) also has
GitHub/LinkedIn/Email buttons in its header — search for `github.com`
in that file and update the same way.

---

## 9. Updating the resume PDF

Replace the file, keep the name:

```bash
cp /path/to/new-resume.pdf public/Aditya_Thakare_Resume.pdf
```

Nothing else to change — every "Resume" button points at that filename.
(If you rename the file, search the whole `src/` folder for
`Aditya_Thakare_Resume` and update each match.)

Same idea for the profile photo: replace `public/avatar.jpg` with a new
JPEG of the same name.

---

## 10. Changing colors / accent

**File:** `src/data/portfolio.ts`, top of the file:

```ts
export const COLORS = {
  background: '#030712',   // page + scene background
  project: '#38bdf8',      // project node color (sky blue = accent)
  category: '#a78bfa',     // default category color
  skill: '#94a3b8',        // skill node gray
  edge: 'rgba(148,163,184,0.1)',
  text: '#f1f5f9',
  accent: '#38bdf8',
}
```

Individual category colors are set per-category in `categoryDefs`
(`color: '#fbbf24'` etc.). Blog nodes are `'#f472b6'` (pink), certs
`'#34d399'` (emerald), info `'#fbbf24'` (amber) — search for those hex
codes in the blog/cert/info sections to change them.

Heads-up: the 2D buttons and pills use Tailwind classes like `bg-sky-400`
spread across `src/components/ui/` — changing the whole site's accent
means touching those too. Keep the accent sky-blue unless you're ready
for a bigger find-and-replace.

---

## 11. Updating the OG image (social share card)

After meaningful content changes, retake the screenshot so link
previews stay current:

1. `npm run dev`
2. Open http://localhost:5173 in Chrome.
3. Open DevTools (F12) → toggle device toolbar (Ctrl+Shift+M) → set
   "Responsive" size to exactly **1200 × 630**.
4. Wait for the graph to settle, then DevTools menu (⋮) → "Capture
   screenshot".
5. Save/rename it to `public/og-image.png` (overwrite the old one).
6. Commit and push. After deploying, verify with https://www.opengraph.xyz
   by pasting your site URL.

---

## 12. Common commands

```bash
cd /home/aditya/portfolio-3d

npm run dev        # local dev server → http://localhost:5173
npm run build      # production build (must pass before pushing)
npm run preview    # test the production build locally
npm run lint       # code style check

# save + publish (Vercel redeploys automatically on push)
git add -A
git commit -m "Update portfolio content"
git push
```

If `npm run build` fails after an edit, the error message names the file
and line — it's almost always a missing comma, quote, or bracket near
whatever you just changed. Undo with `git checkout -- <file>` if stuck.

---

## Resume Updates

Source of truth: `~/GEN_AI_GOOGLE_NEW/Resume_and_job/resumes/Aditya_Thakare_Resume_Final.html`

Workflow:

1. Edit the source HTML above
2. Export to PDF via browser print (Ctrl+P → Save as PDF, A4, no margins)
3. Copy PDF to this repo: `cp ~/path/to/exported.pdf public/Aditya_Thakare_Resume.pdf`
4. Commit and push — Vercel auto-deploys

Do NOT keep a copy of the HTML in this repo (or anywhere else). One
source, one truth. The old duplicate at
`~/Personal_Website/context/Aditya_Thakare_Resume_Final.html` was
deleted on 2026-07-30 after it silently drifted behind the master.
