import { useEffect } from 'react';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import EventsSection from '@/components/EventsSection';
import { Clubs } from '@/components/Clubs';
import { CoreTeaser } from '@/components/CoreTeaser';
import PhotoGallerySection from '@/components/PhotoGallerySection';
import Footer from '@/components/Footer';
import { useImageProtection } from '@/hooks/useImageProtection';

// Homepage section order:
// Hero → About+Numbers → Events → Clubs → Core Teaser → Gallery → Footer

const Index = () => {
  useImageProtection({
    disableRightClick: true,
    disableDrag: true,
    disableSelect: true,
    disablePrintScreen: true,
    disableDevTools: true,
    showWarningOnRightClick: true,
  });

  useEffect(() => {
    // If there is a hash, let the browser scroll to it
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
    // Enable native CSS snap scrolling on mount
    document.documentElement.classList.add('snap-enabled');
    return () => {
      // Clean up on unmount so other pages behave normally
      document.documentElement.classList.remove('snap-enabled');
    };
  }, []);

  return (
    <>
      <main
        className="min-h-screen overflow-x-hidden"
        style={{ backgroundColor: 'hsl(var(--ink))' }}
      >
        <div className="snap-section"><Hero /></div>
        <div className="snap-section--auto-height"><About /></div>
        <div className="snap-section--auto-height"><EventsSection /></div>
        <div className="snap-start"><Clubs /></div>
        <div className="snap-section--auto-height"><CoreTeaser /></div>
        <div className="snap-section--auto-height"><PhotoGallerySection /></div>
        <div style={{ scrollSnapAlign: 'end' }}>
          <Footer />
        </div>
      </main>
    </>
  );
};

export default Index;
