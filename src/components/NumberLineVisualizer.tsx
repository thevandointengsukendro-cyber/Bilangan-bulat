import React from 'react';
import { motion } from 'motion/react';

interface NumberLineVisualizerProps {
  currentValue?: number;
  fromValue?: number; // if showing transition arc, e.g. from 0 to 3
  compareA?: number; // for comparison stage
  compareB?: number; // for comparison stage
  labelA?: string;
  labelB?: string;
  min?: number;
  max?: number;
  showJumpArc?: boolean;
  className?: string;
}

export const NumberLineVisualizer: React.FC<NumberLineVisualizerProps> = ({
  currentValue,
  fromValue,
  compareA,
  compareB,
  labelA = 'Kolam A',
  labelB = 'Kolam B',
  min = -5,
  max = 5,
  showJumpArc = true,
  className = '',
}) => {
  // Generate numbers array
  const numbers: number[] = [];
  for (let i = min; i <= max; i++) {
    numbers.push(i);
  }

  const totalPoints = max - min;
  const getPercent = (val: number) => {
    return ((val - min) / totalPoints) * 100;
  };

  const isCompareMode = compareA !== undefined && compareB !== undefined;

  return (
    <div className={`w-full bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs ${className}`}>
      {/* Header explanation */}
      <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-3 px-1">
        <div className="flex items-center gap-1.5 text-rose-600">
          <span>←</span>
          <span>Semakin ke kiri: Semakin kecil (Negatif)</span>
        </div>
        <div className="flex items-center gap-1.5 text-sky-600">
          <span>Semakin ke kanan: Semakin besar (Positif)</span>
          <span>→</span>
        </div>
      </div>

      {/* Number Line Track Area */}
      <div className="relative pt-8 pb-7 px-4 select-none">
        {/* Main horizontal line axis */}
        <div className="absolute top-[48px] left-4 right-4 h-1 bg-slate-300 rounded-full">
          {/* Left Arrow head */}
          <div className="absolute -left-2 -top-1 border-t-4 border-r-6 border-b-4 border-t-transparent border-b-transparent border-r-slate-400" />
          {/* Right Arrow head */}
          <div className="absolute -right-2 -top-1 border-t-4 border-l-6 border-b-4 border-t-transparent border-b-transparent border-l-slate-400" />
        </div>

        {/* Jump Arc (if fromValue is specified and different from currentValue) */}
        {!isCompareMode && showJumpArc && fromValue !== undefined && currentValue !== undefined && fromValue !== currentValue && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ height: '90px' }}>
            {(() => {
              const startPct = getPercent(fromValue);
              const endPct = getPercent(currentValue);
              const delta = currentValue - fromValue;
              const isPositive = delta > 0;
              const color = isPositive ? '#0284c7' : '#e11d48';

              return (
                <g>
                  {/* Jump curved indicator arc */}
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.85 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    d={`M ${startPct}%,48 Q ${(startPct + endPct) / 2}%,12 ${endPct}%,44`}
                    fill="none"
                    stroke={color}
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                  />
                  {/* Label badge above arc */}
                  <foreignObject
                    x={`calc(${(startPct + endPct) / 2}% - 28px)`}
                    y="2"
                    width="56"
                    height="24"
                  >
                    <div className="flex items-center justify-center">
                      <span
                        className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded shadow-xs"
                        style={{
                          backgroundColor: isPositive ? '#e0f2fe' : '#ffe4e6',
                          color: isPositive ? '#0369a1' : '#be123c',
                        }}
                      >
                        {isPositive ? `+${delta}` : delta}
                      </span>
                    </div>
                  </foreignObject>
                </g>
              );
            })()}
          </svg>
        )}

        {/* Ticks and Numbers */}
        <div className="relative flex justify-between items-center z-10">
          {numbers.map((num) => {
            const isZero = num === 0;
            const isCurrent = !isCompareMode && currentValue === num;
            const isA = isCompareMode && compareA === num;
            const isB = isCompareMode && compareB === num;

            return (
              <div
                key={num}
                className="flex flex-col items-center group relative cursor-default"
                style={{ width: `${100 / numbers.length}%` }}
              >
                {/* Tick bar */}
                <div
                  className={`w-0.5 transition-all ${
                    isZero
                      ? 'h-5 bg-amber-500 -mt-1'
                      : isCurrent || isA || isB
                      ? 'h-5 bg-sky-600 -mt-1 w-1'
                      : 'h-3 bg-slate-300'
                  }`}
                />

                {/* Number text */}
                <span
                  className={`mt-2 font-mono text-xs tabular-nums transition-colors ${
                    isZero
                      ? 'font-bold text-amber-600 scale-110'
                      : isCurrent
                      ? 'font-bold text-sky-700 scale-115'
                      : isA
                      ? 'font-bold text-sky-600 scale-115'
                      : isB
                      ? 'font-bold text-amber-600 scale-115'
                      : num < 0
                      ? 'text-slate-500'
                      : 'text-slate-600'
                  }`}
                >
                  {num}
                </span>

                {/* Zero label helper */}
                {isZero && (
                  <span className="absolute -bottom-5 text-[10px] text-amber-600 font-semibold whitespace-nowrap">
                    Pusat (0)
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Dynamic Marker for Single Value Mode */}
        {!isCompareMode && currentValue !== undefined && (
          <motion.div
            className="absolute top-1 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20"
            animate={{ left: `${getPercent(currentValue)}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className={`px-2 py-0.5 rounded text-xs font-mono font-bold shadow-sm ${
              currentValue > 0 
                ? 'bg-sky-600 text-white' 
                : currentValue === 0 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-rose-600 text-white'
            }`}>
              {currentValue > 0 ? `+${currentValue}` : currentValue}
            </div>
            <div className={`w-0 h-0 border-l-4 border-r-4 border-t-5 border-l-transparent border-r-transparent ${
              currentValue > 0 ? 'border-t-sky-600' : currentValue === 0 ? 'border-t-amber-500' : 'border-t-rose-600'
            }`} />
          </motion.div>
        )}

        {/* Markers for Comparison Mode */}
        {isCompareMode && (
          <>
            {/* Marker A */}
            <motion.div
              className="absolute top-0 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20"
              animate={{ left: `${getPercent(compareA!)}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="px-2 py-0.5 rounded bg-sky-600 text-white text-[11px] font-mono font-bold shadow-sm whitespace-nowrap flex items-center gap-1">
                <span>{labelA}:</span>
                <span>{compareA! > 0 ? `+${compareA}` : compareA}</span>
              </div>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-sky-600" />
            </motion.div>

            {/* Marker B */}
            <motion.div
              className="absolute top-0 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20"
              animate={{ left: `${getPercent(compareB!)}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="px-2 py-0.5 rounded bg-amber-600 text-white text-[11px] font-mono font-bold shadow-sm whitespace-nowrap flex items-center gap-1">
                <span>{labelB}:</span>
                <span>{compareB! > 0 ? `+${compareB}` : compareB}</span>
              </div>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-amber-600" />
            </motion.div>
          </>
        )}
      </div>

      {/* Comparison relation highlight banner */}
      {isCompareMode && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-center text-xs text-slate-600 font-medium">
          {compareA === compareB ? (
            <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
              Kedua bilangan menempati titik yang sama persis: {compareA} = {compareB}
            </span>
          ) : compareA! < compareB! ? (
            <span className="text-slate-700">
              <strong className="text-amber-700">{labelB} ({compareB})</strong> berada di sebelah{' '}
              <strong className="text-emerald-700">KANAN</strong> dari{' '}
              <strong className="text-sky-700">{labelA} ({compareA})</strong> → {compareA} &lt; {compareB}
            </span>
          ) : (
            <span className="text-slate-700">
              <strong className="text-sky-700">{labelA} ({compareA})</strong> berada di sebelah{' '}
              <strong className="text-emerald-700">KANAN</strong> dari{' '}
              <strong className="text-amber-700">{labelB} ({compareB})</strong> → {compareA} &gt; {compareB}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
