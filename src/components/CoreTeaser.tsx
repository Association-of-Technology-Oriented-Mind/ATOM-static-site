import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ScrollScene from '@/components/scroll/ScrollScene';
import { easeInOut, prog } from '@/utils/scrollMath';

export const CoreTeaser = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [absMousePos, setAbsMousePos] = useState({ x: 0, y: 0 });

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
      className="relative bg-transparent group overflow-hidden"
    >
      <ScrollScene heightVh={240}>
        {(progress) => {
          // Slide left/right based on the scroll progress of the scene
          const slideProgress = easeInOut(prog(progress, 0.1, 0.75));
          const textX1 = slideProgress * 35 - 35; // moves from -35% to 0%
          const textX2 = slideProgress * -35 + 35; // moves from 35% to 0%
          
          // Fade in and out
          let opacity = 1;
          if (progress < 0.15) {
            opacity = progress / 0.15;
          } else if (progress > 0.85) {
            opacity = Math.max(0, (1 - progress) / 0.15);
          }

          return (
            <div 
              className="h-full w-full flex flex-col items-center justify-center relative px-6 text-center"
              style={{ opacity }}
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

              <div className="relative w-full flex flex-col items-center max-w-6xl z-10">
                
                {/* 1. 04 / CORE */}
                <div className="flex items-center gap-4 mb-8 sm:mb-12">
                  <span className="mono-label px-3 py-1.5 bg-[hsl(var(--phosphor)/0.15)] border border-[hsl(var(--phosphor)/0.3)] text-[hsl(var(--phosphor))] rounded text-xs tracking-widest">
                    04
                  </span>
                  <div className="h-px w-12 sm:w-24 bg-gradient-to-r from-[hsl(var(--phosphor)/0.5)] to-transparent" />
                  <span className="mono-label tracking-widest text-[hsl(var(--graphite))] uppercase text-xs">
                    CORE
                  </span>
                </div>

                {/* 2. Main Title - Scroll Linked Slide Kinetics */}
                <h2 
                  className="w-full flex flex-col items-center mb-8 sm:mb-12 relative z-20"
                  style={{ ...textShadowStyle, fontFamily: 'var(--font-display)' }}
                >
                  {/* THE MINDS */}
                  <div className="overflow-hidden relative w-full flex justify-center pb-1">
                    <div
                      style={{ transform: `translate3d(${textX1}%, 0, 0)` }}
                      className="text-[clamp(3.5rem,8vw,10rem)] text-white whitespace-nowrap leading-[0.85] tracking-tighter uppercase drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                    >
                      THE MINDS
                    </div>
                  </div>
                  
                  {/* BEHIND ATOM */}
                  <div className="overflow-hidden relative w-full flex justify-center pt-1">
                    <div
                      style={{ transform: `translate3d(${textX2}%, 0, 0)` }}
                      className="text-[clamp(3.5rem,8vw,10rem)] text-[hsl(var(--phosphor))] whitespace-nowrap leading-[0.85] tracking-tighter uppercase"
                    >
                      BEHIND ATOM
                    </div>
                  </div>
                </h2>

                {/* 3. Description */}
                <p className="editorial-body text-[hsl(var(--chalk)/0.7)] text-lg sm:text-xl lg:text-2xl mb-12 sm:mb-16 max-w-2xl leading-relaxed mx-auto">
                  Twelve people. Six portfolios.<br/>
                  One community driving what's next.
                </p>

                {/* 4. Button - Auto-Pulsing & Glow Shimmer */}
                <div className="inline-block">
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
                </div>

              </div>
            </div>
          );
        }}
      </ScrollScene>
    </section>
  );
};
