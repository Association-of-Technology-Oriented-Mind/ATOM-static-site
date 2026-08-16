import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft } from 'lucide-react';
import { Event } from '@/constants/events';
import { useEvents } from '@/hooks/useContent';
import { generateSlug } from '@/utils/slug';
import ClockCountdown from '@/components/ui/ClockCountdown';
import Footer from '@/components/Footer';

const ease = [0.16, 1, 0.3, 1] as const;

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const buildEventDate = (dateStr: string, timeStr?: string) => {
  const isoMatch = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  let year: number, month: number, day: number;
  if (isoMatch) {
    year = parseInt(isoMatch[1], 10);
    month = parseInt(isoMatch[2], 10) - 1;
    day = parseInt(isoMatch[3], 10);
  } else {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return new Date(dateStr);
    return d;
  }

  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (timeStr) {
    const t = timeStr.trim();
    const match = t.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
    if (match) {
      let hh = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);
      seconds = match[3] ? parseInt(match[3], 10) : 0;
      const ampm = match[4];
      if (ampm) {
        if (ampm.toUpperCase() === 'PM' && hh !== 12) hh += 12;
        if (ampm.toUpperCase() === 'AM' && hh === 12) hh = 0;
      }
      hours = hh;
    } else {
      const simple = t.match(/^(\d{1,2}):(\d{2})$/);
      if (simple) {
        hours = parseInt(simple[1], 10);
        minutes = parseInt(simple[2], 10);
      }
    }
  }

  return new Date(year, month, day, hours, minutes, seconds);
};

const EventDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const [showRegistrationOptions, setShowRegistrationOptions] = useState(false);

  const { data: events, isLoading: eventsLoading } = useEvents();

  useEffect(() => {
    if (!slug || eventsLoading || !events) return;
    const foundEvent = events.find(e => generateSlug(e.title) === slug);
    if (foundEvent) {
      setEvent(foundEvent);
    } else {
      navigate('/events');
    }
  }, [slug, navigate, events, eventsLoading]);

  useEffect(() => {
    if (!event || event.status !== 'upcoming') return;

    const calculateTimeLeft = () => {
      const eventDate = buildEventDate(event.date, event.time);
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();

      if (!isNaN(difference) && difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [event]);

  const formatDate = (dateString: string) => {
    if (dateString.includes(',')) {
      const dates = dateString.split(',').map(d => d.trim());
      const startDate = new Date(dates[0]);
      const endDate = new Date(dates[1]);
      const startFormatted = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
      const endFormatted = endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      return `${startFormatted} - ${endFormatted}`;
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--ink))' }}>
        <p className="mono-label accent">Loading Event Dossier...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'hsl(var(--ink))' }}>
      
      {/* ── Ambient Background ───────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(to right, hsl(var(--rule)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--rule)) 1px, transparent 1px)',
            backgroundSize: '100px 100px',
            backgroundPosition: 'center',
            maskImage: 'radial-gradient(ellipse at top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)',
          }}
        />
      </div>

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <nav className="relative z-40 w-full flex items-center px-6 sm:px-10 lg:px-16 py-6 sm:py-8 border-b border-[hsl(var(--rule))] backdrop-blur-md">
        <button
          onClick={() => navigate('/events')}
          className="focus-phosphor flex items-center gap-2 group text-[hsl(var(--graphite))] hover:text-[hsl(var(--chalk))] transition-colors uppercase tracking-[0.15em]"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem' }}
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          Return to Events
        </button>
      </nav>

      <div className="relative z-10 max-w-[var(--container-xl)] mx-auto px-6 sm:px-10 lg:px-16 py-12 lg:py-20">
        
        {/* ── Hero Dossier ─────────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-16 lg:mb-24">
          {/* Image & Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="flex-1 w-full"
          >
            <div className="relative aspect-video lg:aspect-square overflow-hidden mb-6 border border-[hsl(var(--rule))] bg-[hsl(var(--ink-raised))]">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover mix-blend-luminosity opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--ink))] to-transparent opacity-40" />
            </div>

            <div className="flex flex-wrap gap-4">
              <span className="mono-label accent px-3 py-1.5 border border-[hsl(var(--phosphor))] bg-[hsl(var(--phosphor)/0.1)]">
                {event.status === 'upcoming' ? 'Upcoming' : 'Archived'}
              </span>
              <span className="mono-label px-3 py-1.5 border border-[hsl(var(--rule))] text-[hsl(var(--chalk)/0.7)]">
                {event.eventType === 'free' ? 'Free Access' : 'Paid Entry'}
              </span>
              <span className="mono-label px-3 py-1.5 border border-[hsl(var(--rule))] text-[hsl(var(--chalk)/0.7)]">
                {event.category}
              </span>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="flex-[1.2] flex flex-col justify-center"
          >
            <h1
              className="uppercase mb-8"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                lineHeight: 1,
                letterSpacing: '-0.03em',
                color: 'hsl(var(--chalk))'
              }}
            >
              {event.title}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 mb-10 pb-10 border-b border-[hsl(var(--rule))]">
              <div>
                <p className="mono-label mb-2 text-[hsl(var(--graphite))]">Date</p>
                <p className="text-[hsl(var(--chalk))] text-lg" style={{ fontFamily: 'var(--font-body)' }}>
                  {formatDate(event.date)}
                </p>
              </div>
              {event.time && (
                <div>
                  <p className="mono-label mb-2 text-[hsl(var(--graphite))]">Time</p>
                  <p className="text-[hsl(var(--chalk))] text-lg" style={{ fontFamily: 'var(--font-body)' }}>
                    {event.time}
                  </p>
                </div>
              )}
              <div className="sm:col-span-2">
                <p className="mono-label mb-2 text-[hsl(var(--graphite))]">Location</p>
                <p className="text-[hsl(var(--chalk))] text-lg" style={{ fontFamily: 'var(--font-body)' }}>
                  {event.location}
                </p>
              </div>
            </div>

            {/* Registration CTA (if upcoming) */}
            {event.status === 'upcoming' && !isExpired && (
              <div className="mt-auto">
                <AnimatePresence mode="wait">
                  {!showRegistrationOptions ? (
                    <motion.div
                      key="btn"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <button
                        onClick={() => setShowRegistrationOptions(true)}
                        className="btn-tech w-full sm:w-auto text-center justify-center py-4"
                        style={{ fontSize: '1rem' }}
                      >
                        Register for Event
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="options"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col sm:flex-row gap-4"
                    >
                      <button
                        onClick={() => navigate('/registration/internal')}
                        className="btn-ghost flex-1 py-4 text-center justify-center border border-[hsl(var(--rule))]"
                      >
                        Internal (Karunya)
                      </button>
                      <button
                        onClick={() => navigate('/registration/external')}
                        className="btn-tech flex-1 py-4 text-center justify-center"
                      >
                        External Participant
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            {/* Expired State */}
            {event.status === 'upcoming' && isExpired && (
              <div className="px-4 py-3 border border-red-500/30 bg-red-500/10 inline-flex mt-auto w-max">
                <p className="mono-label" style={{ color: '#ff6b6b' }}>Registration Closed</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Extra Modules ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
          {/* Main Description */}
          <div className="lg:col-span-2 prose prose-invert prose-p:text-[hsl(var(--chalk)/0.7)] prose-p:leading-relaxed prose-headings:font-display prose-headings:text-[hsl(var(--chalk))] prose-a:text-[hsl(var(--phosphor))] max-w-none">
            {event.id === 1 ? (
              <div className="text-[hsl(var(--chalk)/0.8)] leading-relaxed space-y-6">
                <p className="text-xl">Join the ultimate cybersecurity showdown! Battle of Binaries is an intense 24-hour Capture The Flag (CTF) competition where your skills in cryptography, web exploitation, reverse engineering, and digital forensics will be tested to the limit.</p>
                <h3 className="text-2xl mt-8 mb-4 font-display text-[hsl(var(--chalk))]">Why Participate?</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Compete against top cybersecurity talents</li>
                  <li>Win exciting prizes and CompTIA certification vouchers</li>
                  <li>Network with industry professionals and recruiters</li>
                  <li>Enhance your practical security skills in real-world scenarios</li>
                </ul>
                <h3 className="text-2xl mt-8 mb-4 font-display text-[hsl(var(--chalk))]">Important Information:</h3>
                <p><strong className="text-[hsl(var(--phosphor))]">Registration Deadline: October 15, 2025</strong></p>
                <p>Limited seats available - First-come, First-served basis. Register now to secure your spot!</p>
                <p><strong className="text-[hsl(var(--chalk))]">Format: Individual challenges with real-time scoreboard</strong></p>
              </div>
            ) : (
              <ReactMarkdown>{event.description}</ReactMarkdown>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-10">
            {/* Special Partner for Battle of Binaries */}
            {event.id === 1 && (
              <div className="p-6 border border-[hsl(var(--rule))] bg-[hsl(var(--ink-raised))]">
                <p className="mono-label text-[hsl(var(--graphite))] mb-4">Official Partner</p>
                <img 
                  src="https://comptiacdn.azureedge.net/webcontent/images/default-source/newsiteupdates/comptia-logo.png?sfvrsn=216cff61_2"
                  alt="CompTIA Logo" 
                  className="w-32 h-auto mb-4 invert mix-blend-luminosity opacity-80"
                />
                <p className="text-sm text-[hsl(var(--chalk)/0.6)] leading-relaxed mb-4">
                  This event is organized in association with CompTIA, a leading provider of vendor-neutral IT certifications.
                </p>
                <span className="mono-label accent text-[10px]">Industry Recognized</span>
              </div>
            )}

            {/* Countdown Clock */}
            {event.status === 'upcoming' && !isExpired && (
              <div className="p-6 border border-[hsl(var(--rule))] bg-[hsl(var(--ink-raised))]">
                <p className="mono-label text-[hsl(var(--graphite))] mb-6">T-Minus</p>
                <ClockCountdown targetDate={buildEventDate(event.date, event.time)} />
              </div>
            )}
          </div>
        </div>

      </div>
      <Footer />
    </main>
  );
};

export default EventDetailPage;
