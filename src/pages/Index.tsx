import { useEffect } from 'react';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Achievements } from '@/components/Achievements';
import EventsSection from '@/components/EventsSection';
import CoreMembers from '@/components/CoreMembers';
import { Clubs } from '@/components/Clubs';
import PhotoGallerySection from '@/components/PhotoGallerySection';
import { JoinCTA } from '@/components/JoinCTA';
import Footer from '@/components/Footer';
import { useImageProtection } from '@/hooks/useImageProtection';

// Homepage section order per GOAL.md:
// Hero → About → Achievements → Events → CoreMembers → Clubs → Gallery → Join → Footer

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
    // If there is a hash, let the browser scroll to it (or do it manually).
    // Otherwise, start at top of presentation.
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
        <div className="snap-section"><About /></div>
        <div className="snap-section"><Achievements /></div>
        <div className="snap-section"><EventsSection /></div>
        <div className="snap-start"><CoreMembers /></div>
        <div className="snap-start"><Clubs /></div>
        <div className="snap-section"><PhotoGallerySection /></div>
        <div className="snap-section--auto-height">
          <JoinCTA />
          <Footer />
        </div>
      </main>
    </>
  );
};

export default Index;
