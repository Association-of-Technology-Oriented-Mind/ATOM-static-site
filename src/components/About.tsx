import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// ── About Section — Editorial Layout ─────────────────────────────────────────
// Clean editorial composition matching the orbital design language.
// No multi-layer backgrounds. Uses Framer Motion instead of GSAP.

const ease = [0.16, 1, 0.3, 1] as const;

export const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-120px' });

  return (
    <section
      ref={sectionRef}
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
          animate={isInView ? { opacity: 1, y: 0 } : {}}
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
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease }}
        >
          <span className="about-heading__word">About</span>{' '}
          <span className="about-heading__word accent">ATOM</span>
        </motion.h2>

        {/* Body */}
        <motion.p
          className="about-body"
          initial={{ opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
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
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.35, ease }}
          style={{ transformOrigin: 'left' }}
        >
          <span className="about-signature__line" aria-hidden="true" />
          <span className="about-signature__text">Karunya Institute of Technology and Sciences</span>
        </motion.div>
      </div>
    </section>
  );
};

export default About;