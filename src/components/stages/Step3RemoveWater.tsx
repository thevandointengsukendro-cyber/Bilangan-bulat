import React, { useState } from 'react';
import { PondIllustration } from '../PondIllustration';
import { InteractiveBucket } from '../InteractiveBucket';
import { NumberLineVisualizer } from '../NumberLineVisualizer';
import { ArrowRight, MinusCircle, CheckCircle, HelpCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccess, playBucketScoop, playHint } from '../../utils/audio';

interface Step3RemoveWaterProps {
  onComplete: () => void;
}

export const Step3RemoveWater: React.FC<Step3RemoveWaterProps> = ({ onComplete }) => {
  const [waterLevel, setWaterLevel] = useState<number>(0);
  const [history, setHistory] = useState<number[]>([0]);
  const [isScooping, setIsScooping] = useState<boolean>(false);
  const [bucketCount, setBucketCount] = useState<number>(0);

  // Form state
  const [studentTimesRemoved, setStudentTimesRemoved] = useState<string>('');
  const [selectedSign, setSelectedSign] = useState<string>('');
  const [inputBuckets, setInputBuckets] = useState<string>('');
  const [inputResult, setInputResult] = useState<string>('');
  const [isFormEvaluated, setIsFormEvaluated] = useState<boolean>(false);
  const [isFormCorrect, setIsFormCorrect] = useState<boolean>(false);

  const handleScoopWater = () => {
    if (waterLevel > -5) {
      setIsScooping(true);
      playBucketScoop();
      const nextLevel = waterLevel - 1;
      setWaterLevel(nextLevel);
      setHistory((prev) => [...prev, nextLevel]);
      setBucketCount((prev) => prev + 1);
      setTimeout(() => setIsScooping(false), 500);
    }
  };

  const handleReset = () => {
    setWaterLevel(0);
    setHistory([0]);
    setBucketCount(0);
    setIsFormEvaluated(false);
    setIsFormCorrect(false);
    setStudentTimesRemoved('');
    setSelectedSign('');
    setInputBuckets('');
    setInputResult('');
  };

  const handleCheckForm = () => {
    const isTimesMatch = parseInt(studentTimesRemoved) === bucketCount;
    const isSignMinus = selectedSign === '-';
    const isBucketsMatch = parseInt(inputBuckets) === bucketCount;
    const isResultMatch = parseInt(inputResult) === -bucketCount;

    const correct = isTimesMatch && isSignMinus && isBucketsMatch && isResultMatch && bucketCount > 0;
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
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-700">
          <MinusCircle className="w-4 h-4 text-rose-600" />
          <span>Tahap 3: Aktivitas Mengurangi Air</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">
          Mengambil Air dari Dalam Kolam
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Kondisi kolam kembali dimulai dari titik acuan 0. Ambil air menggunakan ember dan amati bagaimana bilangan bergerak ke arah negatif.
        </p>
      </div>

      {/* Interactive Simulation Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Pond Visualizer */}
        <div className="md:col-span-7 flex flex-col items-center">
          <PondIllustration
            level={waterLevel}
            isScooping={isScooping}
            title="Kolam Air Andi (Pengurangan)"
            subtitle="Air diambil ke bawah garis acuan 0 menghasilkan bilangan negatif"
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
            onPour={() => {}}
            onScoop={handleScoopWater}
            onReset={handleReset}
            mode="remove"
            bucketCount={bucketCount}
            disabled={waterLevel <= -5}
            label="Ambil Air dari Kolam"
          />

          {/* Progressive Change Track (0 -> -1 -> -2 -> -3) */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-2">
            <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Jejak Perubahan Bertahap:</span>
              <span className="text-[11px] text-rose-600 font-mono">Turun ke bawah 0!</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap font-mono text-sm py-1">
              {history.map((lvl, index) => (
                <React.Fragment key={index}>
                  <span
                    className={`px-2 py-0.5 rounded font-bold transition-all ${
                      index === history.length - 1
                        ? 'bg-rose-600 text-white shadow-xs scale-105'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {lvl}
                  </span>
                  {index < history.length - 1 && (
                    <span className="text-slate-400 font-sans">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            <p className="text-[11px] text-slate-500">
              Setiap 1 kali ciduk: air keluar dari kolam, permukaan air bergerak turun di bawah titik 0, menghasilkan <strong>bilangan negatif (-)</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Reflection & Math Operation Writing */}
      {bucketCount > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>Tuliskan Bentuk Matematika Berdasarkan Aktivitasmu:</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Question 1 */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">
                1. Berapa kali kamu mengambil air dari kolam?
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={studentTimesRemoved}
                  onChange={(e) => setStudentTimesRemoved(e.target.value)}
                  placeholder="Contoh: 3"
                  className="w-32 px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-mono focus:border-rose-500 focus:outline-none"
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
                  className="border border-slate-300 rounded-lg px-2 py-1 font-bold text-slate-800 bg-white focus:border-rose-500 focus:outline-none text-sm"
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
                  className="w-16 px-2 py-1 border border-slate-300 rounded-lg text-center text-sm font-mono focus:border-rose-500 focus:outline-none"
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
                  className="w-16 px-2 py-1 border border-slate-300 rounded-lg text-center text-sm font-mono focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Check Button */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleCheckForm}
              className="py-2 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition"
            >
              Periksa Bentuk Matematika
            </button>

            {isFormEvaluated && (
              <div className="text-xs">
                {isFormCorrect ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Hebat! Mengambil {bucketCount} ember dari titik 0 ditulis 0 - {bucketCount} = -{bucketCount}. Pengurangan dari 0 menghasilkan bilangan negatif!
                  </span>
                ) : (
                  <span className="text-rose-600 font-semibold flex items-center gap-1">
                    Periksa kembali: kamu telah mengambil {bucketCount} ember air. Gunakan tanda (-) karena air berkurang, dan hasil akhirnya adalah bilangan negatif (-{bucketCount})!
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>
            Silakan klik tombol <strong>&ldquo;- Ambil 1 Ember&rdquo;</strong> di atas minimal 1 kali untuk melihat air berkurang dan memulai penulisan operasi matematika.
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
          <span>Lanjut ke Tahap 4: Hubungan Aktivitas & Simbol</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
