import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useEvents } from '@/hooks/useContent';
import { generateSlug } from '@/utils/slug';

// ── Events Section — Immersive Cards ─────────────────────────────────────────
// Asymmetric grid: first card large (spans 2 rows), cards 2-3 stacked.
// Full-bleed images with overlay text on hover.

const ease = [0.16, 1, 0.3, 1] as const;

const formatDate = (dateString: string): string => {
  const raw = dateString.includes(',') ? dateString.split(',')[0] : dateString;
  const date = new Date(raw);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const EventsSection = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const navigate = useNavigate();

  const { data: allEvents = [] } = useEvents();
  const previewEvents = allEvents.slice(0, 3);

  return (
    <section
      id="events-section"
      ref={ref}
      className="events-section"
      style={{ backgroundColor: 'hsl(var(--ink))' }}
      aria-labelledby="events-heading"
    >
      <div className="events-container">

        {/* Header row */}
        <div className="events-header">
          <div>
            <motion.div
              className="events-label"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4 }}
            >
              <span className="events-label__num">03</span>
              <span className="events-label__rule" aria-hidden="true" />
              Events &amp; Activities
            </motion.div>
            <motion.h2
              id="events-heading"
              className="events-heading"
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              What we've built
            </motion.h2>
          </div>

          {/* "All events" link — desktop */}
          <motion.button
            className="events-view-all focus-phosphor"
            onClick={() => navigate('/events')}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            All events
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </motion.button>
        </div>

        {previewEvents.length > 0 ? (
          <div className="events-grid">
            {previewEvents.map((event, index) => (
              <motion.article
                key={event.id}
                className={`events-card ${index === 0 ? 'events-card--featured' : ''}`}
                onClick={() => navigate(`/events/${generateSlug(event.title)}`)}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + index * 0.1, ease }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/events/${generateSlug(event.title)}`); }}
              >
                {/* Image */}
                <div className="events-card__image-wrapper">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="events-card__image"
                    loading="lazy"
                  />
                  <div className="events-card__overlay" />
                </div>

                {/* Content overlay */}
                <div className="events-card__content">
                  <span className="events-card__category">{event.category}</span>
                  <h3 className="events-card__title">{event.title}</h3>
                  <div className="events-card__meta">
                    <div className="events-card__meta-item">
                      <Calendar className="w-3 h-3" aria-hidden="true" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="events-card__meta-item">
                      <MapPin className="w-3 h-3" aria-hidden="true" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="events-card__arrow">
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <motion.div
            className="events-empty"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <p className="events-empty__title">No events scheduled</p>
            <p className="events-empty__text">
              The next session's events will appear here once announced.
            </p>
            <button
              className="btn-tech"
              onClick={() => navigate('/events')}
            >
              <span>View all events</span>
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </button>
          </motion.div>
        )}

        {/* Mobile CTA */}
        <motion.div
          className="events-mobile-cta"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <button
            className="btn-tech"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => navigate('/events')}
          >
            <span>All events</span>
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsSection;
