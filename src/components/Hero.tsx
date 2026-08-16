import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { OrbitalCanvas } from './OrbitalCanvas';
import atomLogo from '@/assets/atom-logo-white.png';

const ease = [0.16, 1, 0.3, 1] as const;

export const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll-driven content fade out
  const handleScroll = useCallback(() => {
    const content = contentRef.current;
    if (!content) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const progress = Math.min(scrollY / (vh * 0.6), 1);

    content.style.opacity = String(1 - progress);
    content.style.transform = `translateY(${-progress * 50}px) scale(${1 - progress * 0.05})`;
  }, []);

  useEffect(() => {
    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [handleScroll]);

  return (
    <section
      ref={heroRef}
      className="relative h-full w-full flex items-center justify-center overflow-hidden bg-[hsl(var(--ink))]"
      id="hero"
      aria-label="ATOM — Association of Technical Oriented Minds"
    >
      {/* Constellation canvas — full viewport behind content */}
      <OrbitalCanvas className="absolute inset-0 z-0 pointer-events-none" />

      {/* Central ambient glow */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,hsla(var(--phosphor)/0.05)_0%,transparent_50%)] pointer-events-none" aria-hidden="true" />

      {/* Content */}
      <div 
        ref={contentRef} 
        className="relative z-10 flex flex-col items-center justify-center w-full px-4 text-center h-full max-w-[100vw]" 
        style={{ willChange: 'opacity, transform' }}
      >
        
        {/* ATOM Symbol Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease }}
          className="flex items-center justify-center mb-4 md:mb-6"
        >
          <span 
            className="display-hero"
          >
            AT
          </span>
          
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="relative mx-1 sm:mx-3 md:mx-4 lg:mx-6 flex items-center justify-center w-16 h-16 md:w-24 md:h-24 lg:w-36 lg:h-36 xl:w-44 xl:h-44"
          >
            {/* Glow behind the logo */}
            <div className="absolute inset-0 bg-white/10 blur-xl rounded-full" />
            <img 
              src={atomLogo} 
              alt="ATOM Logo" 
              className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            />
          </motion.div>

          <span 
            className="display-hero"
          >
            M
          </span>
        </motion.div>

        {/* Subtitle wording */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease }}
          className="editorial-body text-center mt-4 md:mt-6 max-w-2xl px-4"
        >
          Association of Technology Oriented Minds .
        </motion.h2>

      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <span className="mono-label text-[0.5rem] tracking-[0.2em] text-[hsl(var(--graphite))]">SCROLL</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--chalk))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </motion.div>
      </motion.div>

      {/* Bottom gradient transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[hsl(var(--ink))] to-transparent z-10 pointer-events-none" aria-hidden="true" />
    </section>
  );
};

export default Hero;