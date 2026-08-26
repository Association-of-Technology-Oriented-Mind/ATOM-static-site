import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export const NetworkCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 }); // start offscreen

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const setSize = () => {
      const { innerWidth, innerHeight } = window;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    setSize();
    window.addEventListener('resize', setSize);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Particles setup
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 40 : 100;
    const particles: Particle[] = [];
    const connectionDistance = isMobile ? 100 : 150;
    const mouseConnectionDistance = 200;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5, // Slow, elegant movement
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 1.5 + 0.5,
      });
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // We use CSS custom properties but must parse them here, or hardcode the RGB values.
      // --phosphor is 168 90% 74% (HSL) -> ~ rgb(53, 239, 186)
      // Let's use a subtle whitish/blueish tint for the nodes.
      const baseColor = '255, 255, 255';
      const phosphorColor = '53, 239, 186';

      // Update and draw particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

        // Connect to other particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            // Opacity based on distance
            const opacity = 1 - (distance / connectionDistance);
            ctx.strokeStyle = `rgba(${baseColor}, ${opacity * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Connect to mouse
        const dxMouse = p.x - mouseRef.current.x;
        const dyMouse = p.y - mouseRef.current.y;
        const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distanceMouse < mouseConnectionDistance) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          const opacity = 1 - (distanceMouse / mouseConnectionDistance);
          // Highlight connection to mouse with phosphor color
          ctx.strokeStyle = `rgba(${phosphorColor}, ${opacity * 0.25})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Mouse repels slightly
          p.x += (dxMouse / distanceMouse) * 0.5;
          p.y += (dyMouse / distanceMouse) * 0.5;
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        // If close to mouse, light up
        if (distanceMouse < mouseConnectionDistance) {
            ctx.fillStyle = `rgba(${phosphorColor}, ${1 - distanceMouse/mouseConnectionDistance})`;
        } else {
            ctx.fillStyle = `rgba(${baseColor}, 0.2)`;
        }
        
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', setSize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
