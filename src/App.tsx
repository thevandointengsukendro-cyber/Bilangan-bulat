/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LearningStage } from './types';
import { Navbar } from './components/Navbar';
import { StageProgress } from './components/StageProgress';
import { Step0Intro } from './components/stages/Step0Intro';
import { Step1ReadStory } from './components/stages/Step1ReadStory';
import { Step2AddWater } from './components/stages/Step2AddWater';
import { Step3RemoveWater } from './components/stages/Step3RemoveWater';
import { Step4RelationSummary } from './components/stages/Step4RelationSummary';
import { Step5WriteOperations } from './components/stages/Step5WriteOperations';
import { Step6NumberLinePond } from './components/stages/Step6NumberLinePond';
import { Step7ComparePonds } from './components/stages/Step7ComparePonds';
import { Step8SandboxQuiz } from './components/stages/Step8SandboxQuiz';
import { isSoundEnabled, setSoundEnabled, playSuccess } from './utils/audio';

const STORAGE_KEY_STAGE = 'kolam_bilangan_stage';
const STORAGE_KEY_COMPLETED = 'kolam_bilangan_completed';

export default function App() {
  const [currentStage, setCurrentStage] = useState<LearningStage>('intro');
  const [completedStages, setCompletedStages] = useState<LearningStage[]>([]);
  const [soundActive, setSoundActive] = useState<boolean>(true);

  // Load persistence from local storage
  useEffect(() => {
    try {
      const savedStage = localStorage.getItem(STORAGE_KEY_STAGE) as LearningStage | null;
      const savedCompleted = localStorage.getItem(STORAGE_KEY_COMPLETED);

      if (savedStage) {
        setCurrentStage(savedStage);
      }
      if (savedCompleted) {
        setCompletedStages(JSON.parse(savedCompleted));
      }
    } catch {
      // LocalStorage access might fail in restricted iframe sandboxes
    }
  }, []);

  // Save stage changes
  const handleSelectStage = (stage: LearningStage) => {
    setCurrentStage(stage);
    try {
      localStorage.setItem(STORAGE_KEY_STAGE, stage);
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const markStageCompleted = (stage: LearningStage, nextStage: LearningStage) => {
    playSuccess();
    setCompletedStages((prev) => {
      const nextList = prev.includes(stage) ? prev : [...prev, stage];
      try {
        localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(nextList));
      } catch {
        // ignore
      }
      return nextList;
    });
    handleSelectStage(nextStage);
  };

  const handleToggleSound = () => {
    const nextState = !soundActive;
    setSoundActive(nextState);
    setSoundEnabled(nextState);
  };

  const handleResetAllProgress = () => {
    if (window.confirm('Apakah kamu ingin mengulangi pembelajaran dari awal?')) {
      setCurrentStage('intro');
      setCompletedStages([]);
      try {
        localStorage.removeItem(STORAGE_KEY_STAGE);
        localStorage.removeItem(STORAGE_KEY_COMPLETED);
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Navbar Contract */}
      <Navbar
        currentStage={currentStage}
        onSelectStage={handleSelectStage}
        soundEnabled={soundActive}
        onToggleSound={handleToggleSound}
        onResetAllProgress={handleResetAllProgress}
      />

      {/* Structured Learning Stage Bar */}
      <StageProgress
        currentStage={currentStage}
        completedStages={completedStages}
        onSelectStage={handleSelectStage}
      />

      {/* Main Learning Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-8">
        {currentStage === 'intro' && (
          <Step0Intro onStart={() => handleSelectStage('stage1_story')} />
        )}

        {currentStage === 'stage1_story' && (
          <Step1ReadStory
            onComplete={() => markStageCompleted('stage1_story', 'stage2_add')}
          />
        )}

        {currentStage === 'stage2_add' && (
          <Step2AddWater
            onComplete={() => markStageCompleted('stage2_add', 'stage3_remove')}
          />
        )}

        {currentStage === 'stage3_remove' && (
          <Step3RemoveWater
            onComplete={() => markStageCompleted('stage3_remove', 'stage4_concept')}
          />
        )}

        {currentStage === 'stage4_concept' && (
          <Step4RelationSummary
            onComplete={() => markStageCompleted('stage4_concept', 'stage5_operations')}
          />
        )}

        {currentStage === 'stage5_operations' && (
          <Step5WriteOperations
            onComplete={() => markStageCompleted('stage5_operations', 'stage6_numberline')}
          />
        )}

        {currentStage === 'stage6_numberline' && (
          <Step6NumberLinePond
            onComplete={() => markStageCompleted('stage6_numberline', 'stage7_compare')}
          />
        )}

        {currentStage === 'stage7_compare' && (
          <Step7ComparePonds
            onComplete={() => markStageCompleted('stage7_compare', 'stage8_sandbox_quiz')}
          />
        )}

        {currentStage === 'stage8_sandbox_quiz' && (
          <Step8SandboxQuiz onRestart={() => handleSelectStage('intro')} />
        )}
      </main>

      {/* Quiet, clean educational footer */}
      <footer className="border-t border-slate-200 bg-white py-5 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>Media Pembelajaran Interaktif Matematika: Konsep Bilangan Bulat dengan Konteks Kolam Air</span>
          </div>
          <div className="text-slate-400">
            Aktivitas Nyata → Visual Kolam → Bilangan → Operasi Matematika → Perbandingan
          </div>
        </div>
      </footer>
    </div>
  );
}
