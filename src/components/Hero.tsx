import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, Variants, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import atomLogo from '@/assets/atom-logo.webp';

// ──────────────────────────────────────────────────────────
// MATRIX-STYLE DIGITAL CIRCUITRY CANVAS
// Straight grid-locked lines with corner junction nodes
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

    // Multi-color palette
    const PALETTE = [
      { r: 125, g: 249, b: 228, glow: true },  // phosphor cyan
      { r: 255, g: 255, b: 255, glow: false },  // white
      { r: 130, g: 180, b: 255, glow: true },   // soft blue
      { r: 160, g: 240, b: 180, glow: false },   // pale green
      { r: 160, g: 160, b: 160, glow: false },   // grey
    ];

    interface CornerNode {
      x: number;
      y: number;
    }

    interface CircuitPath {
      nodes: CornerNode[];    // All corner points forming the path
      tipX: number;           // Current advancing tip
      tipY: number;
      speed: number;
      thickness: number;
      colorIdx: number;
      baseOpacity: number;
      pulseOffset: number;
      life: number;
      maxLife: number;
      segmentLength: number;  // Distance before next turn
      segmentProgress: number;
      currentAngle: number;   // Current snapped direction
    }

    let paths: CircuitPath[] = [];

    const getTargetCoords = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) return { x: w * 0.5, y: h * 0.75 };
      return { x: w * 0.825, y: h * 0.5 };
    };

    const FADE_RADIUS = 160;

    const snapAngle = (angle: number) => {
      return Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
    };

    const spawnPath = (): CircuitPath => {
      const startX = Math.random() * w * 0.45;
      const startY = Math.random() * h;
      const target = getTargetCoords();
      const angleToTarget = Math.atan2(target.y - startY, target.x - startX);
      const snapped = snapAngle(angleToTarget);

      return {
        nodes: [{ x: startX, y: startY }],
        tipX: startX,
        tipY: startY,
        speed: Math.random() * 1.4 + 0.5,
        thickness: Math.random() * 1.4 + 0.5,
        colorIdx: Math.floor(Math.random() * PALETTE.length),
        baseOpacity: Math.random() * 0.22 + 0.1,
        pulseOffset: Math.random() * Math.PI * 2,
        life: 0,
        maxLife: Math.random() * 350 + 150,
        segmentLength: Math.random() * 120 + 40,
        segmentProgress: 0,
        currentAngle: snapped,
      };
    };

    // Initialize 100 paths
    const PATH_COUNT = 100;
    for (let i = 0; i < PATH_COUNT; i++) {
      paths.push(spawnPath());
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

        // Distance from tip to target
        const dx = target.x - p.tipX;
        const dy = target.y - p.tipY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Fade factor — dissolve in last FADE_RADIUS px
        let fadeFactor = 1;
        if (dist < FADE_RADIUS) {
          fadeFactor = dist / FADE_RADIUS;
          fadeFactor = fadeFactor * fadeFactor;
        }

        // Respawn if dissolved, expired, or way out of bounds
        if (fadeFactor < 0.03 || p.life >= p.maxLife || p.tipX < -80 || p.tipX > w + 80 || p.tipY < -80 || p.tipY > h + 80) {
          paths[i] = spawnPath();
          continue;
        }

        // Advance the tip along the current straight angle
        p.tipX += Math.cos(p.currentAngle) * p.speed;
        p.tipY += Math.sin(p.currentAngle) * p.speed;
        p.segmentProgress += p.speed;

        // Check if it's time to make a turn (corner node)
        if (p.segmentProgress >= p.segmentLength) {
          // Place a corner node at current tip position
          p.nodes.push({ x: p.tipX, y: p.tipY });

          // Recalculate angle towards target and snap to grid
          const newAngleToTarget = Math.atan2(target.y - p.tipY, target.x - p.tipX);
          const snapped = snapAngle(newAngleToTarget);

          // Occasionally take a perpendicular detour for visual variety
          if (Math.random() < 0.3) {
            const turnDir = Math.random() > 0.5 ? 1 : -1;
            p.currentAngle = snapped + turnDir * (Math.PI / 4);
          } else {
            p.currentAngle = snapped;
          }

          p.segmentProgress = 0;
          p.segmentLength = Math.random() * 120 + 40;
        }

        // Cap nodes to prevent memory buildup
        if (p.nodes.length > 12) {
          p.nodes.shift();
        }

        // Compute opacity with subtle pulse
        const pulse = Math.sin(p.life * 0.04 + p.pulseOffset) * 0.06;
        const opacity = Math.max(0, (p.baseOpacity + pulse) * fadeFactor);
        const col = PALETTE[p.colorIdx];

        // Glow for cyan/blue traces
        if (col.glow && opacity > 0.06) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = `rgba(${col.r}, ${col.g}, ${col.b}, ${opacity * 0.5})`;
        } else {
          ctx.shadowBlur = 0;
        }

        // Draw the full path: nodes → tip
        ctx.beginPath();
        ctx.moveTo(p.nodes[0].x, p.nodes[0].y);
        for (let n = 1; n < p.nodes.length; n++) {
          ctx.lineTo(p.nodes[n].x, p.nodes[n].y);
        }
        ctx.lineTo(p.tipX, p.tipY);
        ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${opacity})`;
        ctx.lineWidth = p.thickness * fadeFactor;
        ctx.stroke();

        // Corner junction squares
        ctx.shadowBlur = 0;
        for (let n = 0; n < p.nodes.length; n++) {
          const nodeOpacity = opacity * 0.7;
          ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${nodeOpacity})`;
          ctx.fillRect(p.nodes[n].x - 1.5, p.nodes[n].y - 1.5, 3, 3);
        }

        // Glowing tip
        const tipPulse = Math.sin(p.life * 0.08 + p.pulseOffset) * 0.3 + 0.7;
        const tipOpacity = Math.min(opacity * tipPulse * 1.5, 0.8) * fadeFactor;
        ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${tipOpacity})`;
        ctx.fillRect(p.tipX - 2.5, p.tipY - 2.5, 5, 5);

        // Outer tip glow ring for cyan/blue
        if (col.glow) {
          ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${tipOpacity * 0.4})`;
          ctx.strokeRect(p.tipX - 4, p.tipY - 4, 8, 8);
        }
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
      className="absolute inset-0 w-full h-full pointer-events-none opacity-80 z-10"
    />
  );
}

