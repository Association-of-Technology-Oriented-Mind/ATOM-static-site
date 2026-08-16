import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';

// ── Club Page (Placeholder) ──────────────────────────────────────────────────
// Matches the orbital design system with a clean editorial fallback.

const ease = [0.16, 1, 0.3, 1] as const;

const ClubPage = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <>
      <main
        className="min-h-screen relative flex flex-col justify-center overflow-hidden"
        style={{
          backgroundColor: 'hsl(var(--ink))',
          paddingTop: 'var(--nav-height)',
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, hsl(var(--phosphor)/0.03) 0%, transparent 60%)',
            filter: 'blur(80px)',
            zIndex: 0,
          }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center w-full my-auto py-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <span
              className="uppercase tracking-[0.2em]"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'hsl(var(--graphite))' }}
            >
              CLUB
            </span>
            <span className="w-6 h-px bg-[hsl(var(--rule))]" aria-hidden="true" />
            <span
              className="uppercase tracking-[0.2em]"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'hsl(var(--phosphor))' }}
            >
              {(slug ?? '').toUpperCase()}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="uppercase mb-6"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              color: 'hsl(var(--chalk))',
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}
          >
            Coming Soon
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="mx-auto mb-12 max-w-[44ch]"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              lineHeight: 1.7,
              color: 'hsl(var(--chalk)/0.6)',
              fontWeight: 300,
            }}
          >
            Individual club dossiers are currently in development. Check back soon for detailed information about this club's focus, activities, and upcoming sessions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              to="/#clubs-section"
              className="btn-tech inline-flex"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-2" aria-hidden="true" />
              <span>Back to clubs</span>
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ClubPage;
