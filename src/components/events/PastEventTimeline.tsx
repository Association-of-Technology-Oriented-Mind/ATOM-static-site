import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import type { Event } from '@/constants/events';

interface PastEventTimelineProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
}

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

const PastEventTimeline: React.FC<PastEventTimelineProps> = ({ events, onEventClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll progress for the central line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Group events by year
  const groupedEvents = events.reduce((acc, event) => {
    const year = extractYear(event.date);
    if (!acc[year]) acc[year] = [];
    acc[year].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const sortedYears = Object.entries(groupedEvents).sort(([a], [b]) => parseInt(b) - parseInt(a));

  // Global event index for alternating left/right layout across all years
  let globalIndex = 0;

  return (
    <div className="w-full bg-[hsl(var(--ink))] py-20 relative overflow-hidden" ref={containerRef}>
      
      <div className="max-w-6xl mx-auto px-6 relative">
        {/* The Central Line (Background) */}
        <div className="absolute left-[36px] md:left-1/2 top-0 bottom-0 w-[2px] bg-[hsl(var(--rule))] transform md:-translate-x-1/2" />
        
        {/* The Central Line (Active Progress) */}
        <motion.div 
          className="absolute left-[36px] md:left-1/2 top-0 w-[2px] bg-[hsl(var(--phosphor))] transform md:-translate-x-1/2 origin-top shadow-[0_0_15px_hsl(var(--phosphor))]"
          style={{ height: lineHeight }}
        />

        {sortedYears.map(([year, yearEvents]) => (
          <div key={year} className="mb-24 relative">
            
            {/* Year Milestone Node */}
            <div className="relative flex items-center justify-start md:justify-center mb-16 pt-8">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.5 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true, margin: "-20%" }}
                 className="absolute left-[36px] md:left-1/2 w-5 h-5 rounded-full bg-[hsl(var(--ink))] border-4 border-[hsl(var(--phosphor))] transform -translate-x-1/2 z-20 shadow-[0_0_20px_hsl(var(--phosphor))]" 
               />
               
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-20%" }}
                 className="ml-20 md:ml-0 relative z-10"
               >
                 <span className="inline-block px-8 py-2 rounded-full border border-[hsl(var(--phosphor)/0.3)] bg-[hsl(var(--ink-raised))] backdrop-blur-md shadow-[0_10px_30px_-10px_hsl(var(--phosphor)/0.2)]">
                   <h2 className="text-3xl md:text-4xl font-black tracking-widest text-[hsl(var(--chalk))]" style={{ fontFamily: 'var(--font-display)' }}>
                     {year}
                   </h2>
                 </span>
               </motion.div>
            </div>
            
            {/* Events for the Year */}
            <div className="flex flex-col gap-12 md:gap-24 relative">
              {yearEvents.map((event) => {
                const isEven = globalIndex % 2 === 0;
                globalIndex++;
                
                return (
                  <div key={event.id} className="relative flex items-center justify-between w-full group cursor-pointer" onClick={() => onEventClick && onEventClick(event)}>
                    
                    {/* Timeline Event Node */}
                    <motion.div 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, margin: "-20%" }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                      className="absolute left-[36px] md:left-1/2 w-4 h-4 rounded-full bg-[hsl(var(--chalk))] transform -translate-x-1/2 z-20 border-[3px] border-[hsl(var(--ink))] group-hover:bg-[hsl(var(--phosphor))] group-hover:shadow-[0_0_15px_hsl(var(--phosphor))] transition-colors duration-300"
                    />

                    {/* Desktop Layout: Alternating Sides */}
                    <div className={`hidden md:flex w-full items-center justify-between ${isEven ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Empty spacer for the timeline balance */}
                      <div className="w-[45%]" />
                      
                      {/* Connecting Line */}
                      <div className="absolute left-1/2 w-[5%] h-px bg-[hsl(var(--rule))] group-hover:bg-[hsl(var(--phosphor)/0.5)] transition-colors duration-300 z-10" 
                           style={{ [isEven ? 'right' : 'left']: '50%', transform: isEven ? 'translateX(-50%)' : 'translateX(50%)' }} />

                      {/* Event Card */}
                      <motion.div 
                        initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-[45%] relative"
                        onMouseMove={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          const y = e.clientY - rect.top;
                          e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                          e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                        }}
                      >
                        <EventCard event={event} />
                      </motion.div>
                    </div>

                    {/* Mobile Layout: Left Aligned */}
                    <div className="flex md:hidden w-full items-center pl-20 pr-0 relative">
                      {/* Connecting Line */}
                      <div className="absolute left-[36px] w-[20px] h-px bg-[hsl(var(--rule))] group-hover:bg-[hsl(var(--phosphor)/0.5)] transition-colors duration-300 z-10" />
                      
                      <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-full relative"
                      >
                         <EventCard event={event} />
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sub-component for the actual card
const EventCard = ({ event }: { event: Event }) => (
  <div className="w-full bg-[hsl(var(--ink-raised))] border border-[hsl(var(--rule))] overflow-hidden group-hover:border-[hsl(var(--phosphor)/0.4)] transition-colors duration-500 rounded-xl relative shadow-lg group-hover:shadow-[0_10px_40px_-10px_hsla(168,90%,74%,0.15)] flex flex-col xl:flex-row">
    
    {/* Mouse Glow */}
    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x,_50%)_var(--mouse-y,_50%),_hsla(var(--phosphor),0.1)_0%,_transparent_60%)]" />
    </div>

    {/* Image */}
    <div className="relative w-full xl:w-2/5 shrink-0 overflow-hidden h-48 xl:h-auto">
      <div className="absolute inset-0 bg-black/30 z-10 group-hover:bg-transparent transition-colors duration-500" />
      <div className="absolute top-4 left-4 z-20">
        <span className="mono-label bg-[hsl(var(--phosphor))] text-[hsl(var(--ink))] px-2 py-1 text-[10px] rounded shadow-md">
          {event.category}
        </span>
      </div>
      <img 
        src={event.image} 
        alt={event.title}
        className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
      />
    </div>

    {/* Content */}
    <div className="p-6 relative z-10 flex flex-col justify-center flex-1">
      <div className="flex items-center gap-3 mb-3 text-[hsl(var(--graphite))] mono-label text-xs">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[hsl(var(--phosphor))]" />
          <span>{formatDateDisplay(event.date)}</span>
        </div>
        <span className="opacity-50">/</span>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate max-w-[120px]" title={event.location}>{event.location}</span>
        </div>
      </div>
      
      <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[hsl(var(--chalk))] group-hover:text-[hsl(var(--phosphor))] transition-colors duration-300"
          style={{ fontFamily: "var(--font-body)", fontWeight: 700 }}
      >
        {event.title}
      </h3>
      
      <div className="mt-6 flex items-center gap-2 text-[hsl(var(--phosphor))] transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
        <span className="mono-label text-[10px]">EXPLORE DOSSIER</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  </div>
);

export default PastEventTimeline;