import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import atomLogo from '@/assets/atom-logo.webp';

// ── Navigation ─────────────────────────────────────────────────────────────────
// Refined for orbital hero cohesion. Transparent → solid on scroll.
// Desktop: Logo left, links center.
// Mobile: Logo left, hamburger right → fullscreen overlay menu.

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/events', label: 'Events' },
  { path: '/core', label: 'Team' },
  { path: '/full-gallery', label: 'Gallery' },
];

const Navigation: React.FC = () => {
  const location = useLocation();
  const [showNavbar, setShowNavbar] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Track scroll position for reveal trigger
  const handleScroll = useCallback(() => {
    if (location.pathname !== '/') {
      setShowNavbar(true);
    } else {
      setShowNavbar(window.scrollY >= window.innerHeight * 0.9);
    }
  }, [location.pathname]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, location.pathname]);

  // Re-trigger scroll check on pathname changes (e.g. navigating between pages)
  useEffect(() => {
    handleScroll();
  }, [location.pathname, handleScroll]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <motion.nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[var(--z-nav)]"
        initial={{ opacity: 0, y: -100 }}
        animate={showNavbar ? { opacity: 1, y: 0 } : { opacity: 0, y: -100 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          backgroundColor: 'hsla(220, 14%, 4%, 0.85)',
          backdropFilter: 'blur(24px) saturate(1.6)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
          borderBottom: '1px solid hsla(168, 90%, 74%, 0.15)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div
          className="mx-auto flex items-center justify-between relative"
          style={{
            maxWidth: 'var(--container-xl)',
            padding: '0 var(--space-6)',
            height: 'var(--nav-height)',
          }}
        >
          {/* Logo - Left aligned */}
          <Link
            to="/"
            className="focus-phosphor flex items-center gap-2.5 group relative z-10"
            aria-label="ATOM — return to homepage"
          >
            <img
              src={atomLogo}
              alt=""
              className="w-7 h-7 opacity-90 transition-transform duration-500 group-hover:rotate-[60deg]"
              aria-hidden="true"
            />
            <span
              className="hidden sm:inline text-[hsl(var(--chalk))] tracking-[-0.03em]"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.9375rem',
              }}
            >
              ATOM
            </span>
          </Link>

          {/* Desktop links - Absolutely centered */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
            {NAV_LINKS.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`focus-phosphor relative px-4 py-2 text-[0.6875rem] tracking-[0.14em] uppercase transition-colors duration-200 ${
                  isActive(path)
                    ? 'text-[hsl(var(--chalk))]'
                    : 'text-[hsl(var(--graphite))] hover:text-[hsl(var(--chalk))]'
                }`}
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop right — Spacer for flex balance */}
          <div className="hidden md:block w-7 relative z-10" />

          {/* Mobile hamburger */}
          <button
            className="focus-phosphor md:hidden relative w-10 h-10 flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            <div className="relative w-5 h-3.5 flex flex-col justify-between">
              <span
                className="block h-[1.5px] w-full transition-all duration-300 origin-center"
                style={{
                  backgroundColor: 'hsl(var(--chalk))',
                  transform: mobileOpen ? 'rotate(45deg) translate(3.5px, 3.5px)' : 'none',
                }}
              />
              <span
                className="block h-[1.5px] w-full transition-all duration-300"
                style={{
                  backgroundColor: 'hsl(var(--chalk))',
                  opacity: mobileOpen ? 0 : 1,
                  transform: mobileOpen ? 'translateX(8px)' : 'none',
                }}
              />
              <span
                className="block h-[1.5px] w-full transition-all duration-300 origin-center"
                style={{
                  backgroundColor: 'hsl(var(--chalk))',
                  transform: mobileOpen ? 'rotate(-45deg) translate(3.5px, -3.5px)' : 'none',
                }}
              />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            className="fixed inset-0 z-[calc(var(--z-nav)-1)] md:hidden flex flex-col justify-center items-center"
            style={{ backgroundColor: 'hsl(var(--ink))' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <nav className="flex flex-col items-center gap-2" aria-label="Mobile navigation">
              {NAV_LINKS.map(({ path, label }, index) => (
                <motion.div
                  key={path}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ delay: 0.05 + index * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={path}
                    className={`focus-phosphor block px-6 py-4 text-center transition-colors duration-200 ${
                      isActive(path)
                        ? 'text-[hsl(var(--phosphor))]'
                        : 'text-[hsl(var(--chalk))]'
                    }`}
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
                      letterSpacing: '-0.02em',
                      textTransform: 'uppercase',
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}

              {/* Decorative divider */}
              <motion.div
                className="w-8 h-px my-4"
                style={{ backgroundColor: 'hsl(var(--rule))' }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.25, duration: 0.3 }}
              />

              {/* Contact info */}
              <motion.a
                href="mailto:atom@karunya.edu"
                className="focus-phosphor text-[0.6875rem] tracking-[0.18em] uppercase transition-colors hover:text-[hsl(var(--phosphor))]"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'hsl(var(--graphite))',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                atom@karunya.edu
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;