# Global UI/UX Consistency Implementation Plan

Review the plan to address inconsistencies across the site's layout, fonts, and interaction patterns, standardizing them under the brutalist/technical "Lattice" design system.

## Proposed Changes

### 1. Hero Section Redesign
* **File:** [Hero.tsx](file:///home/lebi/ATOM-org/Atom_Standalone/src/components/Hero.tsx)
* **Goal:** Remove the rotating logo arrangement ("AT" logo "M") and replace it with a stunning, high-impact brutalist typographic landing.
* **Layout:** Use large, tracked-out `Archivo Black` headers with `JetBrains Mono` coordinates, labels, and structured borders. Keep the active canvas background but style all text elements to look precise and technical.

---

### 2. Events Page & Timeline Consistency
* **Files:** [PastEventTimeline.tsx](file:///home/lebi/ATOM-org/Atom_Standalone/src/components/events/PastEventTimeline.tsx) / [Events.tsx](file:///home/lebi/ATOM-org/Atom_Standalone/src/pages/Event.tsx)
* **Goal:** Standardize the Events timeline to use the monochrome `--rule` grid lines, uppercase `JetBrains Mono` category tags, and subtle `--phosphor` highlights. Group past events cleanly by year using border dividers instead of card shadows.

---

### 3. Photo Gallery Masonry Grid
* **Files:** [PhotoGallerySection.tsx](file:///home/lebi/ATOM-org/Atom_Standalone/src/components/PhotoGallerySection.tsx) / [FullPhotoGallery.tsx](file:///home/lebi/ATOM-org/Atom_Standalone/src/pages/FullPhotoGallery.tsx)
* **Goal:** Standardize the gallery masonry layout. Add thin `--rule` border frames around the images (2px border-radius limit per design system) and render clean utility tags/details on hover rather than overlay cards.

---

### 4. Footer Alignment
* **File:** [Footer.tsx](file:///home/lebi/ATOM-org/Atom_Standalone/src/components/Footer.tsx)
* **Goal:** Restyle the footer container to use a clean bottom-rule layout with thin line boundaries, removing generic spacing and aligning the address, social icons, and copyright details using wide-tracked mono-labels.

---

### 5. Cleanup & Other Sections (About, Achievements)
* **Files:** [About.tsx](file:///home/lebi/ATOM-org/Atom_Standalone/src/components/About.tsx) / [Achievements.tsx](file:///home/lebi/ATOM-org/Atom_Standalone/src/components/Achievements.tsx)
* **Goal:** Remove the remaining blue-gradient assets, custom background images (like `atom-team.webp` in About), and obsolete text widgets (`ScrollFloat.tsx`, `TextPressure.tsx`) to unify the visual architecture.

## Verification Plan

### Automated Tests
- Run `npm run typecheck` to verify no strict compilation errors.
- Run `npm run build` to confirm production assets assemble cleanly.

### Manual Verification
- Review layout fluidity across viewport breakpoints (Desktop down to 390px Mobile).
- Check that all interactive items focus correctly with `--phosphor` rings.
