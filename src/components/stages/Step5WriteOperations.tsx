import React, { useState } from 'react';
import { PondIllustration } from '../PondIllustration';
import { NumberLineVisualizer } from '../NumberLineVisualizer';
import { ArrowRight, Calculator, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccess, playHint } from '../../utils/audio';

interface Step5WriteOperationsProps {
  onComplete: () => void;
}

interface OperationTask {
  id: string;
  story: string;
  initial: number;
  actionWord: 'menambahkan' | 'mengambil';
  buckets: number;
  expectedSign: '+' | '-';
  expectedResult: number;
  hint: string;
}

const TASKS: OperationTask[] = [
  {
    id: 't1',
    story: 'Air berada pada posisi 0. Kamu mengambil air sebanyak 4 ember.',
    initial: 0,
    actionWord: 'mengambil',
    buckets: 4,
    expectedSign: '-',
    expectedResult: -4,
    hint: 'Mengambil air berarti berkurang, gunakan tanda (-) dan hasilnya menjadi negatif (-4).',
  },
  {
    id: 't2',
    story: 'Air berada pada posisi 0. Kamu menambahkan air sebanyak 5 ember.',
    initial: 0,
    actionWord: 'menambahkan',
    buckets: 5,
    expectedSign: '+',
    expectedResult: 5,
    hint: 'Menambahkan air berarti bertambah, gunakan tanda (+) dan hasilnya menjadi positif (5).',
  },
  {
    id: 't3',
    story: 'Air berada pada posisi 0. Kamu mengambil air sebanyak 2 ember.',
    initial: 0,
    actionWord: 'mengambil',
    buckets: 2,
    expectedSign: '-',
    expectedResult: -2,
    hint: 'Mengambil 2 ember dari posisi 0 menghasilkan 0 - 2 = -2.',
  },
  {
    id: 't4',
    story: 'Air berada pada posisi 2. Kamu menambahkan air sebanyak 3 ember.',
    initial: 2,
    actionWord: 'menambahkan',
    buckets: 3,
    expectedSign: '+',
    expectedResult: 5,
    hint: 'Mulai dari 2, bertambah 3 ember: 2 + 3 = 5.',
  },
];

