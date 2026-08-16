import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import type { Event } from '@/constants/events';

gsap.registerPlugin(ScrollTrigger);

interface PastEventTimelineProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
}

const PastEventTimeline: React.FC<PastEventTimelineProps> = ({ events, onEventClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const yearsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Format date helper
  const extractYear = (dateString: string) => {
    const firstDate = dateString.includes(',') ? dateString.split(',')[0].trim() : dateString;
    return new Date(firstDate).getFullYear().toString();
  };

  const formatDateDisplay = (dateString: string) => {
    const firstDate = dateString.includes(',') ? dateString.split(',')[0].trim() : dateString;
    const date = new Date(firstDate);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit'
    }).toUpperCase();
  };

  // Group events by year
  const groupedEvents = events.reduce((acc, event) => {
    const year = extractYear(event.date);
    if (!acc[year]) acc[year] = [];
    acc[year].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  // Sort years descending
  const sortedYears = Object.entries(groupedEvents).sort(([a], [b]) => parseInt(b) - parseInt(a));

  useEffect(() => {
    // ScrollTrigger for sticky pinning the year
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      yearsRef.current.forEach((yearEl) => {
        if (!yearEl) return;
        const parent = yearEl.parentElement;
        if (!parent) return;

        ScrollTrigger.create({
          trigger: parent,
          start: "top top",
          end: "bottom bottom",
          pin: yearEl,
          pinSpacing: false,
        });
      });
    });

    return () => mm.revert();
  }, [sortedYears]);

  return (
    <div className="w-full bg-[hsl(var(--ink))]" ref={containerRef}>
      {sortedYears.map(([year, yearEvents], groupIndex) => (
        <div 
          key={year} 
          className="relative flex flex-col lg:flex-row border-b border-[hsl(var(--rule))]"
        >
          {/* Left Column - Sticky Year */}
          <div className="lg:w-[35%] lg:border-r lg:border-[hsl(var(--rule))] relative z-10">
            <div 
              ref={(el) => { yearsRef.current[groupIndex] = el; }}
              className="px-6 sm:px-10 lg:px-16 py-10 lg:h-screen lg:flex lg:flex-col lg:justify-center"
            >
              <h2 
                className="text-[clamp(6rem,15vw,18rem)] font-black leading-[0.8] tracking-tighter text-[hsl(var(--chalk))] opacity-10"
                style={{ fontFamily: "'Archivo Black', system-ui, sans-serif" }}
              >
                {year}
              </h2>
              <div className="mt-4 flex items-center gap-4">
                <div className="h-px bg-[hsl(var(--phosphor))] w-12" />
                <span className="mono-label text-[hsl(var(--phosphor))]">
                  {yearEvents.length} {yearEvents.length === 1 ? 'EVENT' : 'EVENTS'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Events Scroll */}
          <div className="lg:w-[65%] flex flex-col">
            {yearEvents.map((event, eventIndex) => (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, delay: eventIndex * 0.1, ease: "easeOut" }}
                onClick={() => onEventClick && onEventClick(event)}
                className="group relative cursor-pointer border-b border-[hsl(var(--rule))] last:border-b-0 overflow-hidden bg-[hsl(var(--ink))] hover:bg-[hsl(var(--ink-raised))] transition-colors duration-500"
              >
                {/* Image Section (Edge to Edge within row) */}
                <div className="relative w-full h-[40vh] sm:h-[50vh] overflow-hidden border-b border-[hsl(var(--rule))]">
                  <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-transparent transition-colors duration-500" />
                  
                  {/* Category Badge overlaying image */}
                  <div className="absolute top-6 left-6 z-20">
                    <span className="mono-label bg-[hsl(var(--phosphor))] text-[hsl(var(--ink))] px-3 py-1 text-xs">
                      {event.category}
                    </span>
                  </div>

                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover transform transition-transform duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
                  />
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-10 lg:p-12 relative flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4 text-[hsl(var(--graphite))] mono-label text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[hsl(var(--phosphor))]" />
                        <span>{formatDateDisplay(event.date)}</span>
                      </div>
                      <span className="opacity-50">/</span>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate max-w-[150px]">{event.location}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-[hsl(var(--chalk))] group-hover:text-[hsl(var(--phosphor))] transition-colors duration-300 transform group-hover:translate-x-2 ease-out"
                        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
                    >
                      {event.title}
                    </h3>
                  </div>

                  <div className="shrink-0 flex items-center justify-end overflow-hidden">
                    <div className="flex items-center gap-3 text-[hsl(var(--phosphor))] transform translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                      <span className="mono-label">EXPLORE</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Hover Top-Border Glow */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[hsl(var(--phosphor))] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-out z-30" />
              </motion.article>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PastEventTimeline;