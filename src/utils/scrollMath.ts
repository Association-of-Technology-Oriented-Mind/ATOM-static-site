/**
 * Math helpers for scroll-scrubbed scenes.
 *
 * Phase components map sub-ranges of a scene's 0→1 progress onto their own
 * opacity/transform, then write those values straight to the DOM. Keeping the
 * maths here means the phases stay declarative timelines rather than algebra.
 */

export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

export const lerp = (from: number, to: number, t: number): number =>
  from + (to - from) * t;

/** Quadratic ease-in-out; cheap and smooth enough for per-frame use. */
export const easeInOut = (t: number): number =>
  t < 0.5 ? 2 * t * t : -2 * t * t + 4 * t - 1;

/** Remaps the slice [start, end] of `scene` onto a local 0→1. */
export const prog = (scene: number, start: number, end: number): number =>
  clamp((scene - start) / (end - start), 0, 1);
