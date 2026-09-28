import React from 'react';
import { LearningStage } from '../types';
import { Check } from 'lucide-react';

interface StageProgressProps {
  currentStage: LearningStage;
  completedStages: LearningStage[];
  onSelectStage: (stage: LearningStage) => void;
}

const STAGES: { id: LearningStage; label: string; short: string }[] = [
  { id: 'intro', label: 'Pengantar', short: 'Awal' },
  { id: 'stage1_story', label: '1. Cerita Kolam', short: 'Cerita' },
  { id: 'stage2_add', label: '2. Tambah Air (+)', short: 'Tambah' },
  { id: 'stage3_remove', label: '3. Kurang Air (-)', short: 'Kurang' },
  { id: 'stage4_concept', label: '4. Konsep Simbol', short: 'Simbol' },
  { id: 'stage5_operations', label: '5. Tulis Operasi', short: 'Operasi' },
  { id: 'stage6_numberline', label: '6. Garis Bilangan', short: 'Garis' },
  { id: 'stage7_compare', label: '7. Bandingkan', short: 'Banding' },
  { id: 'stage8_sandbox_quiz', label: '8. Kuis & Lab', short: 'Evaluasi' },
];

export const StageProgress: React.FC<StageProgressProps> = ({
  currentStage,
  completedStages,
  onSelectStage,
}) => {
  const currentIndex = STAGES.findIndex((s) => s.id === currentStage);
  const progressPercent = Math.round((completedStages.length / (STAGES.length - 1)) * 100);

  return (
    <div className="w-full bg-slate-100/80 border-b border-slate-200 py-2 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
        {/* Progress summary text */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="font-semibold text-slate-800">Alur Belajar:</span>
          <span>Tahap {Math.max(1, currentIndex)} dari {STAGES.length - 1}</span>
          <span aria-hidden="true">·</span>
          <span className="text-sky-700 font-mono font-medium">{Math.min(100, progressPercent)}% Selesai</span>
        </div>

        {/* Stage quick step indicators */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {STAGES.map((s, idx) => {
            const isCompleted = completedStages.includes(s.id);
            const isCurrent = s.id === currentStage;

            return (
              <button
                key={s.id}
                onClick={() => onSelectStage(s.id)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-sky-600 text-white font-semibold shadow-2xs'
                    : isCompleted
                    ? 'bg-white text-slate-700 hover:text-sky-700 border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
                }`}
                title={s.label}
              >
                {isCompleted && !isCurrent && (
                  <Check className="w-3 h-3 text-emerald-600" />
                )}
                <span>{idx === 0 ? s.short : `${idx}. ${s.short}`}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
