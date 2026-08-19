import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';

// ──────────────────────────────────────────────────────────
// CANVAS PARTICLE FIELD
// ──────────────────────────────────────────────────────────
function ParticleCanvas() {
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

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      alpha: number;
      da: number;
      z: number;
    }

    // Dense starfield
    const particles: Particle[] = Array.from({ length: 220 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      da: (Math.random() - 0.5) * 0.01,
      z: Math.random() * 2.5 + 0.8,
    }));

    let rafId: number;
    let frame = 0;

    // Mouse tracking for parallax
    let mouseX = w / 2;
    let mouseY = h / 2;
    let currentOffsetX = 0;
    let currentOffsetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', onMouseMove);

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, w, h);

      // Mouse parallax offset
      const targetOffsetX = (mouseX - w / 2) * 0.12;
      const targetOffsetY = (mouseY - h / 2) * 0.12;
      currentOffsetX += (targetOffsetX - currentOffsetX) * 0.08;
      currentOffsetY += (targetOffsetY - currentOffsetY) * 0.08;

      for (const p of particles) {
        // Natural drift
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.da;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        if (p.alpha < 0.05 || p.alpha > 0.75) p.da *= -1;

        // Apply depth-based parallax offset
        const drawX = p.x + currentOffsetX * p.z;
        const drawY = p.y + currentOffsetY * p.z;

        ctx.beginPath();
        ctx.arc(drawX, drawY, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();
      }

      // Connecting lines between close particles
      if (frame % 2 === 0) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const p1X = particles[i].x + currentOffsetX * particles[i].z;
            const p1Y = particles[i].y + currentOffsetX * particles[i].z;
            const p2X = particles[j].x + currentOffsetX * particles[j].z;
            const p2Y = particles[j].y + currentOffsetX * particles[j].z;

            const dx = p1X - p2X;
            const dy = p1Y - p2Y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 100) {
              ctx.beginPath();
              ctx.moveTo(p1X, p1Y);
              ctx.lineTo(p2X, p2Y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - dist / 100) * 0.1})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    const onResize = () => {
      if (!canvas) return;
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener('resize', onResize);
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
    />
  );
}

// ──────────────────────────────────────────────────────────
// STAGGERED WORD REVEAL
// ──────────────────────────────────────────────────────────
const wordVariants: Variants = {
  hidden: { opacity: 0, y: 50, skewY: 3, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, skewY: 0, filter: 'blur(0px)' },
};

function SplitText({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <span className={`inline-block overflow-visible ${className ?? ''}`} style={{ display: 'block' }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block mr-[0.2em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// ──────────────────────────────────────────────────────────
// HERO COMPONENT
// ──────────────────────────────────────────────────────────
export const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  // Parallax transform on scroll
  const textY = useTransform(scrollY, [0, 800], [0, -120]);

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-start pt-28 overflow-x-hidden bg-[hsl(var(--ink))]"
      aria-label="ATOM — Association of Technical Oriented Minds"
    >
      {/* Particle field background */}
      <ParticleCanvas />

      {/* Lighting / Vignette */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[hsl(var(--phosphor))] opacity-[0.015] blur-[120px] rounded-full" />
      </div>

      {/* Bottom fade transition */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[hsl(var(--ink))] to-transparent pointer-events-none z-20" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        
        {/* Main headline — staggered word reveal */}
        <motion.div
          style={{ y: textY }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 mt-12"
        >
          <div className="text-[12vw] md:text-[8.5rem] lg:text-[10rem] font-black leading-[0.88] tracking-[-0.04em] flex flex-col items-center pb-4 select-none">
            <SplitText text="Where" className="text-[hsl(var(--chalk))]" />
            <SplitText text="Technical" className="text-[hsl(var(--chalk))]" />
            <SplitText text="Minds Build" className="text-[hsl(var(--chalk))]" />
            <SplitText text="What Comes" className="text-[hsl(var(--chalk))]" />
            <span className="block overflow-hidden">
              {['Next.'].map((word) => (
                <motion.span
                  key={word}
                  variants={wordVariants}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block text-[hsl(var(--phosphor))]"
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </div>
        </motion.div>

        {/* Sub copy */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="editorial-body max-w-2xl mb-12 text-[hsl(var(--chalk)/0.7)] px-4"
        >
          ATOM is Karunya's premier technical association — four specialized clubs,
          hundreds of builders, and one shared mission: create technology that matters.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-wrap items-center justify-center gap-4 z-30"
        >
          <a
            href="#clubs-section"
            className="btn-tech flex items-center gap-2 border border-[hsl(var(--rule))] px-8 py-3.5 hover:border-[hsl(var(--phosphor))] hover:text-[hsl(var(--phosphor))]"
          >
            Explore Clubs
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="#about"
            className="btn-tech border border-[hsl(var(--rule))] px-8 py-3.5 hover:border-[hsl(var(--phosphor))] hover:text-[hsl(var(--phosphor))]"
          >
            Our Story
          </a>
        </motion.div>

      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="mt-auto mb-8 flex flex-col items-center gap-2.5 z-20"
      >
        <span className="mono-label text-[0.625rem] text-[hsl(var(--graphite))]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-[hsl(var(--graphite))] to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default Hero;