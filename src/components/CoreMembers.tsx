import { useEffect, useRef, useState } from 'react';
import { Linkedin, Award, BookOpen, Briefcase, Code, Trophy, User, Check, Copy } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';

import ScrollScene from '@/components/scroll/ScrollScene';
import {
  easeInOut,
  lerp,
  prog,
} from '@/utils/scrollMath';
import {
  coordinatorsByPortfolio,
  type Coordinator,
} from '@/constants/coordinators';

/* -------------------------------------------------------------------------- */
/* Scene timing                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Timeline for each portfolio scene:
 *
 * 0.00 ─────────────── 0.22
 * Portfolio introduction holds
 *
 * 0.22 ─────────────── 0.38
 * Introduction exits
 *
 * 0.30 ─────────────── 0.50
 * Members enter from opposite sides
 *
 * 0.50 ─────────────── 0.68
 * Details appear
 *
 * 0.68 ─────────────── 1.00
 * Everything remains stable
 */
const HEADLINE_OUT: readonly [number, number] = [0.22, 0.38];
const MEMBER_IN: readonly [number, number] = [0.30, 0.50];
const DETAIL_IN: readonly [number, number] = [0.50, 0.68];

const TOTAL_PORTFOLIOS = 6;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const clamp01 = (value: number) =>
  Math.min(1, Math.max(0, value));

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();

const normalizeLinkedInUrl = (value?: string) => {
  if (!value) return null;

  const trimmed = value.trim();

  if (!trimmed) return null;

  return /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
};

/* -------------------------------------------------------------------------- */
/* Reduced motion                                                             */
/* -------------------------------------------------------------------------- */

const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );

    const handleChange = () => {
      setReducedMotion(mediaQuery.matches);
    };

    handleChange();

    mediaQuery.addEventListener?.('change', handleChange);

    return () => {
      mediaQuery.removeEventListener?.(
        'change',
        handleChange,
      );
    };
  }, []);

  return reducedMotion;
};


/* -------------------------------------------------------------------------- */
/* Scene background                                                            */
/* -------------------------------------------------------------------------- */

const SceneBackground = ({
  portfolio,
}: {
  portfolio: string;
}) => {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden"
    >
      <span 
        className="text-[20vw] font-black text-white whitespace-nowrap uppercase select-none opacity-[0.03]" 
        style={{ fontFamily: 'var(--font-display)', transform: 'rotate(-5deg) scale(1.2)' }}
      >
        {portfolio}
      </span>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Scene headline                                                              */
/* -------------------------------------------------------------------------- */

const Headline = ({
  progress,
  index,
  portfolio,
  reducedMotion,
}: {
  progress: number;
  index: number;
  portfolio: string;
  reducedMotion: boolean;
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  const safeProgress = clamp01(progress);

  const headlineProgress = reducedMotion
    ? 0
    : easeInOut(
        prog(safeProgress, ...HEADLINE_OUT),
      );

  const opacity = 1 - headlineProgress;

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    element.style.opacity = String(opacity);

    if (reducedMotion) {
      element.style.transform = 'none';
      return;
    }

    element.style.transform = `translate3d(
      0,
      ${-headlineProgress * 56}px,
      0
    )`;
  }, [
    headlineProgress,
    opacity,
    reducedMotion,
  ]);

  return (
    <div
      ref={elementRef}
      className="
        pointer-events-none
        absolute
        inset-0
        z-30
        flex
        flex-col
        items-center
        justify-center
        px-6
        text-center
        sm:px-10
        lg:px-[8vw]
      "
      style={{
        opacity: 0,
        willChange: reducedMotion
          ? 'opacity'
          : 'opacity, transform',
      }}
    >
      <span className="mono-label accent tabular-nums">
        {String(index + 1).padStart(2, '0')} /{' '}
        {String(TOTAL_PORTFOLIOS).padStart(2, '0')}
      </span>

      <h3 className="display-l mt-5">
        Meet the
        <br />
        {portfolio}
      </h3>
    </div>
  );
};

