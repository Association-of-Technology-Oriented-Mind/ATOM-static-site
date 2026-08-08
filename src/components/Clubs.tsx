import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { X, Linkedin, ArrowLeft } from "lucide-react";

import { useClubs } from "@/hooks/useContent";
import { DotIcon, BiasIcon, HackIcon } from "@/constants/clubs";

export const Clubs = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { data: clubs = [] } = useClubs();

  const [selectedClub, setSelectedClub] = useState<null | typeof clubs[0]>(null);
  const [clubPage, setClubPage] = useState<null | typeof clubs[0]>(null);
  const [selectedCoordinator, setSelectedCoordinator] = useState<
    null | typeof clubs[0]["coordinators"][0]
  >(null);

  // disable background scroll only when modals are open, not for club page
  useEffect(() => {
    if (selectedClub || selectedCoordinator) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedClub, selectedCoordinator]);

  const renderCoordinatorsByRole = (coordinators: typeof clubs[0]["coordinators"], roles: string[]) => {
    const filtered = coordinators.filter(coord => roles.includes(coord.role));
    if (filtered.length === 0) return null;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
        {filtered.map((coordinator, index) => (
          <div
            key={index}
            className={`glass-card p-4 sm:p-6 text-center cursor-pointer w-full ${
              coordinator.isMain ? "ring-2 ring-atom-primary" : ""
            }`}
            onClick={() => setSelectedCoordinator(coordinator)}
          >
            <img
              src={coordinator.image}
              alt={coordinator.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto object-cover border-2 border-atom-metallic mb-3 sm:mb-4"
            />
            <h5 className="font-semibold text-sm sm:text-base text-foreground mb-1 sm:mb-2">
              {coordinator.name}
            </h5>
            <p
              className={`text-xs sm:text-sm ${
                coordinator.isMain
                  ? "text-atom-primary font-semibold"
                  : "text-foreground-secondary"
              }`}
            >
              {coordinator.role}
            </p>
          </div>
        ))}
      </div>
    );
  };

  // Helper to render a centered LinkedIn anchor for a coordinator
  const renderCoordinatorLinkedIn = (coordinator?: typeof clubs[0]["coordinators"][0] | null) => {
    if (!coordinator || !coordinator.linkedin) return null;
    const raw = coordinator.linkedin as string;
    const url = raw.startsWith('http') ? raw : `https://${raw}`;

    return (
      <div className="w-full flex justify-center">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 max-w-[520px] w-full justify-center px-2"
          aria-label={`Open ${coordinator.name}'s LinkedIn`}
        >
          <Linkedin className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span className="truncate block max-w-[420px] text-center">{raw}</span>
        </a>
      </div>
    );
  };

  if (clubPage) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-background z-50 overflow-y-auto"
      >
        {/* Back Button */}
        <div className="sticky top-4 left-4 z-10 ml-4 mt-4">
          <button
            onClick={() => setClubPage(null)}
            className="flex items-center gap-2 px-4 py-2 bg-glass-card backdrop-blur-sm rounded-full hover:bg-card-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        <div className="pt-4 sm:pt-6 lg:pt-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-12 sm:pb-16 lg:pb-20">
          {/* Club Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-10 lg:mb-12"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto bg-gradient-primary rounded-xl flex items-center justify-center mb-4 sm:mb-6">
              {clubPage.name === "DotDev Club" ? (
                <img src={DotIcon} alt="DotDev Logo" className="w-14 h-14 object-contain mx-auto" style={{ display: 'block' }} />
              ) : clubPage.name === "Unbiased Club" ? (
                <img src={BiasIcon} alt="Unbiased Logo" className="w-14 h-14 object-contain mx-auto" style={{ display: 'block' }} />
              ) : clubPage.name === "Hack Hive Club" ? (
                <img src={HackIcon} alt="Hack Hive Logo" className="w-14 h-14 object-contain mx-auto" style={{ display: 'block' }} />
              ) : typeof clubPage.icon === "string" ? (
                <img src={clubPage.icon} alt={`${clubPage.name} icon`} className="w-12 h-12 object-contain mx-auto" style={{ display: 'block' }} />
              ) : (
                (() => {
                  const Icon = clubPage.icon;
                  return <Icon className="w-12 h-12 text-primary-foreground mx-auto" style={{ display: 'block' }} />;
                })()
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 gradient-text px-4 sm:px-0">
              {clubPage.name}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-foreground-secondary mb-4 sm:mb-6 max-w-3xl mx-auto px-4 sm:px-0">
              {clubPage.description}
            </p>
          </motion.div>

          {/* Objectives */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 sm:mb-10 lg:mb-12"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 metallic-text">Objectives</h2>
            <div className="glass-card p-4 sm:p-6">
              <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed">{clubPage.objectives}</p>
            </div>
          </motion.section>

          {/* Extra Info */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 sm:mb-10 lg:mb-12"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 metallic-text">About the Club</h2>
            <div className="glass-card p-4 sm:p-6">
              <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed">{clubPage.extraInfo}</p>
            </div>
          </motion.section>

          {/* Coordinators */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8 sm:mb-10 lg:mb-12"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 metallic-text">Coordinators</h2>
            {renderCoordinatorsByRole(clubPage.coordinators, ["Coordinator", "Senior Coordinator", "Joint Coordinator", "Junior Coordinator"])}
          </motion.section>

          {/* Educators */}
          {clubPage.coordinators.some(coord => coord.role === "Educator") && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8 sm:mb-10 lg:mb-12"
            >
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 metallic-text">Educators</h2>
              {renderCoordinatorsByRole(clubPage.coordinators, ["Educator"])}
            </motion.section>
          )}

          {/* Projects
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6 metallic-text">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubPage.projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="glass-card p-6"
                >
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{project.name}</h3>
                  <p className="text-foreground-secondary mb-4 leading-relaxed">{project.description}</p>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-atom-primary hover:text-atom-primary/80 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    View Repository
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.section> */}

          {/* Gallery */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 metallic-text">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {clubPage.gallery.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="glass-card overflow-hidden hover-scale w-full aspect-video"
                >
                  <img
                    src={image}
                    alt={`${clubPage.name} gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Coordinator Modal in Club Page */}
        {selectedCoordinator && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-60 flex items-center justify-center p-2 sm:p-4 min-h-screen overflow-y-auto"
            onClick={() => setSelectedCoordinator(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card max-w-xs sm:max-w-md w-full p-4 sm:p-6 relative text-center mx-auto my-4 sm:my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCoordinator(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-card-hover rounded-full transition-colors z-10"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              <div className="mb-4 sm:mb-6">
                <img
                  src={selectedCoordinator.image}
                  alt={selectedCoordinator.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto object-cover border-2 border-atom-metallic mb-3 sm:mb-4"
                />
                <h5 className="font-bold text-foreground text-lg sm:text-xl lg:text-2xl mb-1 sm:mb-2 px-8 sm:px-0">
                  {selectedCoordinator.name}
                </h5>
                <p className="text-foreground-secondary text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">
                  {selectedCoordinator.role}
                </p>
                {selectedCoordinator.isMain && (
                  <div className="mb-3 sm:mb-4 text-xs text-atom-primary font-medium">
                    ★ Lead Coordinator
                  </div>
                )}
              </div>

              {selectedCoordinator.bio && (
                <div className="mb-4 sm:mb-6">
                  <p className="text-foreground-secondary text-xs sm:text-sm leading-relaxed">
                    {selectedCoordinator.bio}
                  </p>
                </div>
              )}

                {renderCoordinatorLinkedIn(selectedCoordinator)}
            </motion.div>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <>
      {/* Clubs Section */}
      <section ref={ref} className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 gradient-text"
        >
          Our Clubs
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 justify-center">
          {clubs.map((club, index) => {
            return (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card p-4 sm:p-6 lg:p-8 hover-scale cursor-pointer group h-full flex flex-col justify-between max-w-sm mx-auto w-full"
                onClick={() => setSelectedClub(club)}
              >
                <div>
                  <div className="relative mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto bg-gradient-primary rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:shadow-electric transition-all duration-300">
                      {club.name === "DotDev Club" ? (
                        <img src={DotIcon} alt="DotDev Logo" className="w-14 h-14 object-contain mx-auto" />
                      ) : club.name === "Unbiased Club" ? (
                        <img src={BiasIcon} alt="Unbiased Logo" className="w-14 h-14 object-contain mx-auto" />
                      ) : club.name === "Hack Hive Club" ? (
                        <img src={HackIcon} alt="Hack Hive Logo" className="w-14 h-14 object-contain mx-auto" />
                      ) : typeof club.icon === "string" ? (
                        <img src={club.icon} alt={`${club.name} icon`} className="w-12 h-12 object-contain mx-auto" />
                      ) : (
                        (() => {
                          const Icon = club.icon;
                          return <Icon className="w-12 h-12 text-primary-foreground mx-auto" />;
                        })()
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-center mb-3 sm:mb-4 text-foreground">
                    {club.name}
                  </h3>
                  <p className="text-sm sm:text-base text-foreground-secondary text-center leading-relaxed mb-3 sm:mb-4 line-clamp-3">
                    {club.description}
                  </p>
                </div>
                <div className="flex justify-center space-x-2 mt-3 sm:mt-4">
                  {club.coordinators.slice(0, 3).map((coordinator, i) => (
                    <img
                      key={i}
                      src={coordinator.image}
                      alt={coordinator.name}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-atom-metallic"
                    />
                  ))}
                  {club.coordinators.length > 3 && (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-card-hover border-2 border-atom-metallic flex items-center justify-center text-xs font-semibold">
                      +{club.coordinators.length - 3}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center mt-8">
          {/* Add content for the second grid here */}
        </div>
      </section>

      {/* Club Modal */}
      {selectedClub && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 min-h-screen overflow-y-auto"
          onClick={() => setSelectedClub(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card max-w-xs sm:max-w-2xl lg:max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 lg:p-8 relative mx-auto my-2 sm:my-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedClub(null)}
              className="absolute top-4 right-4 p-2 hover:bg-card-hover rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
                {selectedClub.name === "DotDev Club" ? (
                  <img src={DotIcon} alt="DotDev Logo" className="w-14 h-14 object-contain mx-auto" style={{ display: 'block' }} />
                ) : selectedClub.name === "Unbiased Club" ? (
                  <img src={BiasIcon} alt="Unbiased Logo" className="w-14 h-14 object-contain mx-auto" style={{ display: 'block' }} />
                ) : selectedClub.name === "Hack Hive Club" ? (
                  <img src={HackIcon} alt="Hack Hive Logo" className="w-14 h-14 object-contain mx-auto" style={{ display: 'block' }} />
                ) : typeof selectedClub.icon === "string" ? (
                  <img src={selectedClub.icon} alt={`${selectedClub.name} icon`} className="w-12 h-12 object-contain mx-auto" style={{ display: 'block' }} />
                ) : (
                  (() => {
                    const Icon = selectedClub.icon;
                    return <Icon className="w-12 h-12 text-primary-foreground mx-auto" style={{ display: 'block' }} />;
                  })()
                )}
              </div>
              <h3 className="text-3xl font-bold mb-4 gradient-text">
                {selectedClub.name}
              </h3>
              <p className="text-lg text-foreground-secondary">
                {selectedClub.description}
              </p>
            </div>

            <div className="mb-8 flex justify-center">
              <button
                onClick={() => {
                  setClubPage(selectedClub);
                  setSelectedClub(null);
                }}
                className="px-6 py-2 rounded-full bg-atom-primary text-white font-semibold hover:bg-atom-primary/80 transition-colors"
              >
                More Details
              </button>
            </div>

            {/* Coordinators Only */}
            <div>
              <h4 className="text-xl font-semibold mb-6 metallic-text">
                Coordinators
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
                {selectedClub.coordinators
                  .filter(coord => coord.role !== "Educator")
                  .map((coordinator, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`glass-card p-6 text-center cursor-pointer w-full max-w-xs mx-auto ${
                      coordinator.isMain ? "ring-2 ring-atom-primary" : ""
                    }`}
                    onClick={() => setSelectedCoordinator(coordinator)}
                  >
                    <img
                      src={coordinator.image}
                      alt={coordinator.name}
                      className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-atom-metallic mb-4"
                    />
                    <h5 className="font-semibold text-foreground mb-2">
                      {coordinator.name}
                    </h5>
                    <p
                      className={`text-sm ${
                        coordinator.isMain
                          ? "text-atom-primary font-semibold"
                          : "text-foreground-secondary"
                      }`}
                    >
                      {coordinator.role}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Coordinator Modal */}
      {selectedCoordinator && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 min-h-screen"
          onClick={() => setSelectedCoordinator(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card max-w-md w-full p-6 relative text-center mx-auto my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCoordinator(null)}
              className="absolute top-4 right-4 p-2 hover:bg-card-hover rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="mb-6">
              <img
                src={selectedCoordinator.image}
                alt={selectedCoordinator.name}
                className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-atom-metallic mb-4"
              />
              <h5 className="font-bold text-foreground text-2xl mb-2">
                {selectedCoordinator.name}
              </h5>
              <p className="text-foreground-secondary text-lg mb-4">
                {selectedCoordinator.role}
              </p>
              {selectedCoordinator.isMain && (
                <div className="mb-4 text-xs text-atom-primary font-medium">
                  ★ Lead Coordinator
                </div>
              )}
            </div>

            {selectedCoordinator.bio && (
              <div className="mb-6">
                <p className="text-foreground-secondary text-sm leading-relaxed">
                  {selectedCoordinator.bio}
                </p>
              </div>
            )}

              {renderCoordinatorLinkedIn(selectedCoordinator)}
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Clubs;
