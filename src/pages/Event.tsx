import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PastEventTimeline from '@/components/events/PastEventTimeline';
import { type Event } from '@/constants/events';
import { getEvents } from '@/utils/dataService';
import { generateSlug } from '@/utils/slug';
import atomLogo from '@/assets/atom-logo.webp';
import '@/styles/events.css';
import '@/styles/event-enhancements.css';
import '@/styles/event-card-enhancements.css';

const Event: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = React.useState<Event[]>([]);

  // Load events on mount and clear cache to get fresh data
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Force clear cached events to get updated data from constants
    localStorage.removeItem('cms_events');
    console.log('Cleared cached events data');
    
    // Load all events (both upcoming and past)
    const allEvents = getEvents();
    
    setEvents(allEvents);
    
    console.log('All Events:', allEvents);
    allEvents.forEach(event => {
      console.log(`Event: ${event.title}, Image: ${event.image}`);
    });
  }, []);


  const handleEventClick = (event: Event) => {
    const slug = generateSlug(event.title);
    navigate(`/events/${slug}`);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  // Remove modal-related functions since we're not using modals anymore

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(220, 25%, 6%) 0%, hsl(220, 20%, 8%) 25%, hsl(220, 15%, 12%) 50%, hsl(220, 20%, 8%) 75%, hsl(220, 25%, 6%) 100%)",
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-blue-500/5 via-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '30s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">

        {/* ATOM Logo - Top Left */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 z-20"
        >
          <motion.button
            onClick={handleLogoClick}
            className="flex items-center gap-3 p-2 sm:p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Go to Home"
          >
            <img 
              src={atomLogo} 
              alt="ATOM Logo" 
              className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 transition-transform duration-300 group-hover:rotate-12"
            />
            <span className="text-white font-semibold text-sm sm:text-base lg:text-lg group-hover:text-blue-300 transition-colors duration-300">
              ATOM
            </span>
          </motion.button>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-10 lg:mb-16 px-2 pt-16 sm:pt-20 lg:pt-24"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-400 bg-clip-text text-transparent mb-4 sm:mb-6">
            ATOM EVENTS
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-3 sm:mb-4 px-3 sm:px-0">
            Join us in shaping the future through technology, innovation, and collaboration.
            Experience cutting-edge workshops, hackathons, and tech talks.
          </p>
          <p className="text-xs sm:text-sm text-gray-500 max-w-2xl mx-auto px-3 sm:px-0">
            Explore our journey through events, workshops, and achievements
          </p>
        </motion.div>

        {/* Events Section - Timeline of all events */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-400 bg-clip-text text-transparent mb-4">
              Events
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Explore our timeline of events, from the latest to our earliest achievements
            </p>
          </div>

          {events.length > 0 ? (
            <PastEventTimeline events={events} onEventClick={handleEventClick} />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
              role="status"
              aria-live="polite"
            >
              <div className="text-6xl mb-6">📅</div>
              <h3 className="text-2xl font-bold text-white mb-4">No Events Yet</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Our events will appear here. Stay tuned for exciting updates!
              </p>
            </motion.div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default Event;
