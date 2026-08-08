import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { X, Linkedin, Grid, ArrowLeft } from "lucide-react";

import { useCoordinators } from "@/hooks/useContent";

export const Coordinators = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { data: coordinators = [] } = useCoordinators();
  const [selectedCoordinator, setSelectedCoordinator] = useState<
    typeof coordinators[0] | null
  >(null);

  const [viewAll, setViewAll] = useState(false);

  // Helper to render LinkedIn anchor for selected coordinator
  const renderLinkedIn = () => {
    if (!selectedCoordinator || !selectedCoordinator.linkedin) return null;
    const raw = selectedCoordinator.linkedin as string;
    const linkedinUrl = raw.startsWith('http') ? raw : `https://${raw}`;

    return (
      <div className="w-full flex justify-center">
        <div className="inline-flex justify-center w-full max-w-[520px]">
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-foreground-secondary hover:underline w-full justify-center px-2"
            aria-label={`Open ${selectedCoordinator.name}'s LinkedIn`}
          >
            <Linkedin className="w-5 h-5 text-atom-primary flex-shrink-0" />
            <span className="truncate block max-w-[420px] text-center">{raw}</span>
          </a>
        </div>
      </div>
    );
  };

  const Card = ({ coordinator }: { coordinator: typeof coordinators[0] }) => (
    <motion.div
      key={coordinator.id}
      // Use a fixed width for the scrolling carousel, but make cards responsive and centered when viewing all
      className={
        viewAll
          ? "glass-card p-4 sm:p-6 cursor-pointer w-full max-w-xs sm:max-w-sm mx-auto"
          : "flex-shrink-0 w-64 sm:w-72 glass-card p-4 sm:p-6 cursor-pointer"
      }
      onClick={() => setSelectedCoordinator(coordinator)}
    >
      <div className="relative mb-3 sm:mb-4">
        <img
          src={coordinator.image}
          alt={coordinator.name}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto object-cover border-2 border-atom-metallic"
        />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-center mb-2 text-foreground">
        {coordinator.name}
      </h3>
      <p className="text-sm sm:text-base text-atom-primary font-semibold text-center mb-2 sm:mb-3">
        {coordinator.role}
      </p>
      <p className="text-xs sm:text-sm text-foreground-secondary text-center leading-relaxed line-clamp-3">
        {coordinator.bio}
      </p>
    </motion.div>
  );

  return (
    <>
      <section ref={ref} className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 gradient-text"
        >
          Core Members
        </motion.h2>

        {viewAll ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
              {coordinators.map((c) => (
                <Card key={c.id} coordinator={c} />
              ))}
            </div>
            <div className="flex justify-center items-center mt-8 sm:mt-12 px-4">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewAll(false)}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full text-white font-semibold transition-all duration-300 shadow-lg text-sm sm:text-base lg:text-lg hover:shadow-xl flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Carousel
              </motion.button>
            </div>
          </>
        ) : (
          <>
            <div className="relative overflow-hidden">
              <motion.div
                className="flex gap-6 animate-scroll"
                style={{
                  width: `${coordinators.length * 320 * 2}px`,
                  animation: `scroll ${coordinators.length * 4}s linear infinite`,
                }}
              >
                {[...coordinators, ...coordinators].map((c, index) => (
                  <Card key={`${c.id}-${index}`} coordinator={c} />
                ))}
              </motion.div>
            </div>
            <div className="flex justify-center items-center mt-8 sm:mt-12 px-4">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewAll(true)}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full text-white font-semibold transition-all duration-300 shadow-lg text-sm sm:text-base lg:text-lg hover:shadow-xl flex items-center gap-2"
              >
                <Grid className="w-4 h-4" />
                View All
              </motion.button>
            </div>
          </>
        )}
      </section>

      {selectedCoordinator && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 min-h-screen overflow-y-auto"
          onClick={() => setSelectedCoordinator(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card max-w-md sm:max-w-lg w-full p-4 sm:p-6 lg:p-8 relative mx-auto my-4 sm:my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCoordinator(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-card-hover rounded-full transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="text-center mb-4 sm:mb-6">
              <img
                src={selectedCoordinator.image}
                alt={selectedCoordinator.name}
                className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full mx-auto object-cover border-[3px] border-atom-metallic mb-3 sm:mb-4"
              />
              <h3 className="text-xl sm:text-2xl font-bold mb-2 gradient-text px-8 sm:px-0">
                {selectedCoordinator.name}
              </h3>
              <p className="text-atom-primary font-semibold text-base sm:text-lg">
                {selectedCoordinator.role}
              </p>
            </div>
            <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed mb-4 sm:mb-6">
              {selectedCoordinator.bio}
            </p>
            <div className="space-y-3">
              {renderLinkedIn()}
            </div>
          </motion.div>
        </motion.div>
      )}

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </>
  );
};

export default Coordinators;
