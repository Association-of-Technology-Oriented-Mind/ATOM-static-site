import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import ScrollFloat from './ScrollFloat';
import atomTeamImage from '../assets/atom-team.webp';

export const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref} 
      className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 w-full min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${atomTeamImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: window.innerWidth > 768 ? 'fixed' : 'scroll'
      }}
    >
      {/* Light overlay to let faces show through while maintaining readability */}
      <div className="absolute inset-0 bg-black/30 sm:bg-black/25"></div>
      
      <div className="relative z-10 text-center max-w-6xl mx-auto">
        <div className="text-2xl sm:text-3xl lg:text-4xl text-white/70 mb-8 sm:mb-12 lg:mb-16">
          <ScrollFloat
            scrollContainerRef={null}
            animationDuration={6}
            ease='power1.inOut'
            scrollStart='center bottom+=50%'
            scrollEnd='bottom bottom-=40%'
            stagger={0.18}
          >
            About ATOM 
          </ScrollFloat>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 text-base sm:text-lg lg:text-xl leading-relaxed text-white/60 px-4 sm:px-0">
          <ScrollFloat
            scrollContainerRef={null}
            animationDuration={7}
            ease='power1.inOut'
            scrollStart='center bottom+=50%'
            scrollEnd='bottom bottom-=40%'
            stagger={0.22}
            containerClassName=""
            textClassName="text-base sm:text-lg lg:text-xl leading-relaxed text-white/60"
          >
           Association of Technology Oriented Minds (ATOM) is a student-driven community that              fosters innovation, learning, and collaboration. We aim to empower students with hands-on experience, technical skills, and a platform to turn ideas into impactful solutions.
          </ScrollFloat>
        </div>
      </div>
    </section>
  );
};