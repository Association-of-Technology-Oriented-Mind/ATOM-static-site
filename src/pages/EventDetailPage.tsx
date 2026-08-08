import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Event } from '@/constants/events';
import { useNavigate, useParams } from 'react-router-dom';
import { useEvents } from '@/hooks/useContent';
import { generateSlug } from '@/utils/slug';
import ClockCountdown from '@/components/ui/ClockCountdown';
import ReactMarkdown from 'react-markdown';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Helper: build a Date object from ISO date (YYYY-MM-DD) and various time formats
// Moved to module scope to ensure consistent parsing (Safari-safe) and reuse.
const buildEventDate = (dateStr: string, timeStr?: string) => {
  // Try to parse YYYY-MM-DD first
  const isoMatch = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  let year: number, month: number, day: number;
  if (isoMatch) {
    year = parseInt(isoMatch[1], 10);
    month = parseInt(isoMatch[2], 10) - 1;
    day = parseInt(isoMatch[3], 10);
  } else {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return new Date(dateStr); // fallback
    return d;
  }

  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (timeStr) {
    // Match formats like '09:30 AM', '9:30 PM', '09:30', '09:30:00'
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
      // Try plain numeric hour:minute without AM/PM
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
    // Handle multi-day events (comma-separated dates)
    if (dateString.includes(',')) {
      const dates = dateString.split(',').map(d => d.trim());
      const startDate = new Date(dates[0]);
      const endDate = new Date(dates[1]);
      
      const startFormatted = startDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric'
      });
      const endFormatted = endDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      
      return `${startFormatted} - ${endFormatted}`;
    }
    
    // Handle single-day events
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const goBack = () => {
    navigate('/events');
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Enhanced loading background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-conic from-blue-500/10 via-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-spin" style={{ animationDuration: '20s' }}></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center relative z-10"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-transparent border-t-blue-400 border-r-cyan-400 rounded-full mx-auto mb-6 relative"
          >
            <div className="absolute inset-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-sm"></div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white text-xl font-semibold"
          >
            Loading Event Details...
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-gray-400 text-sm mt-2"
          >
            Preparing an amazing experience
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-500/20 via-cyan-500/15 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-transparent rounded-full blur-3xl"
        />

        {/* Conic gradient centerpiece */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-conic from-blue-500/8 via-cyan-500/6 via-purple-500/8 via-pink-500/6 to-blue-500/8 rounded-full blur-3xl"
        />

        {/* Floating geometric shapes */}
        <motion.div
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-lg blur-xl"
        />
        <motion.div
          animate={{
            y: [20, -20, 20],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-xl"
        />

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03)_0%,transparent_50%)] opacity-50"></div>
      </div>

        {/* Enhanced Navigation */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="sticky top-0 z-40 backdrop-blur-2xl bg-black/30 border-b border-white/10 shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-cyan-500/5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 relative z-10">
          <button
            onClick={goBack}
            className="text-white hover:text-blue-400 transition-all duration-300 hover:scale-105 group relative flex items-center px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base"
          >
            <span className="relative z-10">Back to Events</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-7xl">
        {/* Enhanced Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-full h-96 sm:h-[28rem] lg:h-[32rem] overflow-hidden rounded-3xl mb-12 shadow-2xl group"
        >
          {/* Multi-layered background gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-slate-900/60 to-cyan-900/80 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-20"></div>

          {/* Event image with enhanced effects */}
          <motion.img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          {/* Enhanced floating particles */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl z-30">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-white/30 rounded-full shadow-lg"
                style={{
                  left: `${15 + i * 10}%`,
                  top: `${20 + (i % 3) * 20}%`,
                }}
                animate={{
                  y: [-15, 15, -15],
                  x: [-5, 5, -5],
                  opacity: [0.4, 0.9, 0.4],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 4 + i * 0.8,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}

            {/* Additional geometric particles */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`geo-${i}`}
                className="absolute w-2 h-2 bg-gradient-to-br from-cyan-400/60 to-blue-500/60 rounded-sm shadow-lg"
                style={{
                  left: `${70 + i * 8}%`,
                  top: `${60 + i * 15}%`,
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: 6 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>

          {/* Enhanced Event Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 z-40">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-4"
                >
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-xl rounded-full text-sm text-white/90 mb-3 border border-white/20 shadow-xl">
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mr-3 shadow-lg"
                    ></motion.span>
                    {event.status === 'upcoming' ? 'Coming Soon' : 'Event Completed'}
                  </div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                  className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-4"
                >
                  {event.title}
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="flex flex-wrap gap-3"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge
                      className={`text-sm font-semibold px-4 py-2 transition-all duration-300 hover:scale-105 ${
                        event.eventType === 'free'
                          ? 'bg-gradient-to-r from-green-500/25 to-emerald-500/25 text-green-200 border border-green-400/40 backdrop-blur-xl hover:from-green-500/35 hover:to-emerald-500/35 shadow-lg hover:shadow-green-500/25'
                          : 'bg-gradient-to-r from-orange-500/25 to-red-500/25 text-orange-200 border border-orange-400/40 backdrop-blur-xl hover:from-orange-500/35 hover:to-red-500/35 shadow-lg hover:shadow-orange-500/25'
                      }`}
                    >
                      {event.eventType === 'free' ? 'Free Event' : 'Paid Event'}
                    </Badge>
                  </motion.div>
                  {/* Only show status badge if not Battle of Binaries */}
                  {event.id !== 1 && (
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Badge className="bg-gradient-to-r from-blue-500/25 to-cyan-500/25 text-blue-200 border border-blue-400/40 backdrop-blur-xl px-4 py-2 hover:from-blue-500/35 hover:to-cyan-500/35 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25">
                        {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                      </Badge>
                    </motion.div>
                  )}
                </motion.div>
              </div>

            </div>
          </div>
        </motion.div>

        {/* Content Grid - Full width for past events, 2-column for upcoming */}
        <div className={`grid grid-cols-1 gap-6 lg:gap-8 ${event.status === 'upcoming' && !isExpired ? 'lg:grid-cols-3' : ''}`}>
          {/* Main Content Column */}
          <div className={`space-y-6 lg:space-y-8 ${event.status === 'upcoming' && !isExpired ? 'lg:col-span-2' : 'max-w-6xl mx-auto w-full'}`}>
            
            {/* CompTIA Partner Section - Only for Battle of Binaries (Shown FIRST for Maximum Impact) */}
            {event.id === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{
                  scale: 1.02,
                  y: -10,
                  rotateY: 2,
                  rotateX: -2
                }}
                className="glass-card p-6 sm:p-8 rounded-2xl relative overflow-hidden group cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(220, 38, 38, 0.2) 100%)',
                  backdropFilter: 'blur(25px)',
                  border: '1px solid rgba(220, 38, 38, 0.2)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(220, 38, 38, 0.1), 0 0 20px rgba(220, 38, 38, 0.15)',
                  transition: 'box-shadow 0.4s ease-out'
                }}
              >
                {/* Enhanced background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/15 to-orange-500/15 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>

                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    {/* Text Content */}
                    <div className="flex-1 text-center sm:text-left">
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.35 }}
                      >
                        <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-red-100 to-orange-100 mb-2">
                          Official Partner
                        </h3>
                        <p className="text-gray-300 text-sm sm:text-base">
                          This event is organized in association with CompTIA, a leading provider of vendor-neutral IT certifications
                        </p>
                      </motion.div>
                    </div>

                    {/* CompTIA Logo */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 200 }}
                      className="flex-shrink-0"
                    >
                      <div className="relative group/logo">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur-xl group-hover/logo:blur-2xl transition-all duration-300"></div>
                        <div className="relative bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-white/20 hover:border-red-400/40 transition-all duration-300 hover:scale-105">
                          <img 
                            src="https://comptiacdn.azureedge.net/webcontent/images/default-source/newsiteupdates/comptia-logo.png?sfvrsn=216cff61_2"
                            alt="CompTIA Logo" 
                            className="w-32 sm:w-40 md:w-48 h-auto object-contain"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Additional Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.45 }}
                    className="mt-6 pt-6 border-t border-white/10"
                  >
                    <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg border border-red-400/30">
                        <svg className="w-4 h-4 text-red-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-white">Industry Recognized</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-400/30">
                        <svg className="w-4 h-4 text-orange-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-white">Certified Event</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Key Information Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
            >
              <motion.div
                whileHover={{
                  scale: 1.05,
                  y: -12,
                  rotateY: 5,
                  rotateX: 3
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="glass-card p-8 rounded-2xl relative overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 58, 138, 0.4) 100%)',
                  backdropFilter: 'blur(25px)',
                  border: '1px solid rgba(59, 130, 246, 0.15)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.1)',
                  transition: 'box-shadow 0.4s ease-out'
                }}
              >
                {/* Enhanced background patterns */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-conic from-blue-500/5 via-transparent to-cyan-500/5 rounded-full blur-2xl animate-spin" style={{ animationDuration: '20s' }}></div>

                {/* Subtle grid overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.05)_25%,rgba(59,130,246,0.05)_50%,transparent_50%,transparent_75%,rgba(59,130,246,0.05)_75%)] bg-[length:20px_20px]"></div>
                </div>

                <div className="flex items-center gap-4 h-full relative z-10">
                  <div className="flex-1">
                    <p className="text-sm text-blue-300/80 font-medium mb-1">Event Date</p>
                    <p className="text-white font-semibold text-lg">{formatDate(event.date)}</p>
                  </div>
                </div>
              </motion.div>

              {event.time && (
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    y: -12,
                    rotateY: -5,
                    rotateX: 3
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="glass-card p-8 rounded-2xl relative overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 58, 138, 0.4) 100%)',
                    backdropFilter: 'blur(25px)',
                    border: '1px solid rgba(147, 51, 234, 0.15)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(147, 51, 234, 0.1), 0 0 20px rgba(147, 51, 234, 0.1)',
                    transition: 'box-shadow 0.4s ease-out'
                  }}
                >
                  {/* Enhanced background patterns */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-conic from-purple-500/5 via-transparent to-pink-500/5 rounded-full blur-2xl animate-spin" style={{ animationDuration: '20s' }}></div>

                  {/* Subtle grid overlay */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(147,51,234,0.05)_25%,rgba(147,51,234,0.05)_50%,transparent_50%,transparent_75%,rgba(147,51,234,0.05)_75%)] bg-[length:20px_20px]"></div>
                  </div>

                  <div className="flex items-center gap-4 h-full relative z-10">
                    <div className="flex-1">
                      <p className="text-sm text-purple-300/80 font-medium mb-1">Start Time</p>
                      <p className="text-white font-semibold text-lg">{event.time}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.div
                whileHover={{
                  scale: 1.05,
                  y: -12,
                  rotateY: 5,
                  rotateX: -3
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="glass-card p-8 rounded-2xl relative overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 58, 138, 0.4) 100%)',
                  backdropFilter: 'blur(25px)',
                  border: '1px solid rgba(16, 185, 129, 0.15)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(16, 185, 129, 0.1), 0 0 20px rgba(16, 185, 129, 0.1)',
                  transition: 'box-shadow 0.4s ease-out'
                }}
              >
                {/* Enhanced background patterns */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-conic from-green-500/5 via-transparent to-emerald-500/5 rounded-full blur-2xl animate-spin" style={{ animationDuration: '20s' }}></div>

                {/* Subtle grid overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(16,185,129,0.05)_25%,rgba(16,185,129,0.05)_50%,transparent_50%,transparent_75%,rgba(16,185,129,0.05)_75%)] bg-[length:20px_20px]"></div>
                </div>

                <div className="flex items-center gap-4 h-full relative z-10">
                  <div className="flex-1">
                    <p className="text-sm text-green-300/80 font-medium mb-1">Venue</p>
                    <p className="text-white font-semibold text-lg">{event.location}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Event Highlights - Only for Battle of Binaries */}
            {event.id === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{
                  scale: 1.02,
                  y: -10,
                  rotateY: -2,
                  rotateX: 2
                }}
                className="glass-card p-8 rounded-2xl relative overflow-hidden group cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(139, 92, 246, 0.3) 100%)',
                  backdropFilter: 'blur(25px)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(139, 92, 246, 0.1), 0 0 20px rgba(139, 92, 246, 0.15)',
                  transition: 'box-shadow 0.4s ease-out'
                }}
              >
                {/* Enhanced background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-violet-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/15 to-violet-500/15 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-fuchsia-500/10 to-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>

                <div className="relative z-10">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.45 }}
                    className="mb-6"
                  >
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-violet-100 flex items-center gap-3">
                      <svg className="w-7 h-7 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Event Highlights
                    </h3>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {/* Highlight 1 */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">CTF Competition</h4>
                        <p className="text-gray-300 text-sm">Real-world cybersecurity challenges</p>
                      </div>
                    </div>

                    {/* Highlight 2 */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-400/20 hover:border-violet-400/40 transition-all duration-300 hover:scale-105">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">₹75,000 Worth Prizes</h4>
                        <p className="text-gray-300 text-sm">Vouchers & certifications</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* About This Event - Show for all events with descriptions */}
            {event.description && event.description.trim() !== '' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45 }}
                whileHover={{
                  scale: 1.02,
                  y: -10,
                  rotateY: 2,
                  rotateX: 2
                }}
                className="glass-card p-8 rounded-2xl relative overflow-hidden group cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 58, 138, 0.4) 100%)',
                  backdropFilter: 'blur(25px)',
                  border: '1px solid rgba(59, 130, 246, 0.15)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.1)',
                  transition: 'box-shadow 0.4s ease-out'
                }}
              >
                {/* Enhanced background patterns */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-conic from-blue-500/5 via-transparent to-cyan-500/5 rounded-full blur-2xl animate-spin" style={{ animationDuration: '20s' }}></div>

                {/* Subtle grid overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.05)_25%,rgba(59,130,246,0.05)_50%,transparent_50%,transparent_75%,rgba(59,130,246,0.05)_75%)] bg-[length:20px_20px]"></div>
                </div>

                <div className="relative z-10">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mb-6"
                  >
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan-100 flex items-center gap-3">
                      <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      About This Event
                    </h3>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.55 }}
                    className="prose prose-invert max-w-none"
                  >
                    {event.id === 1 ? (
                      // Custom content for Battle of Binaries
                      <div className="text-gray-300 leading-relaxed space-y-4">
                        <p className="text-gray-300 mb-4 leading-relaxed text-base">
                          Get ready for the ultimate Capture The Flag (CTF) competition! Battle of Binaries 1.0 is a premier cybersecurity competition organized in association with CompTIA, designed to test your skills in ethical hacking, cryptography, reverse engineering, web exploitation, and more.
                        </p>
                        
                        <p className="text-gray-300 mb-4 leading-relaxed text-base">
                          Compete in real-time challenges with progressive difficulty levels and win amazing prizes including vouchers worth ₹75,000!
                        </p>
                        
                        <p className="text-gray-300 mb-4 leading-relaxed text-base font-semibold">
                          Important Information:
                        </p>
                        
                        <p className="mb-4">
                          <strong className="text-white font-bold text-lg">Registration Deadline: October 15, 2025</strong>
                        </p>
                        
                        <p className="text-gray-300 mb-4 leading-relaxed text-base">
                          Limited seats available - First-come, First-served basis. Register now to secure your spot!
                        </p>
                        
                        <p className="mb-4">
                          <strong className="text-white font-bold text-lg">Format: Individual challenges with real-time scoreboard</strong>
                        </p>
                      </div>
                    ) : (
                      // Dynamic content for all other events
                      <div className="text-gray-300 leading-relaxed space-y-4">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-3xl font-bold text-white mb-4 mt-6 first:mt-0">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-2xl font-bold text-white mb-3 mt-5">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-xl font-bold text-white mb-2 mt-4">
                                {children}
                              </h3>
                            ),
                            p: ({ children }) => (
                              <p className="text-gray-300 mb-4 leading-relaxed text-base">
                                {children}
                              </p>
                            ),
                            ul: ({ children }) => (
                              <ul className="text-gray-300 mb-4 ml-6 space-y-2 list-disc">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="text-gray-300 mb-4 ml-6 space-y-2 list-decimal">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => (
                              <li className="leading-relaxed text-base">
                                {children}
                              </li>
                            ),
                            strong: ({ children }) => (
                              <strong className="text-white font-bold">
                                {children}
                              </strong>
                            ),
                            em: ({ children }) => (
                              <em className="text-gray-200 italic">
                                {children}
                              </em>
                            ),
                          }}
                        >
                          {event.description}
                        </ReactMarkdown>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Event Gallery - Show if gallery images exist */}
            {event.gallery && event.gallery.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                whileHover={{
                  scale: 1.01,
                  y: -10,
                  rotateY: -2,
                  rotateX: 2
                }}
                className="glass-card p-8 rounded-2xl relative overflow-hidden group cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 58, 138, 0.4) 100%)',
                  backdropFilter: 'blur(25px)',
                  border: '1px solid rgba(59, 130, 246, 0.15)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.1)',
                  transition: 'box-shadow 0.4s ease-out'
                }}
              >
                {/* Enhanced background patterns */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>

                <div className="relative z-10">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex items-center mb-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100 flex items-center gap-3">
                        <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Event Gallery
                      </h2>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                  >
                    {event.gallery.map((imageUrl, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="relative overflow-hidden rounded-xl group/img"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 z-10"></div>
                        <img
                          src={imageUrl}
                          alt={`${event.title} - Image ${index + 1}`}
                          className="w-full h-56 sm:h-64 object-cover rounded-xl transition-transform duration-300 group-hover/img:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-sm font-medium opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 z-20">
                          Photo {index + 1}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Countdown Timer */}
            {event.status === 'upcoming' && !isExpired && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                whileHover={{
                  scale: 1.02,
                  y: -8,
                  rotateY: 3,
                  rotateX: -1
                }}
                className="glass-card p-8 rounded-2xl relative overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 58, 138, 0.4) 100%)',
                  backdropFilter: 'blur(25px)',
                  border: '1px solid rgba(59, 130, 246, 0.15)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.1)',
                  transition: 'box-shadow 0.4s ease-out'
                }}
              >
                {/* Enhanced background patterns */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-conic from-blue-500/5 via-transparent to-cyan-500/5 rounded-full blur-2xl animate-spin" style={{ animationDuration: '20s' }}></div>

                {/* Subtle grid overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.05)_25%,rgba(59,130,246,0.05)_50%,transparent_50%,transparent_75%,rgba(59,130,246,0.05)_75%)] bg-[length:20px_20px]"></div>
                </div>

                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Event Countdown
                    </h3>
                  </div>

                  {/* Use the refined ClockCountdown component */}
                  <ClockCountdown
                    targetDate={buildEventDate(event.date, event.time)}
                    size="md"
                  />
                </div>
              </motion.div>
            )}

            {/* Registration Section */}
            {event.status === 'upcoming' && !isExpired && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{
                  scale: 1.02,
                  y: -10,
                  rotateY: -2,
                  rotateX: 2
                }}
                className="glass-card p-8 rounded-2xl relative overflow-hidden group cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(59, 130, 246, 0.3) 100%)',
                  backdropFilter: 'blur(25px)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.15)',
                  transition: 'box-shadow 0.4s ease-out'
                }}
              >
                {/* Enhanced animated background elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/15 to-emerald-500/15 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-conic from-blue-500/5 via-transparent to-cyan-500/5 rounded-full blur-2xl animate-spin" style={{ animationDuration: '15s' }}></div>

                {/* Subtle grid overlay */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.05)_25%,rgba(59,130,246,0.05)_50%,transparent_50%,transparent_75%,rgba(59,130,246,0.05)_75%)] bg-[length:15px_15px]"></div>
                </div>

                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.7, type: "spring", stiffness: 200 }}
                    className="text-center mb-8"
                  >
                    <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan-100 mb-3 drop-shadow-lg">
                      Join the Experience
                    </h3>
                  </motion.div>

                  {!showRegistrationOptions ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      <Button
                        onClick={() => setShowRegistrationOptions(true)}
                        className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-500 hover:via-cyan-500 hover:to-blue-500 text-white py-5 text-xl font-bold rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-blue-500/40 hover:scale-105 relative overflow-hidden group border border-blue-400/30"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                          <span>Register Now</span>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                      </Button>


                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <Button
                          onClick={() => navigate('/registration/internal')}
                          className="w-full bg-gradient-to-r from-blue-600/90 to-blue-500/90 hover:from-blue-600 hover:to-blue-500 text-white py-6 font-bold rounded-2xl transition-all duration-300 flex flex-col items-center gap-2 shadow-xl hover:shadow-blue-500/40 hover:scale-105 group border border-blue-400/30 relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                          <div className="text-center relative z-10">
                            <span className="text-xl font-bold block">Internal Registration</span>
                          </div>
                        </Button>
                      </motion.div>

                      <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <Button
                          onClick={() => navigate('/registration/external')}
                          className="w-full bg-gradient-to-r from-cyan-600/90 to-blue-600/90 hover:from-cyan-500 hover:to-blue-500 text-white py-6 font-bold rounded-2xl transition-all duration-300 flex flex-col items-center gap-2 shadow-xl hover:shadow-cyan-500/40 hover:scale-105 group border border-cyan-400/30 relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                          <div className="text-center relative z-10">
                            <span className="text-xl font-bold block">External Registration</span>
                          </div>
                        </Button>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="text-center pt-2"
                      >
                        <Button
                          variant="ghost"
                          onClick={() => setShowRegistrationOptions(false)}
                          className="text-cyan-300/80 hover:text-cyan-200 hover:bg-cyan-400/10 transition-all duration-300 text-base font-medium px-6 py-3 rounded-xl border border-cyan-400/20 hover:border-cyan-400/40"
                        >
                          ← Back to overview
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Contact Card - Only for Battle of Binaries */}
            {event.id === 1 && event.status === 'upcoming' && !isExpired && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                whileHover={{
                  scale: 1.02,
                  y: -10,
                  rotateY: 2,
                  rotateX: -2
                }}
                className="glass-card p-8 rounded-2xl relative overflow-hidden group cursor-pointer mt-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(6, 182, 212, 0.3) 100%)',
                  backdropFilter: 'blur(25px)',
                  border: '1px solid rgba(6, 182, 212, 0.2)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(6, 182, 212, 0.1), 0 0 20px rgba(6, 182, 212, 0.15)',
                  transition: 'box-shadow 0.4s ease-out'
                }}
              >
                {/* Enhanced animated background elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/15 to-teal-500/15 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>

                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8, type: "spring", stiffness: 200 }}
                    className="text-center mb-6"
                  >
                    <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-teal-100 mb-2 drop-shadow-lg">
                      Need Help?
                    </h3>
                    <p className="text-cyan-200/80 text-base">Contact us for any queries</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    className="space-y-4"
                  >
                    {/* <a
                      href="tel:7904826830"
                      className="flex flex-col items-center justify-center gap-2 w-full bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/50 hover:to-blue-600/50 text-white py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 hover:scale-105 border border-cyan-400/20 group/phone"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-cyan-300 group-hover/phone:animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span className="text-lg font-semibold">7904826830</span>
                      </div>
                      <span className="text-sm text-cyan-200/80 font-medium">Dharshan Kumar J</span>
                    </a> */}

                    <a
                      href="tel:9345639487"
                      className="flex flex-col items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/50 hover:to-blue-600/50 text-white py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/30 hover:scale-105 border border-purple-400/20 group/phone"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-purple-300 group-hover/phone:animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span className="text-lg font-semibold">9345639487</span>
                      </div>
                      <span className="text-sm text-purple-200/80 font-medium">Kevin J</span>
                    </a>

                    <a
                      href="tel:9944871330"
                      className="flex flex-col items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600/30 to-cyan-600/30 hover:from-blue-600/50 hover:to-cyan-600/50 text-white py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/30 hover:scale-105 border border-blue-400/20 group/phone"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-blue-300 group-hover/phone:animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span className="text-lg font-semibold">9944871330</span>
                      </div>
                      <span className="text-sm text-blue-200/80 font-medium">Bruno A</span>
                    </a>

                    <a
                      href="mailto:atom@karunya.edu.in"
                      className="flex flex-col items-center justify-center gap-2 w-full bg-gradient-to-r from-teal-600/30 to-cyan-600/30 hover:from-teal-600/50 hover:to-cyan-600/50 text-white py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-teal-500/30 hover:scale-105 border border-teal-400/20 group/email"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-teal-300 group-hover/email:animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span className="text-lg font-semibold">atom@karunya.edu.in</span>
                      </div>
                      <span className="text-sm text-teal-200/80 font-medium">Email Us</span>
                    </a>
                  </motion.div>
                </div>
              </motion.div>
            )}

          </div>
        </div>

        {/* Rules & Guidelines - Only for upcoming events */}
        {event.status === 'upcoming' && !isExpired && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-8 sm:mt-12"
        >
          {/* Rules & Regulations */}
          <motion.div
            whileHover={{
              scale: 1.03,
              y: -12,
              rotateY: 3,
              rotateX: -2
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="glass-card p-8 rounded-2xl relative overflow-hidden group cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(59, 130, 246, 0.3) 100%)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.15)',
              transition: 'box-shadow 0.4s ease-out'
            }}
          >
            {/* Enhanced background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/15 to-cyan-500/15 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-conic from-blue-500/5 via-transparent to-cyan-500/5 rounded-full blur-2xl animate-spin" style={{ animationDuration: '15s' }}></div>

            {/* Subtle grid overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.05)_25%,rgba(59,130,246,0.05)_50%,transparent_50%,transparent_75%,rgba(59,130,246,0.05)_75%)] bg-[length:15px_15px]"></div>
            </div>

            <div className="relative z-10">
              <motion.h3
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="text-2xl font-bold text-white mb-8 flex items-center"
              >
                <div>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">Rules & Regulations</span>
                </div>
              </motion.h3>

              <div className="space-y-5">
                {[
                  "All participants must register before the event deadline",
                  "Participants must bring valid ID proof for verification",
                  "Late arrivals may not be permitted to participate",
                  "Follow all venue guidelines and instructions from organizers",
                  "Respectful behavior towards all participants is mandatory"
                ].map((rule, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                    className="flex items-start group/item"
                  >
                    <motion.span
                      whileHover={{ scale: 1.3, rotate: 180 }}
                      transition={{ duration: 0.3 }}
                      className="text-cyan-400 mr-4 mt-1.5 text-sm font-bold bg-cyan-400/10 rounded-full w-6 h-6 flex items-center justify-center border border-cyan-400/20 group-hover/item:bg-cyan-400/20 transition-colors duration-200"
                    >
                      {index + 1}
                    </motion.span>
                    <span className="text-gray-100 leading-relaxed group-hover/item:text-white transition-colors duration-200 font-medium">
                      {rule}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Terms & Conditions */}
          <motion.div
            whileHover={{
              scale: 1.03,
              y: -12,
              rotateY: -3,
              rotateX: 2
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="glass-card p-8 rounded-2xl relative overflow-hidden group cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(6, 182, 212, 0.3) 100%)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(6, 182, 212, 0.1), 0 0 20px rgba(6, 182, 212, 0.15)',
              transition: 'box-shadow 0.4s ease-out'
            }}
          >
            {/* Enhanced background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/15 to-blue-500/15 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-conic from-cyan-500/5 via-transparent to-blue-500/5 rounded-full blur-2xl animate-spin" style={{ animationDuration: '15s' }}></div>

            {/* Subtle grid overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(6,182,212,0.05)_25%,rgba(6,182,212,0.05)_50%,transparent_50%,transparent_75%,rgba(6,182,212,0.05)_75%)] bg-[length:15px_15px]"></div>
            </div>

            <div className="relative z-10">
              <motion.h3
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="text-2xl font-bold text-white mb-8 flex items-center"
              >
                <div>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-100">Terms & Conditions</span>
                </div>
              </motion.h3>

              <div className="space-y-5">
                {[
                  "Comply with all event rules and venue policies",
                  "Organizers are not liable for personal belongings",
                  "Provide accurate information during registration",
                  ...(event.id === 1 ? [
                    "Scoreboard results are final and cannot be contested",
                    "Misconduct may lead to immediate disqualification"
                  ] : [])
                ].map((term, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                    className="flex items-start group/item"
                  >
                    <motion.span
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                      className="text-green-400 mr-4 mt-1.5 text-lg bg-green-400/10 rounded-full w-7 h-7 flex items-center justify-center border border-green-400/20 group-hover/item:bg-green-400/20 transition-colors duration-200"
                    >
                      ✓
                    </motion.span>
                    <span className="text-gray-100 leading-relaxed group-hover/item:text-white transition-colors duration-200 font-medium">
                      {term}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
        )}
      </div>
    </div>
  );
};

export default EventDetailPage;
