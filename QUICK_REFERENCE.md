# Quick Reference

One-page cheat sheet. Full instructions with copy-paste examples:
[MAINTENANCE_GUIDE.md](MAINTENANCE_GUIDE.md). Line numbers are
approximate — search for the `const ...` name if they've drifted.

| Want to do this? | Edit this | Where |
|---|---|---|
| Add / edit a project | `src/data/portfolio.ts` | `projectDefs` ~line 70, plus `projectSkillEdges` ~477 and `projectCategoryEdges` ~486 |
| Remove a project | `src/data/portfolio.ts` | delete its block in `projectDefs` + its rows in both edge lists |
| Add a skill | `src/data/portfolio.ts` | its category's `skills:` list inside `categoryDefs` ~142 |
| Link a skill to a project | `src/data/portfolio.ts` | add the skill id to the project's row in `projectSkillEdges` ~477 |
| Add a blog post | `src/data/portfolio.ts` | `blogDefs` ~287 (+ optional `blogSkillEdges` ~495) |
| Add a certification | `src/data/portfolio.ts` | `certDefs` ~348 (+ optional `certSkillEdges` ~502) |
| Edit experience / education | `src/data/portfolio.ts` | `infoDefs` ~420 — also mirror in `src/components/ui/AboutOverlay.tsx` |
| Change name / subtitle on landing | `src/components/ui/HeroOverlay.tsx` | ~line 25 |
| Change landing stat line | `src/components/ui/HeroOverlay.tsx` | ~line 31 ("2+ years · ...") |
| Change bio paragraph | `src/components/ui/AboutOverlay.tsx` | ~line 28 |
| Change Overview page header/stats | `src/components/ui/OverviewPanel.tsx` | ~line 78–90 |
| Change GitHub / LinkedIn / Email | `src/components/ui/HeroOverlay.tsx` ~4, `src/components/ui/ContactOverlay.tsx` ~4, `src/components/ui/OverviewPanel.tsx` ~98 | the `href:` values |
| Replace resume PDF | `public/Aditya_Thakare_Resume.pdf` | overwrite the file, same name |
| Replace profile photo | `public/avatar.jpg` | overwrite the file, same name (JPEG) |
| Change colors | `src/data/portfolio.ts` | `COLORS` ~line 20; per-category `color:` in `categoryDefs` |
| Spread nodes out more | `src/data/portfolio.ts` | `PROJECT_RADIUS` ~60, `CATEGORY_RADIUS` ~133, `BLOG_RADIUS` ~285, `CERT_RADIUS` ~346, `INFO_RADIUS` ~418 |
| Retake OG share image | `public/og-image.png` | screenshot the landing at 1200×630 (guide §11) |
| Change page title / SEO text | `index.html` | `<title>` and `<meta>` tags |

## Commands

```bash
npm run dev        # preview at http://localhost:5173
npm run build      # must pass before pushing
git add -A && git commit -m "update" && git push   # publish (Vercel auto-deploys)
```

**Broke something?** `git checkout -- <file>` undoes uncommitted edits
to that file. Build errors = usually a missing comma or quote at the
line the error names.
