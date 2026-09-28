import React from 'react';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { LearningStage } from '../types';

interface NavbarProps {
  currentStage: LearningStage;
  onSelectStage: (stage: LearningStage) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetAllProgress: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStage,
  onSelectStage,
  soundEnabled,
  onToggleSound,
  onResetAllProgress,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Zone 1: Brand title, single line text wordmark */}
        <button
          onClick={() => onSelectStage('intro')}
          className="text-lg font-bold tracking-tight text-sky-900 hover:text-sky-700 transition flex items-center gap-2 text-left"
        >
          <span className="font-display text-xl text-sky-600">🌊</span>
          <span>Kolam Bilangan Bulat</span>
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-600">
          <button
            onClick={() => onSelectStage('intro')}
            className={`hover:text-sky-600 transition whitespace-nowrap pb-1 ${
              currentStage === 'intro' ? 'text-sky-600 border-b-2 border-sky-600' : ''
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => onSelectStage('stage1_story')}
            className={`hover:text-sky-600 transition whitespace-nowrap pb-1 ${
              currentStage === 'stage1_story' ? 'text-sky-600 border-b-2 border-sky-600' : ''
            }`}
          >
            1. Cerita
          </button>
          <button
            onClick={() => onSelectStage('stage2_add')}
            className={`hover:text-sky-600 transition whitespace-nowrap pb-1 ${
              currentStage === 'stage2_add' ? 'text-sky-600 border-b-2 border-sky-600' : ''
            }`}
          >
            2. Tambah (+)
          </button>
          <button
            onClick={() => onSelectStage('stage3_remove')}
            className={`hover:text-sky-600 transition whitespace-nowrap pb-1 ${
              currentStage === 'stage3_remove' ? 'text-sky-600 border-b-2 border-sky-600' : ''
            }`}
          >
            3. Kurang (-)
          </button>
          <button
            onClick={() => onSelectStage('stage4_concept')}
            className={`hover:text-sky-600 transition whitespace-nowrap pb-1 ${
              currentStage === 'stage4_concept' ? 'text-sky-600 border-b-2 border-sky-600' : ''
            }`}
          >
            4. Konsep Simbol
          </button>
          <button
            onClick={() => onSelectStage('stage5_operations')}
            className={`hover:text-sky-600 transition whitespace-nowrap pb-1 ${
              currentStage === 'stage5_operations' ? 'text-sky-600 border-b-2 border-sky-600' : ''
            }`}
          >
            5. Tulis Operasi
          </button>
          <button
            onClick={() => onSelectStage('stage7_compare')}
            className={`hover:text-sky-600 transition whitespace-nowrap pb-1 ${
              currentStage === 'stage7_compare' ? 'text-sky-600 border-b-2 border-sky-600' : ''
            }`}
          >
            6. Bandingkan
          </button>
          <button
            onClick={() => onSelectStage('stage8_sandbox_quiz')}
            className={`hover:text-sky-600 transition whitespace-nowrap pb-1 ${
              currentStage === 'stage8_sandbox_quiz' ? 'text-sky-600 border-b-2 border-sky-600' : ''
            }`}
          >
            7. Kuis & Lab
          </button>
        </nav>

        {/* Zone 3: Primary utility actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Matikan suara' : 'Nyalakan suara'}
            title={soundEnabled ? 'Suara Aktif' : 'Suara Bisu'}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <button
            onClick={onResetAllProgress}
            aria-label="Ulangi pembelajaran dari awal"
            title="Ulangi dari awal"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
