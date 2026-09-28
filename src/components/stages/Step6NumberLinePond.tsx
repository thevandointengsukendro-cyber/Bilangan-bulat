import React, { useState } from 'react';
import { PondIllustration } from '../PondIllustration';
import { NumberLineVisualizer } from '../NumberLineVisualizer';
import { InteractiveBucket } from '../InteractiveBucket';
import { ArrowRight, Compass, ArrowRightLeft, CheckCircle2 } from 'lucide-react';
import { playWaterSplash, playBucketScoop } from '../../utils/audio';

interface Step6NumberLinePondProps {
  onComplete: () => void;
}

export const Step6NumberLinePond: React.FC<Step6NumberLinePondProps> = ({ onComplete }) => {
  const [level, setLevel] = useState<number>(0);
  const [prevLevel, setPrevLevel] = useState<number>(0);
  const [isPouring, setIsPouring] = useState<boolean>(false);
  const [isScooping, setIsScooping] = useState<boolean>(false);
  const [exploredRight, setExploredRight] = useState(false);
  const [exploredLeft, setExploredLeft] = useState(false);

  const handleAdd = () => {
    if (level < 5) {
      setIsPouring(true);
      playWaterSplash();
      setPrevLevel(level);
      const next = level + 1;
      setLevel(next);
      if (next > 0) setExploredRight(true);
      setTimeout(() => setIsPouring(false), 400);
    }
  };

  const handleRemove = () => {
    if (level > -5) {
      setIsScooping(true);
      playBucketScoop();
      setPrevLevel(level);
      const next = level - 1;
      setLevel(next);
      if (next < 0) setExploredLeft(true);
      setTimeout(() => setIsScooping(false), 400);
    }
  };

  const handleReset = () => {
    setPrevLevel(level);
    setLevel(0);
  };

  const canProceed = exploredRight && exploredLeft;

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Title */}
      <div className="border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
          <Compass className="w-4 h-4" />
          <span>Tahap 6: Representasi Ganda Kolam & Garis Bilangan</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">
          Menghubungkan Permukaan Air dengan Garis Bilangan
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Perhatikan keselarasan antara ketinggian air di kolam dan arah pergerakan titik pada garis bilangan!
        </p>
      </div>

      {/* Synchronous Comparison Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Pond on Left */}
        <div className="md:col-span-6 flex flex-col items-center">
          <PondIllustration
            level={level}
            isPouring={isPouring}
            isScooping={isScooping}
            title="Representasi 1: Ketinggian Kolam"
            subtitle="Air naik (positif) atau turun (negatif)"
            size="md"
          />
        </div>

        {/* Controls and Concept on Right */}
        <div className="md:col-span-6 space-y-4">
          <InteractiveBucket
            onPour={handleAdd}
            onScoop={handleRemove}
            onReset={handleReset}
            mode="both"
            label="Eksplorasi Gerak Kolam & Garis Bilangan"
          />

          {/* Dual representation rules */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3 text-xs">
            <div className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
              <ArrowRightLeft className="w-4 h-4 text-sky-600" />
              <span>Dua Bahasa yang Sama:</span>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 bg-sky-50 rounded-lg border border-sky-200 flex items-start gap-2">
                <span className="text-base">💧</span>
                <div>
                  <strong className="text-sky-900 block">Air Bertambah (Kolam Naik):</strong>
                  <span className="text-slate-600">
                    Pada garis bilangan, titik bergerak dari 0 <strong>ke arah kanan</strong> (menuju bilangan positif).
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-200 flex items-start gap-2">
                <span className="text-base">🪣</span>
                <div>
                  <strong className="text-rose-900 block">Air Berkurang (Kolam Turun):</strong>
                  <span className="text-slate-600">
                    Pada garis bilangan, titik bergerak dari 0 <strong>ke arah kiri</strong> (menuju bilangan negatif).
                  </span>
                </div>
              </div>
            </div>

            {/* Checklist of exploration */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className={exploredRight ? 'text-emerald-700 font-semibold' : ''}>
                {exploredRight ? '✓ Telah mencoba ke kanan (+)' : '○ Coba tuang air (+)'}
              </span>
              <span className={exploredLeft ? 'text-emerald-700 font-semibold' : ''}>
                {exploredLeft ? '✓ Telah mencoba ke kiri (-)' : '○ Coba ambil air (-)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Synchronous Live Number Line (Full Width at Bottom) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-800">
            Representasi 2: Garis Bilangan
          </span>
          <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2 py-1 rounded">
            Nilai saat ini: {level > 0 ? `+${level}` : level}
          </span>
        </div>

        <NumberLineVisualizer
          currentValue={level}
          fromValue={prevLevel}
          min={-5}
          max={5}
        />
      </div>

      {/* Next Step Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onComplete}
          disabled={!canProceed}
          className="py-3 px-6 rounded-xl font-bold text-white bg-sky-600 hover:bg-sky-700 active:scale-98 disabled:opacity-40 disabled:pointer-events-none shadow-sm transition flex items-center gap-2 text-sm"
        >
          <span>Lanjut ke Tahap 7: Membandingkan Dua Bilangan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
