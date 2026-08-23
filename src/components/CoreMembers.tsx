import { useEffect, useRef, useState } from 'react';
import { Linkedin } from 'lucide-react';

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

/* -------------------------------------------------------------------------- */
/* Member column                                                              */
/* -------------------------------------------------------------------------- */

const MemberColumn = ({
  progress,
  member,
  side,
  reducedMotion,
}: {
  progress: number;
  member: Coordinator;
  side: 'left' | 'right';
  reducedMotion: boolean;
}) => {
  const figureRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const isLeft = side === 'left';

  const hasMember = Boolean(
    member.name?.trim(),
  );

  const linkedInUrl = normalizeLinkedInUrl(
    member.linkedin,
  );

  const safeProgress = clamp01(progress);

  const memberProgress = reducedMotion
    ? 1
    : easeInOut(
        prog(safeProgress, ...MEMBER_IN),
      );

  const detailProgress = reducedMotion
    ? 1
    : easeInOut(
        prog(safeProgress, ...DETAIL_IN),
      );

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
        className="
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
        "
        style={{
          opacity: 0,
          willChange: reducedMotion
            ? 'opacity'
            : 'opacity, transform',
        }}
      >
        {member.image ? (
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
                  "'Archivo Black', system-ui, sans-serif",
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

        <p className="mono-label">
          <span className="accent">
            {member.isLead
              ? 'Lead'
              : 'Joint'}
          </span>

          <span aria-hidden="true">
            {' · '}
          </span>

          <span>
            {member.role}
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
              heightVh={300}
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
    </section>
  );
};

export default CoreMembers;