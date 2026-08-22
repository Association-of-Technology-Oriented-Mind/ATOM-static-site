import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, Variants, AnimatePresence } from 'framer-motion';
import atomLogo from '@/assets/atom-logo.webp';

// ──────────────────────────────────────────────────────────
// DIGITAL CIRCUITRY — DENSE MULTI-COLOR DISSOLVING TRACES
// ──────────────────────────────────────────────────────────
function CircuitryCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;

    // Color palette
    const PALETTE = [
      { r: 125, g: 249, b: 228 }, // phosphor cyan
      { r: 255, g: 255, b: 255 }, // white
      { r: 130, g: 180, b: 255 }, // soft blue
      { r: 160, g: 240, b: 180 }, // pale green
      { r: 140, g: 140, b: 140 }, // dim grey
    ];

    interface CircuitPath {
      x: number;
      y: number;
      prevX: number;
      prevY: number;
      angle: number;
      speed: number;
      thickness: number;
      colorIdx: number;
      baseOpacity: number;
      opacityShift: number;
      opacityShiftSpeed: number;
      life: number;
      maxLife: number;
      jitterStrength: number;
      turnChance: number;
      trail: { x: number; y: number }[];
      trailMax: number;
    }

    let paths: CircuitPath[] = [];

    const getTargetCoords = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) return { x: w * 0.5, y: h * 0.75 };
      return { x: w * 0.825, y: h * 0.5 };
    };

    const FADE_RADIUS = 150; // dissolve zone radius around logo

    const spawnPath = (): CircuitPath => {
      const startX = Math.random() * w * 0.4;
      const startY = Math.random() * h;
      const target = getTargetCoords();
      const angle = Math.atan2(target.y - startY, target.x - startX);

      return {
        x: startX,
        y: startY,
        prevX: startX,
        prevY: startY,
        angle,
        speed: Math.random() * 1.8 + 0.4,
        thickness: Math.random() * 1.6 + 0.4,
        colorIdx: Math.floor(Math.random() * PALETTE.length),
        baseOpacity: Math.random() * 0.25 + 0.08,
        opacityShift: 0,
        opacityShiftSpeed: Math.random() * 0.03 + 0.005,
        life: 0,
        maxLife: Math.random() * 300 + 100,
        jitterStrength: Math.random() * 0.06,
        turnChance: Math.random() * 0.025 + 0.005,
        trail: [],
        trailMax: Math.floor(Math.random() * 60 + 20),
      };
    };

    // Initialize 110 paths
    const PATH_COUNT = 110;
    for (let i = 0; i < PATH_COUNT; i++) {
      const p = spawnPath();
      // Stagger initial life so they don't all start together
      p.life = Math.floor(Math.random() * p.maxLife * 0.6);
      p.x += Math.cos(p.angle) * p.speed * p.life;
      p.y += Math.sin(p.angle) * p.speed * p.life;
      paths.push(p);
    }

    let rafId: number;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Subtle background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 1;
      const gridSize = 48;
      for (let gx = 0; gx < w; gx += gridSize) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let gy = 0; gy < h; gy += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      const target = getTargetCoords();

      for (let i = 0; i < paths.length; i++) {
        const p = paths[i];
        p.life++;

        // Shift opacity over time for shimmer
        p.opacityShift = Math.sin(p.life * p.opacityShiftSpeed) * 0.12;

        // Distance to target logo center
        const dx = target.x - p.x;
        const dy = target.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Calculate fade factor (dissolve in last FADE_RADIUS px)
        let fadeFactor = 1;
        if (dist < FADE_RADIUS) {
          fadeFactor = dist / FADE_RADIUS;
          fadeFactor = fadeFactor * fadeFactor; // quadratic ease for smoother dissolve
        }

        // Respawn if dissolved, expired, or out of bounds
        if (fadeFactor < 0.02 || p.life >= p.maxLife || p.x < -50 || p.x > w + 50 || p.y < -50 || p.y > h + 50) {
          paths[i] = spawnPath();
          continue;
        }

        // Store previous position
        p.prevX = p.x;
        p.prevY = p.y;

        // Recalculate angle towards target with jitter
        const angleToTarget = Math.atan2(dy, dx);

        // Random sharp 90° turns
        if (Math.random() < p.turnChance) {
          const turnDir = Math.random() > 0.5 ? 1 : -1;
          p.angle = Math.round(angleToTarget / (Math.PI / 4)) * (Math.PI / 4) + turnDir * (Math.PI / 2);
          p.trail.push({ x: p.x, y: p.y }); // mark corner
          if (p.trail.length > p.trailMax) p.trail.shift();
        } else {
          // Snap to grid angles but drift back towards target
          const snapped = Math.round(angleToTarget / (Math.PI / 4)) * (Math.PI / 4);
          p.angle += (snapped - p.angle) * 0.08;
        }

        // Apply jitter
        p.angle += (Math.random() - 0.5) * p.jitterStrength;

        // Move
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;

        // Calculate final opacity
        const opacity = Math.max(0, (p.baseOpacity + p.opacityShift) * fadeFactor);
        const col = PALETTE[p.colorIdx];
        const isCyan = p.colorIdx === 0;

        // Glow for cyan traces
        if (isCyan && opacity > 0.08) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = `rgba(${col.r}, ${col.g}, ${col.b}, ${opacity * 0.6})`;
        } else {
          ctx.shadowBlur = 0;
        }

        // Draw current segment
        ctx.beginPath();
        ctx.moveTo(p.prevX, p.prevY);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${opacity})`;
        ctx.lineWidth = p.thickness * fadeFactor;
        ctx.stroke();

        // Draw trail corners as small junction nodes
        ctx.shadowBlur = 0;
        for (let t = 0; t < p.trail.length; t++) {
          const trailOpacity = opacity * 0.6 * (t / p.trail.length);
          ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${trailOpacity})`;
          const sz = p.thickness * 1.5 * fadeFactor;
          ctx.fillRect(p.trail[t].x - sz / 2, p.trail[t].y - sz / 2, sz, sz);
        }

        // Tip dot
        const tipOpacity = opacity * 1.3;
        ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${Math.min(tipOpacity, 0.8) * fadeFactor})`;
        const tipSize = (p.thickness + 1.5) * fadeFactor;
        ctx.fillRect(p.x - tipSize / 2, p.y - tipSize / 2, tipSize, tipSize);
      }

      // Subtle ambient glow at the target
      const gradient = ctx.createRadialGradient(target.x, target.y, 0, target.x, target.y, 200);
      gradient.addColorStop(0, 'rgba(125, 249, 228, 0.025)');
      gradient.addColorStop(1, 'rgba(125, 249, 228, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(target.x, target.y, 200, 0, Math.PI * 2);
      ctx.fill();

      rafId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    };

    window.addEventListener('resize', handleResize);
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-70 z-10"
    />
  );
}

// ──────────────────────────────────────────────────────────
// HERO COMPONENT
// ──────────────────────────────────────────────────────────
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
      className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a]"
      aria-label="ATOM — Association of Technical Oriented Minds"
    >
      {/* 1. SPLIT BACKGROUND LAYER (z-0) */}
      <div className="absolute inset-0 w-full h-full flex flex-col md:flex-row z-0 pointer-events-none">
        <div className="w-full md:w-[65%] h-full bg-[#121212] border-b md:border-b-0 md:border-r border-[hsl(var(--rule))]" />
        <div className="w-full md:w-[35%] h-full bg-[#0a0a0a]" />
      </div>

      {/* 2. DYNAMIC CIRCUITRY LAYER (z-10) */}
      <CircuitryCanvas />

      {/* 3. FIXED MENU TOGGLE BUTTON (z-[110]) */}
      <div className="fixed top-6 right-8 z-[110] flex items-center gap-6">
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="group flex flex-col gap-1.5 focus:outline-none p-2"
          aria-label="Toggle Menu"
        >
          <motion.span 
            animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            style={{ originX: 0.5 }}
            className="w-6 h-0.5 bg-[hsl(var(--chalk))] group-hover:bg-[hsl(var(--phosphor))] transition-colors" 
          />
          <motion.span 
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-6 h-0.5 bg-[hsl(var(--chalk))] group-hover:bg-[hsl(var(--phosphor))] transition-colors" 
          />
          <motion.span 
            animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            style={{ originX: 0.5 }}
            className="w-6 h-0.5 bg-[hsl(var(--chalk))] group-hover:bg-[hsl(var(--phosphor))] transition-colors" 
          />
        </button>
      </div>

      {/* 4. CONTENT LAYER (z-20) */}
      <div className="relative z-20 w-full min-h-screen flex flex-col md:flex-row pointer-events-none">
        
        {/* LEFT COLUMN CONTENT */}
        <motion.div
          style={{ y: leftY }}
          className="w-full md:w-[65%] min-h-[60vh] md:min-h-screen flex flex-col justify-between p-8 sm:p-12 lg:p-16 relative pointer-events-auto"
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

          {/* Bottom footer text */}
          <div className="text-[0.625rem] font-mono text-[hsl(var(--graphite))] tracking-wider">
            DEVELOPING INNOVATIVE SOLUTIONS FOR THE NEXT GENERATION
          </div>
        </motion.div>

        {/* RIGHT COLUMN CONTENT */}
        <motion.div
          style={{ y: rightY }}
          className="w-full md:w-[35%] min-h-[40vh] md:min-h-screen flex flex-col justify-between p-8 sm:p-12 lg:p-16 relative pointer-events-auto"
        >
          {/* Top metadata */}
          <div className="flex items-center justify-between w-full">
            <span className="font-mono text-xs tracking-widest text-[hsl(var(--graphite))]">
              EST. 2021 — KARUNYA
            </span>
          </div>

          {/* Centered ATOM Emblem Logo */}
          <div className="my-auto flex items-center justify-center relative">
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

          {/* Bottom text */}
          <div className="text-[0.625rem] font-mono text-[hsl(var(--graphite))] tracking-wider text-right uppercase">
            [ SYSTEM ACTIVE ]
          </div>
        </motion.div>
      </div>

      {/* 5. FULLSCREEN MENU OVERLAY (z-[100]) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-[100] bg-[#121212] flex flex-col justify-center items-center p-8 sm:p-16"
          >
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
                { label: 'Sub-Clubs', path: '/#clubs-section' },
                { label: 'Events Archive', path: '/events' },
                { label: 'Core Team', path: '/core' },
                { label: 'Photo Gallery', path: '/full-gallery' }
              ].map((item, idx) => {
                const isHash = item.path.startsWith('/#');
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.5 }}
                  >
                    {isHash ? (
                      <a
                        href={item.path.substring(1)}
                        onClick={() => {
                          setMenuOpen(false);
                          const el = document.getElementById('clubs-section');
                          if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 300);
                        }}
                        className="display-m block text-[hsl(var(--chalk))] hover:text-[hsl(var(--phosphor))] uppercase tracking-tight py-3 border-b border-[hsl(var(--rule))/0.3] transition-colors"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={() => setMenuOpen(false)}
                        className="display-m block text-[hsl(var(--chalk))] hover:text-[hsl(var(--phosphor))] uppercase tracking-tight py-3 border-b border-[hsl(var(--rule))/0.3] transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.div>
                );
              })}

              <div className="mt-8 flex justify-center gap-6">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="mono-label text-xs text-[hsl(var(--graphite))] hover:text-[hsl(var(--phosphor))]">GITHUB</a>
                <span className="text-[hsl(var(--rule))]">/</span>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="mono-label text-xs text-[hsl(var(--graphite))] hover:text-[hsl(var(--phosphor))]">LINKEDIN</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;