import React, { useState } from 'react';
import { PondIllustration } from '../PondIllustration';
import { InteractiveBucket } from '../InteractiveBucket';
import { NumberLineVisualizer } from '../NumberLineVisualizer';
import { ArrowRight, PlusCircle, CheckCircle, HelpCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccess, playWaterSplash, playHint } from '../../utils/audio';

interface Step2AddWaterProps {
  onComplete: () => void;
}

export const Step2AddWater: React.FC<Step2AddWaterProps> = ({ onComplete }) => {
  const [waterLevel, setWaterLevel] = useState<number>(0);
  const [history, setHistory] = useState<number[]>([0]);
  const [isPouring, setIsPouring] = useState<boolean>(false);
  const [bucketCount, setBucketCount] = useState<number>(0);

  // Math form state
  const [studentTimesAdded, setStudentTimesAdded] = useState<string>('');
  const [selectedSign, setSelectedSign] = useState<string>('');
  const [inputBuckets, setInputBuckets] = useState<string>('');
  const [inputResult, setInputResult] = useState<string>('');
  const [isFormEvaluated, setIsFormEvaluated] = useState<boolean>(false);
  const [isFormCorrect, setIsFormCorrect] = useState<boolean>(false);

  const handlePourWater = () => {
    if (waterLevel < 5) {
      setIsPouring(true);
      playWaterSplash();
      const nextLevel = waterLevel + 1;
      setWaterLevel(nextLevel);
      setHistory((prev) => [...prev, nextLevel]);
      setBucketCount((prev) => prev + 1);
      setTimeout(() => setIsPouring(false), 500);
    }
  };

  const handleReset = () => {
    setWaterLevel(0);
    setHistory([0]);
    setBucketCount(0);
    setIsFormEvaluated(false);
    setIsFormCorrect(false);
    setStudentTimesAdded('');
    setSelectedSign('');
    setInputBuckets('');
    setInputResult('');
  };

  const handleCheckForm = () => {
    const isTimesMatch = parseInt(studentTimesAdded) === bucketCount;
    const isSignPlus = selectedSign === '+';
    const isBucketsMatch = parseInt(inputBuckets) === bucketCount;
    const isResultMatch = parseInt(inputResult) === bucketCount;

    const correct = isTimesMatch && isSignPlus && isBucketsMatch && isResultMatch && bucketCount > 0;
    setIsFormCorrect(correct);
    setIsFormEvaluated(true);

    if (correct) {
      playSuccess();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } else {
      playHint();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Title */}
      <div className="border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
          <PlusCircle className="w-4 h-4 text-sky-600" />
          <span>Tahap 2: Aktivitas Menambahkan Air</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">
          Menuangkan Ember ke Dalam Kolam
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Kondisi awal kolam berada di posisi 0. Tuangkan ember air ke dalam kolam dan amati perubahan angka secara bertahap.
        </p>
      </div>

      {/* Interactive Simulation Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Pond Visualizer */}
        <div className="md:col-span-7 flex flex-col items-center">
          <PondIllustration
            level={waterLevel}
            isPouring={isPouring}
            title="Kolam Air Andi"
            subtitle="Air bertambah dari posisi 0 menuju bilangan positif"
            size="md"
          />

          {/* Realtime Number Line representation */}
          <div className="w-full mt-4">
            <NumberLineVisualizer
              currentValue={waterLevel}
              fromValue={history.length > 1 ? history[history.length - 2] : 0}
              min={-5}
              max={5}
            />
          </div>
        </div>

        {/* Bucket Tool & Progressive History */}
        <div className="md:col-span-5 space-y-4">
          <InteractiveBucket
            onPour={handlePourWater}
            onScoop={() => {}}
            onReset={handleReset}
            mode="add"
            bucketCount={bucketCount}
            disabled={waterLevel >= 5}
            label="Tuangkan Air ke Kolam"
          />

          {/* Progressive Change Track (0 -> 1 -> 2 -> 3) */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-2">
            <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Jejak Perubahan Bertahap:</span>
              <span className="text-[11px] text-sky-600 font-mono">Bukan langsung melompat!</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap font-mono text-sm py-1">
              {history.map((lvl, index) => (
                <React.Fragment key={index}>
                  <span
                    className={`px-2 py-0.5 rounded font-bold transition-all ${
                      index === history.length - 1
                        ? 'bg-sky-600 text-white shadow-xs scale-105'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {lvl > 0 ? `+${lvl}` : lvl}
                  </span>
                  {index < history.length - 1 && (
                    <span className="text-slate-400 font-sans">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            <p className="text-[11px] text-slate-500">
              Setiap 1 kali tuang: air mengalir, permukaan kolam naik, dan bilangan bertambah 1 satuan ke arah positif (+).
            </p>
          </div>
        </div>
      </div>

      {/* Reflection & Writing the Math Operation */}
      {bucketCount > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Tuliskan Bentuk Matematika Berdasarkan Aktivitasmu:</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Question 1 */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">
                1. Berapa kali kamu menambahkan air ke dalam kolam?
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={studentTimesAdded}
                  onChange={(e) => setStudentTimesAdded(e.target.value)}
                  placeholder="Contoh: 3"
                  className="w-32 px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-mono focus:border-sky-500 focus:outline-none"
                />
                <span className="text-slate-500">kali (ember)</span>
              </div>
            </div>

            {/* Question 2 */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">
                2. Tuliskan bentuk operasi matematikanya:
              </label>
              <div className="flex items-center gap-1.5 font-mono text-sm">
                <span className="font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded">0</span>
                
                {/* Sign Selector */}
                <select
                  value={selectedSign}
                  onChange={(e) => setSelectedSign(e.target.value)}
                  className="border border-slate-300 rounded-lg px-2 py-1 font-bold text-slate-800 bg-white focus:border-sky-500 focus:outline-none text-sm"
                >
                  <option value="">(Tanda?)</option>
                  <option value="+">+</option>
                  <option value="-">-</option>
                </select>

                {/* Bucket Count Input */}
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={inputBuckets}
                  onChange={(e) => setInputBuckets(e.target.value)}
                  placeholder="Jumlah"
                  className="w-16 px-2 py-1 border border-slate-300 rounded-lg text-center text-sm font-mono focus:border-sky-500 focus:outline-none"
                />

                <span className="font-bold text-slate-700">=</span>

                {/* Result Input */}
                <input
                  type="number"
                  min="-10"
                  max="10"
                  value={inputResult}
                  onChange={(e) => setInputResult(e.target.value)}
                  placeholder="Hasil"
                  className="w-16 px-2 py-1 border border-slate-300 rounded-lg text-center text-sm font-mono focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Check Button */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleCheckForm}
              className="py-2 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition"
            >
              Periksa Bentuk Matematika
            </button>

            {isFormEvaluated && (
              <div className="text-xs">
                {isFormCorrect ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Bagus sekali! Karena air bertambah, kita gunakan tanda (+) sebanyak {bucketCount} ember: 0 + {bucketCount} = {bucketCount}.
                  </span>
                ) : (
                  <span className="text-rose-600 font-semibold flex items-center gap-1">
                    Periksa kembali: kamu telah menuang {bucketCount} ember air. Gunakan tanda (+) karena air bertambah!
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl text-xs text-sky-900 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-sky-600 shrink-0" />
          <span>
            Silakan klik tombol <strong>&ldquo;+ Tuang 1 Ember&rdquo;</strong> di atas minimal 1 kali untuk melihat air naik dan memulai penulisan operasi matematika.
          </span>
        </div>
      )}

      {/* Next Step Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onComplete}
          disabled={!isFormCorrect}
          className="py-3 px-6 rounded-xl font-bold text-white bg-sky-600 hover:bg-sky-700 active:scale-98 disabled:opacity-40 disabled:pointer-events-none shadow-sm transition flex items-center gap-2 text-sm"
        >
          <span>Lanjut ke Tahap 3: Mengurangi Air</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
