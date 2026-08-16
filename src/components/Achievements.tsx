import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useEvents } from '@/hooks/useContent';

// ── Achievements — Horizontal Stats Strip ────────────────────────────────────
// Pure typography-driven stats. Large numbers, clean dividers.
// Framer Motion for reveal, inline counter animation.

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
    if (reducedMotion) {
      setCount(target);
      return;
    }

    const duration = 1800;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out curve
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

export const Achievements = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const { data: events = [] } = useEvents();
  const liveEventCount = events.length > 0 ? events.length : 9;

  const stats = [
    {
      id: 'members',
      target: 88,
      suffix: '+',
      title: 'Active Members',
      context: 'Growing network',
    },
    {
      id: 'events',
      target: liveEventCount,
      suffix: '',
      title: 'Events Conducted',
      context: 'In academic year 2025',
    },
    {
      id: 'clubs',
      target: 4,
      suffix: '',
      title: 'Specialist Clubs',
      context: 'Focused domains',
    },
    {
      id: 'portfolios',
      target: 6,
      suffix: '',
      title: 'Core Portfolios',
      context: 'Leadership seats',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="achievements-section"
      id="achievements"
      aria-labelledby="achievements-heading"
    >
      <div className="achievements-container">
        {/* Header */}
        <motion.div
          className="achievements-header"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
        >
          <div className="achievements-label">
            <span className="achievements-label__num">02</span>
            <span className="achievements-label__rule" aria-hidden="true" />
            <span>Impact &amp; Milestones</span>
          </div>
          <h2 id="achievements-heading" className="achievements-heading">
            Our Numbers
          </h2>
        </motion.div>

        {/* Stats strip */}
        <div className="achievements-strip">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              className="achievements-stat"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.08, ease }}
            >
              <span className="achievements-stat__number">
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  isInView={isInView}
                />
              </span>
              <span className="achievements-stat__title">{stat.title}</span>
              <span className="achievements-stat__context">{stat.context}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;