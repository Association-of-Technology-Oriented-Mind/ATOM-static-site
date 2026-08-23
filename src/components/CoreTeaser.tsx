import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const CoreTeaser = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [absMousePos, setAbsMousePos] = useState({ x: 0, y: 0 });

  // Scroll kinetics setup
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  // Slide left/right based on scroll progress
  const textX1 = useTransform(scrollYProgress, [0, 0.85], ["-35%", "0%"]);
  const textX2 = useTransform(scrollYProgress, [0, 0.85], ["35%", "0%"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    setAbsMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    
    setMousePos({
      x: (e.clientX - rect.left - centerX) / centerX,
      y: (e.clientY - rect.top - centerY) / centerY,
    });
  };

  // Subsurface 3D shadow effect
  const shadowX = -mousePos.x * 20;
  const shadowY = -mousePos.y * 20;
  const textShadowStyle = {
    textShadow: `
      ${shadowX * 0.2}px ${shadowY * 0.2}px 0px rgba(168,255,230,0.6),
      ${shadowX * 0.5}px ${shadowY * 0.5}px 15px rgba(168,255,230,0.3),
      ${shadowX}px ${shadowY}px 30px rgba(168,255,230,0.15)
    `,
    transition: 'text-shadow 0.1s ease-out'
  };

  return (
    <section 
      ref={containerRef} 
      onMouseMove={handleMouseMove} 
      className="relative min-h-[100vh] py-32 bg-transparent group overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Ambient Marquee Background */}
      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none opacity-[0.02] select-none z-0 pt-40">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }} 
          transition={{ repeat: Infinity, ease: "linear", duration: 60 }}
          className="flex whitespace-nowrap text-white" 
          style={{ fontFamily: 'var(--font-display)', fontSize: '15vw', lineHeight: 1 }}
        >
          CYBERSECURITY — WEB DEV — AI & ML — APP DEV — AR/VR — UI/UX — CYBERSECURITY — WEB DEV — AI & ML — APP DEV — AR/VR — UI/UX — 
        </motion.div>
      </div>

      {/* Background Lattice/Noise */}
      <div className="absolute inset-0 lattice opacity-40 pointer-events-none z-0" />
      
      {/* Subsurface Flashlight */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-screen z-0"
        style={{
          background: `radial-gradient(800px circle at ${absMousePos.x}px ${absMousePos.y}px, hsl(var(--phosphor)/0.06), transparent 50%)`
        }}
      />

      <div className="relative w-full flex flex-col items-center max-w-6xl z-10 px-6 text-center">
        
        {/* 1. 04 / CORE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-4 mb-8 sm:mb-12"
        >
          <span className="mono-label px-3 py-1.5 bg-[hsl(var(--phosphor)/0.1)] border border-[hsl(var(--phosphor)/0.3)] text-[hsl(var(--phosphor))] rounded text-xs tracking-widest">
            04
          </span>
          <div className="h-px w-12 sm:w-24 bg-gradient-to-r from-[hsl(var(--phosphor)/0.5)] to-transparent" />
          <span className="mono-label tracking-widest text-[hsl(var(--graphite))] uppercase text-xs">
            CORE
          </span>
        </motion.div>

        {/* 2. Main Title - Scroll Linked Slide Kinetics */}
        <h2 
          className="w-full flex flex-col items-center mb-8 sm:mb-12 relative z-20"
          style={{ ...textShadowStyle, fontFamily: 'var(--font-display)' }}
        >
          {/* THE MINDS */}
          <div className="overflow-hidden relative w-full flex justify-center pb-1">
            <motion.div
              style={{ x: textX1 }}
              className="text-[clamp(3.5rem,8vw,10rem)] text-white whitespace-nowrap leading-[0.85] tracking-tighter uppercase drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
            >
              THE MINDS
            </motion.div>
          </div>
          
          {/* BEHIND ATOM */}
          <div className="overflow-hidden relative w-full flex justify-center pt-1">
            <motion.div
              style={{ x: textX2 }}
              className="text-[clamp(3.5rem,8vw,10rem)] text-[hsl(var(--phosphor))] whitespace-nowrap leading-[0.85] tracking-tighter uppercase"
            >
              BEHIND ATOM
            </motion.div>
          </div>
        </h2>

        {/* 3. Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="editorial-body text-[hsl(var(--chalk)/0.7)] text-lg sm:text-xl lg:text-2xl mb-12 sm:mb-16 max-w-2xl leading-relaxed mx-auto"
        >
          Twelve people. Six portfolios.<br/>
          One community driving what's next.
        </motion.p>

        {/* 4. Button - Auto-Pulsing & Glow Shimmer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <motion.div
            animate={{
              scale: [1, 1.025, 1],
              boxShadow: [
                "0 0 0 0 rgba(125, 249, 228, 0)",
                "0 0 15px 2px rgba(125, 249, 228, 0.15)",
                "0 0 0 0 rgba(125, 249, 228, 0)"
              ]
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut"
            }}
            className="inline-block"
          >
            <Link
              to="/core"
              className="group/btn relative inline-flex items-center justify-center gap-4 px-8 sm:px-12 py-4 sm:py-5 bg-transparent border border-[hsl(var(--phosphor)/0.4)] hover:border-[hsl(var(--phosphor))] text-[hsl(var(--chalk))] overflow-hidden transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.4)]"
            >
              {/* Auto Shimmer Swipe Background */}
              <motion.div
                animate={{
                  x: ["-100%", "200%"]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3.5,
                  ease: "linear",
                  repeatDelay: 1.5
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[hsl(var(--phosphor)/0.15)] to-transparent pointer-events-none"
              />

              {/* Hover sweep background */}
              <div className="absolute inset-0 bg-[hsl(var(--phosphor))] translate-y-[101%] group-hover/btn:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.2,1,0.2,1)] pointer-events-none" />
              
              <span className="relative z-10 mono-label tracking-widest group-hover/btn:text-black transition-colors duration-300">MEET THE CORE</span>
              <ArrowRight className="relative z-10 w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:text-black group-hover/btn:translate-x-1 transition-all duration-300" />
            </Link>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};
