import { useEffect, useRef } from 'react';
import { Linkedin } from 'lucide-react';
import ScrollScene from '@/components/scroll/ScrollScene';
import { easeInOut, lerp, prog, sceneGradient } from '@/utils/scrollMath';
import {
  coordinatorsByPortfolio,
  type Coordinator,
} from '@/constants/coordinators';

/**
 * Scene timeline — one scrubbed scene per portfolio.
 *
 *   0.00–0.24  headline holds ("Meet the Secretariat")
 *   0.20–0.36  headline lifts out
 *   0.28–0.48  both members fade in from their own side
 *   0.52–0.70  their details resolve beneath them and stay
 *
 * The lead occupies the right half, the joint holder the left, each with
 * their own portrait and caption — one screen, two people, no overlap.
 */
const HEADLINE_OUT: [number, number] = [0.2, 0.36];
const MEMBER_IN: [number, number] = [0.28, 0.48];
const DETAIL_IN: [number, number] = [0.52, 0.7];

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();

/** Gradient ground; written straight to the DOM so it never re-renders. */
const SceneBackground = ({ progress }: { progress: number }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.style.background = sceneGradient(progress, '50%');
  }, [progress]);

  return <div ref={ref} className="absolute inset-0 z-0" />;
};

const Headline = ({
  progress,
  index,
  portfolio,
}: {
  progress: number;
  index: number;
  portfolio: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const out = easeInOut(prog(progress, ...HEADLINE_OUT));
    el.style.opacity = String(1 - out);
    el.style.transform = reducedMotion() ? 'none' : `translateY(${-out * 56}px)`;
  }, [progress]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center px-[8vw] text-center"
      style={{ willChange: 'opacity, transform' }}
    >
      <span className="mono-label accent tabular-nums">
        {String(index + 1).padStart(2, '0')} / 06
      </span>
      <h3 className="display-l mt-5">
        Meet the
        <br />
        {portfolio}
      </h3>
    </div>
  );
};

/**
 * One member occupying half the stage: a free-standing portrait with their
 * name and role beneath it. No frame, no card — the figure sits on the
 * gradient the way a cutout would.
 */