const MemberDetailModal = ({
  member,
  isOpen,
  onClose,
}: {
  member: Coordinator;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied k-mail to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const hasAchievements = member.achievements && member.achievements.length > 0;
  const hasExpertise = member.expertise && member.expertise.length > 0;
  const hasProjects = member.projects && member.projects.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl w-[90vw] max-h-[85vh] overflow-y-auto bg-black/90 border border-white/[0.08] backdrop-blur-2xl text-white rounded-2xl shadow-2xl p-6 md:p-8 select-none">
        
        {/* Header Block */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
          
          {/* Portrait Image */}
          <div className="md:col-span-4 aspect-[3/4] w-full max-w-[200px] mx-auto md:max-w-none rounded-xl overflow-hidden border border-white/10 bg-white/5 shadow-inner">
            {member.image ? (
              <img
                src={member.image}
                alt={`${member.name} portrait`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/30 text-3xl font-black">
                {member.name ? initials(member.name) : 'TBA'}
              </div>
            )}
          </div>

          {/* Name and Basic details */}
          <div className="md:col-span-8 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 text-xs font-mono font-medium rounded-full bg-white/10 border border-white/5 text-[hsl(var(--phosphor))] tracking-wider uppercase">
                  {member.isLead ? 'LEAD' : 'JOINT'}
                </span>
                <span className="text-white/40 text-xs font-mono tracking-wider uppercase">
                  {member.portfolio}
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold font-display mt-3 text-white">
                {member.name}
              </h3>
              
              <p className="text-sm md:text-base text-[hsl(var(--phosphor))] font-mono tracking-wider mt-1 uppercase">
                {member.role}
              </p>

              {/* Year and Register Number */}
              <div className="grid grid-cols-2 gap-4 mt-6 border-t border-white/5 pt-4 text-xs font-mono text-white/60">
                <div>
                  <span className="block text-white/40 mb-0.5">REGISTER NUMBER</span>
                  <span className="text-white font-medium">{member.regNo || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-white/40 mb-0.5">YEAR OF STUDY</span>
                  <span className="text-white font-medium">{member.year || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="mt-6 flex flex-wrap gap-3">
              {member.kmail && (
                <button
                  onClick={() => copyToClipboard(member.kmail!)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition text-xs font-mono text-white/80"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5 text-white/60" />}
                  <span>{member.kmail}</span>
                </button>
              )}

              {member.linkedin && (
                <a
                  href={normalizeLinkedInUrl(member.linkedin) || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[hsl(var(--phosphor))/0.1] border border-[hsl(var(--phosphor))/0.2] hover:bg-[hsl(var(--phosphor))/0.2] transition text-xs font-mono text-[hsl(var(--phosphor))]"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                  <span>LinkedIn Profile</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bio segment */}
        {member.bio && (
          <div className="mt-8 border-t border-white/5 pt-6">
            <p className="text-sm md:text-base leading-relaxed text-white/70">
              {member.bio}
            </p>
          </div>
        )}

        {/* Fields of Expertise / Chips */}
        {hasExpertise && (
          <div className="mt-8">
            <h4 className="text-xs font-mono text-white/40 tracking-wider uppercase mb-3">FIELDS OF EXPERTISE</h4>
            <div className="flex flex-wrap gap-2">
              {member.expertise?.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-xs text-white/80">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Sections (Achievements, Projects, Experience, Outreach) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 border-t border-white/5 pt-6">
          
          {/* Achievements Section */}
          {hasAchievements && (
            <div>
              <div className="flex items-center gap-2 text-[hsl(var(--phosphor))] mb-4">
                <Trophy className="h-4 w-4" />
                <h4 className="text-xs font-mono tracking-wider uppercase">MAJOR ACHIEVEMENTS</h4>
              </div>
              <ul className="space-y-3">
                {member.achievements?.map((ach, idx) => (
                  <li key={idx} className="text-xs md:text-sm text-white/70 pl-4 border-l border-white/10 relative">
                    <span className="absolute left-0 top-1.5 h-1 w-1 bg-[hsl(var(--phosphor))] rounded-full -translate-x-1/2" />
                    {ach}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Academic & Certifications Section */}
          {member.academic && member.academic !== 'Nil' && (
            <div>
              <div className="flex items-center gap-2 text-[hsl(var(--phosphor))] mb-4">
                <Award className="h-4 w-4" />
                <h4 className="text-xs font-mono tracking-wider uppercase">ACADEMIC & CERTIFICATIONS</h4>
              </div>
              <p className="text-xs md:text-sm text-white/70 leading-relaxed pl-4 border-l border-white/10">
                {member.academic}
              </p>
            </div>
          )}

          {/* Internship & Work Experience Section */}
          {member.experience && (
            <div>
              <div className="flex items-center gap-2 text-[hsl(var(--phosphor))] mb-4">
                <Briefcase className="h-4 w-4" />
                <h4 className="text-xs font-mono tracking-wider uppercase">INTERNSHIP & EXPERIENCE</h4>
              </div>
              <p className="text-xs md:text-sm text-white/70 leading-relaxed pl-4 border-l border-white/10">
                {member.experience}
              </p>
            </div>
          )}

          {/* Projects Developed Section */}
          {hasProjects && (
            <div>
              <div className="flex items-center gap-2 text-[hsl(var(--phosphor))] mb-4">
                <Code className="h-4 w-4" />
                <h4 className="text-xs font-mono tracking-wider uppercase">PROJECTS DEVELOPED</h4>
              </div>
              <ul className="space-y-3">
                {member.projects?.map((proj, idx) => (
                  <li key={idx} className="text-xs md:text-sm text-white/70 pl-4 border-l border-white/10 relative">
                    <span className="absolute left-0 top-1.5 h-1 w-1 bg-[hsl(var(--phosphor))] rounded-full -translate-x-1/2" />
                    {proj}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Extracurriculars Section */}
          {member.sports && member.sports !== 'Nil' && (
            <div>
              <div className="flex items-center gap-2 text-[hsl(var(--phosphor))] mb-4">
                <BookOpen className="h-4 w-4" />
                <h4 className="text-xs font-mono tracking-wider uppercase">SPORTS & EXTRACURRICULARS</h4>
              </div>
              <p className="text-xs md:text-sm text-white/70 leading-relaxed pl-4 border-l border-white/10">
                {member.sports}
              </p>
            </div>
          )}

          {/* Spiritual & Social Service Section */}
          {member.outreach && member.outreach !== 'Nil' && (
            <div>
              <div className="flex items-center gap-2 text-[hsl(var(--phosphor))] mb-4">
                <User className="h-4 w-4" />
                <h4 className="text-xs font-mono tracking-wider uppercase">OUTREACH & SOCIAL SERVICE</h4>
              </div>
              <p className="text-xs md:text-sm text-white/70 leading-relaxed pl-4 border-l border-white/10">
                {member.outreach}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* -------------------------------------------------------------------------- */
/* Member column                                                              */
/* -------------------------------------------------------------------------- */

const MemberColumn = ({
  progress,
  member,
  side,
  reducedMotion,
  onSelect,
}: {
  progress: number;
  member: Coordinator;
  side: 'left' | 'right';
  reducedMotion: boolean;
  onSelect: () => void;
}) => {
  const figureRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const isLeft = side === 'left';

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const hasMember = Boolean(
    member.name?.trim(),
  );

  const linkedInUrl = normalizeLinkedInUrl(
    member.linkedin,
  );

  const safeProgress = clamp01(progress);

  // Timing ranges: desktop side-by-side vs mobile scroll sequence
  let memberRange: readonly [number, number] = MEMBER_IN;
  let detailRange: readonly [number, number] = DETAIL_IN;
  let exitRange: readonly [number, number] | null = null;

  if (isMobile) {
    if (isLeft) {
      memberRange = [0.26, 0.34];
      detailRange = [0.32, 0.40];
      exitRange = [0.58, 0.66];
    } else {
      memberRange = [0.64, 0.72];
      detailRange = [0.70, 0.78];
      exitRange = [0.94, 1.00];
    }
  }

  let memberProgress = reducedMotion
    ? 1
    : easeInOut(
        prog(safeProgress, ...memberRange),
      );

  let detailProgress = reducedMotion
    ? 1
    : easeInOut(
        prog(safeProgress, ...detailRange),
      );

  if (isMobile && isLeft && exitRange) {
    const exitProgress = easeInOut(
      prog(safeProgress, ...exitRange),
    );
    memberProgress = memberProgress * (1 - exitProgress);
    detailProgress = detailProgress * (1 - exitProgress);
  }

  useEffect(() => {
    const figure = figureRef.current;
    const detail = detailRef.current;

    if (!figure || !detail) return;

    /* ------------------------------ Figure ------------------------------ */

    figure.style.opacity = String(
      memberProgress,
    );

    if (reducedMotion) {
      figure.style.transform = 'none';
    } else {
      const startingX = isLeft ? -52 : 52;

      figure.style.transform = `translate3d(
        ${lerp(
          startingX,
          0,
          memberProgress,
        )}px,
        0,
        0
      )`;
    }

    /* ------------------------------ Detail ------------------------------ */

    detail.style.opacity = String(
      detailProgress,
    );

    if (reducedMotion) {
      detail.style.transform = 'none';
    } else {
      detail.style.transform = `translate3d(
        0,
        ${lerp(
          24,
          0,
          detailProgress,
        )}px,
        0
      )`;
    }

    /*
     * Prevent invisible content from capturing pointer events.
     */
    detail.style.pointerEvents =
      detailProgress > 0.65
        ? 'auto'
        : 'none';
  }, [
    memberProgress,
    detailProgress,
    reducedMotion,
    isLeft,
  ]);

  return (
    <div
      className={`
        absolute
        inset-x-0
        top-0
        z-10
        flex
        h-full
        w-full
        flex-col
        items-center
        justify-center
        px-5
        pt-[12vh]
        pb-[8vh]

        sm:px-8

        lg:top-0
        lg:w-1/2
        lg:px-[4vw]
        lg:pt-[15vh]
        lg:pb-[5vh]

        ${
          isLeft
            ? 'lg:left-0 lg:right-auto'
            : 'lg:right-0 lg:left-auto'
        }
      `}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Portrait                                                            */}
      {/* ------------------------------------------------------------------ */}

      <div
        ref={figureRef}
        onClick={hasMember ? onSelect : undefined}
        className={`
          pointer-events-auto
          flex
          h-[35vh]
          sm:h-[42vh]
          lg:h-[48vh]
          mx-auto
          aspect-[3/4]
          relative
          overflow-hidden
          rounded-2xl
          border border-[hsl(var(--chalk)/0.15)]
          bg-[hsl(var(--ink)/0.5)]
          transition-colors duration-500 hover:border-[hsl(var(--phosphor)/0.5)]
          group
          ${hasMember ? 'cursor-pointer' : ''}
        `}
        style={{
          opacity: 0,
          willChange: reducedMotion
            ? 'opacity'
            : 'opacity, transform',
        }}
      >
        {member.image ? (
          <>
            <img
              src={member.image}
              alt={
                hasMember
                  ? `${member.name} portrait`
                  : ''
              }
              loading="eager"
              decoding="async"
              className="
                block
                h-full
                w-full
                object-cover
                object-center
                group-hover:scale-105
                transition-all
                duration-700
              "
            />
            {hasMember && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-[10px] sm:text-xs font-mono text-[hsl(var(--phosphor))] uppercase tracking-wider scale-95 group-hover:scale-100 transition-transform duration-300">
                  Click to view details
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full opacity-20 bg-[hsl(var(--ink)/0.3)]">
            <span
              aria-hidden="true"
              className="
                select-none
                font-black
                leading-none
                text-[hsl(var(--graphite))]
              "
              style={{
                fontFamily:
                  "var(--font-display)",
                fontSize:
                  'clamp(3rem, 6vw, 5rem)',
              }}
            >
              {hasMember
                ? initials(member.name)
                : 'TBA'}
            </span>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Member details                                                      */}
      {/* ------------------------------------------------------------------ */}

      <div
        ref={detailRef}
        className="
          w-full
          max-w-md
          shrink-0
          text-center
          lg:max-w-[34rem]
        "
        style={{
          opacity: 0,
          willChange: reducedMotion
            ? 'opacity'
            : 'opacity, transform',
        }}
      >
        {/* Role */}

        <p className="font-sans text-lg sm:text-xl lg:text-2xl font-light tracking-[0.3em] text-[hsl(var(--chalk))] opacity-90 mb-3">
          <span className="text-[hsl(var(--phosphor))] uppercase font-medium">
            {member.isLead
              ? 'LEAD'
              : 'JOINT'}
          </span>

          <span className="opacity-40 mx-4 text-[0.7em] align-middle" aria-hidden="true">
            {'•'}
          </span>

          <span className="uppercase">
            {member.role.toUpperCase().replace('JOINT ', '')}
          </span>
        </p>

        {/* Name */}

        <h4 className="display-m mt-3">
          {hasMember ? (
            member.name
          ) : (
            <span className="text-[hsl(var(--graphite))]">
              Position open
            </span>
          )}
        </h4>

        {/* Accent line */}

        <div
          aria-hidden="true"
          className="
            mx-auto
            mt-4
            h-[2px]
            w-9
            bg-[hsl(var(--phosphor))]
          "
        />

        {/* Bio */}

        {member.bio ? (
          <p
            className="
              mx-auto
              mt-5
              max-w-prose
              text-sm
              leading-relaxed
              text-[hsl(var(--graphite))]
            "
          >
            {member.bio}
          </p>
        ) : (
          <p
            className="
              mx-auto
              mt-5
              max-w-prose
              text-sm
              italic
              leading-relaxed
              text-[hsl(var(--graphite)/0.6)]
            "
          >
            A short introduction will appear once
            this position is filled.
          </p>
        )}

        {/* LinkedIn */}

        {linkedInUrl ? (
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name || 'Member'} on LinkedIn`}
            className="
              focus-phosphor
              mono-label
              mt-5
              inline-flex
              items-center
              gap-2
              text-[hsl(var(--chalk))]
              transition-colors
              duration-200
              hover:text-[hsl(var(--phosphor))]
            "
          >
            <Linkedin
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />

            <span>
              LinkedIn
            </span>
          </a>
        ) : (
          <span
            aria-hidden="true"
            className="
              mono-label
              mt-5
              inline-flex
              items-center
              gap-2
              text-[hsl(var(--graphite)/0.45)]
            "
          >
            <Linkedin
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />

            <span>
              LinkedIn
            </span>
          </span>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Scene label                                                                 */
/* -------------------------------------------------------------------------- */

const SceneLabel = ({
  progress,
  portfolio,
  reducedMotion,
}: {
  progress: number;
  portfolio: string;
  reducedMotion: boolean;
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  const labelProgress = reducedMotion
    ? 1
    : easeInOut(
        prog(
          clamp01(progress),
          ...MEMBER_IN,
        ),
      );

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    element.style.opacity = String(
      labelProgress,
    );
  }, [labelProgress]);

  return (
    <div
      ref={elementRef}
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        left-0
        right-0
        top-[5vh]
        z-20
        text-center

        lg:top-[7vh]
      "
      style={{
        opacity: 0,
        willChange: 'opacity',
      }}
    >
      <p className="mono-label">
        {portfolio}
      </p>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Main component                                                              */
/* -------------------------------------------------------------------------- */

const CoreMembers = () => {
  const reducedMotion = useReducedMotion();
  const [selectedMember, setSelectedMember] = useState<Coordinator | null>(null);

  return (
    <section
      id="core-members"
      className="
        lattice
        bg-black
        relative
      "
      aria-labelledby="core-members-title"
    >
      {/* ================================================================== */}
      {/* Section introduction                                               */}
      {/* ================================================================== */}

      <div
        className="
          rule-b
          px-6
          py-24

          sm:px-10

          lg:px-16
          lg:py-32
        "
      >
        <div className="
          mx-auto
          w-full
          max-w-5xl
        ">
          <p className="mono-label">
            Academic year 2025–26
          </p>

          <h2
            id="core-members-title"
            className="
              display-xl
              mt-6
              max-w-[12ch]
            "
          >
            Meet the core members
          </h2>

          <p
            className="
              mt-8
              max-w-prose
              text-base
              leading-relaxed
              text-[hsl(var(--graphite))]
            "
          >
            Twelve positions, six portfolios. Each
            portfolio is held by a lead and a joint
            holder who run it together across the
            year.
          </p>
        </div>
      </div>

      {/* ================================================================== */}
      {/* Portfolio scenes                                                    */}
      {/* ================================================================== */}

      {coordinatorsByPortfolio.map(
        ({ portfolio, members }, index) => {
          /*
           * Explicitly identify members by their role.
           * Their array order no longer determines
           * their position in the interface.
           */
          const lead = members.find(
            member => member.isLead,
          );

          const joint = members.find(
            member => !member.isLead,
          );

          return (
            <ScrollScene
              key={portfolio}
              heightVh={380}
            >
              {progress => (
                <div
                  className="
                    relative
                    h-full
                    w-full
                    overflow-hidden
                  "
                  data-portfolio={portfolio}
                >
                  {/* Background */}

                  <SceneBackground
                    portfolio={portfolio}
                  />

                  {/* ====================================================== */}
                  {/* LEFT — LEAD                                            */}
                  {/* ====================================================== */}

                  {lead && (
                    <MemberColumn
                      progress={progress}
                      member={lead}
                      side="left"
                      reducedMotion={
                        reducedMotion
                      }
                      onSelect={() => setSelectedMember(lead)}
                    />
                  )}

                  {/* ====================================================== */}
                  {/* RIGHT — JOINT HOLDER                                   */}
                  {/* ====================================================== */}

                  {joint && (
                    <MemberColumn
                      progress={progress}
                      member={joint}
                      side="right"
                      reducedMotion={
                        reducedMotion
                      }
                      onSelect={() => setSelectedMember(joint)}
                    />
                  )}

                  {/* Portfolio label */}

                  <SceneLabel
                    progress={progress}
                    portfolio={portfolio}
                    reducedMotion={
                      reducedMotion
                    }
                  />

                  {/* Intro headline */}

                  <Headline
                    progress={progress}
                    index={index}
                    portfolio={portfolio}
                    reducedMotion={
                      reducedMotion
                    }
                  />
                </div>
              )}
            </ScrollScene>
          );
        },
      )}

      {selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </section>
  );
};

export default CoreMembers;