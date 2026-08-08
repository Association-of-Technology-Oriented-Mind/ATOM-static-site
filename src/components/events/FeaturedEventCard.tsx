import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: string;
  time?: string;
  location: string;
  description: string;
  image: string;
  status: 'upcoming' | 'past';
  category: string;
  participants?: number;
  rating?: number;
  registrationLink?: string;
  eventType: 'free' | 'paid';
}


interface FeaturedEventCardProps {
  event: Event;
  onClick?: () => void;
}

const FeaturedEventCard: React.FC<FeaturedEventCardProps> = ({ event, onClick }) => {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateTimeRemaining = () => {
    try {
      
      // Parse the date parts
      const dateParts = event.date.split('-');
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed in JavaScript
      const day = parseInt(dateParts[2]);
      
      
      // Parse the time
      let hours = 0;
      let minutes = 0;
      
      if (event.time) {
        const timeStr = event.time.trim();
        
        // Handle 12-hour format (e.g., "09:30 AM")
        if (timeStr.includes('AM') || timeStr.includes('PM')) {
          const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
          if (timeMatch) {
            hours = parseInt(timeMatch[1]);
            minutes = parseInt(timeMatch[2]);
            const ampm = timeMatch[3].toUpperCase();
            
            
            // Convert to 24-hour format
            if (ampm === 'PM' && hours !== 12) {
              hours += 12;
            } else if (ampm === 'AM' && hours === 12) {
              hours = 0;
            }
          }
        } else {
          // Handle 24-hour format (e.g., "09:30")
          const timeParts = timeStr.split(':');
          hours = parseInt(timeParts[0]) || 0;
          minutes = parseInt(timeParts[1]) || 0;
        }
      }
      
      
      // Create the event date using individual components
      const eventDateTime = new Date(year, month, day, hours, minutes, 0, 0);
      const now = new Date();
      
      
      // Check if date is valid
      if (isNaN(eventDateTime.getTime())) {
        console.error('Invalid date created');
        return null;
      }
      
      const difference = eventDateTime.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
      }
      
      return null;
    } catch (error) {
      console.error('Date parsing error:', error);
      console.error('Event data:', { date: event.date, time: event.time });
      return null;
    }
  };

  useEffect(() => {
    if (event.status === 'upcoming') {
      // Initial calculation
      setTimeRemaining(calculateTimeRemaining());

      const timer = setInterval(() => {
        setTimeRemaining(calculateTimeRemaining());
      }, 1000);

      // Handle app visibility changes (important for iOS)
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          setTimeRemaining(calculateTimeRemaining());
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        clearInterval(timer);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [event.date, event.time, event.status]);

  const isUpcoming = event.status === 'upcoming';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="cursor-pointer max-w-4xl mx-auto"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/10 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/25 group">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10" />
        
        <div className="flex flex-col lg:flex-row h-full">
          {/* Image Section */}
          <div className="relative lg:w-1/2 h-64 lg:h-auto overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                console.error(`Failed to load image: ${event.image} for event: ${event.title}`);
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/20 lg:to-black/60" />
            
            {/* Status Badges - positioned on image */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none font-semibold text-sm px-3 py-1">
                {event.category}
              </Badge>
              <Badge
                variant="secondary"
                className={`border-none font-semibold text-sm px-3 py-1 ${
                  isUpcoming
                    ? 'bg-green-500/90 text-white'
                    : 'bg-gray-500/90 text-white'
                }`}
              >
                {isUpcoming ? 'Upcoming' : 'Completed'}
              </Badge>
              <Badge
                className={`border-none font-semibold text-sm px-3 py-1 ${
                  event.eventType === 'free'
                    ? 'bg-emerald-500/90 text-white'
                    : 'bg-amber-500/90 text-white'
                }`}
              >
                {event.eventType === 'free' ? 'Free Event' : 'Paid Event'}
              </Badge>
            </div>

            {/* Large Title Overlay on Image - Mobile */}
            <div className="absolute bottom-4 left-4 right-4 lg:hidden">
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                {event.title}
              </h2>
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-center relative z-10">
            {/* Title - Desktop */}
            <div className="hidden lg:block mb-6">
              <h2 className="text-3xl xl:text-4xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300 leading-tight">
                {event.title}
              </h2>
            </div>

            {/* Event Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center text-gray-300">
                <Calendar className="w-5 h-5 mr-3 text-blue-400 flex-shrink-0" />
                <span className="text-lg font-medium">{formatDate(event.date)}</span>
                {event.time && (
                  <>
                    <Clock className="w-5 h-5 ml-6 mr-3 text-purple-400 flex-shrink-0" />
                    <span className="text-lg font-medium">{event.time}</span>
                  </>
                )}
              </div>

              <div className="flex items-start text-gray-300">
                <MapPin className="w-5 h-5 mr-3 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-lg font-medium">{event.location}</span>
              </div>
            </div>

            {/* Countdown Timer */}
            {isUpcoming && (
              <div className="mb-6">
                <h3 className="text-white text-lg font-semibold mb-4">Event Countdown</h3>
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  {timeRemaining ? (
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div className="flex flex-col">
                        <div className="text-2xl font-bold text-white">
                          {(timeRemaining.days || 0).toString().padStart(2, '0')}
                        </div>
                        <div className="text-sm text-gray-400">DAYS</div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-2xl font-bold text-white">
                          {(timeRemaining.hours || 0).toString().padStart(2, '0')}
                        </div>
                        <div className="text-sm text-gray-400">HOURS</div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-2xl font-bold text-white">
                          {(timeRemaining.minutes || 0).toString().padStart(2, '0')}
                        </div>
                        <div className="text-sm text-gray-400">MINUTES</div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-2xl font-bold text-white">
                          {(timeRemaining.seconds || 0).toString().padStart(2, '0')}
                        </div>
                        <div className="text-sm text-gray-400">SECONDS</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-white text-lg">Loading...</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-gray-300 text-base leading-relaxed mb-8 opacity-90">
              {event.description}
            </p>

            {/* Action Button */}
            <div>
              <Button
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-full border-none shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent text-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.();
                }}
                aria-label={`Learn more about ${event.title}`}
              >
                Know More
              </Button>
            </div>
          </div>
        </div>

        {/* Hover Border Effect */}
        <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-gradient-to-r group-hover:from-blue-500/50 group-hover:via-purple-500/50 group-hover:to-blue-500/50 transition-all duration-500 pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default FeaturedEventCard;