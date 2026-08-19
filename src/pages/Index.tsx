import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Achievements } from '@/components/Achievements';
import EventsSection from '@/components/EventsSection';
import { Clubs } from '@/components/Clubs';
import PhotoGallerySection from '@/components/PhotoGallerySection';
import Footer from '@/components/Footer';
import { useImageProtection } from '@/hooks/useImageProtection';

// Homepage section order:
// Hero → About → Achievements → Events → Clubs → Core Teaser → Gallery → Footer

const CoreTeaser = () => {
  return (
    <section className="relative lattice rule-t rule-b py-24 px-6 sm:px-10 lg:px-16 bg-[hsl(var(--ink))]">
      <div className="max-w-[var(--container-xl)] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="max-w-2xl">
          <p className="mono-label mb-4">
            <span className="accent">07</span> — Leadership & Portfolios
          </p>
          <h2 className="display-l text-[hsl(var(--chalk))] uppercase mb-4">
            Meet the Core Team
          </h2>
          <p className="editorial-body text-[hsl(var(--chalk)/0.7)]">
            Twelve positions across six technical portfolios. Meet the student leaders driving innovation at ATOM.
          </p>
        </div>
        <div className="shrink-0">
          <Link
            to="/core"
            className="btn-tech inline-flex items-center gap-3 px-8 py-4 border border-[hsl(var(--rule))] hover:border-[hsl(var(--phosphor))] hover:text-[hsl(var(--phosphor))]"
          >
            <span>Explore Core Portfolios</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

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
        <div className="snap-section"><About /></div>
        <div className="snap-section"><Achievements /></div>
        <div className="snap-section"><EventsSection /></div>
        <div className="snap-start"><Clubs /></div>
        <div className="snap-section"><CoreTeaser /></div>
        <div className="snap-section"><PhotoGallerySection /></div>
        <div className="snap-section--auto-height">
          <Footer />
        </div>
      </main>
    </>
  );
};

export default Index;
