import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users, Star } from 'lucide-react';

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

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isUpcoming = event.status === 'upcoming';

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
      className="cursor-pointer h-auto min-h-[280px] sm:min-h-[320px] lg:min-h-[200px] xl:min-h-[220px] 2xl:min-h-[250px] 3xl:min-h-[280px] w-full"
      onClick={onClick}
    >
      <Card className={`group relative overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/25 ${
        isUpcoming
          ? 'hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-white/15 hover:via-white/10 hover:to-blue-500/10'
          : 'opacity-85 hover:opacity-100'
      }`}>

        {/* Glow Effect */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl ${
          isUpcoming ? 'bg-gradient-to-r from-blue-500/15 via-cyan-500/15 to-blue-500/15' : ''
        }`} />

        {/* Responsive Layout: Stacked on mobile, thumbnail + content on desktop */}
        <div className="flex flex-col lg:flex-row h-full lg:items-start">
          {/* Event Image Section */}
          <div className="relative overflow-hidden h-40 xs:h-44 sm:h-48 md:h-52 lg:h-32 lg:w-32 xl:h-36 xl:w-36 2xl:h-40 2xl:w-40 3xl:h-44 3xl:w-44 rounded-t-2xl sm:rounded-t-3xl lg:rounded-2xl lg:rounded-t-2xl flex-shrink-0 lg:m-4 xl:m-5 2xl:m-6">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                console.error(`Failed to load image: ${event.image} for event: ${event.title}`);
                e.currentTarget.src = '/placeholder.svg';
              }}
              onLoad={() => {
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-transparent" />

            {/* Mobile Badges */}
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 lg:hidden">
              {/* Top Badges Row */}
              <div className="flex justify-between items-start mb-2 sm:mb-0">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none font-semibold text-xs px-1.5 py-0.5 sm:text-sm sm:px-2 sm:py-1">
                  {event.category}
                </Badge>
                <Badge
                  variant="secondary"
                  className={`border-none font-semibold text-xs px-1.5 py-0.5 sm:text-sm sm:px-2 sm:py-1 ${
                    isUpcoming
                      ? 'bg-green-500/25 text-green-300'
                      : 'bg-gray-500/25 text-gray-300'
                  }`}
                >
                  {isUpcoming ? 'Upcoming' : 'Completed'}
                </Badge>
              </div>

              {/* Bottom Badge */}
              <div className="flex justify-start">
                <Badge
                  className={`border-none font-semibold text-xs px-1.5 py-0.5 sm:text-sm sm:px-2 sm:py-1 ${
                    event.eventType === 'free'
                      ? 'bg-emerald-500/25 text-emerald-300'
                      : 'bg-amber-500/25 text-amber-300'
                  }`}
                >
                  {event.eventType === 'free' ? 'Free' : 'Paid'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Desktop Status Badges (Positioned at top-right of thumbnail area) */}
          <div className="hidden lg:flex lg:flex-row lg:justify-start lg:items-start lg:gap-2 xl:gap-3 lg:mt-4 xl:mt-5 2xl:mt-6 lg:mr-4 xl:mr-5 2xl:mr-6 lg:flex-wrap">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none font-semibold text-xs xl:text-sm px-2 xl:px-3 py-1 xl:py-1.5 whitespace-nowrap">
              {event.category}
            </Badge>
            <Badge
              variant="secondary"
              className={`border-none font-semibold text-xs xl:text-sm px-2 xl:px-3 py-1 xl:py-1.5 whitespace-nowrap ${
                isUpcoming
                  ? 'bg-green-500/25 text-green-300'
                  : 'bg-gray-500/25 text-gray-300'
              }`}
            >
              {isUpcoming ? 'Upcoming' : 'Completed'}
            </Badge>
            <Badge
              className={`border-none font-semibold text-xs xl:text-sm px-2 xl:px-3 py-1 xl:py-1.5 whitespace-nowrap ${
                event.eventType === 'free'
                  ? 'bg-emerald-500/25 text-emerald-300'
                  : 'bg-amber-500/25 text-amber-300'
              }`}
            >
              {event.eventType === 'free' ? 'Free' : 'Paid'}
            </Badge>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-3 sm:p-4 md:p-6 lg:pr-4 lg:pl-0 lg:py-4 xl:pr-6 xl:pl-0 xl:py-5 2xl:pr-8 2xl:pl-0 2xl:py-6 flex flex-col min-w-0 lg:justify-between">
            {/* Header Section */}
            <div className="flex-1">
              <h3 className="text-base xs:text-lg sm:text-xl lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300 mb-3 sm:mb-4 lg:mb-2 xl:mb-3 2xl:mb-4 leading-tight">
                {event.title}
              </h3>

              {/* Event Details - Responsive Layout */}
              <div className="space-y-2 xs:space-y-2.5 sm:space-y-3 lg:space-y-1.5 xl:space-y-2 2xl:space-y-3 mb-4 sm:mb-5 md:mb-6 lg:mb-3 xl:mb-4 2xl:mb-5">
                <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4 xl:gap-6 gap-2 sm:gap-0">
                  <div className="flex items-center text-gray-300 min-w-0">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 mr-2 lg:mr-2 xl:mr-3 text-blue-400 flex-shrink-0" />
                    <span className="text-sm sm:text-base lg:text-sm xl:text-base 2xl:text-lg font-medium truncate">{formatDate(event.date)}</span>
                  </div>
                  {event.time && (
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 mr-2 text-purple-400 flex-shrink-0" />
                      <span className="text-sm sm:text-base lg:text-sm xl:text-base 2xl:text-lg font-medium">{event.time}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-start text-gray-300">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 mr-2 sm:mr-3 lg:mr-2 xl:mr-3 2xl:mr-4 text-green-400 flex-shrink-0 mt-0.5 lg:mt-0.5 xl:mt-0.5 2xl:mt-1" />
                  <span className="text-sm sm:text-base lg:text-sm xl:text-base 2xl:text-lg font-medium line-clamp-1 lg:line-clamp-1 xl:line-clamp-2">{event.location}</span>
                </div>

                {/* Past Event Stats - Desktop Optimized */}
                {!isUpcoming && (
                  <div className="flex flex-col sm:flex-row lg:flex-row xl:flex-row 2xl:flex-row sm:gap-4 lg:gap-3 xl:gap-4 2xl:gap-6 gap-2 text-gray-300">
                    {event.participants && (
                      <div className="flex items-center">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 mr-2 text-blue-400" />
                        <span className="text-sm sm:text-base lg:text-sm xl:text-base 2xl:text-lg font-medium">{event.participants} participants</span>
                      </div>
                    )}
                    {event.rating && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 mr-2 text-yellow-400 fill-current" />
                        <span className="text-sm sm:text-base lg:text-sm xl:text-base 2xl:text-lg font-medium">{event.rating}/5 rating</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Description removed - content only shown on detail page */}
            </div>

            {/* Action Button - Desktop Enhanced */}
            <div className="flex justify-start sm:justify-start lg:justify-end xl:justify-start mt-2 sm:mt-3 lg:mt-auto xl:mt-3 2xl:mt-4 lg:self-end xl:self-start">
              <Button
                className="px-5 sm:px-6 lg:px-4 xl:px-6 2xl:px-8 py-2.5 sm:py-3 lg:py-2 xl:py-2.5 2xl:py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-full border-none shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent text-sm sm:text-base lg:text-sm xl:text-base 2xl:text-lg min-w-[120px] sm:min-w-[140px] lg:min-w-[100px] xl:min-w-[120px] 2xl:min-w-[140px]"
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
      </Card>
    </motion.div>
  );
};

export default EventCard;
