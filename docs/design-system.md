# Design system

Visual direction for the public site. The admin CMS is deliberately excluded —
it keeps the older utility styling.

## Thesis

The mark is an atom: three orbital paths crossing, five electrons pinned at
specific points. The design takes its rules from that, not from decoration.
Structure is a **lattice** — content sits on visible coordinates, roles and
events occupy fixed positions, and the one moving thing is an orbit.

The previous site was dark glassmorphism with blue→cyan gradients: the default
look, and one that says nothing about a technology club. This direction is
technical and physical instead — closer to a lab notation sheet or an element
card than a startup landing page.

## Color

Near-monochrome, one accent. The accent is a **phosphor cyan** taken from the
iridescent edge in the logo, not the flat brand blue it replaces.

| Token | Value | Use |
| --- | --- | --- |
| `--ink` | `#0A0B0D` | Page background |
| `--ink-raised` | `#121317` | Panels, raised blocks |
| `--chalk` | `#F2F3F5` | Primary text |
| `--graphite` | `#6E7379` | Secondary text, labels |
| `--rule` | `#24262B` | Hairlines, grid, borders |
| `--phosphor` | `#7DF9E4` | Accent — one per viewport |

Rule: the accent marks *position* (current role, active event, live state).
It is never a fill, never a gradient, never decoration.

## Type

Three roles, deliberately mismatched in weight rather than family count.

- **Display** — `Archivo Black`. Heavy, tight, condensed-feeling. Used at
  large sizes with negative tracking for section openings only.
- **Body** — `Inter`. Already loaded; kept for reading text.
- **Utility** — `JetBrains Mono`. Labels, roles, dates, counters, coordinates.
  Uppercase, wide tracking. This face carries the technical register.

Scale (fluid, clamped):

```
display-xl  clamp(3.5rem, 12vw, 11rem)   tracking -0.04em
display-l   clamp(2.5rem, 7vw, 5.5rem)   tracking -0.03em
heading     clamp(1.5rem, 3vw, 2.5rem)   tracking -0.02em
body        1rem / 1.7
mono-label  0.75rem  tracking 0.18em  uppercase
```

## Layout

A visible lattice. Sections are separated by hairline rules, not whitespace
alone. Content aligns to a 12-column grid whose edges are drawn, not implied.

Core members and clubs use **full-viewport panels** — one subject per screen,
scrolled through, in the manner of a specimen sheet.

## Signature

**The orbit index.** A fixed marker tracks vertical position through the core
members and clubs sections: an electron travelling its orbit as you scroll,
with the current role set in mono beside it. It encodes real information —
where you are in a fixed sequence of positions — rather than decorating the
edge of the screen.

## Motion

- Reveals are short and positional: 200–400ms, translate and opacity only.
- No parallax, no ambient float, no continuous background animation. The
  previous build ran framer-motion, GSAP and a WebGL canvas simultaneously.
- `prefers-reduced-motion` disables all transforms and leaves opacity only.

## Rules

- Zero border radius on structural elements. Photos keep a 2px radius only.
- No blur, no glass, no drop shadows. Depth comes from the rule colour.
- One accent per viewport. If two things are cyan, one is wrong.
- Every interactive element has a visible focus ring in `--phosphor`.
