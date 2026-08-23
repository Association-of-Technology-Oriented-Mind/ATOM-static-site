import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import ScrollScene from '@/components/scroll/ScrollScene';
import { easeInOut, prog } from '@/utils/scrollMath';

// Import real club icons (the .ico files will be replaced with WebP — see GOAL.md)
import { DotIcon, BiasIcon, HackIcon } from '@/constants/clubs';
import qyroLogo from '@/assets/qyro.webp';

// ── Club data ────────────────────────────────────────────────────────────────
// 4 clubs per GOAL.md: HackHive, DotDev, UnBias, Qyro.
// RND and Career Guidance are removed from this component (their constant files
// can be cleaned up separately once nothing else imports them).
//
// Qyro content marked [DATA REQUIRED] — see GOAL.md / "Waiting on Lebi".

interface CoordinatorDef {
  name: string;
  role: string;
  image: string | null;
}

interface ClubDef {
  id: string;
  slug: string;
  name: string;
  tag: string;           // short mono-label category
  description: string;
  coordinators: CoordinatorDef[];
  logo: string | null;   // imported asset URL, or null for icon fallback
  logoAlt: string;
}

const CLUBS: ClubDef[] = [
  {
    id: 'hackhive',
    slug: 'hackhive',
    name: 'Hack Hive',
    tag: 'CYBERSECURITY',
    description:
      'A student-driven club that brings together passionate individuals to explore, learn, and innovate in the field of information security. Hands-on CTFs, ethical hacking workshops, and security competitions.',
    coordinators: [
      { name: 'Sanjay S', role: 'Coordinator', image: null },
      { name: 'Jayesh V Prakash Naidu', role: 'Joint Coordinator', image: null },
    ],
    logo: HackIcon,
    logoAlt: 'Hack Hive icon',
  },
  {
    id: 'dotdev',
    slug: 'dotdev',
    name: 'DotDev',
    tag: 'WEB DEVELOPMENT',
    description:
      'A student community for aspiring software engineers focused on full-stack development. Hackathons, code sprints, mentorship sessions and collaborative projects — from frontend to backend to deployment.',
    coordinators: [
      { name: 'Dharshan Kumar J', role: 'Coordinator', image: null },
      { name: 'Danish Prabhu K V', role: 'Joint Coordinator', image: null },
    ],
    logo: DotIcon,
    logoAlt: 'DotDev icon',
  },
  {
    id: 'unbias',
    slug: 'unbias',
    name: 'Unbiased',
    tag: 'AI / ML / NLP',
    description:
      'Exploring AI, ML, Deep Learning, NLP, Generative AI and Agents. Weekly sessions, research paper discussions, and hands-on model building — with a focus on department-relevant applications.',
    coordinators: [
      { name: 'Aravindan M', role: 'Coordinator', image: null },
      { name: 'Ronnie A Jeffrey', role: 'Joint Coordinator', image: null },
    ],
    logo: BiasIcon,
    logoAlt: 'Unbiased club icon',
  },
  {
    id: 'qyro',
    slug: 'qyro',
    name: 'Qyro',
    tag: 'NEW CLUB',               // [DATA REQUIRED] — actual tag/focus unknown
    description:
      '[DATA REQUIRED] — Club description, objectives and focus area for Qyro are pending. Please supply this content.',
    coordinators: [
      { name: '[DATA REQUIRED]', role: 'Coordinator', image: null },
      { name: '[DATA REQUIRED]', role: 'Joint Coordinator', image: null },
    ],
    logo: qyroLogo,
    logoAlt: 'Qyro club logo',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

// ── Scene timing ─────────────────────────────────────────────────────────────
const INTRO_IN: [number, number] = [0.0, 0.15];
const COORD_IN: [number, number] = [0.15, 0.4];
const JOINT_IN: [number, number] = [0.35, 0.6];
const DETAIL_IN: [number, number] = [0.55, 0.75];

const getSceneTimeline = (progress: number, reducedMotion: boolean) => {
  const safeProgress = clamp01(progress);
  if (reducedMotion) {
    return { intro: 1, coord: 1, joint: 1, details: 1 };
  }
  return {
    intro: easeInOut(prog(safeProgress, ...INTRO_IN)),
    coord: easeInOut(prog(safeProgress, ...COORD_IN)),
    joint: easeInOut(prog(safeProgress, ...JOINT_IN)),
    details: easeInOut(prog(safeProgress, ...DETAIL_IN)),
  };
};

const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setReducedMotion(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener?.('change', handleChange);
    return () => mediaQuery.removeEventListener?.('change', handleChange);
  }, []);

  return reducedMotion;
};

