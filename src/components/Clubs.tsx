import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollScene from '@/components/scroll/ScrollScene';
import { easeInOut, prog, sceneGradient } from '@/utils/scrollMath';

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

const initials = (name: string) =>
  name
    .replace(/\[DATA REQUIRED\]/, '??')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();

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

const SceneBackground = ({ progress }: { progress: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.style.background = sceneGradient(progress, '50%');
  }, [progress]);
  return <div ref={ref} className="absolute inset-0 z-0" aria-hidden="true" />;
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

  useEffect(() => {
    const headline = headlineRef.current;
    const members = membersRef.current;
    const details = detailsRef.current;
    
    if (!headline || !members || !details) return;

    const t = getSceneTimeline(progress, reducedMotion);

    // Headline (Part 1: Left Side)
    headline.style.opacity = String(t.intro);
    headline.style.transform = reducedMotion ? 'none' : `translate3d(${(1 - t.intro) * -20}px, 0, 0)`;

    // Members (Part 2: Right Side)
    const topCard = members.children[0] as HTMLElement;
    const bottomCard = members.children[1] as HTMLElement;
    
    if (topCard) {
      topCard.style.opacity = String(t.coord);
      topCard.style.transform = reducedMotion ? 'none' : `translate3d(${(1 - t.coord) * 40}px, 0, 0)`;
    }
    
    if (bottomCard) {
      bottomCard.style.opacity = String(t.joint);
      bottomCard.style.transform = reducedMotion ? 'none' : `translate3d(${(1 - t.joint) * 40}px, 0, 0)`;
    }

    // Details / Explore button
    details.style.opacity = String(t.details);
    details.style.transform = reducedMotion ? 'none' : `translate3d(0, ${(1 - t.details) * 20}px, 0)`;
  }, [progress, reducedMotion]);

  return (
    <div className="relative h-full w-full overflow-hidden lattice" ref={containerRef}>
      <SceneBackground progress={progress} />

      {/* Split container */}
      <div className="absolute inset-0 z-10 flex flex-col md:flex-row h-full">
        
        {/* Left: Club Info */}
        <div 
          ref={headlineRef}
          className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 border-b md:border-b-0 md:border-r border-[hsl(var(--rule))] py-12 md:py-0"
          style={{ willChange: 'opacity, transform' }}
        >
          <div className="w-full max-w-lg mx-auto">
            <div className="mb-8 sm:mb-10 flex items-center gap-4">
              <span className="mono-label accent">
                {String(index + 1).padStart(2, '0')} / {String(CLUBS.length).padStart(2, '0')}
              </span>
              <div className="flex-1 h-px bg-[hsl(var(--rule))]" aria-hidden="true" />
              <span className="mono-label text-[hsl(var(--graphite))]">{club.tag}</span>
            </div>
            
            <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
              {club.logo && (
                <img
                  src={club.logo}
                  alt={club.logoAlt}
                  className="w-10 h-10 sm:w-14 sm:h-14 object-contain flex-shrink-0"
                />
              )}
              <h3
                className="display-m text-[hsl(var(--chalk))]"
                style={{ textTransform: 'uppercase' }}
              >
                {club.name}
              </h3>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-[hsl(var(--chalk)/0.7)] mb-0">
              {club.description}
            </p>
          </div>
        </div>

        {/* Right: Coordinators & Explore */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 md:py-0">
          <div className="w-full max-w-lg mx-auto">
            <div 
              ref={membersRef}
              className="flex flex-col gap-6"
              style={{ willChange: 'opacity' }}
            >
              {club.coordinators.map((coord, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-5 sm:gap-6 p-5 sm:p-6 border border-[hsl(var(--rule))] bg-[hsl(var(--ink-raised))]"
                  style={{ willChange: 'transform' }}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-[hsl(var(--rule))] overflow-hidden flex items-center justify-center bg-[hsl(var(--ink))] flex-shrink-0">
                    {coord.image ? (
                      <img src={coord.image} alt={coord.name} className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500" />
                    ) : (
                      <span className="text-base sm:text-lg font-mono text-[hsl(var(--graphite))]">
                        {initials(coord.name)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-mono text-[hsl(var(--chalk))] mb-1">{coord.name}</h4>
                    <p className="text-xs sm:text-sm text-[hsl(var(--graphite))] uppercase tracking-widest">{coord.role}</p>
                  </div>
                </div>
              ))}
            </div>

            <div
              ref={detailsRef}
              className="mt-10 sm:mt-12"
              style={{ willChange: 'opacity, transform' }}
            >
              <Link
                to={`/clubs/${club.slug}`}
                className="focus-phosphor inline-flex items-center gap-2 mono-label border border-[hsl(var(--rule))] px-8 py-3 text-[hsl(var(--chalk))] hover:border-[hsl(var(--phosphor))] hover:text-[hsl(var(--phosphor))] transition-colors"
              >
                EXPLORE
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
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

  return (
    <section id="clubs-section" className="lattice" aria-label="ATOM Sub-Clubs">
      {/* Section intro — sits above the pinned scenes */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-28 rule-b">
        <p className="mono-label mb-8">
          <span className="accent">06</span>
          {' — '}
          Sub-Clubs
        </p>
        <h2 className="display-l text-[hsl(var(--chalk))] max-w-[16ch]">
          Four specialist communities
        </h2>
      </div>

      {/* One ScrollScene per club */}
      {CLUBS.map((club, index) => (
        <ScrollScene key={club.id} heightVh={280}>
          {(progress) => (
            <ClubScene club={club} index={index} progress={progress} reducedMotion={reducedMotion} />
          )}
        </ScrollScene>
      ))}
    </section>
  );
};

export default Clubs;
