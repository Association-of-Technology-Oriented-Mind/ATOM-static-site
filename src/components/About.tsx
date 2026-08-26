import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import atomLogo from '@/assets/atom-logo.webp';

// ── About Section — 4-Card Grid Layout with Bottom-to-Top Fill Transitions ────

const ease = [0.16, 1, 0.3, 1] as const;

const CARDS = [
  {
    num: '01',
    title: 'Who We Are',
    body: 'ATOM — Association of Technology Oriented Minds is a student-led community under the Division of Data Science and Cyber Security, bringing together curious minds passionate about technology, innovation, and learning.',
    cardClass: 'about-card--1',
  },
  {
    num: '02',
    title: 'What We Do',
    body: 'We create opportunities to learn, build, and collaborate through workshops, hackathons, technical sessions, research discussions, CTFs, and hands-on projects across our four clubs.',
    cardClass: 'about-card--2',
  },
  {
    num: '03',
    title: 'Our Mission',
    body: 'Our mission is to build a platform where students can explore emerging technologies, develop real-world skills, and turn ideas into meaningful solutions.',
    cardClass: 'about-card--3',
  },
  {
    num: '04',
    title: 'Beyond Code',
    body: 'ATOM is more than technology. We foster leadership, teamwork, creativity, communication, and problem-solving to help students grow into confident and well-rounded professionals.',
    cardClass: 'about-card--4',
  },
] as const;

