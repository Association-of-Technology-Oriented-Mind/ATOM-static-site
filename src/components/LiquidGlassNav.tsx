import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import atomLogo from '@/assets/atom-logo-white.png';
import atomLogoColor from '@/assets/atom-logo.webp';

// ── iOS Liquid Glass Floating Centered Navbar ────────────────────────────────

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/events', label: 'Events' },
  { path: '/#clubs-section', label: 'Clubs' },
  { path: '/#core-members', label: 'Team' },
  { path: '/full-gallery', label: 'Gallery' },
] as const;

const springTransition = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 30,
  mass: 0.8,
};

const LiquidGlassNav: React.FC = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [mouseX, setMouseX] = useState(50);
  const [isVisible, setIsVisible] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);

  const isExcludedPage = 
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/registration');

  const [activeSection, setActiveSection] = useState<string>('/');

  // Track scroll position to reveal navbar only after Hero section on homepage
  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname !== '/') {
        setIsVisible(true);
      } else {
        setIsVisible(window.scrollY > window.innerHeight * 0.75);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Scroll spy effect to detect which section is currently active in the viewport on the homepage
  useEffect(() => {
    if (location.pathname !== '/') return;

    const sections = [
      { id: 'hero', path: '/' },
      { id: 'about', path: '/' },
      { id: 'events-section', path: '/events' },
      { id: 'clubs-section', path: '/#clubs-section' },
      { id: 'core-members', path: '/#core-members' },
      { id: 'gallery-section', path: '/full-gallery' },
    ];

    const handleScrollSpy = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.4;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(sections[i].path);
            break;
          }
        }
      }
    };

    handleScrollSpy();
    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [location.pathname]);

  const isActive = useCallback(
    (path: string) => {
      if (location.pathname !== '/') {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
      }
      return activeSection === path;
    },
    [location.pathname, activeSection],
  );

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Mouse tracking for localized liquid light refraction
  const handleDockMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = dockRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouseX(((e.clientX - rect.left) / rect.width) * 100);
  }, []);

  if (isExcludedPage) {
    return null;
  }

  const activePath = hoveredPath ?? NAV_LINKS.find(l => isActive(l.path))?.path ?? '/';

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* ── SVG Liquid Refraction & Underwater Magnifier Filter ──────────────── */}
          <svg
            style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}
            aria-hidden="true"
          >
            <defs>
              <filter id="lg-water-magnify" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.012 0.025" numOctaves="2" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G" result="displaced" />
                <feComponentTransfer in="displaced">
                  <feFuncR type="linear" slope="1.1" intercept="0.02" />
                  <feFuncG type="linear" slope="1.15" intercept="0.02" />
                  <feFuncB type="linear" slope="1.22" intercept="0.04" />
                </feComponentTransfer>
              </filter>
            </defs>
          </svg>

          {/* ── Floating Centered Nav Capsule ──────────────────────────────────── */}
          <div className="fixed top-5 md:top-6 left-0 right-0 z-[100] flex justify-center pointer-events-none px-4">
            <motion.div
              className="lg-nav-wrapper pointer-events-auto"
              initial={{ opacity: 0, y: -28, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -28, scale: 0.92 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              role="navigation"
              aria-label="Main navigation"
            >
              <div
                ref={dockRef}
                className="lg-nav-capsule"
                onMouseMove={handleDockMouseMove}
                style={{
                  background: `
                    radial-gradient(
                      180px circle at ${mouseX}% 50%,
                      rgba(255,255,255,0.12) 0%,
                      transparent 70%
                    ),
                    linear-gradient(
                      180deg,
                      rgba(255, 255, 255, 0.08) 0%,
                      rgba(20, 24, 34, 0.55) 35%,
                      rgba(10, 12, 18, 0.78) 100%
                    )
                  `,
                }}
              >
                {/* Logo */}
                <Link
                  to="/"
                  className="lg-nav-logo lg-focusable"
                  aria-label="ATOM — return to homepage"
                  onClick={() => {
                    if (location.pathname === '/') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                >
                  <span className="lg-nav-logo__text inline-flex items-center gap-0.5">
                    <span className="atom-brand-text">AT</span>
                    <img
                      src={atomLogoColor}
                      alt="O"
                      className="w-[0.75em] h-[0.75em] object-contain inline-block align-middle -mt-0.5"
                    />
                    <span className="atom-brand-text">M</span>
                  </span>
                </Link>

                {/* Desktop nav links with 3D Liquid Glass Magnifying Lens */}
                <div className="lg-nav-links lg-nav-links-desktop hidden md:flex">
                  {NAV_LINKS.map(({ path, label }) => {
                    const isSelected = activePath === path;
                    const isHash = path.startsWith('/#');
                    
                    return (
                      <Link
                        key={path}
                        to={path}
                        className={`lg-nav-link lg-focusable ${isActive(path) ? 'lg-nav-link--active' : ''}`}
                        onMouseEnter={() => setHoveredPath(path)}
                        onMouseLeave={() => setHoveredPath(null)}
                        onClick={(e) => {
                          if (isHash && location.pathname === '/') {
                            e.preventDefault();
                            const id = path.replace('/#', '');
                            const el = document.getElementById(id);
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth' });
                            }
                          }
                        }}
                        aria-current={isActive(path) ? 'page' : undefined}
                      >
                        {/* Animated 3D Liquid Lens Magnifier */}
                        {isSelected && (
                          <motion.div
                            layoutId="lg-nav-active-pill"
                            className="lg-nav-pill-indicator"
                            transition={springTransition}
                            aria-hidden="true"
                          />
                        )}

                        {/* Text scales up inside the glass lens like underwater magnification */}
                        <span
                          className="lg-nav-link__text"
                          style={{
                            transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease',
                            fontWeight: isSelected ? 700 : 500,
                          }}
                        >
                          {label}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile toggle */}
                <div className="lg-nav-actions md:hidden">
                  <button
                    className="lg-nav-mobile-btn lg-focusable"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-expanded={mobileOpen}
                    aria-controls="lg-mobile-nav"
                    aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {mobileOpen ? (
                        <motion.div
                          key="close"
                          initial={{ opacity: 0, rotate: -90 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: 90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <X size={16} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="open"
                          initial={{ opacity: 0, rotate: 90 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: -90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Menu size={16} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Mobile Full-Screen Glass Sheet Menu ──────────────────────────── */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                id="lg-mobile-nav"
                className="lg-nav-sheet pointer-events-auto"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <nav aria-label="Mobile navigation" style={{ width: '100%', display: 'contents' }}>
                  {NAV_LINKS.map(({ path, label }, index) => {
                    const isHash = path.startsWith('/#');
                    return (
                      <motion.div
                        key={path}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ delay: 0.05 + index * 0.07, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        style={{ width: '100%', maxWidth: 340 }}
                      >
                        <Link
                          to={path}
                          className={`lg-nav-sheet__link ${isActive(path) ? 'lg-nav-sheet__link--active' : ''}`}
                          onClick={(e) => {
                            setMobileOpen(false);
                            if (isHash && location.pathname === '/') {
                              e.preventDefault();
                              const id = path.replace('/#', '');
                              const el = document.getElementById(id);
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth' });
                              }
                            }
                          }}
                          aria-current={isActive(path) ? 'page' : undefined}
                        >
                          {label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default LiquidGlassNav;
