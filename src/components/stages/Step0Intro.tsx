import React, { useState } from 'react';
import { PondIllustration } from '../PondIllustration';
import { InteractiveBucket } from '../InteractiveBucket';
import { NumberLineVisualizer } from '../NumberLineVisualizer';
import { ArrowRight, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { playWaterSplash, playBucketScoop } from '../../utils/audio';

interface Step0IntroProps {
  onStart: () => void;
}

export const Step0Intro: React.FC<Step0IntroProps> = ({ onStart }) => {
  const [demoLevel, setDemoLevel] = useState<number>(0);
  const [prevLevel, setPrevLevel] = useState<number>(0);
  const [isPouring, setIsPouring] = useState<boolean>(false);
  const [isScooping, setIsScooping] = useState<boolean>(false);
  const [bucketCount, setBucketCount] = useState<number>(0);

  const handlePour = () => {
    if (demoLevel < 5) {
      setIsPouring(true);
      setPrevLevel(demoLevel);
      setDemoLevel((prev) => prev + 1);
      setBucketCount((prev) => prev + 1);
      playWaterSplash();
      setTimeout(() => setIsPouring(false), 500);
    }
  };

  const handleScoop = () => {
    if (demoLevel > -5) {
      setIsScooping(true);
      setPrevLevel(demoLevel);
      setDemoLevel((prev) => prev - 1);
      setBucketCount((prev) => prev + 1);
      playBucketScoop();
      setTimeout(() => setIsScooping(false), 500);
    }
  };

  const handleReset = () => {
    setPrevLevel(demoLevel);
    setDemoLevel(0);
    setBucketCount(0);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
          Media Pembelajaran Kolam Bilangan Bulat
        </h1>
        <p className="text-slate-600 text-sm md:text-base leading-relaxed">
          Pahami konsep bilangan positif, bilangan negatif, operasi matematika, dan perbandingan secara visual melalui perubahan jumlah air di dalam kolam.
        </p>
      </div>

      {/* Interactive Showcase / Demo Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Interactive Pond Display */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <PondIllustration
            level={demoLevel}
            isPouring={isPouring}
            isScooping={isScooping}
            title="Simulasi Kolam Awal"
            subtitle="Coba tuang atau ambil air untuk melihat perubahan angka secara langsung"
            size="md"
          />

          {/* Synchronous Live Number Line */}
          <div className="w-full mt-4">
            <NumberLineVisualizer
              currentValue={demoLevel}
              fromValue={prevLevel}
              min={-5}
              max={5}
            />
          </div>
        </div>

        {/* Right: Controls & Overview Card */}
        <div className="lg:col-span-5 space-y-5">
          <InteractiveBucket
            onPour={handlePour}
            onScoop={handleScoop}
            onReset={handleReset}
            bucketCount={bucketCount}
            label="Uji Coba Alat Ember"
            mode="both"
          />

          <div className="bg-sky-50/70 border border-sky-200/80 rounded-xl p-4 text-xs space-y-2 text-slate-700">
            <div className="font-semibold text-sky-900 flex items-center gap-1.5 text-sm">
              <Layers className="w-4 h-4 text-sky-600" />
              <span>Aturan Sederhana Kolam:</span>
            </div>
            <ul className="space-y-1.5 text-slate-600 pl-1">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">0:</span>
                <span>Posisi awal air berada tepat pada titik acuan normal <strong>0</strong>.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-sky-600 font-bold">+ :</span>
                <span>Menambahkan air membuat permukaan naik ke arah <strong>bilangan positif</strong>.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">- :</span>
                <span>Mengambil air membuat permukaan turun ke arah <strong>bilangan negatif</strong>.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-slate-800 font-bold">1 Ember:</span>
                <span>Setiap satu ember mewakili <strong>1 satuan perubahan</strong>.</span>
              </li>
            </ul>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={onStart}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-sky-600 hover:bg-sky-700 active:scale-98 shadow-sm transition flex items-center justify-center gap-2 text-sm md:text-base group"
          >
            <span>Mulai Belajar Sekarang</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Curriculum Steps Overview */}
      <div className="border-t border-slate-200 pt-6">
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold text-slate-800">Tahapan Pembelajaran Terstruktur</h2>
          <p className="text-xs text-slate-500">
            Disusun bertahap dari pemahaman nyata menuju simbol matematika abstrak
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
            <div className="font-semibold text-slate-900">1. Membaca Situasi</div>
            <p className="text-slate-500">Mengenal cerita kolam & perubahan arah tanpa simbol rumus.</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
            <div className="font-semibold text-slate-900">2. Menambah & Mengurangi</div>
            <p className="text-slate-500">Aktivitas menuang ember (+) dan menciduk air (-) bertahap.</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
            <div className="font-semibold text-slate-900">3. Menuliskan Operasi</div>
            <p className="text-slate-500">Menyusun bentuk matematika tanda, angka, dan hasil akhir.</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
            <div className="font-semibold text-slate-900">4. Perbandingan Kolam</div>
            <p className="text-slate-500">Membandingkan dua bilangan dengan garis bilangan nyata.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
