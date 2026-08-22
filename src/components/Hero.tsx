import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, Variants, AnimatePresence } from 'framer-motion';
import atomLogo from '@/assets/atom-logo.webp';

// ──────────────────────────────────────────────────────────
// DIGITAL CIRCUITRY GRAPH & VORTEX SUCTION CANVAS ANIMATION
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

    interface PathNode {
      x: number;
      y: number;
    }

    interface CircuitPath {
      points: PathNode[];
      currentX: number;
      currentY: number;
      targetX: number;
      targetY: number;
      speed: number;
      type: 'cyan' | 'white' | 'grey';
      color: string;
      life: number;
      maxLife: number;
      pulseOffset: number;
      pulseProgress: number; // for cyan flowing pulses
    }

    interface OrbitParticle {
      radius: number;
      angle: number;
      speed: number;
      size: number;
      color: string;
    }

    let paths: CircuitPath[] = [];
    let orbitParticles: OrbitParticle[] = [];

    // Target coordinates (ATOM Logo center on the right side)
    const getTargetCoords = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        return { x: w * 0.5, y: h * 0.75 };
      }
      return { x: w * 0.825, y: h * 0.5 };
    };

    const spawnPath = (): CircuitPath => {
      const startX = Math.random() * (w * 0.35);
      const startY = Math.random() * h;
      const target = getTargetCoords();
      
      const rand = Math.random();
      let type: 'cyan' | 'white' | 'grey' = 'white';
      let color = 'rgba(255, 255, 255, 0.12)';
      let speed = Math.random() * 1.0 + 0.6;
      
      if (rand < 0.28) {
        type = 'cyan';
        color = 'rgba(125, 249, 228, 0.35)'; // High energy cyan
        speed = Math.random() * 1.5 + 1.0;
      } else if (rand > 0.75) {
        type = 'grey';
        color = 'rgba(255, 255, 255, 0.05)'; // Dim background traces
        speed = Math.random() * 0.6 + 0.4;
      }

      return {
        points: [{ x: startX, y: startY }],
        currentX: startX,
        currentY: startY,
        targetX: target.x,
        targetY: target.y,
        speed,
        type,
        color,
        life: 0,
        maxLife: Math.random() * 240 + 120,
        pulseOffset: Math.random() * Math.PI * 2,
        pulseProgress: 0,
      };
    };

    const spawnOrbitParticle = (): OrbitParticle => {
      const randColor = Math.random() > 0.4 ? 'rgba(125, 249, 228, 0.35)' : 'rgba(255, 255, 255, 0.2)';
      return {
        radius: Math.random() * 150 + 40,
        angle: Math.random() * Math.PI * 2,
        speed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 2.5 + 1.0,
        color: randColor,
      };
    };

    // Initialize paths
    for (let i = 0; i < 55; i++) {
      paths.push(spawnPath());
    }

    // Initialize orbit particles
    for (let i = 0; i < 45; i++) {
      orbitParticles.push(spawnOrbitParticle());
    }

    let rafId: number;

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, w, h);

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.012)';
      ctx.lineWidth = 1;
      const gridSize = 48;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const target = getTargetCoords();

      // Update and draw background circuitry paths
      paths.forEach((p, idx) => {
        p.life++;
        p.pulseProgress += 0.008;
        if (p.pulseProgress > 1) p.pulseProgress = 0;

        // Calculate vector to target logo
        const dx = p.targetX - p.currentX;
        const dy = p.targetY - p.currentY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Advance tip
        if (dist > 30 && p.life < p.maxLife) {
          const angleToTarget = Math.atan2(dy, dx);
          
          if (dist < 220) {
            // Spiral vortex suction effect: curve lines inwards
            const suctionStrength = (220 - dist) / 220; // 0 to 1
            const spiralAngle = angleToTarget + suctionStrength * Math.PI * 0.45;
            p.currentX += Math.cos(spiralAngle) * p.speed * 1.6;
            p.currentY += Math.sin(spiralAngle) * p.speed * 1.6;
          } else {
            // Snap angle to 0, 45, -45, 90, -90 degrees for digital layout
            const snappedAngle = Math.round(angleToTarget / (Math.PI / 4)) * (Math.PI / 4);
            p.currentX += Math.cos(snappedAngle) * p.speed;
            p.currentY += Math.sin(snappedAngle) * p.speed;

            // Occasional corner junctions
            if (Math.random() < 0.02 && p.points.length < 7) {
              p.points.push({ x: p.currentX, y: p.currentY });
            }
          }
        }

        // Apply glow filters for Cyan paths
        const isCyan = p.type === 'cyan';
        if (isCyan) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(125, 249, 228, 0.45)';
        } else {
          ctx.shadowBlur = 0;
        }

        // Draw path line
        ctx.beginPath();
        ctx.moveTo(p.points[0].x, p.points[0].y);
        for (let i = 1; i < p.points.length; i++) {
          ctx.lineTo(p.points[i].x, p.points[i].y);
        }
        ctx.lineTo(p.currentX, p.currentY);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = isCyan ? 1.4 : 1.0;
        ctx.stroke();

        // Draw corner junctions
        ctx.shadowBlur = 0; // reset glow for nodes
        p.points.forEach((pt) => {
          ctx.fillStyle = isCyan ? 'rgba(125, 249, 228, 0.4)' : 'rgba(255, 255, 255, 0.12)';
          ctx.fillRect(pt.x - 1.5, pt.y - 1.5, 3, 3);
        });

        // Pulsing tip at the end of trace
        const pulse = Math.sin(p.life * 0.08 + p.pulseOffset) * 0.3 + 0.7;
        ctx.fillStyle = isCyan 
          ? `rgba(125, 249, 228, ${pulse * 0.7})` 
          : `rgba(255, 255, 255, ${pulse * 0.4})`;
        ctx.fillRect(p.currentX - 2.5, p.currentY - 2.5, 5, 5);

        // Respawn if path gets sucked into logo center or lifespan ends
        if (p.life >= p.maxLife || dist <= 30) {
          paths[idx] = spawnPath();
        }
      });

      // Update and draw orbit suction particles (Vortex)
      ctx.shadowBlur = 0;
      orbitParticles.forEach((op, idx) => {
        // Orbit around target
        op.angle += op.speed;
        
        // Pull particle inward gradually (suction flow)
        op.radius -= 0.35;
        
        const px = target.x + Math.cos(op.angle) * op.radius;
        const py = target.y + Math.sin(op.angle) * op.radius;

        // Render suction particle
        ctx.fillStyle = op.color;
        ctx.fillRect(px - op.size / 2, py - op.size / 2, op.size, op.size);

        // Respawn when sucked into core or goes out of boundary
        if (op.radius <= 18) {
          orbitParticles[idx] = spawnOrbitParticle();
          // Reset radius to outer orbit
          orbitParticles[idx].radius = Math.random() * 80 + 120;
        }
      });

      // Target core gravity well visual aura
      ctx.fillStyle = 'rgba(125, 249, 228, 0.02)';
      ctx.beginPath();
      ctx.arc(target.x, target.y, 160, 0, Math.PI * 2);
      ctx.fill();

      rafId = requestAnimationFrame(updateAndDraw);
    };

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    };

    window.addEventListener('resize', handleResize);
    rafId = requestAnimationFrame(updateAndDraw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60 z-10"
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

      {/* 2. DYNAMIC CIRCUITRY & VORTEX LAYER (z-10) */}
      <CircuitryCanvas />

      {/* 3. FIXED MENU TOGGLE BUTTON (z-[110] so it is clickable above the overlay) */}
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

      {/* 4. CONTENT LAYER WITH TRANSPARENT BACKGROUNDS (z-20) */}
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

          {/* Bottom footer text (Left side) */}
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
      </div>

      {/* 5. STAGGERED FULLSCREEN MENU OVERLAY (z-[100]) */}
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