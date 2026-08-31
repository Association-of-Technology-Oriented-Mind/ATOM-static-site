import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { clamp } from '@/utils/scrollMath';

type Stage = 'before' | 'fixed' | 'after';

interface ScrollSceneProps {
  /**
   * Scroll distance for the scene, in viewport heights. More height means a
   * slower, more deliberate scrub; less means content flashes past.
   */
  heightVh?: number;
  /** Receives scene progress 0→1 on every frame. */
  children: (progress: number) => ReactNode;
  className?: string;
}

/**
 * Pins a full-viewport stage while the page scrolls past a taller wrapper, and
 * reports how far through that wrapper the viewport has travelled.
 *
 * The stage switches between three positions so it enters, pins, and hands off
 * without jumping:
 *   before — absolute at the wrapper top, scrolls in normally
 *   fixed  — pinned to the viewport while the wrapper fills it
 *   after  — absolute at the wrapper bottom, released to the next section
 *
 * Progress is polled with requestAnimationFrame rather than a scroll listener,
 * which sidesteps scroll-event throttling. Children write their own styles
 * directly to the DOM; only this component holds progress in state.
 */
const ScrollScene = ({ heightVh = 400, children, className = '' }: ScrollSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<Stage>('before');
  const [inView, setInView] = useState(false);

  const tick = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const viewH = window.innerHeight;
      const total = container.offsetHeight - viewH;

      // Guard: if the wrapper is shorter than the viewport the maths divides
      // by zero, which happens at small breakpoints.
      if (total > 0) {
        setProgress(clamp(-rect.top / total, 0, 1));

        if (rect.top > 0) setStage('before');
        else if (rect.bottom <= viewH) setStage('after');
        else setStage('fixed');
      }
      
      rafRef.current = requestAnimationFrame(tick);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      {
        rootMargin: '100px 0px 100px 0px',
      }
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!inView) return;

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [tick, inView]);

  const stageStyle: React.CSSProperties =
    stage === 'fixed'
      ? { position: 'fixed', top: 0, left: 0 }
      : stage === 'after'
        ? { position: 'absolute', bottom: 0, left: 0 }
        : { position: 'absolute', top: 0, left: 0 };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height: `${heightVh}vh` }}
    >
      <div
        className="h-screen w-full overflow-hidden"
        style={{ ...stageStyle, width: '100%' }}
      >
        {children(progress)}
      </div>
    </div>
  );
};

export default ScrollScene;
