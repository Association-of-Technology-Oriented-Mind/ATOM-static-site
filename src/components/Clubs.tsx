import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Linkedin } from 'lucide-react';
import ScrollScene from '@/components/scroll/ScrollScene';
import { easeInOut, prog } from '@/utils/scrollMath';

// Import real club icons & logos
import { DotIcon, BiasIcon, HackIcon } from '@/constants/clubs';
import qyroLogo from '@/assets/qyro.webp';
import sanjayImg from '@/assets/HACKHIVE/Sanjay.webp';
import jayeshImg from '@/assets/HACKHIVE/Jayesh.webp';

interface CoordinatorDef {
  name: string;
  role: string;
  image: string | null;
  bio: string;
  linkedin: string;
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
      {
        name: 'Sanjay S',
        role: 'Coordinator',
        image: sanjayImg,
        bio: 'As Coordinator of Hack Hive, Sanjay S is a finalist in the Cyberthon and was awarded the Best Idea Award at the TN-Police Hackathon.',
        linkedin: 'https://linkedin.com/in/sanjay-s-699585345'
      },
      {
        name: 'Jayesh V Prakash Naidu',
        role: 'Joint Coordinator',
        image: jayeshImg,
        bio: 'As Junior Coordinator of Hack Hive, Jayesh is passionate about digital forensics and created a Wi-Fi pentesting device to learn networking. He is also the founder of BlackSpotAI.',
        linkedin: 'https://linkedin.com/in/jayesh-v-prakash-naidu'
      },
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
      {
        name: 'Dharshan Kumar J',
        role: 'Coordinator',
        image: null,
        bio: 'As Coordinator of DotDev, Dharshan Kumar J is a Finalist of the NEXUS hackathon and a Software Developer skilled in developing Web and Mobile Applications. He is also a co-founder of VelsyMedia and TurpleSpace.',
        linkedin: 'https://linkedin.com/in/j-dharshan-kumar'
      },
      {
        name: 'Danish Prabhu K V',
        role: 'Joint Coordinator',
        image: null,
        bio: 'As Junior Coordinator of DotDev, Danish Prabhu K V is a Finalist of the NEXUS Hackathon and is passionate about AI and software engineering. He is currently an intern at GMS.',
        linkedin: 'https://linkedin.com/in/danish-prabhu-0a1691293'
      },
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
      {
        name: 'Aravindan M',
        role: 'Coordinator',
        image: null,
        bio: "As Coordinator of Unbias, Aravindan M is a Silver Medalist in the International Taekwondo Championship and a finalist at IIT Bombay's Eureka 2024. He is specialized in Generative AI.",
        linkedin: 'https://linkedin.com/in/aravindan-arru'
      },
      {
        name: 'Ronnie A Jeffrey',
        role: 'Joint Coordinator',
        image: null,
        bio: "As Junior Coordinator of Unbias, Ronnie A Jeffrey is a winner in NEXUS 2024 and was awarded a special mention at Cyberthon '25. He is passionate about AI and Full Stack development.",
        linkedin: 'https://linkedin.com/in/ronnie-a-jeffrey'
      },
    ],
    logo: BiasIcon,
    logoAlt: 'Unbiased club icon',
  },
  {
    id: 'qyro',
    slug: 'qyro',
    name: 'Qyro',
    tag: 'NEW CLUB',
    description:
      'Club description, objectives and focus area for Qyro are pending. Please supply this content.',
    coordinators: [
      {
        name: 'TBA',
        role: 'Coordinator',
        image: null,
        bio: 'A short intro will appear once this position is filled.',
        linkedin: ''
      },
      {
        name: 'TBA',
        role: 'Joint Coordinator',
        image: null,
        bio: 'A short intro will appear once this position is filled.',
        linkedin: ''
      },
    ],
    logo: qyroLogo,
    logoAlt: 'Qyro club logo',
  },
];

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

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
    let leftOpacity = 0;
    let leftTranslateX = -40;
    
    if (progress <= 0.15) {
      const p = progress / 0.15; // 0 to 1
      leftOpacity = p;
      leftTranslateX = -40 * (1 - p);
    } else if (progress > 0.15 && progress <= 0.85) {
      leftOpacity = 1;
      leftTranslateX = 0;
    } else {
      // fade out as we exit the scene
      const p = Math.max(0, (1 - progress) / 0.15); // 1 to 0
      leftOpacity = p;
      leftTranslateX = -30 * (1 - p);
    }
    
    headline.style.opacity = String(leftOpacity);
    headline.style.transform = reducedMotion ? 'none' : `translate3d(${leftTranslateX}px, 0, 0)`;

    // Right Side - Cards Sequence Animation
    const card1 = members.children[0] as HTMLElement;
    const card2 = members.children[1] as HTMLElement;

    if (card1) {
      let opacity = 0;
      let tx = 100;
      let scale = 0.95;
      let rot = 3;

      if (progress < 0.1) {
        opacity = 0;
        tx = 100;
      } else if (progress >= 0.1 && progress < 0.25) {
        // Slide in
        const p = (progress - 0.1) / 0.15; // 0 to 1
        opacity = p;
        tx = 100 * (1 - p);
        scale = 0.95 + 0.05 * p;
        rot = 3 * (1 - p);
      } else if (progress >= 0.25 && progress < 0.5) {
        // Active
        opacity = 1;
        tx = 0;
        scale = 1;
        rot = 0;
      } else if (progress >= 0.5 && progress < 0.65) {
        // Slide out to the left
        const p = (progress - 0.5) / 0.15; // 0 to 1
        opacity = 1 - p;
        tx = -120 * p;
        scale = 1 - 0.05 * p;
        rot = -3 * p;
      } else {
        opacity = 0;
      }

      card1.style.opacity = String(opacity);
      card1.style.transform = reducedMotion ? 'none' : `translate3d(${tx}px, 0, 0) scale(${scale}) rotate(${rot}deg)`;
      card1.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
    }

    if (card2) {
      let opacity = 0;
      let tx = 120;
      let scale = 0.95;
      let rot = 3;

      if (progress < 0.45) {
        opacity = 0;
        tx = 120;
      } else if (progress >= 0.45 && progress < 0.6) {
        // Slide in from the right
        const p = (progress - 0.45) / 0.15; // 0 to 1
        opacity = p;
        tx = 120 * (1 - p);
        scale = 0.95 + 0.05 * p;
        rot = 3 * (1 - p);
      } else if (progress >= 0.6 && progress < 0.8) {
        // Active
        opacity = 1;
        tx = 0;
        scale = 1;
        rot = 0;
      } else if (progress >= 0.8 && progress < 0.95) {
        // Slide out to the left
        const p = (progress - 0.8) / 0.15; // 0 to 1
        opacity = 1 - p;
        tx = -100 * p;
        scale = 1 - 0.05 * p;
        rot = -3 * p;
      } else {
        opacity = 0;
      }

      card2.style.opacity = String(opacity);
      card2.style.transform = reducedMotion ? 'none' : `translate3d(${tx}px, 0, 0) scale(${scale}) rotate(${rot}deg)`;
      card2.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
    }

    // Detail button / CTA
    let detailOpacity = 0;
    let detailTranslateY = 30;
    if (progress >= 0.25 && progress < 0.85) {
      detailOpacity = 1;
      detailTranslateY = 0;
    } else if (progress < 0.25) {
      const p = (progress) / 0.25;
      detailOpacity = p;
      detailTranslateY = 30 * (1 - p);
    } else {
      const p = Math.max(0, (1 - progress) / 0.15);
      detailOpacity = p;
      detailTranslateY = 20 * (1 - p);
    }
    details.style.opacity = String(detailOpacity);
    details.style.transform = reducedMotion ? 'none' : `translate3d(0, ${detailTranslateY}px, 0)`;
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
            <p className="text-base sm:text-lg leading-relaxed text-[hsl(var(--chalk)/0.75)] p-6 bg-black/20 border-l-2 border-[hsl(var(--phosphor)/0.5)] rounded-r-lg backdrop-blur-sm mb-10">
              {club.description}
            </p>

            {/* MOVED INITIATE HANDSHAKE CTA HERE */}
            <div
              ref={detailsRef}
              className="w-full md:w-auto"
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

        {/* Right: Coordinators Detailed Profiles */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-12 md:py-0 relative z-20">
          <div className="w-full max-w-lg mx-auto md:ml-auto md:mr-0 flex flex-col items-center">
            
            {/* Portrait Coordinator Cards & Profiles Stack */}
            <div 
              ref={membersRef}
              className="relative w-full max-w-sm h-[520px] sm:h-[600px] md:h-[660px] mx-auto md:mr-0"
              style={{ willChange: 'opacity' }}
            >
              {club.coordinators.map((coord, i) => {
                const isTBA = !coord.image || coord.name === 'TBA';
                
                return (
                  <div 
                    key={i}
                    className="absolute inset-0 w-full h-full flex flex-col items-center text-center justify-center"
                    style={{ willChange: 'transform' }}
                  >
                    {/* 1. Image Portrait Card */}
                    <div className="relative w-56 h-72 sm:w-64 sm:h-80 md:w-72 md:h-96 rounded-2xl border border-[hsl(var(--phosphor)/0.25)] bg-black shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden group">
                      {/* Subtle hover overlay glow */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--phosphor)/0.15)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none rounded-2xl" />

                      {/* Holographic Glare */}
                      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-2xl">
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out translate-x-[-100%] group-hover:translate-x-[100%]" />
                      </div>

                      {isTBA ? (
                        /* TBA Portrait State */
                        <div className="absolute inset-0 flex items-center justify-center bg-black">
                          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] sm:text-[10rem] font-black text-white/5 select-none z-0 tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>TBA</span>
                          <span className="relative z-10 text-sm text-[hsl(var(--graphite))] font-mono uppercase tracking-[0.2em]">// OPEN SEAT</span>
                        </div>
                      ) : (
                        /* Filled Portrait State */
                        <>
                          <img 
                            src={coord.image!} 
                            alt={coord.name} 
                            className="absolute inset-0 w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                        </>
                      )}
                    </div>

                    {/* 2. Text Metadata Section */}
                    <div className="mt-6 flex flex-col items-center max-w-[340px]">
                      {/* Role Label */}
                      <span className="mono-label text-[10px] sm:text-xs text-[hsl(var(--phosphor))] uppercase tracking-[0.2em] font-semibold">
                        {coord.role}
                      </span>

                      {/* Name */}
                      <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white uppercase mt-2 leading-tight tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
                        {coord.name}
                      </h4>

                      {/* Accent separator line */}
                      <div className="w-9 h-[2px] bg-[hsl(var(--phosphor)/0.5)] my-3" />

                      {/* Bio brief */}
                      <p className="text-xs sm:text-sm leading-relaxed text-[hsl(var(--graphite))] text-center px-4 font-normal">
                        {coord.bio}
                      </p>

                      {/* LinkedIn URL Link */}
                      {!isTBA && coord.linkedin && (
                        <a
                          href={coord.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${coord.name} on LinkedIn`}
                          className="focus-phosphor mono-label mt-4 inline-flex items-center gap-2 text-[hsl(var(--chalk))] hover:text-[hsl(var(--phosphor))] transition-colors duration-200 text-xs tracking-widest"
                        >
                          <Linkedin className="h-4 w-4 shrink-0" aria-hidden="true" />
                          <span>CONNECT</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
