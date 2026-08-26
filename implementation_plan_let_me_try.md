# Visual and Structural Refactoring Plan

This implementation plan details the steps to restructure the public ATOM website, implementing the user's specific guidelines regarding the Hero section, Navbar visibility, Events timeline, Club detail pages, and Core Members scroll path.

---

## User Review Required

> [!IMPORTANT]
> **Key Decisions & Adaptations:**
> * **Hero Accents:** The Hero section from the `leme` branch uses `#ff5c00` orange accents. We will adapt this styling to use `--phosphor` cyan (`#7DF9E4`) and a technical, flat-border button style to match our strict brutalist design system (no rounded pill borders).
> * **Navbar Scroll Reveal:** The Navbar will be hidden during the initial Hero presentation. Once the viewport scrolls past the Hero page (`scrollY > window.innerHeight`), the Navbar will slide/fade into view at the top.
> * **Core Members Relocation:** The scroll-pinned core members animation will move from the homepage to a dedicated route `/core`. A teaser block will link to `/core` from the main page.

---

## Proposed Changes

### 1. Hero Page Refactor
#### [MODIFY] [Hero.tsx](file:///home/lebi/ATOM-org/Atom_Standalone/src/components/Hero.tsx)
* **Goal:** Port the typographic layout and 2D canvas particle field from the `leme` branch.
* **Details:**
  * Implement the `ParticleCanvas` and `SplitText` helper components inline or as local assets.
  * Update the headline copy to: *"Where Technical Minds Build What Comes Next."*.
  * Adapt styling: Swap orange highlights with `--phosphor` cyan, keep a sharp brutalist aesthetic with zero-radius corners on buttons, and use the display font scale.

---

### 2. Scroll-Triggered Navigation
#### [MODIFY] [Navigation.tsx](file:///home/lebi/ATOM-org/Atom_Standalone/src/components/Navigation.tsx)
* **Goal:** Add visibility logic to show the navbar only after the Hero page.
* **Details:**
  * Track `scrollY` to set a threshold of `window.innerHeight` (100vh).
  * If `scrollY < 100vh`, hide the navbar (opacity 0, translate-y -100%).
  * If `scrollY >= 100vh`, animate the navbar into view (opacity 1, translate-y 0) and stick it.
  * Adjust link references: Home, Events, Gallery, Team (`/core`), and Clubs.

---

### 3. Events Page Timeline
#### [MODIFY] [Event.tsx](file:///home/lebi/ATOM-org/Atom_Standalone/src/pages/Event.tsx)
* **Goal:** Use the `PastEventTimeline` component instead of the standard grid.
* **Details:**
  * Import [PastEventTimeline.tsx](file:///home/lebi/ATOM-org/Atom_Standalone/src/components/events/PastEventTimeline.tsx).
  * Wrap the timeline inside the page, feeding it the search-filtered and category-filtered events.
  * Retain search/filter widgets at the top for improved UX.

---

### 4. Homepage Layout & Clubs Page
#### [MODIFY] [Index.tsx](file:///home/lebi/ATOM-org/Atom_Standalone/src/pages/Index.tsx)
* **Goal:** Change section ordering: Hero → About → Achievements → Events Section → Clubs Section → Core Teaser → Gallery → Footer.
* **Details:**
  * Remove `CoreMembers` from the main loop.
  * Add a new brief "Core Members Teaser" section with a button: *"Meet the Core Members"* linking to `/core`.
  * Remove `JoinCTA` (Contact Form) entirely.

#### [MODIFY] [ClubPage.tsx](file:///home/lebi/ATOM-org/Atom_Standalone/src/pages/ClubPage.tsx)
* **Goal:** Build the dynamic club detail views.
* **Details:**
  * Replace the "Coming Soon" placeholder.
  * Read the slug parameter (`hackhive`, `dotdev`, `unbias`, `qyro`).
  * Load details from matching constants (`hackhiveClub`, `dotdevClub`, `unbiasClub`, `qyroClub`).
  * Display a dedicated header, objectives, list of educators (role and bio), GitHub project repositories, and a photo carousel.

---

### 5. Dedicated Core Members Page
#### [NEW] [CorePage.tsx](file:///home/lebi/ATOM-org/Atom_Standalone/src/pages/CorePage.tsx)
* **Goal:** Create a standalone page for core member portfolios.
* **Details:**
  * Render a wrapper page with the sticky navigation and full-height scroll snapping.
  * Mount [CoreMembers.tsx](file:///home/lebi/ATOM-org/Atom_Standalone/src/components/CoreMembers.tsx) directly inside it.

#### [MODIFY] [App.tsx](file:///home/lebi/ATOM-org/Atom_Standalone/src/App.tsx)
* **Goal:** Add `/core` lazy route.

---

### 6. Cleanup
#### [DELETE] [JoinCTA.tsx](file:///home/lebi/ATOM-org/Atom_Standalone/src/components/JoinCTA.tsx)
* **Goal:** Remove the contact section.

---

## Verification Plan

### Automated Tests
* Run `npm run typecheck` to ensure all TypeScript imports and types align.
* Run `npm run build` to confirm production assets bundle.

### Manual Verification
* Scroll from Hero down to verify the navbar triggers visibility exactly at 100vh.
* Verify `/events` displays events correctly grouped by year with sticky labels.
* Verify `/clubs/hackhive` and `/clubs/dotdev` render projects, educators, and gallery correctly.
* Verify clicking "Meet the Core Members" navigates to `/core` and loads scroll-pin timelines correctly.
