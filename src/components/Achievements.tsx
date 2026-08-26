import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useEvents } from '@/hooks/useContent';
import { use3DTilt } from '@/hooks/use3DTilt';

// ── Achievements — Liquid Glass 3D Metrics Grid ───────────────────────────────
// Four interactive frosted glass metric cards with animated counters.
// Hovering triggers cursor-tracking 3D perspective tilt + specular shine.

const ease = [0.16, 1, 0.3, 1] as const;

const AnimatedCounter = ({
  target,
  suffix = '',
  isInView,
}: {
  target: number;
  suffix?: string;
  isInView: boolean;
}) => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) { setCount(target); return; }

    const duration = 1800;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
      else setCount(target);
    };
    requestAnimationFrame(animate);
  }, [isInView, target]);

  return <span>{count}{suffix}</span>;
};

const MetricCard = ({
  target,
  suffix,
  title,
  context,
  index,
  isInView,
}: {
  target: number;
  suffix: string;
  title: string;
  context: string;
  index: number;
  isInView: boolean;
}) => {
  const ref = use3DTilt<HTMLDivElement>({ max: 10, scale: 1.02 });

  return (
    <motion.div
      ref={ref}
      className="lg-achievements__metric liquid-glass-card"
      initial={{ opacity: 0, y: 24, scale: 0.93 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.1, ease }}
    >
      {/* Specular accent dot */}
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'rgba(125,249,228,0.5)',
          boxShadow: '0 0 8px rgba(125,249,228,0.4)',
          marginBottom: '1rem',
          flexShrink: 0,
        }}
        aria-hidden="true"
      />

      <div className="lg-achievements__number" aria-label={`${target}${suffix} ${title}`}>
        <AnimatedCounter target={target} suffix={suffix} isInView={isInView} />
      </div>

      <div className="lg-achievements__label">{title}</div>
      <div className="lg-achievements__context">{context}</div>
    </motion.div>
  );
};

export const Achievements = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const { data: events = [] } = useEvents();
  const liveEventCount = events.length > 0 ? events.length : 9;

  const stats = [
    { id: 'members', target: 88, suffix: '+', title: 'Active Members', context: 'Growing community' },
    { id: 'events', target: liveEventCount, suffix: '', title: 'Events Conducted', context: 'Academic year 2025' },
    { id: 'clubs', target: 4, suffix: '', title: 'Specialist Clubs', context: 'Focused domains' },
    { id: 'portfolios', target: 6, suffix: '', title: 'Core Portfolios', context: 'Leadership seats' },
  ];

  return (
    <section
      ref={sectionRef}
      className="lg-achievements"
      id="achievements"
      aria-labelledby="achievements-heading"
    >
      <div className="lg-achievements__container" style={{ position: 'relative', zIndex: 2 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: '3rem' }}
        >
          <div className="lg-section-label">
            <span className="lg-section-label__num">02</span>
            <span className="lg-section-label__line" />
            <span className="lg-section-label__text">Impact & Milestones</span>
          </div>
          <h2
            id="achievements-heading"
            className="lg-section-heading"
          >
            Our Numbers
          </h2>
        </motion.div>

        {/* Metrics Grid */}
        <div className="lg-achievements__grid">
          {stats.map((stat, index) => (
            <MetricCard
              key={stat.id}
              target={stat.target}
              suffix={stat.suffix}
              title={stat.title}
              context={stat.context}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;