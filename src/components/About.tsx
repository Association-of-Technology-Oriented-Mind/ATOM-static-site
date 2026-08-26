import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// ── About Section — 4-Card Grid Layout (Matches Reference Image) ───────────────

const ease = [0.16, 1, 0.3, 1] as const;

// SVG watermarks for each card
const StarburstWatermark = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
    style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: 110, height: 110, opacity: 0.18 }}>
    {Array.from({ length: 16 }).map((_, i) => {
      const angle = (i * 360) / 16;
      const rad = (angle * Math.PI) / 180;
      const x2 = 60 + 52 * Math.cos(rad);
      const y2 = 60 + 52 * Math.sin(rad);
      return <line key={i} x1="60" y1="60" x2={x2} y2={y2} stroke="#000" strokeWidth="1.5" strokeLinecap="round" />;
    })}
    <circle cx="60" cy="60" r="8" fill="#000" />
  </svg>
);

const IsometricWatermark = () => (
  <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
    style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: 110, height: 90, opacity: 0.13 }}>
    {/* Three stacked isometric boxes */}
    {/* Bottom box */}
    <polygon points="60,70 90,55 90,75 60,90" fill="rgba(125,249,228,0.5)" />
    <polygon points="30,55 60,70 60,90 30,75" fill="rgba(125,249,228,0.3)" />
    <polygon points="30,55 60,40 90,55 60,70" fill="rgba(125,249,228,0.7)" />
    {/* Middle box */}
    <polygon points="60,50 90,35 90,55 60,70" fill="rgba(125,249,228,0.5)" />
    <polygon points="30,35 60,50 60,70 30,55" fill="rgba(125,249,228,0.3)" />
    <polygon points="30,35 60,20 90,35 60,50" fill="rgba(125,249,228,0.7)" />
    {/* Top box */}
    <polygon points="60,30 90,15 90,35 60,50" fill="rgba(125,249,228,0.5)" />
    <polygon points="30,15 60,30 60,50 30,35" fill="rgba(125,249,228,0.3)" />
    <polygon points="30,15 60,0 90,15 60,30" fill="rgba(125,249,228,0.7)" />
  </svg>
);

const RadarWatermark = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
    style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: 110, height: 110, opacity: 0.13 }}>
    {[52, 38, 26, 14].map((r, i) => (
      <circle key={i} cx="60" cy="60" r={r} stroke="rgba(125,249,228,0.8)" strokeWidth="1.2" fill="none" />
    ))}
    <line x1="60" y1="60" x2="60" y2="8" stroke="rgba(125,249,228,0.6)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="60" y1="60" x2="105" y2="80" stroke="rgba(125,249,228,0.3)" strokeWidth="1" strokeLinecap="round" />
    <circle cx="60" cy="8" r="3" fill="rgba(125,249,228,0.8)" />
  </svg>
);

const DotGridWatermark = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
    style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: 100, height: 100, opacity: 0.2 }}>
    {Array.from({ length: 5 }).map((_, row) =>
      Array.from({ length: 5 }).map((_, col) => (
        <circle key={`${row}-${col}`} cx={10 + col * 20} cy={10 + row * 20} r="2.5" fill="#444" />
      ))
    )}
  </svg>
);

const ArrowButton = ({ light = false }: { light?: boolean }) => (
  <button
    type="button"
    aria-label="Learn more"
    style={{
      width: 44,
      height: 44,
      borderRadius: '50%',
      border: `1.5px solid ${light ? 'rgba(0,0,0,0.25)' : 'rgba(125,249,228,0.4)'}`,
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      flexShrink: 0,
      transition: 'all 0.3s ease',
      color: light ? '#000' : 'rgba(125,249,228,0.9)',
    }}
    className="about-arrow-btn"
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </button>
);

