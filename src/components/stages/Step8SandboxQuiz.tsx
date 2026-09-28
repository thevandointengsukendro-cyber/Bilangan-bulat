import React, { useState } from 'react';
import { PondIllustration } from '../PondIllustration';
import { NumberLineVisualizer } from '../NumberLineVisualizer';
import { InteractiveBucket } from '../InteractiveBucket';
import {
  Trophy,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Printer,
  ChevronRight,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccess, playHint, playWaterSplash, playBucketScoop } from '../../utils/audio';

interface Step8SandboxQuizProps {
  onRestart: () => void;
}

interface QuizItem {
  id: string;
  category: string;
  question: string;
  storyContext?: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
}

const QUIZ_ITEMS: QuizItem[] = [
  {
    id: 'qz1',
    category: 'Konsep Titik Acuan',
    question: 'Pada simulasi kolam, kondisi air mula-mula berada tepat pada titik acuan...',
    options: [
      { text: '0 (Nol)', isCorrect: true },
      { text: '+5', isCorrect: false },
      { text: '-5', isCorrect: false },
    ],
    explanation: 'Titik awal normal adalah 0. Ini menjadi patokan apakah air bertambah ke positif atau berkurang ke negatif.',
  },
  {
    id: 'qz2',
    category: 'Operasi Pengurangan',
    question: 'Air kolam mula-mula di posisi 0. Kemudian diambil 3 ember air. Bentuk matematikanya adalah...',
    options: [
      { text: '0 + 3 = 3', isCorrect: false },
      { text: '0 - 3 = -3', isCorrect: true },
      { text: '3 - 0 = 3', isCorrect: false },
    ],
    explanation: 'Karena air diambil (berkurang), kita menggunakan tanda (-) dan menghasilkan bilangan negatif: 0 - 3 = -3.',
  },
  {
    id: 'qz3',
    category: 'Perbandingan Negatif',
    question: 'Manakah pernyataan yang benar mengenai perbandingan antara -4 dan -1?',
    options: [
      { text: '-4 > -1, karena 4 lebih besar dari 1', isCorrect: false },
      { text: '-4 < -1, karena pada garis bilangan -1 berada lebih ke kanan', isCorrect: true },
      { text: '-4 = -1, karena keduanya sama-sama negatif', isCorrect: false },
    ],
    explanation: 'Pada garis bilangan, bilangan yang berada lebih ke sebelah kanan selalu memiliki nilai lebih besar. Karena -1 berada lebih ke kanan dibanding -4, maka -4 < -1.',
  },
  {
    id: 'qz4',
    category: 'Operasi Lanjutan',
    question: 'Ketinggian air kolam saat ini berada di level 2. Kamu menuangkan 3 ember air lagi. Posisi air sekarang adalah...',
    options: [
      { text: '2 + 3 = 5', isCorrect: true },
      { text: '2 - 3 = -1', isCorrect: false },
      { text: '3 + 2 = 1', isCorrect: false },
    ],
    explanation: 'Mulai dari 2, ditambah 3 ember: 2 + 3 = 5.',
  },
  {
    id: 'qz5',
    category: 'Garis Bilangan',
    question: 'Jika kamu mengurangi air dari kolam, titik penanda pada garis bilangan bergerak ke arah...',
    options: [
      { text: 'Kanan (menuju bilangan positif)', isCorrect: false },
      { text: 'Kiri (menuju bilangan negatif)', isCorrect: true },
      { text: 'Diam di tempat', isCorrect: false },
    ],
    explanation: 'Pengurangan selalu menggerakkan titik pada garis bilangan ke arah kiri.',
  },
  {
    id: 'qz6',
    category: 'Perbandingan Positif & Negatif',
    question: 'Antara +3 dan -5, simbol perbandingan yang tepat adalah...',
    options: [
      { text: '3 < -5', isCorrect: false },
      { text: '3 > -5', isCorrect: true },
      { text: '3 = -5', isCorrect: false },
    ],
    explanation: 'Bilangan positif selalu bernilai lebih besar daripada bilangan negatif karena posisinya berada di sebelah kanan 0 pada garis bilangan.',
  },
];