// ── Sub-components ────────────────────────────────────────────────────────────

const ClubScene = ({
  club,
  index,
  progress,
  reducedMotion,
}: {
  club: ClubDef;
  index: number;
  progress: number;
  reducedMotion: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const membersRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const headline = headlineRef.current;
    const members = membersRef.current;
    const details = detailsRef.current;
    const watermark = watermarkRef.current;
    
    if (!headline || !members || !details) return;

    const t = getSceneTimeline(progress, reducedMotion);

    // Watermark parallax
    if (watermark) {
       watermark.style.opacity = String(t.intro * 0.08); // very faint
       watermark.style.transform = reducedMotion ? 'none' : `scale(${1 + t.intro * 0.1}) translate3d(0, ${(1 - t.intro) * 100}px, 0)`;
    }

    // Headline (Part 1: Left Side)
    headline.style.opacity = String(t.intro);
    headline.style.transform = reducedMotion ? 'none' : `translate3d(${(1 - t.intro) * -30}px, 0, 0)`;

    // Members (Part 2: Right Side) - Deck Reveal Animation
    const topCard = members.children[0] as HTMLElement;
    const bottomCard = members.children[1] as HTMLElement;
    
    if (topCard) {
      topCard.style.opacity = String(t.coord);
      const rot1 = -8 * t.coord;
      const x1 = -30 * t.coord;
      const y1 = (1 - t.coord) * 60; 
      topCard.style.transform = reducedMotion ? 'none' : `translate3d(${x1}px, ${y1}px, 0) rotate(${rot1}deg)`;
    }
    
    if (bottomCard) {
      bottomCard.style.opacity = String(t.joint);
      const rot2 = 8 * t.joint;
      const x2 = 30 * t.joint;
      const y2 = (1 - t.joint) * 60;
      bottomCard.style.transform = reducedMotion ? 'none' : `translate3d(${x2}px, ${y2}px, 0) rotate(${rot2}deg)`;
    }

    // Details / Explore button
    details.style.opacity = String(t.details);
    details.style.transform = reducedMotion ? 'none' : `translate3d(0, ${(1 - t.details) * 30}px, 0)`;
  }, [progress, reducedMotion]);

  return (
    <div className="relative h-full w-full overflow-hidden lattice bg-transparent" ref={containerRef}>
      {/* Massive Background Watermark */}
      <div 
        ref={watermarkRef}
        className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0"
        style={{ willChange: 'opacity, transform' }}
      >
        <span 
          className="text-[20vw] font-black text-white whitespace-nowrap uppercase select-none opacity-[0.03]" 
          style={{ fontFamily: 'var(--font-display)', transform: 'rotate(-5deg) scale(1.2)' }}
        >
          {club.name}
        </span>
      </div>

      {/* Split container */}
      <div className="absolute inset-0 z-10 flex flex-col md:flex-row h-full max-w-[var(--container-xl)] mx-auto">
        
        {/* Left: Club Info */}
        <div 
          ref={headlineRef}
          className="flex-1 flex flex-col justify-center px-8 md:px-16 py-12 md:py-0 relative z-20"
          style={{ willChange: 'opacity, transform' }}
        >
          <div className="w-full max-w-lg mx-auto md:mr-auto md:ml-0">
            {/* Meta Tags */}
            <div className="mb-8 sm:mb-12 flex items-center gap-4">
              <span className="mono-label px-3 py-1 bg-[hsl(var(--phosphor)/0.15)] border border-[hsl(var(--phosphor)/0.3)] rounded text-[hsl(var(--phosphor))] shadow-[0_0_10px_hsl(var(--phosphor)/0.2)]">
                0{index + 1} / 0{CLUBS.length}
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-[hsl(var(--phosphor)/0.5)] to-transparent" aria-hidden="true" />
              <span className="mono-label tracking-widest text-[hsl(var(--chalk))] uppercase">{club.tag}</span>
            </div>
            
            {/* Title & Logo */}
            <div className="flex items-center gap-6 mb-8 relative">
              {club.logo && (
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                  <div className="absolute inset-0 bg-[hsl(var(--phosphor))] blur-xl opacity-20 animate-pulse" />
                  <img
                    src={club.logo}
                    alt={club.logoAlt}
                    className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  />
                </div>
              )}
              <h3
                className="text-5xl sm:text-7xl text-white font-bold leading-none tracking-tighter uppercase drop-shadow-2xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {club.name}
              </h3>
            </div>
            
            {/* Description */}
            <p className="text-base sm:text-lg leading-relaxed text-[hsl(var(--chalk)/0.75)] p-6 bg-black/20 border-l-2 border-[hsl(var(--phosphor)/0.5)] rounded-r-lg backdrop-blur-sm">
              {club.description}
            </p>
          </div>
        </div>

        {/* Right: Coordinators & Explore */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-12 md:py-0 relative z-20">
          <div className="w-full max-w-lg mx-auto md:ml-auto md:mr-0 flex flex-col items-start md:items-end">
            
            {/* Portrait Coordinator Cards */}
            <div 
              ref={membersRef}
              className="flex flex-row justify-center md:justify-end -space-x-12 md:-space-x-20 w-full"
              style={{ willChange: 'opacity' }}
            >
              {club.coordinators.map((coord, i) => {
                const isTBA = !coord.image || coord.name === '[DATA REQUIRED]';
                
                return (
                  <div 
                    key={i}
                    className={`w-48 sm:w-56 md:w-64 aspect-[3/4] flex flex-col rounded-3xl border border-[hsl(var(--phosphor)/0.2)] bg-black backdrop-blur-md shadow-[0_30px_60px_rgba(0,0,0,0.8)] transition-all relative overflow-hidden group ${i % 2 !== 0 ? 'mt-12 md:mt-16' : ''}`}
                    style={{ willChange: 'transform' }}
                  >
                    {/* Subtle inner card glow for hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--phosphor)/0.15)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none rounded-3xl" />

                    {/* Holographic Glare */}
                    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-3xl">
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out translate-x-[-100%] group-hover:translate-x-[100%]" />
                    </div>

                    {isTBA ? (
                      /* ── TBA STATE ── */
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black rounded-3xl">
                        {/* Giant Background TBA */}
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] sm:text-[10rem] md:text-[12rem] font-black text-white/5 select-none z-0 tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>TBA</span>
                        
                        <div className="relative z-10 flex flex-col items-center">
                          <span className="text-[9px] sm:text-[10px] md:text-[11px] text-[hsl(var(--graphite))] uppercase tracking-[0.2em] mb-4 leading-tight">{coord.role}</span>
                          <h4 className="text-base sm:text-lg md:text-xl font-black text-[hsl(var(--chalk))] uppercase tracking-wider mb-4 leading-tight drop-shadow-md">POSITION<br/>OPEN</h4>
                          <div className="w-12 h-[2px] bg-[hsl(var(--phosphor))] mb-4 opacity-70" />
                          <p className="text-[9px] sm:text-[10px] md:text-[11px] text-[hsl(var(--graphite))] italic max-w-[90%] leading-relaxed">
                            A short intro will appear once this position is filled.
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* ── FILLED STATE ── */
                      <>
                        <img src={coord.image!} alt={coord.name} className="absolute inset-0 w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                          <span className="text-[9px] sm:text-[10px] text-[hsl(var(--phosphor))] uppercase tracking-widest mb-1.5">{coord.role}</span>
                          <h4 className="text-sm sm:text-lg font-bold text-white uppercase leading-tight">{coord.name}</h4>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Glowing Terminal CTA */}
            <div
              ref={detailsRef}
              className="mt-12 w-full md:w-auto"
              style={{ willChange: 'opacity, transform' }}
            >
              <Link
                to={`/clubs/${club.slug}`}
                className="group relative inline-flex items-center justify-between gap-6 bg-black/60 border border-[hsl(var(--phosphor)/0.4)] hover:border-[hsl(var(--phosphor))] px-8 py-5 w-full md:w-auto overflow-hidden transition-all duration-300 rounded shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_hsl(var(--phosphor)/0.2)]"
              >
                {/* Swipe Glow */}
                <div className="absolute inset-0 bg-[hsl(var(--phosphor)/0.1)] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                
                <div className="relative z-10 flex items-center gap-3">
                  <span className="w-2 h-2 bg-[hsl(var(--phosphor))] rounded-full animate-pulse shadow-[0_0_8px_hsl(var(--phosphor))]" />
                  <span className="mono-label text-[hsl(var(--chalk))] group-hover:text-white transition-colors uppercase tracking-[0.2em] text-xs">Initiate Handshake</span>
                </div>
                
                <svg className="w-4 h-4 text-[hsl(var(--graphite))] group-hover:text-[hsl(var(--phosphor))] transition-colors relative z-10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

export const Clubs = () => {
  const reducedMotion = useReducedMotion();
  
  // For kinetic typography
  const introRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: introRef,
    offset: ["start end", "end start"]
  });

  // Slide left to center
  const textX1 = useTransform(scrollYProgress, [0, 0.45], ["-40%", "0%"]);
  // Slide right to center
  const textX2 = useTransform(scrollYProgress, [0, 0.45], ["40%", "0%"]);
  
  // Scale down and fade slightly as it scrolls away
  const opacityOut = useTransform(scrollYProgress, [0.5, 0.8], [1, 0]);
  const scaleOut = useTransform(scrollYProgress, [0.5, 0.8], [1, 0.9]);

  return (
    <section id="clubs-section" className="relative lattice overflow-hidden bg-transparent" aria-label="ATOM Sub-Clubs">
      
      {/* ── Ambient Marquee Background ── */}
      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none opacity-[0.02] select-none z-0 pt-40">
        <motion.div 
          animate={reducedMotion ? {} : { x: ["0%", "-50%"] }} 
          transition={{ repeat: Infinity, ease: "linear", duration: 60 }}
          className="flex whitespace-nowrap text-white" 
          style={{ fontFamily: 'var(--font-display)', fontSize: '15vw', lineHeight: 1 }}
        >
          HACK HIVE — DOTDEV — UNBIASED — QYRO — HACK HIVE — DOTDEV — UNBIASED — QYRO — HACK HIVE — DOTDEV — UNBIASED — QYRO — 
        </motion.div>
      </div>

      {/* ── Massive Kinetic Typography Intro ── */}
      <div ref={introRef} className="relative z-10 w-full min-h-[75vh] flex flex-col justify-center items-center py-32 overflow-hidden">
        
        {/* Subtle Top Label */}
        <motion.div 
          style={{ opacity: opacityOut }}
          className="mb-12 flex items-center gap-4 z-20"
        >
          <span className="accent">03</span>
          <span className="w-12 h-px bg-[hsl(var(--rule))]"></span>
          <span className="mono-label tracking-widest text-[hsl(var(--graphite))] uppercase">Domains</span>
        </motion.div>

        {/* Kinetic Text */}
        <motion.div 
          style={{ opacity: opacityOut, scale: scaleOut }}
          className="flex flex-col items-center justify-center w-full relative z-20"
        >
          {/* Spotlight Cursor Effect background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--phosphor)/0.08)_0%,transparent_60%)] blur-3xl pointer-events-none mix-blend-screen" />
          
          <div className="w-full overflow-hidden">
            <motion.h2 
              style={{ x: reducedMotion ? "0%" : textX1, fontFamily: 'var(--font-display)' }}
              className="text-[clamp(3.5rem,8vw,10rem)] text-[hsl(var(--chalk))] whitespace-nowrap text-center leading-[0.85] tracking-tighter uppercase drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
            >
              FOUR SPECIALIST
            </motion.h2>
          </div>
          <div className="w-full overflow-hidden relative">
            <motion.h2 
              style={{ x: reducedMotion ? "0%" : textX2, fontFamily: 'var(--font-display)' }}
              className="text-[clamp(3.5rem,8vw,10rem)] text-[hsl(var(--phosphor))] whitespace-nowrap text-center leading-[0.85] tracking-tighter uppercase"
            >
              COMMUNITIES
            </motion.h2>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: opacityOut }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20"
        >
          <span className="mono-label text-[10px] text-[hsl(var(--graphite))] uppercase tracking-widest">Descend</span>
          <div className="w-px h-16 bg-gradient-to-b from-[hsl(var(--rule))] to-transparent relative overflow-hidden">
             <motion.div 
                animate={{ y: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute top-0 left-0 w-full h-1/2 bg-[hsl(var(--phosphor))] shadow-[0_0_10px_hsl(var(--phosphor))]"
             />
          </div>
        </motion.div>
      </div>

      {/* ── Scroll Scenes ── */}
      {/* One ScrollScene per club */}
      {CLUBS.map((club, index) => (
        <div id={`scene-${club.id}`} key={club.id}>
          <ScrollScene heightVh={280}>
            {(progress) => (
              <ClubScene club={club} index={index} progress={progress} reducedMotion={reducedMotion} />
            )}
          </ScrollScene>
        </div>
      ))}
    </section>
  );
};

export default Clubs;
