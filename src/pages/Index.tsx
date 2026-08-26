import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import EventsSection from '@/components/EventsSection';
import { Clubs } from '@/components/Clubs';
import CoreMembers from '@/components/CoreMembers';
import PhotoGallerySection from '@/components/PhotoGallerySection';
import Footer from '@/components/Footer';
import { useImageProtection } from '@/hooks/useImageProtection';

const Index = () => {
  const location = useLocation();

  useImageProtection({
    disableRightClick: true,
    disableDrag: true,
    disableSelect: true,
    disablePrintScreen: true,
    disableDevTools: true,
    showWarningOnRightClick: true,
  });

  useEffect(() => {
    // Apply liquid glass dark body theme
    document.body.classList.add('liquid-theme');
    document.body.style.backgroundColor = 'var(--lg-bg)';
    document.documentElement.style.backgroundColor = 'var(--lg-bg)';

    // Scroll to hash or top
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } else {
      window.scrollTo(0, 0);
    }

    return () => {
      document.body.classList.remove('liquid-theme');
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, []);

  // Listen to hash changes for smooth navigation within the home page
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [location.hash]);

  return (
    <>
      <main
        className="min-h-screen overflow-x-hidden"
        style={{ backgroundColor: 'var(--lg-bg)' }}
      >
        <Hero />
        <About />
        <EventsSection />
        <Clubs />
        <CoreMembers />
        <PhotoGallerySection />
        <Footer />
      </main>
    </>
  );
};

export default Index;
