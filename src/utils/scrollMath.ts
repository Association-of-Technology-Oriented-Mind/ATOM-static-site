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

/** Interpolates two #rrggbb strings. */
export const hexLerp = (from: string, to: string, t: number): string => {
  const channel = (hex: string, at: number) => parseInt(hex.slice(at, at + 2), 16);
  const pair = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  const a = from.replace('#', '');
  const b = to.replace('#', '');
  return `#${pair(lerp(channel(a, 0), channel(b, 0), t))}${pair(
    lerp(channel(a, 2), channel(b, 2), t),
  )}${pair(lerp(channel(a, 4), channel(b, 4), t))}`;
};

interface ColorFrame {
  at: number;
  centre: string;
  edge: string;
}

/**
 * Background ramp for a scrubbed scene. Stays within the lattice palette —
 * ink at rest, lifting to a cool graphite as the subject resolves, so the
 * portrait separates from the ground without introducing a second accent.
 */
const SCENE_FRAMES: ColorFrame[] = [
  { at: 0.0, centre: '#0f1013', edge: '#0a0b0d' },
  { at: 0.35, centre: '#1a1d22', edge: '#0c0d10' },
  { at: 0.7, centre: '#2a2f37', edge: '#111318' },
  { at: 1.0, centre: '#333941', edge: '#141619' },
];

/** Radial gradient for a given scene progress, anchored behind the portrait. */
export const sceneGradient = (scene: number, anchorX: string): string => {
  let i = SCENE_FRAMES.length - 2;
  for (let k = 0; k < SCENE_FRAMES.length - 1; k++) {
    if (scene <= SCENE_FRAMES[k + 1].at) {
      i = k;
      break;
    }
  }

  const from = SCENE_FRAMES[i];
  const to = SCENE_FRAMES[i + 1];
  const t = easeInOut(prog(scene, from.at, to.at));

  return `radial-gradient(ellipse 90% 110% at ${anchorX} 50%, ${hexLerp(
    from.centre,
    to.centre,
    t,
  )} 0%, ${hexLerp(from.edge, to.edge, t)} 100%)`;
};
