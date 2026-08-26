import { useRef, useCallback, useEffect } from 'react';

interface Use3DTiltOptions {
  max?: number;          // Max degrees of rotation
  perspective?: number;  // Perspective in px
  scale?: number;        // Max scale on hover
  speedMs?: number;      // Transition speed in ms
  reset?: boolean;       // Reset on mouse leave
}

/**
 * use3DTilt — Real-time 3D cursor-tracking card tilt with specular highlight.
 *
 * Applies rotateX/rotateY perspective transforms directly to the DOM element
 * via a ref (never React state) to stay at 60fps.
 *
 * Also sets --mouse-x and --mouse-y CSS custom properties on the element
 * so CSS radial-gradient shine effects can track the cursor position.
 */
export const use3DTilt = <T extends HTMLElement = HTMLElement>({
  max = 12,
  perspective = 800,
  scale = 1.02,
  speedMs = 400,
  reset = true,
}: Use3DTiltOptions = {}) => {
  const ref = useRef<T>(null);
  const rafRef = useRef<number>(0);
  const isHovering = useRef(false);

  const applyTransform = useCallback(
    (rotX: number, rotY: number, sc: number, mouseX: number, mouseY: number) => {
      const el = ref.current;
      if (!el) return;
      el.style.transform = `perspective(${perspective}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(${sc},${sc},${sc})`;
      el.style.setProperty('--mouse-x', `${mouseX}%`);
      el.style.setProperty('--mouse-y', `${mouseY}%`);
    },
    [perspective],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) return;

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        const rotX = -(offsetY / (rect.height / 2)) * max;
        const rotY = (offsetX / (rect.width / 2)) * max;

        const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
        const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

        applyTransform(rotX, rotY, scale, mouseX, mouseY);
      });
    },
    [max, scale, applyTransform],
  );

  const handleMouseEnter = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    isHovering.current = true;
    el.style.transition = `transform ${speedMs * 0.3}ms cubic-bezier(0.16, 1, 0.3, 1)`;
  }, [speedMs]);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    isHovering.current = false;
    cancelAnimationFrame(rafRef.current);

    if (reset) {
      el.style.transition = `transform ${speedMs}ms cubic-bezier(0.16, 1, 0.3, 1)`;
      applyTransform(0, 0, 1, 50, 50);
    }
  }, [reset, speedMs, applyTransform]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

  return ref;
};
