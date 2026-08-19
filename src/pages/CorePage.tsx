import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import CoreMembers from '@/components/CoreMembers';
import Footer from '@/components/Footer';

const CorePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(var(--ink))]">
      <Navigation />
      <main className="pt-[var(--nav-height)]">
        <CoreMembers />
      </main>
      <Footer />
    </div>
  );
};

export default CorePage;
