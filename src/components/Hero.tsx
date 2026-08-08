import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import TextPressure from './TextPressure';
import Waves from './Waves';
import atomLogo from '@/assets/atom-logo.webp';

export const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const logoRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleMouseMove = (e) => {
    if (logoRef.current) {
      const rect = logoRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;
      
      setMousePosition({
        x: deltaX * 30, // Increased intensity
        y: deltaY * 30
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
    setIsHovering(false);
  };

  const handleClick = () => {
    setClickCount(prev => prev + 1);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-start overflow-hidden">
      {/* Animated Waves Background */}
      <Waves
        lineColor="#2196f3"
        backgroundColor="rgba(33, 150, 243, 0.2)"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
      />



      {/* Content Layout: Logo left, text right on desktop; stacked on mobile */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center w-full px-4 max-w-7xl mx-auto">
        {/* ATOM Logo - left on desktop, top on mobile */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={isVisible ? { scale: 1, rotate: 0 } : {}}
          transition={{ 
            duration: 1, 
            type: "spring", 
            stiffness: 100,
            delay: 0.2 
          }}
          className="mb-8 lg:mb-0 lg:mr-12 flex-shrink-0 flex items-center justify-center"
          style={{ minWidth: '300px' }}
        >
          <motion.div 
            ref={logoRef}
            className="relative cursor-pointer select-none"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            animate={{
              x: mousePosition.x,
              y: mousePosition.y,
              scale: isHovering ? 1.15 : 1,
              rotateX: mousePosition.y * -1,
              rotateY: mousePosition.x * 1,
              rotateZ: isHovering ? mousePosition.x * 0.5 : 0
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              mass: 0.8
            }}
            style={{
              transformStyle: "preserve-3d"
            }}
            whileTap={{
              scale: 0.95,
              rotateZ: 360,
              transition: { duration: 0.6 }
            }}
          >
            {/* Animated Glow Ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={isHovering ? {
                background: [
                  "radial-gradient(circle, rgba(33,150,243,0.3) 0%, transparent 70%)",
                  "radial-gradient(circle, rgba(255,64,129,0.3) 0%, transparent 70%)",
                  "radial-gradient(circle, rgba(76,175,80,0.3) 0%, transparent 70%)",
                  "radial-gradient(circle, rgba(33,150,243,0.3) 0%, transparent 70%)"
                ],
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              } : {
                background: "transparent",
                scale: 1,
                rotate: 0
              }}
              transition={{
                duration: 2,
                repeat: isHovering ? Infinity : 0,
                ease: "easeInOut"
              }}
            />
            
            {/* Particle Effects */}
            {isHovering && [0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-400 rounded-full"
                initial={{
                  x: 200 + Math.cos(i * 72 * Math.PI / 180) * 150,
                  y: 200 + Math.sin(i * 72 * Math.PI / 180) * 150,
                  scale: 0
                }}
                animate={{
                  x: 200 + Math.cos((i * 72 + Date.now() * 0.001) * Math.PI / 180) * (100 + mousePosition.x),
                  y: 200 + Math.sin((i * 72 + Date.now() * 0.001) * Math.PI / 180) * (100 + mousePosition.y),
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
            
            <motion.img 
              src={atomLogo} 
              alt="ATOM Club Logo" 
              className="w-[350px] h-[350px] md:w-[450px] md:h-[450px] animate-float relative z-10"
              style={{ objectFit: 'contain' }}
              animate={{
                filter: isHovering 
                  ? `drop-shadow(0 0 30px rgba(33, 150, 243, 0.8)) brightness(1.2) contrast(1.1)`
                  : `drop-shadow(0 8px 16px rgba(0,0,0,0.3))`,
                rotateY: clickCount * 180,
                rotate: [0, 360]
              }}
              transition={{
                filter: { duration: 0.3 },
                rotateY: { duration: 0.8, ease: "easeOut" },
                rotate: { 
                  duration: 8, 
                  repeat: Infinity, 
                  ease: "linear" 
                }
              }}
            />
            
            {/* Click Ripple Effect */}
            <motion.div
              key={clickCount}
              className="absolute inset-0 border-2 border-blue-400 rounded-full"
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </motion.div>
        </motion.div>

        {/* Text content - right */}
        <div className="flex-1 text-left">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-6 flex items-center"
          >
            <div style={{ width: 'auto', height: '120px', minWidth: '320px', marginRight: '24px' }}>
              <TextPressure
                text="ATOM"
                flex={true}
                alpha={false}
                stroke={false}
                width={true}
                weight={true}
                italic={true}
                textColor="#ffffff"
                strokeColor="#ff0000"
                minFontSize={60}
              />
            </div>
          </motion.div>

          {/* Subheading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mb-8"
          >
            <TextPressure
              text="Association of Technology Oreinted Minds"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="#ffffff"
              strokeColor="#ff0000"
              minFontSize={32}
            />
          </motion.div>

          {/* Animated Tagline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-base md:text-lg text-foreground-secondary font-medium"
          >
          </motion.div>
        </div>


      </div>
    </section>
  );
};