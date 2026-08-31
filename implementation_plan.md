# Global UI/UX Consistency Implementation Plan

Review the plan to address inconsistencies across the site's layout, fonts, and interaction patterns, standardizing them under the brutalist/technical "Lattice" design system.

## Proposed Changes

### 1. Hero Section Redesign
* **File:** [Hero.tsx](src/components/Hero.tsx)
* **Goal:** Remove the rotating logo arrangement ("AT" logo "M") and replace it with a high-impact technical typographic landing page.
* **Layout:** Use large, tracked-out display headers with `JetBrains Mono` labels, coordinates, and structured borders. Keep the active canvas background while styling text elements precisely.

---

### 2. Events Page & Timeline Consistency
* **Files:** [PastEventTimeline.tsx](src/components/events/PastEventTimeline.tsx) / [Event.tsx](src/pages/Event.tsx)
* **Goal:** Standardize the Events timeline to use monochrome `--rule` grid lines, uppercase `JetBrains Mono` category tags, and subtle `--phosphor` highlights. Group past events cleanly by year using border dividers instead of card shadows.

---

### 3. Photo Gallery Masonry Grid
* **Files:** [PhotoGallerySection.tsx](src/components/PhotoGallerySection.tsx) / [FullPhotoGallery.tsx](src/pages/FullPhotoGallery.tsx)
* **Goal:** Standardize the gallery masonry layout. Add thin `--rule` border frames around the images and render clean utility tags/details on hover.

---

### 4. Footer Alignment
* **File:** [Footer.tsx](src/components/Footer.tsx)
* **Goal:** Restyle the footer container to use a clean bottom-rule layout with thin line boundaries, aligning address, social icons, and copyright details using wide-tracked mono-labels.

---

### 5. About & Achievements Refactoring
* **Files:** [About.tsx](src/components/About.tsx) / [Achievements.tsx](src/components/Achievements.tsx)
* **Goal:** Implement the 4-card grid architecture with bottom-to-top color slide-fill transitions, metallic chrome `ABOUT ATOM` branding, and sharp card edges.

## Verification Plan

### Automated Tests
- Run `npm run typecheck` to verify no strict compilation errors.
- Run `npm test` to confirm test suite passes cleanly.
- Run `npm run build` to confirm production assets assemble cleanly.

### Manual Verification
- Review layout fluidity across viewport breakpoints (Desktop down to 390px Mobile).
- Check that interactive items focus correctly with `--phosphor` rings.