export const Step5WriteOperations: React.FC<Step5WriteOperationsProps> = ({ onComplete }) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const task = TASKS[currentTaskIndex];

  // Student inputs
  const [selectedDirection, setSelectedDirection] = useState<'bertambah' | 'berkurang' | ''>('');
  const [inputSign, setInputSign] = useState<string>('');
  const [inputChange, setInputChange] = useState<string>('');
  const [inputResult, setInputResult] = useState<string>('');

  const [feedback, setFeedback] = useState<{
    evaluated: boolean;
    isCorrect: boolean;
    message: string;
  }>({ evaluated: false, isCorrect: false, message: '' });

  const [solvedTasks, setSolvedTasks] = useState<string[]>([]);

  const handleCheck = () => {
    const isDirectionCorrect = 
      (task.actionWord === 'menambahkan' && selectedDirection === 'bertambah') ||
      (task.actionWord === 'mengambil' && selectedDirection === 'berkurang');

    const isSignCorrect = inputSign === task.expectedSign;
    const isChangeCorrect = parseInt(inputChange) === task.buckets;
    const isResultCorrect = parseInt(inputResult) === task.expectedResult;

    if (isDirectionCorrect && isSignCorrect && isChangeCorrect && isResultCorrect) {
      setFeedback({
        evaluated: true,
        isCorrect: true,
        message: `Tepat sekali! Bentuk operasinya adalah: ${task.initial} ${task.expectedSign} ${task.buckets} = ${task.expectedResult}`,
      });
      playSuccess();
      if (!solvedTasks.includes(task.id)) {
        setSolvedTasks((prev) => [...prev, task.id]);
      }
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    } else {
      let msg = 'Ada bagian yang belum tepat. ';
      if (!isDirectionCorrect) msg += 'Perhatikan apakah air bertambah atau berkurang. ';
      else if (!isSignCorrect) msg += `Gunakan tanda (${task.expectedSign}) karena air ${task.actionWord}. `;
      else if (!isChangeCorrect) msg += `Banyak perubahan adalah jumlah ember (${task.buckets}). `;
      else if (!isResultCorrect) msg += `Hitung hasil akhir dengan teliti (${task.hint}).`;

      setFeedback({
        evaluated: true,
        isCorrect: false,
        message: msg,
      });
      playHint();
    }
  };

  const handleNextTask = () => {
    if (currentTaskIndex < TASKS.length - 1) {
      setCurrentTaskIndex((prev) => prev + 1);
      // Reset inputs
      setSelectedDirection('');
      setInputSign('');
      setInputChange('');
      setInputResult('');
      setFeedback({ evaluated: false, isCorrect: false, message: '' });
    }
  };

  const allCompleted = solvedTasks.length === TASKS.length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Title */}
      <div className="border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
          <Calculator className="w-4 h-4" />
          <span>Tahap 5: Menuliskan Operasi Matematika</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">
          Menyusun Bentuk Operasi dari Cerita Kolam
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Latih kemampuanmu menentukan arah, tanda (+ / -), besaran ember, dan hasil akhir perhitungan.
        </p>
      </div>

      {/* Task Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {TASKS.map((t, idx) => {
          const isDone = solvedTasks.includes(t.id);
          const isCurrent = idx === currentTaskIndex;

          return (
            <button
              key={t.id}
              onClick={() => {
                setCurrentTaskIndex(idx);
                setSelectedDirection('');
                setInputSign('');
                setInputChange('');
                setInputResult('');
                setFeedback({ evaluated: false, isCorrect: false, message: '' });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                isCurrent
                  ? 'bg-sky-600 text-white font-bold shadow-xs'
                  : isDone
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>Soal {idx + 1}</span>
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            </button>
          );
        })}
      </div>

      {/* Main Task Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Interactive Prompt & Input Fields */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
          {/* Story Prompt */}
          <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4">
            <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block mb-1">
              Skenario Kolam (Soal {currentTaskIndex + 1} dari {TASKS.length}):
            </span>
            <p className="text-sm font-semibold text-slate-800 leading-snug">
              &ldquo;{task.story}&rdquo;
            </p>
          </div>

          {/* Step 1: Direction Choice */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Langkah 1: Apakah air bertambah atau berkurang?
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedDirection('bertambah')}
                className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold transition ${
                  selectedDirection === 'bertambah'
                    ? 'bg-sky-50 border-sky-500 text-sky-800'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                💧 Bertambah
              </button>
              <button
                type="button"
                onClick={() => setSelectedDirection('berkurang')}
                className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold transition ${
                  selectedDirection === 'berkurang'
                    ? 'bg-rose-50 border-rose-500 text-rose-800'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                🪣 Berkurang
              </button>
            </div>
          </div>

          {/* Step 2: Write Math Formula */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Langkah 2: Lengkapi kolom rumus matematika:
            </label>

            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-base">
              {/* Initial Point */}
              <span className="font-bold text-slate-800 bg-white border border-slate-300 px-3 py-1.5 rounded-lg shadow-2xs">
                {task.initial}
              </span>

              {/* Sign Selector */}
              <select
                value={inputSign}
                onChange={(e) => setInputSign(e.target.value)}
                className="font-bold text-slate-900 bg-white border border-slate-300 px-3 py-1.5 rounded-lg shadow-2xs focus:border-sky-500 focus:outline-none"
              >
                <option value="">[ ? ]</option>
                <option value="+">+</option>
                <option value="-">-</option>
              </select>

              {/* Bucket Count */}
              <input
                type="number"
                min="0"
                max="10"
                value={inputChange}
                onChange={(e) => setInputChange(e.target.value)}
                placeholder="Ember"
                className="w-20 px-2 py-1.5 text-center font-bold text-slate-900 bg-white border border-slate-300 rounded-lg shadow-2xs focus:border-sky-500 focus:outline-none"
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
                className="w-20 px-2 py-1.5 text-center font-bold text-slate-900 bg-white border border-slate-300 rounded-lg shadow-2xs focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Check Button & Feedback */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleCheck}
                className="py-2.5 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition shadow-xs"
              >
                Periksa Operasi
              </button>

              {feedback.isCorrect && currentTaskIndex < TASKS.length - 1 && (
                <button
                  onClick={handleNextTask}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition flex items-center gap-1.5"
                >
                  <span>Lanjut Soal Berikutnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {feedback.evaluated && (
              <div
                className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                  feedback.isCorrect
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Responsive Pond Preview */}
        <div className="md:col-span-5 flex flex-col items-center">
          <PondIllustration
            level={feedback.isCorrect ? task.expectedResult : task.initial}
            title="Visual Hasil Operasi Kolam"
            subtitle={
              feedback.isCorrect
                ? `Posisi akhir: ${task.expectedResult}`
                : `Posisi awal: ${task.initial}`
            }
            size="sm"
          />

          <div className="w-full mt-3">
            <NumberLineVisualizer
              currentValue={feedback.isCorrect ? task.expectedResult : task.initial}
              fromValue={task.initial}
              min={-5}
              max={5}
            />
          </div>
        </div>
      </div>

      {/* Next Step Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onComplete}
          disabled={!allCompleted}
          className="py-3 px-6 rounded-xl font-bold text-white bg-sky-600 hover:bg-sky-700 active:scale-98 disabled:opacity-40 disabled:pointer-events-none shadow-sm transition flex items-center gap-2 text-sm"
        >
          <span>Lanjut ke Tahap 6: Hubungan dengan Garis Bilangan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