// ──────────────────────────────────────────────────────────
// MINIMAL PARALLAX STARFIELD
// ──────────────────────────────────────────────────────────
function SpaceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;

    interface Star {
      x: number;
      y: number;
      size: number;
      baseOpacity: number;
      layer: number; // 1 (back) to 3 (front)
      twinkleSpeed: number;
      twinklePhase: number;
    }

    const stars: Star[] = [];
    const numStars = 300;

    for (let i = 0; i < numStars; i++) {
      // Skew distribution so most stars are in the background (layer 1)
      const layerRandom = Math.random();
      let layer = 1;
      if (layerRandom > 0.9) layer = 3;
      else if (layerRandom > 0.6) layer = 2;

      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: layer * (Math.random() * 0.5 + 0.5), // bigger if closer
        baseOpacity: layer === 1 ? Math.random() * 0.3 + 0.1 : Math.random() * 0.5 + 0.4,
        layer: layer,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    // Target offsets for parallax based on mouse
    let targetOffsetX = 0;
    let targetOffsetY = 0;
    
    // Current smoothed offsets
    let currentOffsetX = 0;
    let currentOffsetY = 0;
    
    // Constant space drift
    let driftX = 0;
    let driftY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Track mouse across the entire window for better parallax
      const wWidth = window.innerWidth;
      const wHeight = window.innerHeight;
      
      // Calculate offset from center (-1 to 1)
      const xPct = (e.clientX / wWidth) * 2 - 1;
      const yPct = (e.clientY / wHeight) * 2 - 1;

      // Max pixels to move the front layer - increased for visibility
      const maxOffset = 150; 
      targetOffsetX = -xPct * maxOffset;
      targetOffsetY = -yPct * maxOffset;
    };

    const handleMouseLeave = () => {
      targetOffsetX = 0;
      targetOffsetY = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const wWidth = window.innerWidth;
      const wHeight = window.innerHeight;
      
      const xPct = (e.touches[0].clientX / wWidth) * 2 - 1;
      const yPct = (e.touches[0].clientY / wHeight) * 2 - 1;

      const maxOffset = 150; 
      targetOffsetX = -xPct * maxOffset;
      targetOffsetY = -yPct * maxOffset;
    };

    const handleTouchEnd = () => {
      targetOffsetX = 0;
      targetOffsetY = 0;
    };

    // Attach to window so it tracks even if hovering over other elements
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchstart', handleTouchMove);

    let rafId: number;

    const draw = () => {
      ctx.fillStyle = '#0a0a0a'; 
      ctx.fillRect(0, 0, w, h);

      // Smoothly approach target offset
      currentOffsetX += (targetOffsetX - currentOffsetX) * 0.05;
      currentOffsetY += (targetOffsetY - currentOffsetY) * 0.05;
      
      // Add constant slow drift to make it feel alive even when mouse is still
      driftX += 0.2;
      driftY += 0.1;

      for (let i = 0; i < numStars; i++) {
        const star = stars[i];
        
        // Twinkle effect
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinklePhase) * 0.3;
        const opacity = Math.max(0, Math.min(1, star.baseOpacity + twinkle));

        // Parallax offset depends on layer
        // Layer 1 moves slowest, Layer 3 moves fastest
        const parallaxX = (currentOffsetX + driftX) * (star.layer * 0.5);
        const parallaxY = (currentOffsetY + driftY) * (star.layer * 0.5);

        let finalX = star.x + parallaxX;
        let finalY = star.y + parallaxY;

        // Wrap around logic so we never run out of stars if moving a lot
        if (finalX < 0) finalX = w - (-finalX % w);
        if (finalX > w) finalX = finalX % w;
        if (finalY < 0) finalY = h - (-finalY % h);
        if (finalY > h) finalY = finalY % h;

        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        
        // Slight cyan tint to layer 3 for depth and matching theme
        if (star.layer === 3) {
           ctx.fillStyle = `rgba(125, 249, 228, ${opacity * 0.8})`; 
        }

        ctx.beginPath();
        ctx.arc(finalX, finalY, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow for bright/close stars
        if (star.layer === 3 && opacity > 0.6) {
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(125, 249, 228, 0.5)';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchstart', handleTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 cursor-default transition-opacity duration-1000"
      style={{ touchAction: 'none' }}
    />
  );
}

// ──────────────────────────────────────────────────────────
// RIGHT PANEL COMPONENT (INTERACTIVE)
// ──────────────────────────────────────────────────────────
function RightPanel({ rightY }: { rightY: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // framer motion for logo tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ y: rightY }}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full md:w-[35%] min-h-[40vh] md:min-h-screen flex flex-col justify-between p-8 sm:p-12 lg:p-16 relative pointer-events-auto overflow-hidden group"
    >
      <SpaceCanvas />
      
      {/* Top metadata */}
      <div className="relative z-10 flex items-center justify-between w-full pointer-events-none">
        <span className="font-mono text-xs tracking-widest text-[hsl(var(--graphite))]">
          EST. 2026 — KARUNYA
        </span>
      </div>

      {/* Centered ATOM Emblem Logo */}
      <div className="relative z-10 my-auto flex items-center justify-center pointer-events-none" style={{ perspective: '1000px' }}>
        <div className="absolute w-[200px] h-[200px] bg-[hsl(var(--phosphor))] opacity-[0.06] blur-[60px] rounded-full group-hover:opacity-[0.15] transition-opacity duration-700" />
        
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ rotateX, rotateY }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          src={atomLogo}
          alt="ATOM Emblem"
          className="w-48 h-48 sm:w-64 sm:h-64 object-contain filter drop-shadow-[0_0_15px_rgba(125,249,228,0.1)] group-hover:drop-shadow-[0_0_25px_rgba(125,249,228,0.4)] transition-all duration-700"
        />
      </div>

      
    </motion.div>
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
        <RightPanel rightY={rightY} />
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