const MemberColumn = ({
  progress,
  member,
  side,
}: {
  progress: number;
  member: Coordinator;
  side: 'left' | 'right';
}) => {
  const figureRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const isLeft = side === 'left';
  const filled = member.name.trim().length > 0;

  useEffect(() => {
    const figure = figureRef.current;
    const detail = detailRef.current;
    if (!figure || !detail) return;

    const inT = easeInOut(prog(progress, ...MEMBER_IN));
    figure.style.opacity = String(inT);
    figure.style.transform = reducedMotion()
      ? 'none'
      : `translateX(${lerp(isLeft ? -48 : 48, 0, inT)}px)`;

    const detailT = easeInOut(prog(progress, ...DETAIL_IN));
    detail.style.opacity = String(detailT);
    detail.style.transform = reducedMotion()
      ? 'none'
      : `translateY(${lerp(20, 0, detailT)}px)`;
    // A faded phase must not swallow clicks meant for what is visible.
    detail.style.pointerEvents = detailT > 0.5 ? 'auto' : 'none';
  }, [progress, isLeft]);

  return (
    <div
      className={`absolute bottom-0 top-0 z-10 flex w-1/2 flex-col items-center justify-center px-[4vw] pt-[16vh] ${
        isLeft ? 'left-0' : 'right-0'
      }`}
    >
      <div
        ref={figureRef}
        className="pointer-events-none flex w-full items-end justify-center pb-8"
        style={{ opacity: 0, willChange: 'opacity, transform' }}
      >
        {member.image ? (
          <img
            src={member.image}
            alt=""
            loading="lazy"
            className="block max-h-[46vh] w-auto object-contain object-bottom grayscale"
          />
        ) : (
          <span
            className="select-none"
            style={{
              fontFamily: "'Archivo Black', system-ui, sans-serif",
              fontSize: 'clamp(3.5rem, 9vw, 8rem)',
              lineHeight: 1,
              color: 'hsl(var(--graphite) / 0.35)',
            }}
            aria-hidden="true"
          >
            {filled ? initials(member.name) : 'TBA'}
          </span>
        )}
      </div>

      <div
        ref={detailRef}
        className="w-full max-w-md text-center"
        style={{ opacity: 0, willChange: 'opacity, transform' }}
      >
        <p className="mono-label">
          <span className="accent">{member.isLead ? 'Lead' : 'Joint'}</span>
          {' · '}
          {member.role}
        </p>

        <h4 className="display-m mt-3">
          {filled ? (
            member.name
          ) : (
            <span className="text-[hsl(var(--graphite))]">Position open</span>
          )}
        </h4>

        <div className="mx-auto mt-4 h-[2px] w-9 bg-[hsl(var(--phosphor))]" />

        {/* Bio and link keep their space while a seat is unfilled, so the
            composition doesn't shift once real people are added. */}
        {member.bio ? (
          <p className="mx-auto mt-5 max-w-prose text-sm leading-relaxed text-[hsl(var(--graphite))]">
            {member.bio}
          </p>
        ) : (
          <p className="mx-auto mt-5 max-w-prose text-sm italic leading-relaxed text-[hsl(var(--graphite)/0.6)]">
            A short introduction goes here once this seat is filled.
          </p>
        )}

        {member.linkedin ? (
          <a
            href={
              member.linkedin.startsWith('http')
                ? member.linkedin
                : `https://${member.linkedin}`
            }
            target="_blank"
            rel="noreferrer noopener"
            className="focus-phosphor mono-label mt-5 inline-flex items-center gap-2 text-[hsl(var(--chalk))] transition-colors hover:text-[hsl(var(--phosphor))]"
          >
            <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
            LinkedIn
          </a>
        ) : (
          <span className="mono-label mt-5 inline-flex items-center gap-2 text-[hsl(var(--graphite)/0.5)]">
            <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
            LinkedIn
          </span>
        )}
      </div>
    </div>
  );
};

/** Portfolio name, held quietly at the top once the pair has arrived. */
const SceneLabel = ({
  progress,
  portfolio,
}: {
  progress: number;
  portfolio: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = String(easeInOut(prog(progress, ...MEMBER_IN)));
  }, [progress]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute left-0 right-0 top-[8vh] z-20 text-center"
      style={{ opacity: 0 }}
    >
      <p className="mono-label">{portfolio}</p>
    </div>
  );
};

const CoreMembers = () => (
  <section id="core-members" className="lattice relative">
    <div className="rule-b px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto w-full max-w-5xl">
        <p className="mono-label">Academic year 2025–26</p>
        <h2 className="display-xl mt-6 max-w-[12ch]">Meet the core members</h2>
        <p className="mt-8 max-w-prose text-base leading-relaxed text-[hsl(var(--graphite))]">
          Twelve positions, six portfolios. Each portfolio is held by a lead and
          a joint holder who run it together across the year.
        </p>
      </div>
    </div>

    {coordinatorsByPortfolio.map(({ portfolio, members }, index) => {
      const lead = members.find(member => member.isLead);
      const joint = members.find(member => !member.isLead);

      return (
        <ScrollScene key={portfolio} heightVh={300}>
          {progress => (
            <div className="relative h-full w-full overflow-hidden">
              <SceneBackground progress={progress} />

              {/* Lead left, joint holder right. */}
              {lead && (
                <MemberColumn progress={progress} member={lead} side="left" />
              )}
              {joint && (
                <MemberColumn progress={progress} member={joint} side="right" />
              )}

              <SceneLabel progress={progress} portfolio={portfolio} />
              <Headline progress={progress} index={index} portfolio={portfolio} />
            </div>
          )}
        </ScrollScene>
      );
    })}
  </section>
);

export default CoreMembers;
