import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, MapPin, Clock, ArrowRight, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThreeDIconPresets } from './ThreeDIcons';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEvents } from '@/hooks/useContent';

const EventsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // First 3 events for preview (all events, not just upcoming)
  const { data: allEvents = [] } = useEvents();
  const previewEvents = allEvents.slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleShowMore = () => {
    navigate('/events');
    // Scroll to top after navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEventClick = (eventId: number) => {
    navigate(`/events?event=${eventId}`);
  };

  return (
    <section
      ref={ref}
      className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto events-section-container"
      style={{ pointerEvents: 'auto' }}
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 sm:mb-12 lg:mb-16 flex flex-col items-center"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 gradient-text text-center w-full">
          Events
        </h2>
        <p className="text-base sm:text-lg text-foreground-secondary max-w-2xl text-center">
          Discover our events, workshops, and competitions that shape the future of technology
        </p>
      </motion.div>

      {previewEvents.length > 0 ? (
        <>
          {/* Events Grid - Show 2-3 events */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
            {previewEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="bg-[#0d1117] rounded-2xl shadow-md overflow-hidden flex flex-col h-full cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleEventClick(event.id);
                  }}
                >
                  {/* Event Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>

                  {/* Event Content */}
                  <div className="flex flex-col justify-between flex-1 p-4">
                    {/* Title and Details */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 line-clamp-2">
                        {event.title}
                      </h3>

                      {/* Event Details */}
                      <div className="space-y-2 text-sm text-foreground-secondary text-left">
                        <div className="flex items-start gap-1.5">
                          <Calendar className="w-4 h-4 text-atom-primary flex-shrink-0 mt-0.5" />
                          <span>{formatDate(event.date)}</span>
                        </div>

                        {event.time && (
                          <div className="flex items-start gap-1.5">
                            <Clock className="w-4 h-4 text-atom-accent flex-shrink-0 mt-0.5" />
                            <span>{event.time}</span>
                          </div>
                        )}

                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Event Category */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <Badge
                        variant="outline"
                        className="text-xs bg-atom-primary/10 text-atom-primary border-atom-primary/30"
                      >
                        {event.category}
                      </Badge>

                      <div className="flex items-center gap-1 text-xs text-foreground-secondary">
                        <span>Learn More</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>

          {/* Show More Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleShowMore();
              }}
              className="bg-gradient-to-r from-atom-primary to-atom-accent hover:from-atom-primary/90 hover:to-atom-accent/90 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
              type="button"
            >
              <div className="flex items-center gap-3">
                <ThreeDIconPresets.Rocket size={isMobile ? 18 : 20} />
                Show All Events
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </div>
            </Button>
          </motion.div>
        </>
      ) : (
        /* Coming Soon State */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center items-center min-h-[60vh] w-full"
        >
          <div className="glass-card p-8 sm:p-12 lg:p-16 max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.5,
                type: "spring",
                stiffness: 200
              }}
              className="mb-8"
            >
              <div className="text-8xl sm:text-9xl mb-6">🚀</div>
            </motion.div>
            
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 gradient-text"
            >
              Exciting Events Coming Soon!
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="text-base sm:text-lg lg:text-xl text-foreground-secondary mb-3"
            >
              We're currently planning amazing events for the upcoming session.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="text-sm sm:text-base text-foreground-secondary/80 mb-8"
            >
              Stay tuned for announcements! 🎉
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
            >
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleShowMore();
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
                type="button"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  View All Events
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </div>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default EventsSection;
