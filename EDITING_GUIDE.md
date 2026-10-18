# Editing Guide (start here)

How to update your portfolio **from your browser**, with nothing installed.
You only need your GitHub account. For deeper changes, see
[MAINTENANCE_GUIDE.md](MAINTENANCE_GUIDE.md).

---

## How the site works, in one minute

- Your website's files live on GitHub, in the `main` branch.
- **Whenever `main` changes, Vercel rebuilds the site automatically.**
  About 2 minutes later, https://adityathakare.app shows the change.
- Almost all the text (projects, skills, certificates, experience) lives in
  one file: **`src/data/portfolio.ts`**. Workshops live in
  **`src/data/workshops.ts`**.

---

## The safe way to make any change (do this every time)

This gives you a **preview website** to check before anything goes live.

1. Open https://github.com/AdityaThakare72/portfolio-3d
2. Click into the folders to reach the file, e.g. `src` → `data` →
   `portfolio.ts`.
3. Click the **pencil icon** (✏️ "Edit this file") at the top right of the
   file.
4. Use **Ctrl + F** (Mac: Cmd + F) to find the part you want to change, and
   edit it. Follow the recipes below.
5. Click the green **Commit changes…** button (top right).
6. In the box that opens:
   - Write a short message, e.g. `agent harness -> live link`.
   - Choose **"Create a new branch for this commit and start a pull
     request"**.
   - Click **Propose changes**.
7. On the next page, click **Create pull request**.
8. Wait 1–2 minutes. A **Vercel bot comment** appears on the pull request
   with a **Preview** link. Open it and check your change.
   - A **red ✗** next to Vercel means the file has a typo (usually a
     missing comma or quote). **Don't merge.** Open the pull request's
     **Files changed** tab, compare with the recipe, fix it with the
     pencil icon, or ask for help.
9. If the preview looks right: on the pull request page, check it says
   *"wants to merge … into **main**"*, then click **Merge pull request**
   → **Confirm merge**.
10. About 2 minutes later, open https://adityathakare.app and press
    **Ctrl + Shift + R** (Mac: Cmd + Shift + R) to see the new version.

> **Golden rules when editing**
> - Text goes inside quotes: `'like this'`. If the text has an apostrophe,
>   use double quotes: `"Critic's score"`.
> - Every line inside a `{ … }` block ends with a comma `,`.
> - Copy an existing block and change its values — don't type the
>   structure from scratch.

---

## What the numbers on the site mean

The tile **"4 deployed AI systems · +3 more projects on GitHub"** counts
itself from the projects in `portfolio.ts`, so you never edit the number:

| Your project… | Counted as |
|---|---|
| has a `live:` link (a demo anyone can open) | **deployed** |
| has no links at all (a client project running in production, like the CEO dashboard) | **deployed** |
| only has a `source:` GitHub link | one of the **"+N more projects on GitHub"** |
| has `status: 'in-progress',` | never counted as deployed |

Today that's 4 deployed (Research Agent, Legal Agent, Equipment
Maintenance, CEO Dashboard) and 3 on GitHub (react-from-scratch,
typed-decision-models, agent-harness-demo).

**What counts as an "AI project" here?** Only the projects listed on your
site. Client work can be listed (with no links) and counts as deployed.
A small personal project counts once you add it to the list. An
**open-source contribution** (e.g. your code merged into someone else's
repository) is a different thing. It would get its own section rather
than inflate the project count. Ask for that section to be added when
you have one.

---

## Recipes

### A project went live (it now has a demo link)

File: `src/data/portfolio.ts`. Press Ctrl + F and search for the
project's name, e.g. `agent-harness-demo`. Inside its `links: { … }`,
add a `live:` line with the demo address.

Before:

```ts
    links: {
      source: 'https://github.com/AdityaThakare72/agent-harness-demo',
    },
```

After:

```ts
    links: {
      live: 'https://your-demo-address.streamlit.app/',
      source: 'https://github.com/AdityaThakare72/agent-harness-demo',
    },
```

That's all. The site then shows a **Live demo** button for it, and
"4 deployed AI systems" becomes **5** everywhere. If the demo is on
Streamlit, the "may take ~30s to wake up" note appears by itself.

### An in-progress project is finished

Search for the project's name and **delete this one line**:

```ts
    status: 'in-progress',
```

The "In progress" badge disappears.

### Add a demo video to a project

1. Keep the video short (20–40 seconds) and small (under ~10 MB). An MP4
   from any screen recorder is fine. Name it simply, e.g.
   `research-agent.mp4`.
2. On GitHub, open the `public` folder, click **Add file → Upload
   files**, drop the video in, and commit it the same safe way (steps 5–9
   above).
3. In `portfolio.ts`, find the project and add a `media:` line next to
   its `tags:` line:

```ts
    tags: ['LangGraph', 'LangChain', 'Gemini API', 'Tavily', 'Streamlit', 'Docker'],
    media: '/research-agent.mp4',
```

The video then plays at the top of that project's card and 3D panel.
(A `.gif` works the same way.)

### Add a new project

Copy a whole project block in `portfolio.ts`, from its `{` to its `},`,
paste it just before the `]` that closes the project list, and change
the values. Details, including the optional Problem / Key decision /
Outcome write-up, are in section 1 of
[MAINTENANCE_GUIDE.md](MAINTENANCE_GUIDE.md).

### Add a workshop / FDP

File: `src/data/workshops.ts`. Add one line at the bottom of the list,
copying the line above it:

```ts
  { year: 2026, dates: '12 Jan – 14 Jan', topic: 'Generative AI', venue: 'COEP, Pune' },
```

The "60+ workshops at 30+ institutions" numbers update by themselves.

### Change the "Open to … roles" line

File: `src/data/portfolio.ts`, near the top: `export const AVAILABILITY`.
Edit the text between the quotes.

### Replace the resume

Open the `public` folder, click **Add file → Upload files**, and upload
your new PDF named exactly **`Aditya_Thakare_Resume.pdf`**. It replaces
the old one, and every Resume button keeps working.

---

## If something goes wrong

- **The preview shows a red ✗ / "Error":** don't merge. The change
  almost always has a missing comma, quote or bracket near what you
  edited. Compare it with the recipe above.
- **Already merged and the site broke:** open the merged pull request on
  GitHub and click **Revert**. That creates a new pull request that undoes
  it. Merge that one, and the site goes back to how it was.
