import React, { useState } from 'react';
import { motion } from 'motion/react';
import { playBucketScoop, playWaterSplash } from '../utils/audio';

interface InteractiveBucketProps {
  onPour: () => void;
  onScoop: () => void;
  onReset: () => void;
  disabled?: boolean;
  mode?: 'add' | 'remove' | 'both';
  bucketCount?: number;
  label?: string;
}

export const InteractiveBucket: React.FC<InteractiveBucketProps> = ({
  onPour,
  onScoop,
  onReset,
  disabled = false,
  mode = 'both',
  bucketCount = 0,
  label,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [bucketState, setBucketState] = useState<'empty' | 'full'>('full');

  const handlePourClick = () => {
    if (disabled) return;
    playWaterSplash();
    setBucketState('empty');
    onPour();
    setTimeout(() => {
      setBucketState('full');
    }, 600);
  };

  const handleScoopClick = () => {
    if (disabled) return;
    playBucketScoop();
    setBucketState('full');
    onScoop();
    setTimeout(() => {
      setBucketState('empty');
    }, 600);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col items-center">
      {/* Title / Instruction */}
      <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between w-full">
        <span>{label || 'Alat Ember (1 Ember = 1 Satuan)'}</span>
        {bucketCount > 0 && (
          <span className="text-[11px] font-mono bg-sky-50 text-sky-700 px-2 py-0.5 rounded font-bold">
            Sudah digunakan: {bucketCount}x
          </span>
        )}
      </div>

      {/* Bucket Visual Display */}
      <div
        className="relative my-2 w-28 h-28 flex items-center justify-center cursor-pointer select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.svg
          viewBox="0 0 100 100"
          className="w-24 h-24 filter drop-shadow-md"
          animate={{
            rotate: isHovered ? [0, -6, 6, 0] : 0,
            y: isHovered ? -4 : 0,
          }}
          transition={{ duration: 0.6 }}
        >
          {/* Metal Handle */}
          <path
            d="M 22,40 Q 50,6 78,40"
            fill="none"
            stroke="#64748b"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Bucket Body */}
          <path
            d="M 25,38 L 32,86 Q 50,90 68,86 L 75,38 Z"
            fill="#0284c7"
            stroke="#0369a1"
            strokeWidth="2.5"
          />

          {/* Bucket Rim */}
          <ellipse cx="50" cy="38" rx="25" ry="7" fill="#0369a1" />

          {/* Water inside bucket */}
          {bucketState === 'full' && (
            <ellipse cx="50" cy="40" rx="22" ry="5.5" fill="#38bdf8" />
          )}

          {/* Bucket rib bands */}
          <path
            d="M 28,62 Q 50,67 72,62"
            fill="none"
            stroke="#0369a1"
            strokeWidth="1.5"
            opacity="0.6"
          />

          {/* Handle pivot hinges */}
          <circle cx="22" cy="40" r="3" fill="#475569" />
          <circle cx="78" cy="40" r="3" fill="#475569" />
        </motion.svg>

        {/* Small floating badge */}
        <div className="absolute -bottom-1 bg-slate-800 text-white text-[10px] font-mono px-2 py-0.5 rounded-full shadow-xs">
          1 Ember
        </div>
      </div>

      <p className="text-[11px] text-slate-500 text-center mb-3">
        {mode === 'add'
          ? 'Klik tombol tuang untuk menambahkan 1 satuan air.'
          : mode === 'remove'
          ? 'Klik tombol ciduk untuk mengambil 1 satuan air.'
          : 'Pilih aksi untuk mengubah jumlah air kolam.'}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 justify-center w-full">
        {(mode === 'add' || mode === 'both') && (
          <button
            onClick={handlePourClick}
            disabled={disabled}
            className="flex-1 min-w-[120px] py-2 px-3 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 active:scale-97 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-xs transition flex items-center justify-center gap-1.5"
          >
            <span>+ Tuang 1 Ember</span>
          </button>
        )}

        {(mode === 'remove' || mode === 'both') && (
          <button
            onClick={handleScoopClick}
            disabled={disabled}
            className="flex-1 min-w-[120px] py-2 px-3 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-97 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-xs transition flex items-center justify-center gap-1.5"
          >
            <span>- Ambil 1 Ember</span>
          </button>
        )}

        <button
          onClick={onReset}
          disabled={disabled}
          title="Kembalikan posisi air ke 0"
          className="py-2 px-3 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 active:scale-97 rounded-lg transition"
        >
          Reset (0)
        </button>
      </div>
    </div>
  );
};
