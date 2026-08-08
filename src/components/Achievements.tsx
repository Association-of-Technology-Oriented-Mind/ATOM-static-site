import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Trophy, Users, Target, Award, Lightbulb, Rocket } from 'lucide-react';
import { ThreeDIconPresets } from './ThreeDIcons';
import { useIsMobile } from '@/hooks/use-mobile';

const achievements = [
  {
    icon: Trophy,
    title: "50+ Projects Completed",
    description: "Successfully delivered innovative technology solutions"
  },
  {
    icon: Lightbulb,
    title: "Innovation Hub",
    description: "Leading research and development initiatives"
  },
  {
    icon: Users,
    title: "150+ Active Members",
    description: "Growing community of tech enthusiasts and leaders"
  },
  {
    icon: Rocket,
    title: "Solving real life problems",
    description: "Using knowledge and creativity to find practical solutions"
  },
  {
    icon: Target,
    title: "10+ Workshops",
    description: "Comprehensive skill development programs"
  }
];

export const Achievements = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isMobile = useIsMobile();

  return (
    <section ref={ref} className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 gradient-text"
      >
        Our Achievements
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
        {achievements.map((achievement, index) => {
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              className="glass-card p-4 sm:p-6 lg:p-8 text-center group transform-gpu"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="relative mb-4 sm:mb-6 flex justify-center">
                {achievement.icon === Trophy && <ThreeDIconPresets.Trophy size={isMobile ? 32 : 48} />}
                {achievement.icon === Users && <ThreeDIconPresets.Users size={isMobile ? 32 : 48} />}
                {achievement.icon === Target && <ThreeDIconPresets.Target size={isMobile ? 32 : 48} />}
                {achievement.icon === Award && <ThreeDIconPresets.Award size={isMobile ? 32 : 48} />}
                {achievement.icon === Lightbulb && <ThreeDIconPresets.Lightbulb size={isMobile ? 32 : 48} />}
                {achievement.icon === Rocket && <ThreeDIconPresets.Rocket size={isMobile ? 32 : 48} />}
              </div>

              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-foreground">
                {achievement.title}
              </h3>

              <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed">
                {achievement.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};