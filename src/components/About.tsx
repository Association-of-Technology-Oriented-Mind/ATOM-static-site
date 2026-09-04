import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { use3DTilt } from '@/hooks/use3DTilt';

// ── About Section — Liquid Glass Editorial Layout ─────────────────────────────
// A floating 3D glass card presenting ATOM's thesis with interactive specular
// reflection. Cursor-tracking card tilt courtesy of use3DTilt hook.

const ease = [0.16, 1, 0.3, 1] as const;

export const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const cardRef = use3DTilt<HTMLDivElement>({ max: 8, scale: 1.01 });

  return (
    <section
      ref={sectionRef}
      className="lg-about"
      id="about"
      aria-labelledby="about-heading"
    >
      {/* Ambient light blobs */}
      <div className="lg-about__ambient" aria-hidden="true" />

      <div className="lg-about__container" style={{ position: 'relative', zIndex: 2 }}>

        {/* ── Left: Section label + heading ── */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease }}
        >
          <div className="lg-section-label" style={{ marginBottom: '2rem' }}>
            <span className="lg-section-label__num">01</span>
            <span className="lg-section-label__line" />
            <span className="lg-section-label__text">Discover</span>
          </div>

          <h2
            id="about-heading"
            className="lg-section-heading"
            style={{ marginBottom: '2rem', maxWidth: '10ch' }}
          >
            About{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(125,249,228,0.7) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ATOM
            </span>
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.25, ease }}
            style={{
              fontFamily: 'var(--lg-font-body)',
              fontSize: 'clamp(1rem, 1.4vw, 1.1rem)',
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.75,
              fontWeight: 300,
              maxWidth: '44ch',
            }}
          >
            A student-driven community that fosters innovation, learning, and
            collaboration. We aim to empower students with hands-on experience,
            technical skills, and a platform to turn ideas into impactful solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.45, ease }}
            style={{
              transformOrigin: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginTop: '2rem',
            }}
          >
            <div
              style={{
                width: 32,
                height: 1,
                background: 'rgba(125,249,228,0.4)',
              }}
              aria-hidden="true"
            />
            <span
              style={{
                fontFamily: 'var(--lg-font-mono)',
                fontSize: '0.625rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              Karunya Institute of Technology and Sciences
            </span>
          </motion.div>
        </motion.div>

        {/* ── Right: 3D Glass Card ── */}
        <motion.div
          initial={{ opacity: 0, x: 32, scale: 0.95 }}
          animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease }}
        >
          <div
            ref={cardRef}
            className="lg-about__card liquid-glass-card"
          >
            {/* Specular top edge line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '10%',
                right: '10%',
                height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(125,249,228,0.5), transparent)',
                borderRadius: '0 0 100px 100px',
              }}
              aria-hidden="true"
            />

            <div style={{ position: 'relative', zIndex: 2 }}>
              {/* Stat row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  overflow: 'hidden',
                  marginBottom: '2rem',
                }}
              >
                {[
                  { value: '4', label: 'Specialist Clubs' },
                  { value: '6', label: 'Core Portfolios' },
                  { value: '88+', label: 'Active Members' },
                  { value: '2025', label: 'Academic Year' },
                ].map(({ value, label }) => (
                  <div
                    key={label}
                    style={{
                      padding: '1.25rem',
                      background: 'rgba(18, 20, 30, 0.6)',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--lg-font-display)',
                        fontSize: '1.875rem',
                        fontWeight: 700,
                        letterSpacing: '-0.04em',
                        lineHeight: 1,
                        color: 'hsl(var(--phosphor))',
                        marginBottom: '0.375rem',
                      }}
                    >
                      {value}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--lg-font-mono)',
                        fontSize: '0.5625rem',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.6)',
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Description paragraphs */}
              <p
                style={{
                  fontFamily: 'var(--lg-font-body)',
                  fontSize: '0.9375rem',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.7,
                  fontWeight: 300,
                  marginBottom: '1.25rem',
                }}
              >
                ATOM (Association of Technology Oriented Minds) is the flagship technical
                student community at Karunya's Department of Computer Science & Engineering.
              </p>
              <p
                style={{
                  fontFamily: 'var(--lg-font-body)',
                  fontSize: '0.9375rem',
                  color: 'rgba(255,255,255,0.55)',
                  lineHeight: 1.7,
                  fontWeight: 300,
                }}
              >
                Through four specialist sub-clubs — Hack Hive, DotDev, Unbiased,
                and Qyro — we run hands-on programs, hackathons, workshops, and
                collaborative research across cybersecurity, full-stack development,
                AI/ML, and quantum computing.
              </p>

              {/* Bottom badge */}
              <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Cybersecurity', 'AI / ML', 'Web Dev', 'Quantum'].map(tag => (
                  <span key={tag} className="lg-badge">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;