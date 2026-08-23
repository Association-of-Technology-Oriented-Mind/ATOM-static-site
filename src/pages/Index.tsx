import { useEffect } from 'react';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Clubs } from '@/components/Clubs';
import Footer from '@/components/Footer';
import { useImageProtection } from '@/hooks/useImageProtection';

// Homepage section order:
// Hero → About → Clubs → Footer

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
    // Save scroll position when scroll event occurs
    const handleScroll = () => {
      if (window.scrollY > 0) {
        sessionStorage.setItem('homepage_scroll_pos', String(window.scrollY));
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Restore scroll position
    const savedPos = sessionStorage.getItem('homepage_scroll_pos');
    if (savedPos && !window.location.hash) {
      const scrollPos = parseInt(savedPos, 10);
      // Wait a tiny bit for pinned scroll height layout to settle
      setTimeout(() => {
        window.scrollTo({ top: scrollPos, behavior: 'instant' as ScrollBehavior });
      }, 100);
    } else if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 150);
      }
    } else {
      window.scrollTo(0, 0);
    }

    // Enable native CSS snap scrolling on mount
    document.documentElement.classList.add('snap-enabled');
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
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
        <div className="snap-start"><Clubs /></div>
        <div style={{ scrollSnapAlign: 'end' }}>
          <Footer />
        </div>
      </main>
    </>
  );
};

export default Index;
