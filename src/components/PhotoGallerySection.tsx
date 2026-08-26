import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useGalleryImages } from '@/hooks/useContent';

// ── Gallery — Refined Grid ───────────────────────────────────────────────────
// Alternating tile sizes for visual rhythm.
// Hover: phosphor border highlight.

const PREVIEW_COUNT = 6;
const ease = [0.16, 1, 0.3, 1] as const;

const PhotoGallerySection = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const navigate = useNavigate();

  const { data: allImages = [] } = useGalleryImages();
  const previewImages = allImages.slice(0, PREVIEW_COUNT);

  return (
    <section
      ref={ref}
      id="gallery-section"
      className="gallery-section"
      aria-labelledby="gallery-heading"
    >
      <div className="gallery-container">

        {/* Header row */}
        <div className="gallery-header">
          <div>
            <motion.div
              className="gallery-label"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4 }}
            >
              <span className="gallery-label__num">05</span>
              <span className="gallery-label__rule" aria-hidden="true" />
              Gallery
            </motion.div>
            <motion.h2
              id="gallery-heading"
              className="gallery-heading"
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              From the field
            </motion.h2>
          </div>

          {/* Desktop CTA */}
          <motion.button
            className="gallery-view-all focus-phosphor"
            onClick={() => navigate('/full-gallery')}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Full gallery
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </motion.button>
        </div>

        {/* Grid */}
        {previewImages.length > 0 ? (
          <div className="gallery-grid">
            {previewImages.map((src, index) => (
              <motion.button
                key={`${src}-${index}`}
                className={`gallery-tile focus-phosphor ${index === 0 || index === 3 ? 'gallery-tile--large' : ''}`}
                onClick={() => navigate('/full-gallery')}
                aria-label={`Gallery photo ${index + 1}. Opens full gallery.`}
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.15 + index * 0.06, ease }}
              >
                <img
                  src={String(src)}
                  alt=""
                  loading="lazy"
                  className="gallery-tile__image"
                />
                <div className="gallery-tile__border" aria-hidden="true" />
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="gallery-empty">
            <p>No photos yet</p>
          </div>
        )}

        {/* Mobile CTA */}
        <motion.div
          className="gallery-mobile-cta"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <button
            className="btn-tech"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => navigate('/full-gallery')}
          >
            <span>Full gallery</span>
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default PhotoGallerySection;