export const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-heading"
      style={{
        position: 'relative',
        background: 'var(--lg-bg, #0a0a12)',
        padding: 'clamp(4rem, 8vw, 7rem) clamp(1.25rem, 5vw, 3rem)',
        overflow: 'hidden',
      }}
    >
      {/* Subtle ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 50% at 80% 30%, rgba(125,249,228,0.04) 0%, transparent 60%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto' }}>

        {/* ── Header Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          style={{
            marginBottom: '3rem',
          }}
        >
          {/* ABOUT ATOM badge with metallic chrome gradient & no dot */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1rem',
          }}>
            <span style={{
              fontFamily: 'var(--lg-font-mono, monospace)',
              fontSize: '0.75rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35em',
            }}>
              <span className="atom-brand-text">ABOUT</span>
              <span className="inline-flex items-center gap-[0.05em]">
                <span className="atom-brand-text">AT</span>
                <img
                  src={atomLogo}
                  alt="O"
                  style={{
                    width: '0.85em',
                    height: '0.85em',
                    objectFit: 'contain',
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    marginTop: '-0.1em',
                  }}
                />
                <span className="atom-brand-text">M</span>
              </span>
            </span>
          </div>

          {/* Headline */}
          <h2
            id="about-heading"
            style={{
              fontFamily: 'var(--lg-font-display, sans-serif)',
              fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: '#fff',
              margin: 0,
            }}
          >
            Get to{' '}
            <span style={{ color: '#5eead4' }}>know us</span>
          </h2>
        </motion.div>

        {/* ── 4-Card Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
        }}>
          {CARDS.map(({ num, title, body, cardClass }, i) => {
            return (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease }}
                className={`about-card ${cardClass}`}
                style={{
                  position: 'relative',
                  borderRadius: 18,
                  padding: 'clamp(1.5rem, 2.5vw, 2rem)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 340,
                  cursor: 'default',
                }}
              >
                {/* Bottom-to-top hover fill layer */}
                <div className="about-card__fill" aria-hidden="true" />

                {/* Content */}
                <div className="about-card__content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Number */}
                  <span
                    className="about-card__num"
                    style={{
                      fontFamily: 'var(--lg-font-display, sans-serif)',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      lineHeight: 1,
                      marginBottom: '0.625rem',
                    }}
                  >
                    {num}
                  </span>

                  {/* Accent rule under number */}
                  <div
                    className="about-card__rule"
                    style={{
                      width: 28,
                      height: 2,
                      marginBottom: '1.25rem',
                      borderRadius: 2,
                    }}
                  />

                  {/* Title */}
                  <h3
                    className="about-card__title"
                    style={{
                      fontFamily: 'var(--lg-font-display, sans-serif)',
                      fontSize: 'clamp(1.3rem, 2vw, 1.6rem)',
                      fontWeight: 800,
                      letterSpacing: '-0.03em',
                      lineHeight: 1.15,
                      margin: 0,
                      marginBottom: '0.75rem',
                    }}
                  >
                    {title}
                  </h3>

                  {/* Rule under title */}
                  <div
                    className="about-card__rule"
                    style={{
                      width: 28,
                      height: 2,
                      marginBottom: '1.25rem',
                      borderRadius: 2,
                    }}
                  />

                  {/* Body */}
                  <p
                    className="about-card__body"
                    style={{
                      fontFamily: 'var(--lg-font-body, sans-serif)',
                      fontSize: '0.9rem',
                      lineHeight: 1.7,
                      fontWeight: 300,
                      flex: 1,
                    }}
                  >
                    {body}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Scoped CSS for bottom-to-top slide fill transitions */}
      <style>{`
        .about-card {
          position: relative;
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .about-card:hover {
          transform: translateY(-4px);
        }

        /* Slide-up fill layer from bottom to top (matched visual speed with buttons) */
        .about-card__fill {
          position: absolute;
          inset: 0;
          border-radius: 18px;
          transform: translateY(100%);
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 1;
          pointer-events: none;
        }
        .about-card:hover .about-card__fill {
          transform: translateY(0%);
        }

        .about-card__content {
          position: relative;
          z-index: 2;
        }

        .about-card .about-card__num,
        .about-card .about-card__title,
        .about-card .about-card__body,
        .about-card .about-card__rule {
          transition: color 0.45s cubic-bezier(0.16, 1, 0.3, 1),
                      background-color 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* ── CARD 1: Default Mint (#5eead4) → Hover Silver (Slide Fill) ── */
        .about-card--1 {
          background-color: #5eead4;
          border: 1px solid transparent;
        }
        .about-card--1 .about-card__fill {
          background-color: #c8cad0;
        }
        .about-card--1 .about-card__num { color: rgba(0, 0, 0, 0.5); }
        .about-card--1 .about-card__title { color: #000000; }
        .about-card--1 .about-card__body { color: rgba(0, 0, 0, 0.75); }
        .about-card--1 .about-card__rule { background-color: rgba(0, 0, 0, 0.25); }

        .about-card--1:hover {
          box-shadow: 0 16px 36px rgba(200, 202, 208, 0.25);
        }
        .about-card--1:hover .about-card__num { color: rgba(0, 0, 0, 0.45); }
        .about-card--1:hover .about-card__title { color: #000000; }
        .about-card--1:hover .about-card__body { color: rgba(0, 0, 0, 0.65); }
        .about-card--1:hover .about-card__rule { background-color: rgba(0, 0, 0, 0.2); }

        /* ── CARD 2: Default Dark → Hover Mint (Slide Fill) ── */
        .about-card--2 {
          background-color: rgba(18, 20, 30, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }
        .about-card--2 .about-card__fill {
          background-color: #5eead4;
        }
        .about-card--2 .about-card__num { color: rgba(125, 249, 228, 0.75); }
        .about-card--2 .about-card__title { color: #ffffff; }
        .about-card--2 .about-card__body { color: rgba(255, 255, 255, 0.6); }
        .about-card--2 .about-card__rule { background-color: rgba(125, 249, 228, 0.4); }

        .about-card--2:hover {
          box-shadow: 0 16px 36px rgba(94, 234, 212, 0.25);
        }
        .about-card--2:hover .about-card__num { color: rgba(0, 0, 0, 0.5); }
        .about-card--2:hover .about-card__title { color: #000000; }
        .about-card--2:hover .about-card__body { color: rgba(0, 0, 0, 0.75); }
        .about-card--2:hover .about-card__rule { background-color: rgba(0, 0, 0, 0.25); }

        /* ── CARD 3: Default Dark → Hover Silver (Slide Fill) ── */
        .about-card--3 {
          background-color: rgba(18, 20, 30, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }
        .about-card--3 .about-card__fill {
          background-color: #c8cad0;
        }
        .about-card--3 .about-card__num { color: rgba(125, 249, 228, 0.75); }
        .about-card--3 .about-card__title { color: #ffffff; }
        .about-card--3 .about-card__body { color: rgba(255, 255, 255, 0.6); }
        .about-card--3 .about-card__rule { background-color: rgba(125, 249, 228, 0.4); }

        .about-card--3:hover {
          box-shadow: 0 16px 36px rgba(200, 202, 208, 0.25);
        }
        .about-card--3:hover .about-card__num { color: rgba(0, 0, 0, 0.45); }
        .about-card--3:hover .about-card__title { color: #000000; }
        .about-card--3:hover .about-card__body { color: rgba(0, 0, 0, 0.65); }
        .about-card--3:hover .about-card__rule { background-color: rgba(0, 0, 0, 0.2); }

        /* ── CARD 4: Default Silver → Hover Mint (Slide Fill) ── */
        .about-card--4 {
          background-color: #c8cad0;
          border: 1px solid transparent;
        }
        .about-card--4 .about-card__fill {
          background-color: #5eead4;
        }
        .about-card--4 .about-card__num { color: rgba(0, 0, 0, 0.45); }
        .about-card--4 .about-card__title { color: #000000; }
        .about-card--4 .about-card__body { color: rgba(0, 0, 0, 0.6); }
        .about-card--4 .about-card__rule { background-color: rgba(0, 0, 0, 0.2); }

        .about-card--4:hover {
          box-shadow: 0 16px 36px rgba(94, 234, 212, 0.25);
        }
        .about-card--4:hover .about-card__num { color: rgba(0, 0, 0, 0.5); }
        .about-card--4:hover .about-card__title { color: #000000; }
        .about-card--4:hover .about-card__body { color: rgba(0, 0, 0, 0.75); }
        .about-card--4:hover .about-card__rule { background-color: rgba(0, 0, 0, 0.25); }
      `}</style>
    </section>
  );
};

export default About;