export const Step8SandboxQuiz: React.FC<Step8SandboxQuizProps> = ({ onRestart }) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'sandbox'>('quiz');

  // Sandbox states
  const [sandboxLevel, setSandboxLevel] = useState<number>(0);
  const [sandboxPrev, setSandboxPrev] = useState<number>(0);
  const [isPouring, setIsPouring] = useState<boolean>(false);
  const [isScooping, setIsScooping] = useState<boolean>(false);
  const [sandboxHistory, setSandboxHistory] = useState<string[]>([
    'Kondisi awal: Kolam berada pada posisi acuan 0.',
  ]);

  const handleSandboxPour = () => {
    if (sandboxLevel < 5) {
      setIsPouring(true);
      playWaterSplash();
      setSandboxPrev(sandboxLevel);
      const next = sandboxLevel + 1;
      setSandboxLevel(next);
      setSandboxHistory((prev) => [
        `Menuang 1 ember (+1): ${sandboxLevel} + 1 = ${next}`,
        ...prev.slice(0, 9),
      ]);
      setTimeout(() => setIsPouring(false), 400);
    }
  };

  const handleSandboxScoop = () => {
    if (sandboxLevel > -5) {
      setIsScooping(true);
      playBucketScoop();
      setSandboxPrev(sandboxLevel);
      const next = sandboxLevel - 1;
      setSandboxLevel(next);
      setSandboxHistory((prev) => [
        `Mengambil 1 ember (-1): ${sandboxLevel} - 1 = ${next}`,
        ...prev.slice(0, 9),
      ]);
      setTimeout(() => setIsScooping(false), 400);
    }
  };

  const handleSandboxReset = () => {
    setSandboxPrev(sandboxLevel);
    setSandboxLevel(0);
    setSandboxHistory((prev) => [
      'Reset kolam ke posisi acuan 0.',
      ...prev.slice(0, 9),
    ]);
  };

  // Quiz states
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [studentName, setStudentName] = useState('Siswa Hebat');

  const currentQ = QUIZ_ITEMS[quizIndex];
  const currentSelectedOpt = selectedAnswers[quizIndex];
  const isCurrentAnswered = currentSelectedOpt !== undefined;

  const handleSelectQuizOpt = (optIndex: number, isCorrect: boolean) => {
    if (isCurrentAnswered) return;
    setSelectedAnswers((prev) => ({ ...prev, [quizIndex]: optIndex }));

    if (isCorrect) {
      playSuccess();
    } else {
      playHint();
    }
  };

  const handleNextQuizQuestion = () => {
    if (quizIndex < QUIZ_ITEMS.length - 1) {
      setQuizIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      playSuccess();
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }
  };

  // Score calculation
  const totalCorrect = QUIZ_ITEMS.filter(
    (q, idx) => selectedAnswers[idx] !== undefined && q.options[selectedAnswers[idx]].isCorrect
  ).length;
  const scorePercent = Math.round((totalCorrect / QUIZ_ITEMS.length) * 100);

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Title */}
      <div className="border-b border-slate-200 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Tahap 8: Evaluasi & Laboratorium Mandiri</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            Uji Pemahaman & Laboratorium Bebas
          </h2>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`py-1.5 px-4 rounded-lg transition ${
              activeTab === 'quiz'
                ? 'bg-white text-sky-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎯 Kuis Tantangan
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`py-1.5 px-4 rounded-lg transition ${
              activeTab === 'sandbox'
                ? 'bg-white text-sky-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🧪 Laboratorium Bebas
          </button>
        </div>
      </div>

      {/* Tab 1: Quiz Mode */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          {!quizFinished ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              {/* Quiz progress */}
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
                <span className="font-semibold text-sky-800">
                  Kategori: {currentQ.category}
                </span>
                <span>
                  Soal {quizIndex + 1} dari {QUIZ_ITEMS.length}
                </span>
              </div>

              {/* Question */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = currentSelectedOpt === optIdx;
                  const showResult = isCurrentAnswered;

                  let btnStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700';
                  if (showResult) {
                    if (opt.isCorrect) {
                      btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-50 border-rose-500 text-rose-800';
                    } else {
                      btnStyle = 'bg-slate-50 opacity-50 border-slate-200';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isCurrentAnswered}
                      onClick={() => handleSelectQuizOpt(optIdx, opt.isCorrect)}
                      className={`w-full py-3 px-4 rounded-xl border text-xs md:text-sm text-left transition flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt.text}</span>
                      {showResult && opt.isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {showResult && isSelected && !opt.isCorrect && (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next */}
              {isCurrentAnswered && (
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-xl text-xs text-sky-950 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block mb-0.5">Penjelasan Konsep:</strong>
                      <span>{currentQ.explanation}</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleNextQuizQuestion}
                      className="py-2.5 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
                    >
                      <span>
                        {quizIndex < QUIZ_ITEMS.length - 1 ? 'Soal Selanjutnya' : 'Lihat Hasil Akhir'}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Certificate & Final Score Card */
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6 text-center">
              <div className="inline-flex p-4 rounded-full bg-amber-50 text-amber-500 mb-1 border border-amber-200">
                <Award className="w-12 h-12" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold text-slate-900 font-display">
                  Selamat, Pembelajaran Telah Selesai!
                </h3>
                <p className="text-slate-600 text-xs md:text-sm">
                  Kamu telah menyelesaikan seluruh tahapan materi bilangan bulat menggunakan konteks kolam air.
                </p>
              </div>

              {/* Score Display */}
              <div className="inline-flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-sky-700 font-mono">
                    {scorePercent}%
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">Nilai Akhir</div>
                </div>
                <div className="h-8 w-px bg-slate-300" />
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-amber-600 font-mono">
                    {totalCorrect} / {QUIZ_ITEMS.length}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">Jawaban Benar</div>
                </div>
              </div>

              {/* Student Certificate Card */}
              <div className="max-w-xl mx-auto p-6 rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50/50 space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-sky-200 pb-2">
                  <span className="text-xs font-bold text-sky-900 tracking-wider uppercase">
                    Sertifikat Pencapaian
                  </span>
                  <span className="text-xs font-mono text-sky-700">Kolam Bilangan Bulat</span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-slate-500">Diberikan kepada:</div>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3 py-1.5 text-base font-bold text-slate-800 bg-white border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                    placeholder="Masukkan nama lengkap siswa..."
                  />
                  <p className="text-xs text-slate-600">
                    Telah memahami konsep dasar titik acuan 0, bilangan positif (+), bilangan negatif (-), penulisan operasi, serta pembuktian perbandingan menggunakan garis bilangan.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="py-2.5 px-5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Sertifikat</span>
                </button>

                <button
                  onClick={() => {
                    setQuizIndex(0);
                    setSelectedAnswers({});
                    setQuizFinished(false);
                  }}
                  className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ulangi Kuis</span>
                </button>

                <button
                  onClick={onRestart}
                  className="py-2.5 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition flex items-center gap-2"
                >
                  <span>Mulai dari Awal Pembelajaran</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Free Sandbox Mode */}
      {activeTab === 'sandbox' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Pond visualizer */}
            <div className="md:col-span-6 flex flex-col items-center">
              <PondIllustration
                level={sandboxLevel}
                isPouring={isPouring}
                isScooping={isScooping}
                title="Laboratorium Simulasi Kolam"
                subtitle="Bebas mencoba perubahan jumlah air dan melihat reaksinya"
                size="md"
              />
            </div>

            {/* Controls & Action Log */}
            <div className="md:col-span-6 space-y-4">
              <InteractiveBucket
                onPour={handleSandboxPour}
                onScoop={handleSandboxScoop}
                onReset={handleSandboxReset}
                mode="both"
                label="Kendali Bebas Ember"
              />

              {/* Action log */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Catatan Aktivitas Kolam:</span>
                  <span className="text-[10px] text-slate-400 font-mono">10 riwayat terbaru</span>
                </div>

                <div className="space-y-1 font-mono text-xs max-h-36 overflow-y-auto pr-1">
                  {sandboxHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-1.5 bg-slate-50 rounded text-slate-700 border-l-2 border-sky-500 text-[11px]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Synchronous Number Line */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="text-xs font-bold text-slate-800 mb-2">
              Posisi Garis Bilangan Sinkron
            </div>
            <NumberLineVisualizer
              currentValue={sandboxLevel}
              fromValue={sandboxPrev}
              min={-5}
              max={5}
            />
          </div>
        </div>
      )}
    </div>
  );
};
