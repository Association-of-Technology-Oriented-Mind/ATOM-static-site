import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useEvents } from '@/hooks/useContent';

// ── About + Our Numbers — Merged Section ─────────────────────────────────────
// Preserves both original designs exactly as they were, but completely merged
// into a single file and a single component for seamless rendering.

const ease = [0.16, 1, 0.3, 1] as const;

// ── Animated Counter ──────────────────────────────────────────────────────────
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


export const About = () => {
  const aboutRef = useRef<HTMLElement>(null);
  const isAboutInView = useInView(aboutRef, { once: true, margin: '-120px' });

  const achievementsRef = useRef<HTMLElement>(null);
  const isAchievementsInView = useInView(achievementsRef, { once: true, margin: '-80px' });

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
    <>
      {/* ── ABOUT ── */}
      <section
        ref={aboutRef}
        className="about-section"
        id="about"
        aria-labelledby="about-heading"
      >
        {/* Subtle ambient background */}
        <div className="about-ambient" aria-hidden="true" />

          <div className="about-container">
          {/* Section label */}
          <motion.div
            className="about-label"
            initial={{ opacity: 0, y: 12 }}
            animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease }}
          >
            <span className="about-label__num">01</span>
            <span className="about-label__rule" aria-hidden="true" />
            <span>Discover</span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            id="about-heading"
            className="about-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
          >
            <span className="about-heading__word">About</span>{' '}
            <span className="about-heading__word accent">ATOM</span>
          </motion.h2>

          {/* Body */}
          <motion.p
            className="about-body"
            initial={{ opacity: 0, y: 14 }}
            animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease }}
          >
            Association of Technology Oriented Minds (ATOM) is a student-driven
            community that fosters innovation, learning, and collaboration. We aim
            to empower students with hands-on experience, technical skills, and a
            platform to turn ideas into impactful solutions.
          </motion.p>

          {/* Signature line */}
          <motion.div
            className="about-signature"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isAboutInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.35, ease }}
            style={{ transformOrigin: 'left' }}
          >
            <span className="about-signature__line" aria-hidden="true" />
            <span className="about-signature__text">Karunya Institute of Technology and Sciences</span>
          </motion.div>
        </div>
      </section>

      {/* ── OUR NUMBERS ── */}
      <section
        ref={achievementsRef}
        className="achievements-section"
        id="achievements"
        aria-labelledby="achievements-heading"
      >
        <div className="achievements-container">
          {/* Stats grid */}
          <div className="achievements-strip">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                className="achievements-stat"
                initial={{ opacity: 0, y: 20 }}
                animate={isAchievementsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.08, ease }}
              >
                <span className="achievements-stat__number">
                  <AnimatedCounter
                    target={stat.target}
                    suffix={stat.suffix}
                    isInView={isAchievementsInView}
                  />
                </span>
                <span className="achievements-stat__title">{stat.title}</span>
                <span className="achievements-stat__context">{stat.context}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;