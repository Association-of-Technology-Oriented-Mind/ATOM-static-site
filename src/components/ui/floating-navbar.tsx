import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { cn } from '@/lib/utils';
import atomLogo from '@/assets/atom-logo.webp';

export interface NavItem {
  name: string;
  link: string;
}

const navItems: NavItem[] = [
  { name: 'Home', link: '/' },
  { name: 'Events', link: '/events' },
  { name: 'Clubs', link: '/#clubs-section' },
  { name: 'Team', link: '/core' },
  { name: 'Gallery', link: '/full-gallery' },
];

export const FloatingNav = () => {
  const { scrollY } = useScroll();
  const location = useLocation();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Blacklist navigation on admin, login, and registration pages
  const isExcludedPage = 
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/registration');

  const [visible, setVisible] = useState(() => {
    if (isExcludedPage) return false;
    if (location.pathname === '/') return false;
    return true;
  });

  const checkVisibility = (y: number) => {
    if (isExcludedPage) {
      setVisible(false);
      return;
    }
    if (location.pathname === '/') {
      const clubsEl = document.getElementById('clubs-section');
      // Minimum safe threshold (Hero + About height, approx 1.2x viewport height)
      const minThreshold = window.innerHeight * 1.2;
      let threshold = minThreshold;
      
      if (clubsEl && clubsEl.offsetTop > minThreshold) {
        threshold = clubsEl.offsetTop - 200;
      }
      
      setVisible(y >= threshold);
    } else {
      setVisible(true);
    }
  };

  useMotionValueEvent(scrollY, 'change', (latest) => {
    checkVisibility(latest);
  });

  useEffect(() => {
    // Initial check and delayed re-check after layout calculation
    checkVisibility(window.scrollY);
    const timer = setTimeout(() => {
      checkVisibility(window.scrollY);
    }, 300);
    return () => clearTimeout(timer);
  }, [location.pathname, isExcludedPage]);

  if (isExcludedPage) return null;

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "fixed top-6 inset-x-0 mx-auto z-[9999]",
            "flex items-center justify-between",
            "w-[90%] max-w-lg px-4 sm:px-6 py-2 rounded-full",
            // Liquid Glass styling: blur, border opacity, drop shadow, and linear background
            "bg-black/30 backdrop-blur-xl border border-white/[0.08]",
            "shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)]"
          )}
        >
          {/* Brand/Mini-logo */}
          <Link 
            to="/" 
            className="flex items-center focus:outline-none pl-1 group"
            onClick={() => {
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            aria-label="ATOM Homepage"
          >
            <img 
              src={atomLogo} 
              alt="ATOM" 
              className="w-6 h-6 sm:w-7 sm:h-7 object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
            />
          </Link>

          {/* Navigation Pill Items */}
          <nav className="flex items-center gap-1 relative">
            {navItems.map((item, idx) => {
              const isHash = item.link.includes('#');
              const isActive = isHash 
                ? location.pathname === '/' && location.hash === '#clubs-section'
                : location.pathname === item.link;

              const handleClick = (e: React.MouseEvent) => {
                if (isHash && location.pathname === '/') {
                  e.preventDefault();
                  const targetId = item.link.split('#')[1];
                  const element = document.getElementById(targetId);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              };

              return (
                <div
                  key={item.name}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="relative px-2.5 py-1.5 sm:px-3 sm:py-2"
                >
                  {/* Sliding Theme-colored Liquid Glass capsule effect */}
                  {(hoveredIdx === idx || (hoveredIdx === null && isActive)) && (
                    <motion.div
                      layoutId="nav-hover-pill"
                      className={cn(
                        "absolute inset-0 rounded-full border transition-colors duration-200",
                        hoveredIdx === idx
                          ? "bg-[hsl(var(--phosphor)/0.18)] border-[hsl(var(--phosphor)/0.35)] shadow-[0_0_12px_hsl(var(--phosphor)/0.25)]"
                          : "bg-[hsl(var(--phosphor)/0.12)] border-[hsl(var(--phosphor)/0.22)]"
                      )}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}

                  {isHash ? (
                    <a
                      href={item.link}
                      onClick={handleClick}
                      className={cn(
                        "relative z-10 flex items-center focus:outline-none transition-colors duration-200",
                        isActive ? "text-[hsl(var(--phosphor))]" : "text-white/70 hover:text-white"
                      )}
                    >
                      <span className="font-mono text-[10px] sm:text-xs tracking-widest uppercase font-medium">
                        {item.name}
                      </span>
                    </a>
                  ) : (
                    <Link
                      to={item.link}
                      className={cn(
                        "relative z-10 flex items-center focus:outline-none transition-colors duration-200",
                        isActive ? "text-[hsl(var(--phosphor))]" : "text-white/70 hover:text-white"
                      )}
                    >
                      <span className="font-mono text-[10px] sm:text-xs tracking-widest uppercase font-medium">
                        {item.name}
                      </span>
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
