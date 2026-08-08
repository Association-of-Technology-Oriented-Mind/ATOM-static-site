import React, { useEffect, useState, useMemo } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

interface ClockCountdownProps {
  targetDate: Date;
  size?: "sm" | "md" | "lg";
}

/**
 * Holographic Disk Countdown
 * - Four concentric rings show progress of Days / Hours / Minutes / Seconds
 * - Smooth Framer Motion animations
 * - Clean, compact digital readout
 *
 * Props:
 * - targetDate: Date (required)
 * - size: 'sm'|'md'|'lg' (optional)
 */
const ClockCountdown: React.FC<ClockCountdownProps> = ({ targetDate, size = "md" }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
  });

  // Update countdown every second
  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const diff = Math.max(0, targetDate.getTime() - now.getTime());

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      // For days arc scaling: pick an upper bound for days visualization.
      // If the event is far out, clamp to a sensible max (e.g., 365 days).
      const totalDays = Math.min(365, Math.max(1, days || 1));

      setTimeLeft({ days, hours, minutes, seconds, totalDays });
    };

    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  // Geometry config per size
  const config = useMemo(() => {
    return {
      sm: { svg: 160, strokeGap: 8, ringWidth: 6, font: "text-xs", digits: "text-sm" },
      md: { svg: 220, strokeGap: 10, ringWidth: 8, font: "text-sm", digits: "text-lg" },
      lg: { svg: 280, strokeGap: 12, ringWidth: 10, font: "text-base", digits: "text-xl" },
    }[size];
  }, [size]);

  const viewBox = config.svg;
  const center = viewBox / 2;

  // Base radii for 4 rings (outermost = days, then hours, minutes, seconds)
  const gap = config.strokeGap;
  const ringWidth = config.ringWidth;
  const outerRadius = (viewBox / 2) - ringWidth; // leave margin
  const radii = [
    outerRadius,
    outerRadius - (ringWidth + gap),
    outerRadius - 2 * (ringWidth + gap),
    outerRadius - 3 * (ringWidth + gap),
  ];

  // Circumferences for each ring
  const circumferences = radii.map((r) => 2 * Math.PI * r);

  // Percent progress for each unit (0..1)
  const secondPct = timeLeft.seconds / 60;
  const minutePct = timeLeft.minutes / 60 + secondPct / 60; // smooth minute progress
  const hourPct = (timeLeft.hours % 24) / 24 + minutePct / 24; // smooth hour progress
  const dayPct = Math.min(1, timeLeft.days / Math.max(1, timeLeft.totalDays)); // days normalized to totalDays

  // Motion values for smooth SVG stroke animation
  const secMv = useMotionValue(secondPct);
  const minMv = useMotionValue(minutePct);
  const hourMv = useMotionValue(hourPct);
  const dayMv = useMotionValue(dayPct);

  // animate motion values on change
  useEffect(() => {
    secMv.set(secondPct);
    minMv.set(minutePct);
    hourMv.set(hourPct);
    dayMv.set(dayPct);
  }, [secondPct, minutePct, hourPct, dayPct, secMv, minMv, hourMv, dayMv]);

  // convert motion value to strokeDashoffset string transform for SVG
  const dayOffset = useTransform(dayMv, (v: number) => `${(1 - v) * circumferences[0]}`);
  const hourOffset = useTransform(hourMv, (v: number) => `${(1 - v) * circumferences[1]}`);
  const minuteOffset = useTransform(minMv, (v: number) => `${(1 - v) * circumferences[2]}`);
  const secondOffset = useTransform(secMv, (v: number) => `${(1 - v) * circumferences[3]}`);

  // Colors for rings (holographic palette)
  const colors = {
    days: "url(#gradDays)",
    hours: "url(#gradHours)",
    minutes: "url(#gradMinutes)",
    seconds: "url(#gradSeconds)",
  };

  // Small helper to format numbers with leading zeros
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative flex items-center justify-center"
        style={{ width: viewBox, height: viewBox }}
        aria-hidden
      >
        {/* Holographic rotating aura */}
        <motion.div
          aria-hidden
          className="absolute rounded-full pointer-events-none"
          style={{
            width: viewBox * 1.18,
            height: viewBox * 1.18,
            filter: "blur(28px)",
            background: "conic-gradient(from 180deg at 50% 50%, rgba(0,255,255,0.06), rgba(200,100,255,0.04), rgba(0,160,255,0.04))",
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
        />

        {/* SVG Disk */}
        <svg width={viewBox} height={viewBox} viewBox={`0 0 ${viewBox} ${viewBox}`} role="img" aria-label="Holographic countdown disk">
          <defs>
            {/* Gradients */}
            <linearGradient id="gradDays" x1="0" x2="1">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="50%" stopColor="#5EEAD4" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
            <linearGradient id="gradHours" x1="0" x2="1">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
            <linearGradient id="gradMinutes" x1="0" x2="1">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient id="gradSeconds" x1="0" x2="1">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#FB7185" />
            </linearGradient>

            {/* subtle glow filter for rings */}
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Subtle backdrop disc for depth */}
          <circle cx={center} cy={center} r={outerRadius + ringWidth} fill="rgba(6,8,20,0.6)" />

          {/* Days ring (outermost) */}
          <g transform={`translate(${center}, ${center})`}>
            <circle
              r={radii[0]}
              cx={0}
              cy={0}
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth={ringWidth}
            />
            <motion.circle
              r={radii[0]}
              cx={0}
              cy={0}
              fill="none"
              stroke={colors.days}
              strokeWidth={ringWidth}
              strokeLinecap="round"
              strokeDasharray={circumferences[0]}
              strokeDashoffset={dayOffset}
              style={{ filter: "drop-shadow(0 6px 10px rgba(124,58,237,0.12))" }}
              transform="rotate(-90)"
              strokeOpacity={0.95}
            />
          </g>

          {/* Hours ring */}
          <g transform={`translate(${center}, ${center})`}>
            <circle
              r={radii[1]}
              cx={0}
              cy={0}
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth={ringWidth}
            />
            <motion.circle
              r={radii[1]}
              cx={0}
              cy={0}
              fill="none"
              stroke={colors.hours}
              strokeWidth={ringWidth}
              strokeLinecap="round"
              strokeDasharray={circumferences[1]}
              strokeDashoffset={hourOffset}
              transform="rotate(-90)"
              strokeOpacity={0.95}
            />
          </g>

          {/* Minutes ring */}
          <g transform={`translate(${center}, ${center})`}>
            <circle
              r={radii[2]}
              cx={0}
              cy={0}
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth={ringWidth}
            />
            <motion.circle
              r={radii[2]}
              cx={0}
              cy={0}
              fill="none"
              stroke={colors.minutes}
              strokeWidth={ringWidth}
              strokeLinecap="round"
              strokeDasharray={circumferences[2]}
              strokeDashoffset={minuteOffset}
              transform="rotate(-90)"
              strokeOpacity={0.98}
            />
          </g>

          {/* Seconds ring (innermost) */}
          <g transform={`translate(${center}, ${center})`}>
            <circle
              r={radii[3]}
              cx={0}
              cy={0}
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth={ringWidth}
            />
            <motion.circle
              r={radii[3]}
              cx={0}
              cy={0}
              fill="none"
              stroke={colors.seconds}
              strokeWidth={ringWidth}
              strokeLinecap="round"
              strokeDasharray={circumferences[3]}
              strokeDashoffset={secondOffset}
              transform="rotate(-90)"
              strokeOpacity={1}
            />
          </g>

          {/* central accent: small holographic core */}
          <g transform={`translate(${center}, ${center})`}>
            <circle r={Math.max(4, ringWidth / 2)} fill="#0ea5b5" opacity={0.95} />
            <circle r={Math.max(9, ringWidth)} fill="rgba(14,165,185,0.06)" filter="url(#softGlow)" />
          </g>
        </svg>

        {/* Light particle highlights (decorative small orbs) */}
        <motion.div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            width: viewBox,
            height: viewBox,
            display: "block",
          }}
          animate={{ rotate: -18 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {/* positioned small orbs using absolute positioning inside this wrapper */}
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <div style={{ position: "absolute", left: "18%", top: "12%", width: 8, height: 8, borderRadius: 999, background: "rgba(96,165,250,0.85)", filter: "blur(6px)" }} />
            <div style={{ position: "absolute", left: "78%", top: "30%", width: 6, height: 6, borderRadius: 999, background: "rgba(99,102,241,0.9)", filter: "blur(6px)" }} />
            <div style={{ position: "absolute", left: "62%", top: "72%", width: 6, height: 6, borderRadius: 999, background: "rgba(52,211,153,0.85)", filter: "blur(6px)" }} />
          </div>
        </motion.div>
      </div>

      {/* Digital readout (compact glass card) */}
      <div className="flex items-center gap-4 bg-slate-900/60 border border-cyan-500/10 px-4 py-2 rounded-xl shadow-[0_8px_24px_rgba(2,6,23,0.6)] backdrop-blur-md">
        {[
          { key: "days", label: "D", value: timeLeft.days, color: "text-indigo-300" },
          { key: "hours", label: "H", value: timeLeft.hours, color: "text-cyan-300" },
          { key: "minutes", label: "M", value: timeLeft.minutes, color: "text-emerald-300" },
          { key: "seconds", label: "S", value: timeLeft.seconds, color: "text-pink-300" },
        ].map((it, idx) => (
          <div key={it.key} className="flex flex-col items-center px-2">
            <motion.span
              className={`font-mono font-semibold ${it.color} text-lg`}
              initial={{ scale: 0.9, opacity: 0.85 }}
              animate={{ scale: [1, 1.03, 1], opacity: [1, 0.95, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: idx * 0.15 }}
            >
              {pad(it.value)}
            </motion.span>
            <span className="text-[10px] tracking-widest text-slate-400/75 uppercase mt-0.5">{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};


export default ClockCountdown;
