import { useEffect, useRef, useCallback } from 'react';

// ── Orbital Constellation Canvas ─────────────────────────────────────────────
// Lightweight 2D canvas that renders a constellation of interconnected nodes
// tracing orbital paths. Directly inspired by the ATOM atomic identity.
//
// Performance: targets 60fps, caps DPR at 2, uses requestAnimationFrame.
// Reduced-motion: renders a single static frame and stops.

interface Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
  opacity: number;
  layer: number; // 0 = far, 1 = mid, 2 = near — for parallax
}

const NODE_COUNT = 65;
const CONNECTION_DISTANCE = 180;
const PHOSPHOR = { r: 125, g: 249, b: 228 }; // #7DF9E4
const CHALK = { r: 230, g: 232, b: 236 };

function createNodes(w: number, h: number): Node[] {
  const nodes: Node[] = [];
  const cx = w * 0.58;
  const cy = h * 0.48;

  for (let i = 0; i < NODE_COUNT; i++) {
    // Cluster nodes toward center-right with gaussian-like distribution
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * Math.min(w, h) * 0.42;
    const spread = 0.3 + Math.random() * 0.7;

    const baseX = cx + Math.cos(angle) * dist * spread;
    const baseY = cy + Math.sin(angle) * dist * spread * 0.8;

    const layer = i < 20 ? 0 : i < 45 ? 1 : 2;

    nodes.push({
      x: baseX,
      y: baseY,
      baseX,
      baseY,
      radius: layer === 2 ? 1.5 + Math.random() * 1.5 : 0.8 + Math.random() * 1,
      orbitRadius: 8 + Math.random() * 30,
      orbitSpeed: 0.0002 + Math.random() * 0.0006,
      orbitPhase: Math.random() * Math.PI * 2,
      opacity: layer === 2 ? 0.5 + Math.random() * 0.4 : 0.15 + Math.random() * 0.3,
      layer,
    });
  }
  return nodes;
}

interface OrbitalCanvasProps {
  className?: string;
}

export const OrbitalCanvas: React.FC<OrbitalCanvasProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const sizeRef = useRef({ w: 0, h: 0 });

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    sizeRef.current = { w: rect.width, h: rect.height };

    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    nodesRef.current = createNodes(rect.width, rect.height);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    handleResize();

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = (time: number) => {
      const { w, h } = sizeRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;

      // Update node positions with orbital motion
      for (const node of nodes) {
        if (!reducedMotion) {
          const phase = node.orbitPhase + time * node.orbitSpeed;
          node.x = node.baseX + Math.cos(phase) * node.orbitRadius;
          node.y = node.baseY + Math.sin(phase) * node.orbitRadius * 0.6;
        }
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.12;
            ctx.strokeStyle = `rgba(${PHOSPHOR.r}, ${PHOSPHOR.g}, ${PHOSPHOR.b}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        // Cursor proximity glow
        let glowAlpha = 0;
        if (!reducedMotion && mx > 0) {
          const dx = node.x - mx;
          const dy = node.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            glowAlpha = (1 - dist / 200) * 0.3;
          }
        }

        const finalOpacity = Math.min(node.opacity + glowAlpha, 0.95);

        // Node dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.layer === 2
          ? `rgba(${PHOSPHOR.r}, ${PHOSPHOR.g}, ${PHOSPHOR.b}, ${finalOpacity})`
          : `rgba(${CHALK.r}, ${CHALK.g}, ${CHALK.b}, ${finalOpacity * 0.6})`;
        ctx.fill();

        // Subtle glow for near-layer nodes
        if (node.layer === 2 && glowAlpha > 0.05) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 4, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            node.x, node.y, node.radius,
            node.x, node.y, node.radius + 8
          );
          gradient.addColorStop(0, `rgba(${PHOSPHOR.r}, ${PHOSPHOR.g}, ${PHOSPHOR.b}, ${glowAlpha * 0.3})`);
          gradient.addColorStop(1, `rgba(${PHOSPHOR.r}, ${PHOSPHOR.g}, ${PHOSPHOR.b}, 0)`);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      }

      // Draw a few orbital ring hints (very subtle)
      const cx = w * 0.58;
      const cy = h * 0.48;
      for (let r = 0; r < 3; r++) {
        const ringRadius = 80 + r * 100;
        ctx.beginPath();
        ctx.ellipse(cx, cy, ringRadius, ringRadius * 0.55, 0.15, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${PHOSPHOR.r}, ${PHOSPHOR.g}, ${PHOSPHOR.b}, ${0.03 - r * 0.005})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      if (!reducedMotion) {
        animRef.current = requestAnimationFrame(draw);
      }
    };

    // Start animation
    animRef.current = requestAnimationFrame(draw);

    // If reduced motion, draw a single static frame
    if (reducedMotion) {
      draw(0);
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (reducedMotion) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handlePointerLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [handleResize]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
      }}
      aria-hidden="true"
    />
  );
};

export default OrbitalCanvas;
