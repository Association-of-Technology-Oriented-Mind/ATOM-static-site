import { useEffect } from 'react';
import CoreMembers from '@/components/CoreMembers';
import Footer from '@/components/Footer';

const CorePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(var(--ink))]">
      <main className="pt-20 sm:pt-24">
        <CoreMembers />
      </main>
      <Footer />
    </div>
  );
};

export default CorePage;