const CARDS = [
  {
    num: '01',
    title: 'Who We Are',
    body: 'ATOM — Association of Technology Oriented Minds is a student-led community under the Division of Data Science and Cyber Security, bringing together curious minds passionate about technology, innovation, and learning.',
    variant: 'mint',   // teal/mint card
    Watermark: StarburstWatermark,
  },
  {
    num: '02',
    title: 'What We Do',
    body: 'We create opportunities to learn, build, and collaborate through workshops, hackathons, technical sessions, research discussions, CTFs, and hands-on projects across our four clubs.',
    variant: 'dark',
    Watermark: IsometricWatermark,
  },
  {
    num: '03',
    title: 'Our Mission',
    body: 'Our mission is to build a platform where students can explore emerging technologies, develop real-world skills, and turn ideas into meaningful solutions.',
    variant: 'dark',
    Watermark: RadarWatermark,
  },
  {
    num: '04',
    title: 'Beyond Code',
    body: 'ATOM is more than technology. We foster leadership, teamwork, creativity, communication, and problem-solving to help students grow into confident and well-rounded professionals.',
    variant: 'silver',  // off-white/silver card
    Watermark: DotGridWatermark,
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
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 80% 30%, rgba(125,249,228,0.04) 0%, transparent 60%)',
      }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto' }}>

        {/* ── Header Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '2rem',
            marginBottom: '3rem',
          }}
        >
          {/* Left: badge + headline */}
          <div>
            {/* ABOUT US badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#5eead4',
                flexShrink: 0,
                display: 'block',
              }} />
              <span style={{
                fontFamily: 'var(--lg-font-mono, monospace)',
                fontSize: '0.6875rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#5eead4',
                fontWeight: 600,
              }}>About Us</span>
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
          </div>

          {/* Right: vertical accent border + description */}
          <div style={{
            maxWidth: 340,
            paddingLeft: '1.5rem',
            borderLeft: '2.5px solid #5eead4',
            marginTop: '0.5rem',
          }}>
            <p style={{
              fontFamily: 'var(--lg-font-body, sans-serif)',
              fontSize: '0.9375rem',
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.7,
              fontWeight: 300,
              margin: 0,
            }}>
              ATOM – Association of Technology Oriented Minds, a community driven by curiosity, creativity and the passion for technology.
            </p>
          </div>
        </motion.div>

        {/* ── 4-Card Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          {CARDS.map(({ num, title, body, variant, Watermark }, i) => {
            const isMint = variant === 'mint';
            const isSilver = variant === 'silver';
            const isDark = variant === 'dark';

            const bg = isMint
              ? '#5eead4'
              : isSilver
              ? '#c8cad0'
              : 'rgba(18, 20, 30, 0.85)';

            const numColor = isMint ? 'rgba(0,0,0,0.5)' : isSilver ? 'rgba(0,0,0,0.45)' : 'rgba(125,249,228,0.7)';
            const titleColor = isMint || isSilver ? '#000' : '#fff';
            const bodyColor = isMint ? 'rgba(0,0,0,0.7)' : isSilver ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)';
            const ruleColor = isMint ? 'rgba(0,0,0,0.25)' : isSilver ? 'rgba(0,0,0,0.2)' : 'rgba(125,249,228,0.4)';

            // Hover fill colors: mint card → dark on hover, dark cards → mint on hover, silver → dark on hover
            const hoverBg = isMint
              ? '#0a0a12'
              : isSilver
              ? '#0a0a12'
              : '#5eead4';

            return (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease }}
                className="about-card"
                style={{
                  position: 'relative',
                  borderRadius: 18,
                  padding: 'clamp(1.5rem, 2.5vw, 2rem)',
                  background: bg,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 380,
                  border: isDark ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  cursor: 'default',
                  // CSS variable for hover fill
                  ['--about-hover-bg' as string]: hoverBg,
                }}
              >
                {/* Hover fill overlay — slides up from bottom (same as btn-tech) */}
                <div
                  className="about-card__hover-fill"
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: hoverBg,
                    transform: 'translateY(100%)',
                    transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                    borderRadius: 18,
                    zIndex: 0,
                  }}
                />

                {/* Watermark */}
                <Watermark />

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Number */}
                  <span
                    className="about-card__num"
                    style={{
                      fontFamily: 'var(--lg-font-display, sans-serif)',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: numColor,
                      letterSpacing: '-0.02em',
                      lineHeight: 1,
                      marginBottom: '0.625rem',
                      transition: 'color 0.35s ease',
                    }}
                  >{num}</span>

                  {/* Accent rule under number */}
                  <div style={{ width: 28, height: 2, background: ruleColor, marginBottom: '1.25rem', borderRadius: 2, transition: 'background 0.35s ease' }} className="about-card__rule" />

                  {/* Title */}
                  <h3
                    className="about-card__title"
                    style={{
                      fontFamily: 'var(--lg-font-display, sans-serif)',
                      fontSize: 'clamp(1.3rem, 2vw, 1.6rem)',
                      fontWeight: 800,
                      color: titleColor,
                      letterSpacing: '-0.03em',
                      lineHeight: 1.15,
                      margin: 0,
                      marginBottom: '0.75rem',
                      transition: 'color 0.35s ease',
                    }}
                  >{title}</h3>

                  {/* Rule under title */}
                  <div style={{ width: 28, height: 2, background: ruleColor, marginBottom: '1.25rem', borderRadius: 2, transition: 'background 0.35s ease' }} className="about-card__rule" />

                  {/* Body */}
                  <p
                    className="about-card__body"
                    style={{
                      fontFamily: 'var(--lg-font-body, sans-serif)',
                      fontSize: '0.9rem',
                      color: bodyColor,
                      lineHeight: 1.7,
                      fontWeight: 300,
                      flex: 1,
                      transition: 'color 0.35s ease',
                    }}
                  >{body}</p>

                  {/* Arrow button */}
                  <div style={{ marginTop: '1.5rem' }}>
                    <ArrowButton light={isMint || isSilver} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Bottom Quote Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.55, ease }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            padding: '1.5rem 2rem',
          }}
        >
          <span style={{ fontSize: '2rem', color: '#5eead4', lineHeight: 1, fontFamily: 'Georgia, serif', opacity: 0.85 }}>&ldquo;</span>
          <p style={{
            fontFamily: 'var(--lg-font-body, sans-serif)',
            fontSize: 'clamp(0.95rem, 1.6vw, 1.125rem)',
            color: 'rgba(255,255,255,0.65)',
            fontStyle: 'normal',
            fontWeight: 400,
            letterSpacing: '0.01em',
            textAlign: 'center',
            margin: 0,
          }}>
            Building today. Innovating tomorrow. Leading the change.
          </p>
          <span style={{ fontSize: '2rem', color: '#5eead4', lineHeight: 1, fontFamily: 'Georgia, serif', opacity: 0.85 }}>&rdquo;</span>
        </motion.div>

      </div>

      {/* Scoped hover styles */}
      <style>{`
        .about-card:hover .about-card__hover-fill {
          transform: translateY(0);
        }
        .about-card:hover .about-card__num,
        .about-card:hover .about-card__title {
          color: rgba(255,255,255,0.95) !important;
        }
        .about-card:hover .about-card__body {
          color: rgba(255,255,255,0.6) !important;
        }
        .about-card:hover .about-card__rule {
          background: rgba(125,249,228,0.5) !important;
        }
        .about-arrow-btn:hover {
          background: rgba(125,249,228,0.15) !important;
          border-color: #5eead4 !important;
        }
      `}</style>
    </section>
  );
};

export default About;