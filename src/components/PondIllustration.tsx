import React, { useMemo, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PondIllustrationProps {
  level: number; // e.g. -5 to +5
  maxLevel?: number;
  minLevel?: number;
  isPouring?: boolean;
  isScooping?: boolean;
  title?: string;
  subtitle?: string;
  showRuler?: boolean;
  showFish?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PondIllustration: React.FC<PondIllustrationProps> = ({
  level,
  maxLevel = 5,
  minLevel = -5,
  isPouring = false,
  isScooping = false,
  title,
  subtitle,
  showRuler = true,
  showFish = true,
  className = '',
  size = 'md',
}) => {
  const reactId = useId();
  const safeId = useMemo(() => reactId.replace(/[^a-zA-Z0-9_-]/g, '_'), [reactId]);
  const waterGradId = `waterGrad_${safeId}`;
  const basinClipId = `pondBasinClip_${safeId}`;

  // SVG Coordinates
  // Baseline 0 is at y = 180
  // Bottom of pond is at y = 285
  // Top of pond is at y = 75
  const zeroY = 180;
  const bottomY = 285;
  const topY = 75;
  const unitPx = (zeroY - topY) / maxLevel; // e.g. 105 / 5 = 21px per unit

  // Clamp level
  const clampedLevel = Math.max(minLevel, Math.min(maxLevel, level));
  const waterSurfaceY = zeroY - clampedLevel * unitPx;
  const waterHeight = Math.max(8, bottomY - waterSurfaceY);

  // Ruler ticks
  const ticks = useMemo(() => {
    const list: number[] = [];
    for (let i = maxLevel; i >= minLevel; i--) {
      list.push(i);
    }
    return list;
  }, [maxLevel, minLevel]);

  // Vibrant, crystal clear water colors (always clear blue, never black)
  const waterColorStart = clampedLevel > 0 
    ? '#67e8f9' // bright cyan blue
    : clampedLevel === 0 
      ? '#38bdf8' // clear sky blue
      : '#0ea5e9'; // clear azure blue
  const waterColorEnd = clampedLevel > 0 
    ? '#0284c7' // rich blue
    : clampedLevel === 0 
      ? '#0369a1' // deep blue
      : '#075985'; // clear navy blue (never black)

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Header labels if provided */}
      {(title || subtitle) && (
        <div className="mb-2 text-center">
          {title && <div className="text-base font-bold text-slate-800 tracking-tight">{title}</div>}
          {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
        </div>
      )}

      {/* SVG Container */}
      <div className={`w-full relative overflow-hidden rounded-2xl bg-gradient-to-b from-sky-50 via-slate-50 to-amber-50/30 border border-slate-200/80 shadow-inner ${
        size === 'sm' ? 'max-w-[280px]' : size === 'lg' ? 'max-w-[560px]' : 'max-w-[440px]'
      }`}>
        <svg
          viewBox="0 0 420 330"
          className="w-full h-auto block"
          role="img"
          aria-label={`Kolam air dengan level ${clampedLevel}`}
        >
          <defs>
            {/* Water gradient - safe ID without spaces */}
            <linearGradient id={waterGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={waterColorStart} stopOpacity="0.9" />
              <stop offset="100%" stopColor={waterColorEnd} stopOpacity="0.96" />
            </linearGradient>

            {/* Earth & Soil pattern */}
            <linearGradient id="soilGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="50%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>

            <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#4d7c0f" />
            </linearGradient>

            <clipPath id={basinClipId}>
              {/* Basin contour: curved trapezoid */}
              <path d="M 60,75 L 85,285 Q 210,295 335,285 L 360,75 Z" />
            </clipPath>
          </defs>

          {/* Sky background / Outdoor scene */}
          <rect x="0" y="0" width="420" height="75" fill="#f0f9ff" />
          
          {/* Subtle Sun & Clouds */}
          <circle cx="370" cy="30" r="16" fill="#fef08a" opacity="0.8" />
          <path d="M 40,25 Q 55,15 70,25 Q 85,20 95,30 Q 70,35 40,25 Z" fill="#ffffff" opacity="0.85" />
          <path d="M 280,35 Q 295,25 310,35 Q 320,30 330,40 Q 305,45 280,35 Z" fill="#ffffff" opacity="0.7" />

          {/* Grass banks on left and right */}
          <path d="M 0,65 L 60,75 L 60,330 L 0,330 Z" fill="#4d7c0f" opacity="0.9" />
          <path d="M 0,65 Q 30,62 60,75 L 55,85 L 0,85 Z" fill="url(#grassGrad)" />
          
          <path d="M 360,75 L 420,65 L 420,330 L 360,330 Z" fill="#4d7c0f" opacity="0.9" />
          <path d="M 360,75 Q 390,62 420,65 L 420,85 L 365,85 Z" fill="url(#grassGrad)" />

          {/* Soil surrounding the pond */}
          <path d="M 60,75 L 360,75 L 360,330 L 60,330 Z" fill="#573012" />
          
          {/* Stone rim around the pond top */}
          <ellipse cx="210" cy="75" rx="150" ry="12" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
          <ellipse cx="210" cy="75" rx="146" ry="9" fill="#64748b" />

          {/* Basin Interior (Natural Stone/Excavated Pool Basin) */}
          <path
            d="M 64,75 L 87,285 Q 210,295 333,285 L 356,75 Z"
            fill="#334155"
          />

          {/* Basin depth texture markings for negative zone */}
          <g opacity="0.3">
            <line x1="75" y1="200" x2="345" y2="200" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="80" y1="222" x2="340" y2="222" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="85" y1="243" x2="335" y2="243" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="90" y1="264" x2="330" y2="264" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
          </g>

          {/* WATER CLIPPED TO BASIN */}
          <g clipPath={`url(#${basinClipId})`}>
            {/* Water body */}
            <motion.rect
              x="50"
              initial={{ y: waterSurfaceY, height: waterHeight }}
              animate={{ y: waterSurfaceY, height: waterHeight }}
              transition={{ type: 'spring', damping: 20, stiffness: 120 }}
              width="320"
              fill={`url(#${waterGradId})`}
            />

            {/* Animated Water Surface Waves */}
            <motion.g
              initial={{ y: waterSurfaceY }}
              animate={{ y: waterSurfaceY }}
              transition={{ type: 'spring', damping: 20, stiffness: 120 }}
            >
              <ellipse
                cx="210"
                cy="0"
                rx="140"
                ry="8"
                fill={clampedLevel > 0 ? '#a5f3fc' : '#38bdf8'}
                opacity="0.9"
              />
              {/* Highlight shimmer line */}
              <ellipse
                cx="210"
                cy="-2"
                rx="125"
                ry="4"
                fill="#ffffff"
                opacity="0.65"
              />
            </motion.g>

            {/* Floating Fish if water is sufficient */}
            {showFish && clampedLevel >= -2 && (
              <motion.g
                initial={{ x: 180 }}
                animate={{
                  x: [150, 240, 150],
                  y: [
                    Math.min(270, Math.max(waterSurfaceY + 25, 120)),
                    Math.min(270, Math.max(waterSurfaceY + 35, 130)),
                    Math.min(270, Math.max(waterSurfaceY + 25, 120)),
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: 'easeInOut',
                }}
              >
                {/* Cute goldfish */}
                <ellipse cx="0" cy="0" rx="10" ry="5" fill="#f97316" />
                <polygon points="-8,0 -16,-5 -16,5" fill="#fb923c" />
                <circle cx="5" cy="-2" r="1.2" fill="#ffffff" />
                <circle cx="6" cy="-2" r="0.6" fill="#000000" />
              </motion.g>
            )}

            {/* Rising air bubbles in water */}
            <circle cx="160" cy={waterSurfaceY + 30} r="2" fill="#ffffff" opacity="0.6" className="animate-float-bubble" />
            <circle cx="230" cy={waterSurfaceY + 45} r="3" fill="#ffffff" opacity="0.5" className="animate-float-bubble" style={{ animationDelay: '1.2s' }} />
            <circle cx="200" cy={waterSurfaceY + 60} r="1.5" fill="#ffffff" opacity="0.6" className="animate-float-bubble" style={{ animationDelay: '0.6s' }} />
          </g>

          {/* DATUM ZERO LINE (Titik Acuan 0) */}
          <g>
            {/* Guide line across pond */}
            <line
              x1="55"
              y1={zeroY}
              x2="365"
              y2={zeroY}
              stroke="#eab308"
              strokeWidth="2.5"
              strokeDasharray="5 4"
            />
            {/* Left anchor tag */}
            <rect x="18" y={zeroY - 11} width="40" height="22" rx="4" fill="#ca8a04" />
            <text x="38" y={zeroY + 4} fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              0
            </text>
            <text x="80" y={zeroY - 5} fill="#ca8a04" fontSize="10" fontWeight="600" opacity="0.95">
              Titik Acuan (0)
            </text>
          </g>

          {/* RULER / SKALA KETINGGIAN PADA SISI KOLAM */}
          {showRuler && (
            <g className="font-mono text-xs select-none">
              {ticks.map((t) => {
                const tickY = zeroY - t * unitPx;
                const isCurrent = t === clampedLevel;
                const isZero = t === 0;
                const isPos = t > 0;

                return (
                  <g key={t}>
                    {/* Tick line on right wall */}
                    <line
                      x1="345"
                      y1={tickY}
                      x2="365"
                      y2={tickY}
                      stroke={isCurrent ? '#0284c7' : isZero ? '#eab308' : '#cbd5e1'}
                      strokeWidth={isCurrent ? '3' : '1.5'}
                    />
                    
                    {/* Number label */}
                    <text
                      x="385"
                      y={tickY + 4}
                      textAnchor="middle"
                      fill={
                        isCurrent
                          ? '#0284c7'
                          : isZero
                          ? '#a16207'
                          : isPos
                          ? '#0369a1'
                          : '#be123c'
                      }
                      fontSize={isCurrent ? '12' : '10'}
                      fontWeight={isCurrent ? 'bold' : '600'}
                    >
                      {t > 0 ? `+${t}` : t}
                    </text>

                    {/* Active arrow indicator pointing to level */}
                    {isCurrent && (
                      <polygon
                        points={`370,${tickY} 377,${tickY - 4} 377,${tickY + 4}`}
                        fill="#0284c7"
                      />
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* Pouring Animation Stream */}
          <AnimatePresence>
            {isPouring && (
              <motion.g
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Water stream from above */}
                <path
                  d={`M 260,20 Q 255,${waterSurfaceY / 2} 240,${waterSurfaceY}`}
                  stroke="#38bdf8"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.9"
                />
                <ellipse cx="240" cy={waterSurfaceY} rx="18" ry="6" fill="#7dd3fc" opacity="0.8" />
                <circle cx="230" cy={waterSurfaceY - 10} r="3" fill="#bae6fd" />
                <circle cx="255" cy={waterSurfaceY - 15} r="2.5" fill="#bae6fd" />
                {/* Tilted Bucket at top right */}
                <g transform="translate(245, 10) rotate(-35)">
                  <path d="M 0,0 L 28,0 L 24,32 L 4,32 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
                  <ellipse cx="14" cy="0" rx="14" ry="4" fill="#38bdf8" />
                </g>
              </motion.g>
            )}
          </AnimatePresence>

          {/* Scooping Animation (Ember mengambil air) */}
          <AnimatePresence>
            {isScooping && (
              <motion.g
                initial={{ opacity: 0, y: waterSurfaceY + 20 }}
                animate={{ opacity: 1, y: waterSurfaceY - 25 }}
                exit={{ opacity: 0, y: waterSurfaceY - 50 }}
                transition={{ duration: 0.4 }}
              >
                {/* Bucket dipping into water */}
                <g transform={`translate(180, ${waterSurfaceY - 20}) rotate(15)`}>
                  <path d="M 0,0 L 28,0 L 24,30 L 4,30 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
                  <ellipse cx="14" cy="2" rx="13" ry="4" fill="#38bdf8" />
                  {/* Water splash drops */}
                  <circle cx="10" cy="-6" r="2.5" fill="#38bdf8" />
                  <circle cx="26" cy="-4" r="2" fill="#38bdf8" />
                </g>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>

        {/* Current status pill overlay */}
        <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-lg px-2.5 py-1 text-xs shadow-xs flex items-center gap-1.5 font-medium">
          <span className="text-slate-500">Ketinggian:</span>
          <span className={`font-mono font-bold text-sm ${
            clampedLevel > 0 
              ? 'text-sky-700' 
              : clampedLevel === 0 
                ? 'text-amber-600' 
                : 'text-rose-600'
          }`}>
            {clampedLevel > 0 ? `+${clampedLevel}` : clampedLevel}
          </span>
          <span className="text-[11px] text-slate-400">
            {clampedLevel > 0 ? '(Positif)' : clampedLevel === 0 ? '(Titik Nol)' : '(Negatif)'}
          </span>
        </div>
      </div>
    </div>
  );
};
