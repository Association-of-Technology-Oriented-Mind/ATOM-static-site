import { useEffect } from 'react';
import Lenis from 'lenis';

export const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    const updateLenis = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(updateLenis);
    };
    rafId = requestAnimationFrame(updateLenis);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
};
