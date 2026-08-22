import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, Variants, AnimatePresence } from 'framer-motion';
import atomLogo from '@/assets/atom-logo.webp';

export const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const [menuOpen, setMenuOpen] = useState(false);

  // Parallax transform on scroll
  const leftY = useTransform(scrollY, [0, 800], [0, -50]);
  const rightY = useTransform(scrollY, [0, 800], [0, 30]);

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  const menuVariants = {
    closed: {
      clipPath: 'circle(0px at calc(100% - 40px) 40px)',
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 40,
      }
    },
    open: {
      clipPath: 'circle(200% at calc(100% - 40px) 40px)',
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 30,
      }
    }
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen w-full overflow-hidden flex flex-col md:flex-row bg-[#0a0a0a]"
      aria-label="ATOM — Association of Technical Oriented Minds"
    >
      {/* LEFT COLUMN - Dark Grey Background */}
      <motion.div
        style={{ y: leftY }}
        className="w-full md:w-[65%] min-h-[60vh] md:min-h-screen bg-[#121212] flex flex-col justify-between p-8 sm:p-12 lg:p-16 border-b md:border-b-0 md:border-r border-[hsl(var(--rule))] relative z-10"
      >
        {/* Top brand header */}
        <div className="flex items-center justify-between md:justify-start gap-4">
          <span className="font-mono text-xl sm:text-2xl font-black tracking-tighter text-[hsl(var(--chalk))]">
            ATOM
          </span>
          <span className="mono-label text-[0.625rem] text-[hsl(var(--graphite))] tracking-widest hidden sm:inline">
            // KARUNYA'S PREMIER TECHNICAL ASSOCIATION
          </span>
        </div>

        {/* Center content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="my-auto py-12 md:py-0 max-w-2xl"
        >
          <motion.h1
            variants={itemVariants}
            className="text-[12vw] md:text-[6.5rem] lg:text-[7.5rem] font-black leading-[0.85] tracking-[-0.04em] uppercase text-[hsl(var(--chalk))]"
          >
            ATOM.
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="text-[4vw] md:text-[2rem] lg:text-[2.25rem] font-semibold text-[hsl(var(--phosphor))] leading-tight mt-4 mb-8"
          >
            Association of Technology Oriented Minds
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base leading-relaxed text-[hsl(var(--chalk)/0.7)] mb-10 max-w-lg"
          >
            Karunya's premier student-driven technical collective — four specialized clubs,
            hundreds of builders, and one shared mission: design and engineer what comes next.
          </motion.p>

          {/* Action buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 z-30"
          >
            <a
              href="#clubs-section"
              className="btn-tech flex items-center gap-2 border border-[hsl(var(--rule))] px-8 py-3.5 bg-black hover:border-[hsl(var(--phosphor))] hover:text-[hsl(var(--phosphor))] transition-all font-mono text-xs uppercase"
            >
              Explore Clubs
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#about"
              className="btn-tech border border-[hsl(var(--rule))] px-8 py-3.5 hover:border-[hsl(var(--phosphor))] hover:text-[hsl(var(--phosphor))] transition-all font-mono text-xs uppercase"
            >
              Our Story
            </a>
          </motion.div>
        </motion.div>

        {/* Bottom footer text (Left side) */}
        <div className="text-[0.625rem] font-mono text-[hsl(var(--graphite))] tracking-wider">
          DEVELOPING INNOVATIVE SOLUTIONS FOR THE NEXT GENERATION
        </div>
      </motion.div>

      {/* RIGHT COLUMN - Pitch Black Background */}
      <motion.div
        style={{ y: rightY }}
        className="w-full md:w-[35%] min-h-[40vh] md:min-h-screen bg-[#0a0a0a] flex flex-col justify-between p-8 sm:p-12 lg:p-16 relative z-10"
      >
        {/* Top metadata & Hamburger icon */}
        <div className="flex items-center justify-between w-full">
          <span className="font-mono text-xs tracking-widest text-[hsl(var(--graphite))]">
            EST. 2021 — KARUNYA
          </span>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="group relative z-[110] flex flex-col gap-1.5 focus:outline-none p-2"
            aria-label="Toggle Menu"
          >
            <motion.span 
              animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              style={{ originX: 0.5 }}
              className="w-6 h-0.5 bg-[hsl(var(--chalk))] group-hover:bg-[hsl(var(--phosphor))] transition-colors origin-center" 
            />
            <motion.span 
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-0.5 bg-[hsl(var(--chalk))] group-hover:bg-[hsl(var(--phosphor))] transition-colors" 
            />
            <motion.span 
              animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              style={{ originX: 0.5 }}
              className="w-6 h-0.5 bg-[hsl(var(--chalk))] group-hover:bg-[hsl(var(--phosphor))] transition-colors origin-center" 
            />
          </button>
        </div>

        {/* Centered ATOM Emblem Logo */}
        <div className="my-auto flex items-center justify-center relative">
          {/* Subtle logo back-glow */}
          <div className="absolute w-[200px] h-[200px] bg-[hsl(var(--phosphor))] opacity-[0.06] blur-[60px] rounded-full" />
          
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            src={atomLogo}
            alt="ATOM Emblem"
            className="w-48 h-48 sm:w-64 sm:h-64 object-contain filter drop-shadow-[0_0_15px_rgba(125,249,228,0.1)] hover:rotate-6 transition-transform duration-700"
          />
        </div>

        {/* Bottom space placeholder for symmetry */}
        <div className="text-[0.625rem] font-mono text-[hsl(var(--graphite))] tracking-wider text-right uppercase">
          [ SYSTEM ACTIVE ]
        </div>
      </motion.div>

      {/* STAGGERED FULLSCREEN MENU OVERLAY */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-[100] bg-[#121212] flex flex-col justify-center items-center p-8 sm:p-16"
          >
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: 'linear-gradient(to right, hsl(var(--rule)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--rule)) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
              maskImage: 'radial-gradient(circle at calc(100% - 40px) 40px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.1) 100%)',
              WebkitMaskImage: 'radial-gradient(circle at calc(100% - 40px) 40px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.1) 100%)',
              opacity: 0.15,
            }} />

            <div className="flex flex-col gap-6 max-w-xl w-full text-center relative z-10">
              <span className="mono-label text-[0.625rem] text-[hsl(var(--phosphor))] tracking-widest uppercase mb-4">
                [ NAVIGATION MENU ]
              </span>
              {[
                { label: 'Home', path: '/' },
                { label: 'Events Archive', path: '/events' },
                { label: 'Core Team', path: '/core' },
                { label: 'Photo Gallery', path: '/full-gallery' }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className="display-m block text-[hsl(var(--chalk))] hover:text-[hsl(var(--phosphor))] uppercase tracking-tight py-3 border-b border-[hsl(var(--rule))/0.3] transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <div className="mt-8 flex justify-center gap-6">
                <a href="https://github.com" target="_blank" className="mono-label text-xs text-[hsl(var(--graphite))] hover:text-[hsl(var(--phosphor))]">GITHUB</a>
                <span className="text-[hsl(var(--rule))]">/</span>
                <a href="https://linkedin.com" target="_blank" className="mono-label text-xs text-[hsl(var(--graphite))] hover:text-[hsl(var(--phosphor))]">LINKEDIN</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;