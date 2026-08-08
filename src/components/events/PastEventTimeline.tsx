import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Star, ChevronDown, ChevronUp, Clock } from 'lucide-react';

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

interface PastEventTimelineProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
}

const PastEventTimeline: React.FC<PastEventTimelineProps> = ({ events, onEventClick }) => {
  const [expandedEvents, setExpandedEvents] = useState<Set<number>>(new Set());
  const groupBy: 'year' | 'month' = 'year';

  const toggleExpand = (eventId: number) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const formatDate = (dateString: string) => {
    // Handle multi-day events (comma-separated dates)
    // Use the first date for grouping and year extraction
    const firstDate = dateString.includes(',') ? dateString.split(',')[0].trim() : dateString;
    const date = new Date(firstDate);
    
    // Format display for multi-day events
    let fullDisplay, shortDisplay;
    if (dateString.includes(',')) {
      const dates = dateString.split(',').map(d => d.trim());
      const startDate = new Date(dates[0]);
      const endDate = new Date(dates[1]);
      
      fullDisplay = `${startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
      shortDisplay = `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    } else {
      fullDisplay = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      shortDisplay = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
    
    return {
      full: fullDisplay,
      short: shortDisplay,
      year: date.getFullYear(),
      month: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
  };

  // Group events by year or month
  const groupedEvents = events.reduce((acc, event) => {
    const date = formatDate(event.date);
    const key = groupBy === 'year' ? date.year.toString() : date.month;
    
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  // Sort groups in descending order
  const sortedGroups = Object.entries(groupedEvents).sort(([a], [b]) => {
    if (groupBy === 'year') {
      return parseInt(b) - parseInt(a);
    } else {
      return new Date(b).getTime() - new Date(a).getTime();
    }
  });


  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <div className="text-6xl mb-4">📅</div>
        <h3 className="text-2xl font-semibold text-white mb-2">No past events found</h3>
        <p className="text-gray-400">Check back later for event archives</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-xl border border-blue-500/20 rounded-2xl">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">{stats.totalParticipants.toLocaleString()}</div>
            <div className="text-blue-300 text-sm">Total Participants</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl">
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3 fill-current" />
            <div className="text-3xl font-bold text-white mb-1">{stats.avgRating}</div>
            <div className="text-purple-300 text-sm">Average Rating</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/20 rounded-2xl">
          <CardContent className="p-6 text-center">
            <Award className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">{stats.categories}</div>
            <div className="text-green-300 text-sm">Event Categories</div>
          </CardContent>
        </Card>
      </motion.div> */}

      {/* Group By Toggle */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex justify-center mb-8"
      >
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-1 border border-white/10">
          {['year', 'month'].map((option) => (
            <button
              key={option}
              onClick={() => setGroupBy(option as 'year' | 'month')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                groupBy === option
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Group by {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </motion.div> */}

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-30" />

        <div className="space-y-12">
          {sortedGroups.map(([period, periodEvents], groupIndex) => (
            <motion.div
              key={period}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: groupIndex * 0.1 }}
              className="relative"
            >
              {/* Period Header */}
              <div className="flex items-center mb-8">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/25">
                    {groupBy === 'year' ? period : new Date(period).getFullYear()}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-30 -z-10" />
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-white">{period}</h3>
                  <p className="text-gray-400">{periodEvents.length} events</p>
                </div>
              </div>

              {/* Events in this period */}
              <div className="ml-24 space-y-6">
                {periodEvents.map((event, eventIndex) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: eventIndex * 0.1 }}
                    className="relative"
                  >
                    {/* Connection Line */}
                    <div className="absolute -left-24 top-6 w-16 h-px bg-gradient-to-r from-purple-500 to-transparent" />
                    <div className="absolute -left-8 top-5 w-2 h-2 bg-purple-500 rounded-full" />

                    <Card 
                      className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 group cursor-pointer"
                      onClick={() => onEventClick && onEventClick(event)}
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Event Image */}
                        <div className="relative md:w-48 h-48 md:h-auto overflow-hidden">
                          <img 
                            src={event.image} 
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          
                          {/* Category Badge */}
                          <Badge className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none">
                            {event.category}
                          </Badge>
                        </div>

                        {/* Event Content */}
                        <CardContent className="flex-1 p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                                {event.title}
                              </h4>
                              
                              <div className="space-y-1 text-sm text-gray-300">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                                  <span>{formatDate(event.date).full}</span>
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-2 text-green-400" />
                                  <span>{event.location}</span>
                                </div>
                                {event.time && (
                                  <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2 text-purple-400" />
                                    <span>{event.time}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpand(event.id)}
                              className="text-gray-400 hover:text-white hover:bg-white/10"
                            >
                              {expandedEvents.has(event.id) ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                          </div>

                          {/* Event Stats */}
                          <div className="flex items-center gap-6 mb-4 text-sm">
                            {event.participants && (
                              <div className="flex items-center text-gray-300">
                                <Users className="w-4 h-4 mr-2 text-blue-400" />
                                <span>{event.participants} participants</span>
                              </div>
                            )}
                            {event.rating && (
                              <div className="flex items-center text-gray-300">
                                <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
                                <span>{event.rating}/5 rating</span>
                              </div>
                            )}
                          </div>

                          {/* Expanded Content */}
                          <AnimatePresence>
                            {expandedEvents.has(event.id) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                              >
                                <p className="text-gray-300 leading-relaxed">
                                  {event.description}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PastEventTimeline;