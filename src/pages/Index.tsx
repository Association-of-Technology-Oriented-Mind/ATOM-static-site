import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Achievements } from '@/components/Achievements';
import CoreMembers from '@/components/CoreMembers';
import { Clubs } from '@/components/Clubs';
import PhotoGallerySection from '@/components/PhotoGallerySection';
import EventsSection from '@/components/EventsSection';
import { ThreeDBackground } from '@/components/ThreeDBackground';
import { useImageProtection } from '@/hooks/useImageProtection';

const Index = () => {
  // Enable comprehensive image protection
  useImageProtection({
    disableRightClick: true,
    disableDrag: true,
    disableSelect: true,
    disablePrintScreen: true,
    disableDevTools: true,
    showWarningOnRightClick: true,
  });

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Hero />
      <About />
      
      {/* Container for sections with 3D background */}
      <div className="relative">
        {/* 3D Background only for the sections below */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <ThreeDBackground />
        </div>
        
        {/* Content sections with relative positioning */}
        <div className="relative z-10">
          <Achievements />
          {/* EventsSection with higher z-index to ensure clicks work properly */}
          <div className="relative z-30">
            <EventsSection />
          </div>
          {/* PhotoGallerySection with standard z-index */}
          <div className="relative z-20">
            <PhotoGallerySection />
          </div>
          <Clubs />
        </div>
      </div>

      <CoreMembers />
    </main>
  );
};

export default Index;
