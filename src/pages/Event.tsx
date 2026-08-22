import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useInView, useScroll, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { type Event as EventType } from '@/constants/events';
import { useEvents } from '@/hooks/useContent';
import { generateSlug } from '@/utils/slug';
import atomLogo from '@/assets/atom-logo.webp';
import { useLenis } from '@/hooks/useLenis';
import Footer from '@/components/Footer';
import OrbitalCanvas from '@/components/OrbitalCanvas';
import PastEventTimeline from '@/components/events/PastEventTimeline';

/* ── Helpers ─────────────────────────────────────────────────────────────── */

const ease = [0.16, 1, 0.3, 1] as const;

/* ── Main Event Page ─────────────────────────────────────────────────────── */

const Event: React.FC = () => {
  const navigate = useNavigate();
  const { data: events = [] } = useEvents();
  
  const heroRef = useRef<HTMLElement>(null);
  const heroInView = useInView(heroRef, { once: true, margin: '-40px' });

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Smooth scrolling
  useLenis();

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Categories from event data
  const categories = useMemo(() => {
    const cats = Array.from(new Set(events.map((e) => e.category)));
    return ['all', ...cats.sort()];
  }, [events]);

  // Filter + search
  const filteredEvents = useMemo(() => {
    let filtered = events;
    if (activeFilter !== 'all') {
      filtered = filtered.filter((e) => e.category === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [events, activeFilter, searchQuery]);

  // Stats
  const totalEvents = events.length;
  const totalCategories = new Set(events.map((e) => e.category)).size;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleEventClick = (event: EventType) => {
    const slug = generateSlug(event.title);
    navigate(`/events/${slug}`);
  };

  return (
    <main className="min-h-screen relative" style={{ backgroundColor: 'hsl(var(--ink))' }}>

      {/* ── Backgrounds ─────────────────────────────────────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        {/* Orbital Canvas for visual continuity with home page */}
        <OrbitalCanvas />
        {/* Subtle grid fade */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, hsl(var(--rule)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--rule)) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            backgroundPosition: 'center',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.1) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.1) 100%)',
          }}
        />
        {/* Gradient transition so cards sit on solid dark */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--ink)/0.8)] to-[hsl(var(--ink))]" />
      </div>

      {/* Scroll progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left"
        style={{
          scaleX,
          background: 'hsl(var(--phosphor))',
        }}
      />

      {/* ── Sticky Nav ──────────────────────────────────────────────────── */}
      <motion.nav
        className="fixed top-0 left-0 w-full z-40 flex items-center justify-between"
        style={{
          padding: '0 var(--space-6)',
          height: 'var(--nav-height)',
          backgroundColor: 'hsla(var(--ink), 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid hsl(var(--rule))'
        }}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <button
          onClick={() => navigate('/')}
          className="focus-phosphor flex items-center gap-2.5 group"
          aria-label="Return to homepage"
        >
          <img
            src={atomLogo}
            alt="ATOM"
            className="w-7 h-7 opacity-90 transition-transform duration-500 group-hover:rotate-90"
          />
          <span
            className="hidden sm:inline text-[hsl(var(--chalk))] tracking-[-0.03em]"
            style={{ fontFamily: 'var(--font-display)', fontSize: '0.9375rem' }}
          >
            ATOM
          </span>
        </button>

        <div className="flex items-center gap-6">
          <span
            className="text-[hsl(var(--chalk))] hidden md:inline uppercase tracking-[0.15em]"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem' }}
          >
            Events Archive
          </span>
          <button
            onClick={() => navigate('/')}
            className="focus-phosphor text-[hsl(var(--graphite))] hover:text-[hsl(var(--chalk))] transition-colors flex items-center gap-1.5 uppercase tracking-[0.15em]"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem' }}
          >
            Home
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </motion.nav>

      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative z-10 flex flex-col justify-end min-h-[60vh] pt-32 pb-16"
      >
        <div className="max-w-[var(--container-xl)] w-full mx-auto px-6 sm:px-10 lg:px-16 text-[hsl(var(--chalk))]">

          {/* Section label */}
          <motion.div
            className="flex items-center gap-3 mb-6 uppercase tracking-[0.2em]"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'hsl(var(--graphite))' }}
            initial={{ opacity: 0, y: 12 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease }}
          >
            <span style={{ color: 'hsl(var(--phosphor))' }}>04</span>
            <span className="w-6 h-px bg-[hsl(var(--rule))]" aria-hidden="true" />
            <span>Events Archive</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            className="uppercase mb-10 max-w-[14ch]"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 9vw, 6.5rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.03em',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
          >
            Our Legacy
          </motion.h1>

          {/* Stats row */}
          <motion.div
            className="flex flex-wrap items-center gap-6 sm:gap-10"
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3, ease }}
          >
            <div className="flex items-baseline gap-2">
              <span
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', lineHeight: 1 }}
              >
                {totalEvents}
              </span>
              <span
                className="uppercase tracking-[0.15em]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'hsl(var(--graphite))' }}
              >
                Events
              </span>
            </div>

            <div className="h-6 w-px bg-[hsl(var(--rule))]" aria-hidden="true" />

            <div className="flex items-baseline gap-2">
              <span
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', lineHeight: 1 }}
              >
                {totalCategories}
              </span>
              <span
                className="uppercase tracking-[0.15em]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'hsl(var(--graphite))' }}
              >
                Categories
              </span>
            </div>

            <div className="h-6 w-px bg-[hsl(var(--rule))] hidden sm:block" aria-hidden="true" />

            <p
              className="hidden sm:block max-w-[32ch]"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                color: 'hsl(var(--chalk)/0.5)',
                lineHeight: 1.5,
              }}
            >
              Hackathons, bootcamps, seminars, and more — explore our journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Filter + Search Bar ─────────────────────────────────────────── */}
      <section
        className="relative z-20 sticky top-[var(--nav-height)] border-y border-[hsl(var(--rule))]"
        style={{ backgroundColor: 'hsla(var(--ink), 0.95)', backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-[var(--container-xl)] w-full mx-auto px-6 sm:px-10 lg:px-16 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            {/* Category pills */}
            <div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {categories.map((cat, idx) => (
                <motion.button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + idx * 0.05, ease }}
                  className="focus-phosphor uppercase tracking-[0.15em] whitespace-nowrap px-4 py-2 rounded-full transition-colors duration-200 border"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    borderColor: activeFilter === cat ? 'hsl(var(--phosphor))' : 'hsl(var(--rule))',
                    backgroundColor: activeFilter === cat ? 'hsl(var(--phosphor)/0.1)' : 'transparent',
                    color: activeFilter === cat ? 'hsl(var(--phosphor))' : 'hsl(var(--chalk)/0.6)',
                  }}
                >
                  {cat}
                </motion.button>
              ))}
            </div>

            {/* Search */}
            <motion.div
              className="relative min-w-[240px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <div
                className="flex items-center px-4 py-2 border rounded-full transition-colors"
                style={{
                  backgroundColor: 'hsl(var(--ink-raised))',
                  borderColor: 'hsl(var(--rule))',
                }}
              >
                <Search className="w-3.5 h-3.5 mr-2" style={{ color: 'hsl(var(--graphite))' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events..."
                  className="bg-transparent border-none outline-none w-full"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8125rem',
                    color: 'hsl(var(--chalk))',
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-2 focus-phosphor"
                    style={{ color: 'hsl(var(--graphite))' }}
                  >
                    <X className="w-3.5 h-3.5 hover:text-white transition-colors" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Events Timeline ─────────────────────────────────────────────── */}
      <section className="relative z-10 w-full min-h-[50vh]">
        {filteredEvents.length > 0 ? (
          <PastEventTimeline events={filteredEvents} onEventClick={handleEventClick} />
        ) : (
          <div className="max-w-[var(--container-xl)] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-24">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 text-center border border-[hsl(var(--rule))]"
            >
              <Search className="w-8 h-8 mx-auto mb-4" style={{ color: 'hsl(var(--graphite))' }} />
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'hsl(var(--chalk)/0.5)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                No events found matching "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-6 btn-tech mx-auto"
              >
                Clear search
              </button>
            </motion.div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
};

export default Event;
