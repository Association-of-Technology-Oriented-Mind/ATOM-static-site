import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Calendar, Layers, Users, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NavItem {
  name: string;
  link: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: 'Home', link: '/', icon: Home },
  { name: 'Events', link: '/events', icon: Calendar },
  { name: 'Clubs', link: '/#clubs-section', icon: Layers },
  { name: 'Team', link: '/core', icon: Users },
  { name: 'Gallery', link: '/full-gallery', icon: ImageIcon },
];

export const FloatingNav = () => {
  const location = useLocation();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Blacklist navigation on admin, login, and registration pages
  const isExcludedPage = 
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/registration');

  if (isExcludedPage) return null;

  return (
    <AnimatePresence mode="wait">
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
            className="flex items-center gap-1.5 focus:outline-none pl-1"
            onClick={() => {
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <span className="font-mono text-sm font-black tracking-tight text-[hsl(var(--chalk))] hover:text-[hsl(var(--phosphor))] transition-colors">
              ATOM.
            </span>
          </Link>

          {/* Navigation Pill Items */}
          <nav className="flex items-center gap-1 relative">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
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
                  {/* Sliding Liquid Glass capsule effect */}
                  {hoveredIdx === idx && (
                    <motion.div
                      layoutId="nav-hover-pill"
                      className="absolute inset-0 bg-white/[0.05] rounded-full border border-white/[0.03] shadow-inner"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}

                  {/* Active Indicator Underline */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-indicator"
                      className="absolute bottom-0 inset-x-3 h-[2px] bg-[hsl(var(--phosphor))] shadow-[0_0_8px_hsl(var(--phosphor))]"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}

                  {isHash ? (
                    <a
                      href={item.link}
                      onClick={handleClick}
                      className={cn(
                        "relative z-10 flex items-center gap-1.5 focus:outline-none transition-colors duration-200",
                        isActive ? "text-[hsl(var(--phosphor))]" : "text-white/70 hover:text-white"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline font-mono text-[10px] tracking-widest uppercase font-medium">
                        {item.name}
                      </span>
                    </a>
                  ) : (
                    <Link
                      to={item.link}
                      className={cn(
                        "relative z-10 flex items-center gap-1.5 focus:outline-none transition-colors duration-200",
                        isActive ? "text-[hsl(var(--phosphor))]" : "text-white/70 hover:text-white"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline font-mono text-[10px] tracking-widest uppercase font-medium">
                        {item.name}
                      </span>
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </motion.div>
    </AnimatePresence>
  );
};
