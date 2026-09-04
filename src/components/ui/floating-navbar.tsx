import { useState, useEffect, useRef, useCallback } from 'react';
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

/* ─── Liquid Glass SDF helpers ─────────────────────────────────────────── */
function smoothStep(a: number, b: number, t: number) {
  t = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
function vlen(x: number, y: number) {
  return Math.sqrt(x * x + y * y);
}
function roundedRectSDF(x: number, y: number, hw: number, hh: number, r: number) {
  const qx = Math.abs(x) - hw + r;
  const qy = Math.abs(y) - hh + r;
  return Math.min(Math.max(qx, qy), 0) + vlen(Math.max(qx, 0), Math.max(qy, 0)) - r;
}

/* ─── Build displacement-map canvas → data-URL ──────────────────────────  */
function buildDisplacementMap(w: number, h: number, borderRadius: number) {
  const canvas = document.createElement('canvas');
  canvas.width  = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const data = new Uint8ClampedArray(w * h * 4);

  const rU = borderRadius / w;
  const rV = borderRadius / h;
  const r  = Math.min(rU, rV);

  let maxScale = 0;
  const raw: number[] = [];

  for (let i = 0; i < w * h; i++) {
    const px = i % w;
    const py = Math.floor(i / w);
    const ux = px / w;
    const uy = py / h;
    const ix = ux - 0.5;
    const iy = uy - 0.5;

    const hw = 0.5 - r - 0.03;
    const hh = 0.5 - r - 0.03;

    const d = roundedRectSDF(ix, iy, hw, hh, r);
    const disp   = smoothStep(0.6, 0.0, d - 0.18);
    const scaled = smoothStep(0, 1, disp);

    const dx = ix * scaled - ix;
    const dy = iy * scaled - iy;

    maxScale = Math.max(maxScale, Math.abs(dx * w), Math.abs(dy * h));
    raw.push(dx * w, dy * h);
  }

  maxScale = Math.max(maxScale, 0.001) * 0.5;

  for (let i = 0; i < w * h; i++) {
    const rv = (raw[i * 2]     / maxScale + 0.5) * 255;
    const gv = (raw[i * 2 + 1] / maxScale + 0.5) * 255;
    data[i * 4 + 0] = rv;
    data[i * 4 + 1] = gv;
    data[i * 4 + 2] = 0;
    data[i * 4 + 3] = 255;
  }

  ctx.putImageData(new ImageData(data, w, h), 0, 0);
  return { dataUrl: canvas.toDataURL(), scale: maxScale };
}

/* ─── FloatingNav ───────────────────────────────────────────────────────── */
export const FloatingNav = () => {
  const { scrollY }  = useScroll();
  const location     = useLocation();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const filterId  = 'lg-nav-filter';
  const feImageId = 'lg-nav-map';
  const svgRef    = useRef<SVGSVGElement>(null);
  const feImgRef  = useRef<SVGFEImageElement>(null);
  const feDispRef = useRef<SVGFEDisplacementMapElement>(null);
  const navRef    = useRef<HTMLDivElement>(null);

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
      const minThreshold = window.innerHeight * 0.75;
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
    checkVisibility(window.scrollY);
    const timer = setTimeout(() => {
      checkVisibility(window.scrollY);
    }, 300);
    return () => clearTimeout(timer);
  }, [location.pathname, isExcludedPage]);

  /* Build displacement map & update SVG filter */
  const buildFilter = useCallback(() => {
    const el = navRef.current;
    if (!el || !feImgRef.current || !feDispRef.current || !svgRef.current) return;

    const rect = el.getBoundingClientRect();
    const w    = Math.round(rect.width)  || 480;
    const h    = Math.round(rect.height) || 44;
    if (w < 10 || h < 10) return;

    const { dataUrl, scale } = buildDisplacementMap(w, h, h / 2);

    const filter = svgRef.current.querySelector('filter')!;
    filter.setAttribute('x',      String(rect.left));
    filter.setAttribute('y',      String(rect.top));
    filter.setAttribute('width',  String(w));
    filter.setAttribute('height', String(h));

    feImgRef.current.setAttribute('width',  String(w));
    feImgRef.current.setAttribute('height', String(h));
    feImgRef.current.setAttributeNS(
      'http://www.w3.org/1999/xlink', 'href', dataUrl
    );
    feDispRef.current.setAttribute('scale', String(scale));
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(buildFilter, 80);
    return () => clearTimeout(t);
  }, [visible, buildFilter]);

  useEffect(() => {
    window.addEventListener('resize', buildFilter);
    return () => window.removeEventListener('resize', buildFilter);
  }, [buildFilter]);

  if (isExcludedPage) return null;

  return (
    <>
      {/* Hidden SVG holding displacement filter */}
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        width="0"
        height="0"
        style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9998, overflow: 'visible' }}
      >
        <defs>
          <filter
            id={filterId}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
            x="0" y="0" width="480" height="44"
          >
            <feImage
              ref={feImgRef}
              id={feImageId}
              width="480"
              height="44"
              preserveAspectRatio="none"
            />
            <feDisplacementMap
              ref={feDispRef}
              in="SourceGraphic"
              in2={feImageId}
              xChannelSelector="R"
              yChannelSelector="G"
              scale="0"
            />
          </filter>
        </defs>
      </svg>

      {/* Navbar */}
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            ref={navRef}
            initial={{ opacity: 0, y: -100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={buildFilter}
            className={cn(
              "fixed top-6 inset-x-0 mx-auto z-[9999]",
              "flex items-center justify-between",
              "w-[90%] max-w-lg px-4 sm:px-6 py-2 rounded-full",
              "bg-black/40 backdrop-blur-xl border border-white/[0.12]",
              "shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)]"
            )}
          >
            {/* Brand logo */}
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
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 filter drop-shadow-[0_0_8px_rgba(125,249,228,0.4)]"
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
    </>
  );
};
