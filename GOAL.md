# GOAL

Where the UI/UX redesign stands, and what the next person needs to continue it.

Read alongside `docs/design-system.md` (visual direction), `docs/onboarding.md`
(how the codebase works), and `STATUS.md` (chronological log).

---

## The objective

Replace the site's dark-glassmorphism / blue-gradient interface with a
technical, brutalist direction, and replace the content, which is a full
academic year out of date.

Two separate problems, being solved together:

1. **Visual** — the old design is the default AI-website look. The new
   direction takes its rules from the ATOM mark itself: orbits, fixed
   positions, a visible lattice.
2. **Data** — every coordinator holds a role that no longer exists, two clubs
   are gone, one is new, and the achievement stats were never sourced.

The admin CMS is deliberately **out of scope** and keeps its old styling.

---

## Done

### Design system — `docs/design-system.md`, `src/index.css`

Tokens are **additive** under a `LATTICE` block so the admin CMS keeps working
on the old tokens. Do not remove the old ones.

- Near-monochrome: `--ink`, `--ink-raised`, `--chalk`, `--graphite`, `--rule`
- One accent, `--phosphor` `#7DF9E4`, sampled from the logo's iridescent edge.
  It marks *position* only — never a fill, never a gradient, one per viewport.
- `Archivo Black` display, `JetBrains Mono` labels, `Inter` body
- Utility classes: `.display-xl/-l/-m`, `.mono-label`, `.rule-t/-b/-l`,
  `.accent`, `.focus-phosphor`, `.reveal`

### Scroll-pin mechanism — `src/components/scroll/ScrollScene.tsx`

Reusable, ~85 lines, no scroll library. A tall wrapper pins a 100vh stage and
reports progress 0→1 while the page scrolls past it. Ported from the Fludigo
`/about#founders` pattern (`~/fludigo/fludigo-website-new/components/ScrollScene/`).

Two rules that matter:

- Progress is polled with `requestAnimationFrame`, **not** a scroll listener.
- Phase children write `style.opacity` / `style.transform` **directly to the
  DOM via refs**, never through React state. State updates at 60fps would
  re-render the tree every frame.

Maths helpers live in `src/utils/scrollMath.ts`: `clamp`, `lerp`, `easeInOut`,
`prog`, `hexLerp`, `sceneGradient`.

### Core members — `src/components/CoreMembers.tsx`

Six scrubbed scenes, one per portfolio. Timeline per scene:

```
0.00–0.24  headline holds ("Meet the Secretariat")
0.20–0.36  headline lifts out
0.28–0.48  both members arrive from their own side
0.52–0.70  details resolve beneath them and stay
```

- **Lead sits left, joint holder right** — verified across all six portfolios
- Free-standing figures on a scrubbed gradient. No cards, no borders.
- Unfilled seats render "Position open" with a TBA mark, plus placeholder bio
  and LinkedIn, so the composition doesn't shift when real data lands

### Data — `src/constants/coordinators.ts`

Replaced 18 stale coordinators with the 12 current seats across 6 portfolios
(Secretariat, Treasury, Technical Events, Event Management, Media, Spiritual).
Each has a lead and a joint holder. All fields blank, ready to fill.

### Club data — `src/constants/`

- Four active clubs: Hack Hive (`hackhive.ts`), DotDev (`dotdev.ts`), Unbiased (`unbias.ts`), and Qyro (`qyro.ts`).
- Stale clubs (`rnd.ts`, `career-guidance.ts`) removed.
- Exactly 3 educators per club configured with WebP assets.
- Club logos converted to WebP.

### About section — `src/components/About.tsx`

- 4-card grid architecture with metallic chrome branding (`.atom-brand-text`).
- Sharp tech edges (`borderRadius: 0`) and bottom-to-top slide fill transitions matching button velocity.

### Footer — `src/components/Footer.tsx`

- Clean structured layout with verified contact details (`atom@karunya.edu`), navigation, and social links.

### Club detail pages — `src/pages/ClubPage.tsx`

- Dynamic route `/clubs/:slug` supporting all four clubs with educators, objectives, and project links.

### Incidental fix

`TextPressure.tsx` injected a bare `.flex { justify-content: space-between }`
into a global `<style>` block, overriding Tailwind's `.justify-center` on
**every flex container on the page**. Now scoped to `.text-pressure-title`.
Worth knowing this was silently affecting layout site-wide.

---

## In Progress / Next Items

In the order to be tackled:

### 1. Achievements — `components/Achievements.tsx`
Replace the unsourced claim metrics with figures derived from `constants/events.ts`.

### 2. Events Timeline — `components/events/PastEventTimeline.tsx`
Restyle to the lattice. The year-grouping logic (~line 79) is sound — keep it.

### 3. Gallery — `components/PhotoGallerySection.tsx`, `pages/FullPhotoGallery.tsx`
Restyle to match lattice theme. Masonry stays.

### 4. Cleanup & Decomposition
- Delete unused legacy animation widgets (`ScrollFloat.tsx`, `TextPressure.tsx`, `ThreeDBackground.tsx`) once verified.
- Decompose `EventDetailPage.tsx` (1363 LOC) as part of the events rewrite.

---

## Waiting on Lebi

Nothing below can be finished without this.

- **Core member data** — 12 names, photos, bios, LinkedIn URLs. Every seat
  currently reads "Position open".
- **Club data** — descriptions for Qyro, and educators for all four clubs.
- **Photos** — cutout-style portraits work best; the layout places figures
  free-standing on the gradient with no frame.
- **Rotate the admin password.** It was shared in a screenshot during setup.

---

## Decisions already made — don't relitigate

| Question | Decision |
| --- | --- |
| Direction | Technical / brutalist |
| Achievements | Derived from real event data, never claim-style |
| Animations | Remove GSAP / ScrollFloat / ThreeDBackground; **keep Waves on Hero** |
| Club roles | Coordinator + joint + 3 educators |
| Clubs | Scroll sections on homepage; `/clubs/:slug` for detail |
| Socials | Instagram, LinkedIn, GitHub |
| Admin CMS | Untouched |
| Storage | Stays off — Blaze plan only, needed solely for CMS uploads |

---

## Verification

Every change:

```bash
npm run typecheck   # strict, must stay clean
npm test            # 26 tests must keep passing
npm run build
npx vite preview --port 4173
```

Then in the browser. Scroll scenes cannot be verified from the DOM alone —
check them visually with Playwright MCP:

- Screenshot at 1280px **and** 390px
- Scroll to a known scene progress and confirm phases cross-dissolve
- Zero console errors on `/`, `/events`, `/full-gallery`
- Tab through: every interactive element shows the phosphor focus ring
- Emulate `prefers-reduced-motion: reduce` — transforms off, opacity only
- No `/src/assets/` string literals in `dist` (see `FIXES.md` for why)

**Landing a scroll scene at an exact progress:** scrolling once is not enough,
because the wrapper's offset shifts as the page moves. Loop 5–6 times,
recomputing `getBoundingClientRect().top + window.scrollY` each pass, until
progress converges.

---

## Live

- Site: https://atom-2026.web.app
- Repo: https://github.com/Association-of-Technology-Oriented-Mind/ATOM
- Firebase project: `atom-2026`, Firestore in `asia-south1`

The redesign is **not deployed** — it lives on `master` but the last deploy
predates it. Deploy with `npm run build && npx firebase deploy --only hosting`
once the sections are complete.
