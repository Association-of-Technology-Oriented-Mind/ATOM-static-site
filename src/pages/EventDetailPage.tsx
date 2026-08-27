import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';
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
  
  // Parallax effects
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

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
        <p className="mono-label accent text-[hsl(var(--phosphor))]">Loading Event Dossier...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative overflow-x-hidden bg-[hsl(var(--ink))]" ref={containerRef}>
      
      {/* ── Absolute Navigation ────────────────────────────────────────────── */}
      <nav className="absolute top-0 left-0 w-full z-50 px-6 sm:px-10 lg:px-16 py-6 sm:py-8 flex items-center bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={() => navigate('/events')}
          className="flex items-center gap-2 group text-white/70 hover:text-white transition-colors uppercase tracking-[0.15em]"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem' }}
        >
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-black/20 backdrop-blur-md group-hover:border-[hsl(var(--phosphor))] group-hover:bg-[hsl(var(--phosphor)/0.2)] transition-all">
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 group-hover:text-[hsl(var(--phosphor))]" />
          </div>
          Return to Events
        </button>
      </nav>

      {/* ── Cinematic Hero ─────────────────────────────────────────────────── */}
      <div className="relative w-full h-[70vh] lg:h-[80vh] flex flex-col justify-end">
        {/* Parallax Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-black/30 mix-blend-multiply z-10" />
          <motion.img 
            style={{ y: heroY, opacity: heroOpacity }}
            src={event.image}
            alt=""
            className="w-full h-full object-cover scale-110"
          />
          {/* Bottom Gradient Fade */}
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[hsl(var(--ink))] via-[hsl(var(--ink)/0.8)] to-transparent z-20" />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-30 max-w-[var(--container-xl)] w-full mx-auto px-6 sm:px-10 lg:px-16 pb-16 lg:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
          >
            {/* HUD Tags */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="mono-label text-[10px] px-3 py-1.5 border border-[hsl(var(--phosphor))] bg-[hsl(var(--phosphor)/0.15)] text-[hsl(var(--phosphor))] backdrop-blur-md rounded shadow-[0_0_15px_hsl(var(--phosphor)/0.2)]">
                {event.status === 'upcoming' ? 'UPCOMING' : 'ARCHIVED'}
              </span>
              <span className="mono-label text-[10px] px-3 py-1.5 border border-white/20 bg-black/40 text-white backdrop-blur-md rounded">
                {event.eventType === 'free' ? 'FREE ACCESS' : 'PAID ENTRY'}
              </span>
              <span className="mono-label text-[10px] px-3 py-1.5 border border-white/20 bg-black/40 text-white backdrop-blur-md rounded">
                {event.category.toUpperCase()}
              </span>
            </div>
            
            {/* Massive Title */}
            <h1 className="text-[clamp(3rem,8vw,7rem)] font-black uppercase leading-[0.9] tracking-tighter text-white drop-shadow-2xl max-w-5xl" 
                style={{ fontFamily: 'var(--font-display)', textShadow: '0 10px 40px rgba(0,0,0,0.8)' }}>
              {event.title}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* ── Floating Glass Info Panel ──────────────────────────────────────── */}
      <div className="relative z-40 max-w-[var(--container-xl)] mx-auto px-6 sm:px-10 lg:px-16 -mt-24 lg:-mt-32">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          className="w-full rounded-2xl border border-[hsl(var(--phosphor)/0.3)] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] p-6 sm:p-10 lg:p-12 overflow-hidden relative"
          style={{ backgroundColor: 'hsla(var(--ink-raised), 0.75)', backdropFilter: 'blur(30px)' }}
        >
          {/* Subtle panel glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[hsl(var(--phosphor))] to-transparent opacity-50" />
          
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 justify-between items-start lg:items-center relative z-10">
            
            {/* Date, Time, Location Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full lg:w-[65%]">
              <div>
                 <p className="mono-label text-[hsl(var(--phosphor))] text-[10px] mb-3 flex items-center gap-2">
                   <Calendar className="w-3.5 h-3.5" /> DATE
                 </p>
                 <p className="text-[hsl(var(--chalk))] font-bold text-lg sm:text-xl leading-tight" style={{ fontFamily: 'var(--font-body)' }}>
                   {formatDate(event.date)}
                 </p>
              </div>
              {event.time && (
                <div>
                   <p className="mono-label text-[hsl(var(--phosphor))] text-[10px] mb-3 flex items-center gap-2">
                     <Clock className="w-3.5 h-3.5" /> TIME
                   </p>
                   <p className="text-[hsl(var(--chalk))] font-bold text-lg sm:text-xl leading-tight" style={{ fontFamily: 'var(--font-body)' }}>
                     {event.time}
                   </p>
                </div>
              )}
              <div className="sm:col-span-2 lg:col-span-1">
                 <p className="mono-label text-[hsl(var(--phosphor))] text-[10px] mb-3 flex items-center gap-2">
                   <MapPin className="w-3.5 h-3.5" /> LOCATION
                 </p>
                 <p className="text-[hsl(var(--chalk))] font-bold text-lg sm:text-xl leading-tight" style={{ fontFamily: 'var(--font-body)' }}>
                   {event.location}
                 </p>
              </div>
            </div>

            {/* Registration CTA Section */}
            <div className="w-full lg:w-[35%] flex flex-col items-start lg:items-end lg:border-l border-[hsl(var(--rule))] pt-8 lg:pt-0 lg:pl-10">
               {event.status === 'upcoming' && !isExpired ? (
                 <div className="w-full">
                   <AnimatePresence mode="wait">
                     {!showRegistrationOptions ? (
                       <motion.div key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }}>
                         <button 
                           onClick={() => setShowRegistrationOptions(true)} 
                           className="btn-tech w-full py-5 text-sm uppercase tracking-widest shadow-[0_0_20px_hsl(var(--phosphor)/0.3)] hover:shadow-[0_0_30px_hsl(var(--phosphor)/0.5)] transition-all"
                         >
                           Secure Your Spot
                         </button>
                       </motion.div>
                     ) : (
                       <motion.div key="options" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 w-full">
                         <button 
                           onClick={() => navigate('/registration/internal')} 
                           className="w-full py-4 uppercase tracking-widest text-[11px] font-bold border border-[hsl(var(--phosphor)/0.5)] bg-[hsl(var(--phosphor)/0.05)] hover:bg-[hsl(var(--phosphor)/0.15)] text-[hsl(var(--chalk))] transition-colors rounded"
                           style={{ fontFamily: 'var(--font-mono)' }}
                         >
                           Internal (Karunya)
                         </button>
                         <button 
                           onClick={() => navigate('/registration/external')} 
                           className="btn-tech w-full py-4 text-[11px]"
                         >
                           External Participant
                         </button>
                       </motion.div>
                     )}
                   </AnimatePresence>
                 </div>
               ) : event.status === 'upcoming' && isExpired ? (
                 <div className="w-full text-center py-5 border border-red-500/30 bg-red-500/10 rounded-lg">
                   <p className="mono-label text-red-400">REGISTRATION CLOSED</p>
                 </div>
               ) : (
                 <div className="w-full text-center py-5 border border-[hsl(var(--rule))] bg-black/20 rounded-lg">
                   <p className="mono-label text-[hsl(var(--graphite))]">ARCHIVED DOSSIER</p>
                 </div>
               )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Main Content & Sidebar ─────────────────────────────────────────── */}
      <div className="relative z-20 max-w-[var(--container-xl)] mx-auto px-6 sm:px-10 lg:px-16 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
          
          {/* Main Description */}
          <div className="lg:col-span-2 prose prose-invert prose-p:text-[hsl(var(--chalk)/0.7)] prose-p:leading-relaxed prose-p:text-lg prose-headings:font-display prose-headings:text-[hsl(var(--chalk))] prose-a:text-[hsl(var(--phosphor))] max-w-none">
            {event.id === 1 ? (
              <div className="text-[hsl(var(--chalk)/0.8)] leading-relaxed space-y-6">
                <p className="text-xl sm:text-2xl font-light text-white leading-normal mb-10">Join the ultimate cybersecurity showdown! Battle of Binaries is an intense 24-hour Capture The Flag (CTF) competition where your skills in cryptography, web exploitation, reverse engineering, and digital forensics will be tested to the limit.</p>
                <h3 className="text-3xl mt-12 mb-6 font-display text-[hsl(var(--chalk))] uppercase tracking-tight">Why Participate?</h3>
                <ul className="list-none pl-0 space-y-4">
                  {['Compete against top cybersecurity talents', 'Win exciting prizes and CompTIA certification vouchers', 'Network with industry professionals and recruiters', 'Enhance your practical security skills in real-world scenarios'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 bg-[hsl(var(--phosphor))] rounded-full shadow-[0_0_8px_hsl(var(--phosphor))]" />
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
                <h3 className="text-3xl mt-12 mb-6 font-display text-[hsl(var(--chalk))] uppercase tracking-tight">Important Information</h3>
                <div className="p-6 border-l-2 border-[hsl(var(--phosphor))] bg-[hsl(var(--ink-raised))] text-[hsl(var(--chalk))]">
                  <p className="mb-2"><strong className="text-[hsl(var(--phosphor))] uppercase tracking-widest text-xs font-bold font-mono">Registration Deadline:</strong><br/> October 15, 2025</p>
                  <p className="mb-2">Limited seats available - First-come, First-served basis. Register now to secure your spot!</p>
                  <p><strong className="text-white">Format:</strong> Individual challenges with real-time scoreboard</p>
                </div>
              </div>
            ) : (
              <ReactMarkdown>{event.description}</ReactMarkdown>
            )}
          </div>

          {/* Sidebar Modules */}
          <div className="flex flex-col gap-10">
            {/* Special Partner for Battle of Binaries */}
            {event.id === 1 && (
              <div className="p-8 rounded-xl border border-[hsl(var(--rule))] bg-gradient-to-br from-[hsl(var(--ink-raised))] to-[hsl(var(--ink))] shadow-xl">
                <p className="mono-label text-[hsl(var(--graphite))] mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[hsl(var(--phosphor))] rounded-full animate-pulse" />
                  OFFICIAL PARTNER
                </p>
                <img 
                  src="https://comptiacdn.azureedge.net/webcontent/images/default-source/newsiteupdates/comptia-logo.png?sfvrsn=216cff61_2"
                  alt="CompTIA Logo" 
                  className="w-32 h-auto mb-6 invert mix-blend-luminosity opacity-80 hover:opacity-100 hover:mix-blend-normal transition-all"
                />
                <p className="text-sm text-[hsl(var(--chalk)/0.6)] leading-relaxed mb-6">
                  This event is organized in association with CompTIA, a leading provider of vendor-neutral IT certifications.
                </p>
                <span className="mono-label accent text-[10px] px-3 py-1 bg-white/5 rounded border border-white/10 text-white">INDUSTRY RECOGNIZED</span>
              </div>
            )}

            {/* Countdown Clock */}
            {event.status === 'upcoming' && !isExpired && (
              <div className="p-8 rounded-xl border border-[hsl(var(--rule))] bg-gradient-to-br from-[hsl(var(--ink-raised))] to-[hsl(var(--ink))] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[hsl(var(--phosphor)/0.05)] rounded-full blur-3xl" />
                <p className="mono-label text-[hsl(var(--phosphor))] mb-6 text-xs">T-MINUS DEPLOYMENT</p>
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
