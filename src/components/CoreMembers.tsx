import { useEffect, useRef } from 'react';
import { Linkedin } from 'lucide-react';
import ScrollScene from '@/components/scroll/ScrollScene';
import { easeInOut, lerp, prog } from '@/utils/scrollMath';
import {
  coordinatorsByPortfolio,
  type Coordinator,
} from '@/constants/coordinators';

/**
 * Scene timeline — each portfolio gets one scrubbed scene.
 *
 *   0.00–0.26  headline holds ("The Secretariat")
 *   0.20–0.36  headline lifts out
 *   0.26–0.46  the pair fades and slides in
 *   0.48–0.68  detail (name, role, bio, link) resolves and stays
 *
 * Ranges overlap deliberately so phases cross-dissolve instead of leaving
 * dead gaps mid-scroll.
 */
const HEADLINE_OUT: [number, number] = [0.2, 0.36];
const PAIR_IN: [number, number] = [0.26, 0.46];
const DETAIL_IN: [number, number] = [0.48, 0.68];

const prefersReducedMotion = () =>
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

/** Headline that holds, then lifts away as the pair arrives. */
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
    el.style.transform = prefersReducedMotion()
      ? 'none'
      : `translateY(${-out * 48}px)`;
  }, [progress]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-10 lg:px-16"
      style={{ willChange: 'opacity, transform' }}
    >
      <div className="mx-auto w-full max-w-5xl">
        <span className="mono-label accent tabular-nums">
          {String(index + 1).padStart(2, '0')} / 06
        </span>
        {/* display-l rather than display-xl: the stage is a fixed 100vh and
            longer portfolio names at display-xl overflow it. */}
        <h3 className="display-l mt-4 max-w-[12ch]">{portfolio}</h3>
      </div>
    </div>
  );
};

const MemberFigure = ({
  member,
  progress,
}: {
  member: Coordinator;
  progress: number;
}) => {
  const detailRef = useRef<HTMLDivElement>(null);
  const filled = member.name.trim().length > 0;

  useEffect(() => {
    const el = detailRef.current;
    if (!el) return;
    const t = easeInOut(prog(progress, ...DETAIL_IN));
    el.style.opacity = String(t);
    el.style.transform = prefersReducedMotion()
      ? 'none'
      : `translateY(${lerp(14, 0, t)}px)`;
  }, [progress]);

  return (
    <figure className="flex flex-col">
      {/* Capped in vh so the portrait plus its caption always fit one
          viewport — the stage does not scroll, so overflow is lost. */}
      <div className="relative aspect-[3/4] max-h-[46vh] w-full overflow-hidden border border-[hsl(var(--rule))] bg-[hsl(var(--ink-raised))]">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            loading="lazy"
            className="h-full w-full object-cover grayscale"
          />
        ) : (
          /* An empty seat reads as reserved, not as a failed image. */
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              backgroundImage:
                'repeating-linear-gradient(135deg, transparent 0 11px, hsl(var(--rule)) 11px 12px)',
            }}
            aria-hidden="true"
          >
            <span className="display-m select-none bg-[hsl(var(--ink-raised))] px-4 py-2 text-[hsl(var(--graphite))]">
              {filled ? initials(member.name) : 'TBA'}
            </span>
          </div>
        )}

        <span className="mono-label absolute bottom-0 left-0 bg-[hsl(var(--ink))] px-3 py-2">
          {member.isLead ? 'Lead' : 'Joint'}
        </span>
      </div>

      <figcaption ref={detailRef} className="pt-5" style={{ opacity: 0 }}>
        <h4 className="display-m">
          {filled ? (
            member.name
          ) : (
            <span className="text-[hsl(var(--graphite))]">Position open</span>
          )}
        </h4>
        <p className="mono-label mt-2">{member.role}</p>

        {member.bio && (
          <p className="mt-4 max-w-prose text-sm leading-relaxed text-[hsl(var(--graphite))]">
            {member.bio}
          </p>
        )}

        {member.linkedin && (
          <a
            href={
              member.linkedin.startsWith('http')
                ? member.linkedin
                : `https://${member.linkedin}`
            }
            target="_blank"
            rel="noreferrer noopener"
            className="focus-phosphor mono-label mt-4 inline-flex items-center gap-2 text-[hsl(var(--chalk))] transition-colors hover:text-[hsl(var(--phosphor))]"
          >
            <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
            LinkedIn
          </a>
        )}
      </figcaption>
    </figure>
  );
};

/** The pair of portraits, sliding in as the headline leaves. */
const Pair = ({
  progress,
  members,
}: {
  progress: number;
  members: Coordinator[];
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const t = easeInOut(prog(progress, ...PAIR_IN));
    el.style.opacity = String(t);
    el.style.transform = prefersReducedMotion()
      ? 'none'
      : `translateY(${lerp(40, 0, t)}px)`;
    // Faded-out phases must not intercept clicks on what's visible.
    el.style.pointerEvents = t > 0.5 ? 'auto' : 'none';
  }, [progress]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 z-10 flex flex-col justify-center px-6 sm:px-10 lg:px-16"
      style={{ opacity: 0, willChange: 'opacity, transform' }}
    >
      <div className="mx-auto grid w-full max-w-3xl grid-cols-2 gap-6 sm:gap-10 lg:gap-14">
        {members.map(member => (
          <MemberFigure key={member.id} member={member} progress={progress} />
        ))}
      </div>
    </div>
  );
};

const CoreMembers = () => (
  <section id="core-members" className="lattice relative">
    {/* Section opening */}
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

    {coordinatorsByPortfolio.map(({ portfolio, members }, index) => (
      <ScrollScene key={portfolio} heightVh={320}>
        {progress => (
          <div className="lattice relative h-full w-full">
            <Headline
              progress={progress}
              index={index}
              portfolio={portfolio}
            />
            <Pair progress={progress} members={members} />
          </div>
        )}
      </ScrollScene>
    ))}
  </section>
);

export default CoreMembers;
