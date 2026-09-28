import React, { useState } from 'react';
import { PondIllustration } from '../PondIllustration';
import { NumberLineVisualizer } from '../NumberLineVisualizer';
import { ArrowRight, Scale, CheckCircle2, HelpCircle, Eye, ArrowUpDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccess, playHint } from '../../utils/audio';

interface Step7ComparePondsProps {
  onComplete: () => void;
}

interface CompareProblem {
  id: string;
  categoryName: string;
  valA: number;
  valB: number;
  correctSymbol: '<' | '>' | '=';
  greaterPond: 'A' | 'B' | 'Sama';
  explanation: string;
}

const PROBLEMS: CompareProblem[] = [
  {
    id: 'p1',
    categoryName: 'Negatif dengan Positif',
    valA: -3,
    valB: 2,
    correctSymbol: '<',
    greaterPond: 'B',
    explanation: 'Air pada Kolam B (+2) berada di atas garis acuan 0, sedangkan Kolam A (-3) berada di bawah garis acuan. Pada garis bilangan, 2 berada di sebelah kanan -3, sehingga -3 < 2.',
  },
  {
    id: 'p2',
    categoryName: 'Negatif dengan Negatif',
    valA: -5,
    valB: -2,
    correctSymbol: '<',
    greaterPond: 'B',
    explanation: 'Meskipun keduanya negatif, air pada Kolam B (-2) lebih tinggi dan tidak sedalam Kolam A (-5). Pada garis bilangan, -2 berada lebih ke kanan daripada -5, sehingga -5 < -2.',
  },
  {
    id: 'p3',
    categoryName: 'Positif dengan Negatif',
    valA: 4,
    valB: -2,
    correctSymbol: '>',
    greaterPond: 'A',
    explanation: 'Kolam A (+4) memiliki air berlimpah di atas 0, sedangkan Kolam B (-2) kekurangan air. Pada garis bilangan, 4 berada di sebelah kanan -2, sehingga 4 > -2.',
  },
  {
    id: 'p4',
    categoryName: 'Positif dengan Positif',
    valA: 2,
    valB: 5,
    correctSymbol: '<',
    greaterPond: 'B',
    explanation: 'Kolam B memiliki ketinggian air 5, lebih tinggi daripada Kolam A dengan ketinggian 2. Pada garis bilangan, 5 berada di sebelah kanan 2, sehingga 2 < 5.',
  },
  {
    id: 'p5',
    categoryName: 'Bilangan yang Sama',
    valA: 3,
    valB: 3,
    correctSymbol: '=',
    greaterPond: 'Sama',
    explanation: 'Kedua kolam memiliki ketinggian air yang sama persis (3). Pada garis bilangan, keduanya menempati titik yang sama, sehingga 3 = 3.',
  },
];

export const Step7ComparePonds: React.FC<Step7ComparePondsProps> = ({ onComplete }) => {
  const [problemIndex, setProblemIndex] = useState(0);
  const currentProblem = PROBLEMS[problemIndex];

  // Stage states
  const [selectedInitialPond, setSelectedInitialPond] = useState<'A' | 'B' | 'Sama' | ''>('');
  const [showProofLine, setShowProofLine] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<'<' | '>' | '=' | ''>('');
  const [feedback, setFeedback] = useState<{
    evaluated: boolean;
    isCorrect: boolean;
    message: string;
  }>({ evaluated: false, isCorrect: false, message: '' });

  const [completedProblems, setCompletedProblems] = useState<string[]>([]);

  const handleSelectInitialPond = (pond: 'A' | 'B' | 'Sama') => {
    setSelectedInitialPond(pond);
    // automatically unveil proof line affordance
  };

  const handleVerifySymbol = (symbol: '<' | '>' | '=') => {
    setSelectedSymbol(symbol);
    const isCorrect = symbol === currentProblem.correctSymbol;

    if (isCorrect) {
      setFeedback({
        evaluated: true,
        isCorrect: true,
        message: `Benar! ${currentProblem.explanation}`,
      });
      playSuccess();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      if (!completedProblems.includes(currentProblem.id)) {
        setCompletedProblems((prev) => [...prev, currentProblem.id]);
      }
    } else {
      setFeedback({
        evaluated: true,
        isCorrect: false,
        message: `Coba perhatikan posisi kedua bilangan pada garis bilangan. Bilangan yang berada lebih ke kanan selalu memiliki nilai yang lebih besar. Coba amati kembali!`,
      });
      playHint();
    }
  };

  const handleNextProblem = () => {
    if (problemIndex < PROBLEMS.length - 1) {
      setProblemIndex((prev) => prev + 1);
      setSelectedInitialPond('');
      setShowProofLine(false);
      setSelectedSymbol('');
      setFeedback({ evaluated: false, isCorrect: false, message: '' });
    }
  };

  const allCompleted = completedProblems.length === PROBLEMS.length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Title */}
      <div className="border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
          <Scale className="w-4 h-4" />
          <span>Tahap 7: Membandingkan Dua Bilangan Bulat</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">
          Bandingkan Kolam A dan Kolam B
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Bukan dengan hafalan simbol semata, tetapi dengan mengamati ketinggian air dan pembuktian posisi pada garis bilangan!
        </p>
      </div>

      {/* Problem Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {PROBLEMS.map((p, idx) => {
          const isDone = completedProblems.includes(p.id);
          const isCurrent = idx === problemIndex;

          return (
            <button
              key={p.id}
              onClick={() => {
                setProblemIndex(idx);
                setSelectedInitialPond('');
                setShowProofLine(false);
                setSelectedSymbol('');
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
              <span>Kasus {idx + 1}: {p.categoryName}</span>
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            </button>
          );
        })}
      </div>

      {/* Side-by-side Dual Ponds Display */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Pond A */}
          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50/70 border border-slate-200">
            <PondIllustration
              level={currentProblem.valA}
              title="Kolam A"
              subtitle={`Ketinggian air: ${currentProblem.valA > 0 ? `+${currentProblem.valA}` : currentProblem.valA}`}
              size="sm"
            />
            <div className="mt-2 text-center">
              <span className="font-mono text-base font-bold text-sky-800">
                Nilai Kolam A = {currentProblem.valA}
              </span>
            </div>
          </div>

          {/* Pond B */}
          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50/70 border border-slate-200">
            <PondIllustration
              level={currentProblem.valB}
              title="Kolam B"
              subtitle={`Ketinggian air: ${currentProblem.valB > 0 ? `+${currentProblem.valB}` : currentProblem.valB}`}
              size="sm"
            />
            <div className="mt-2 text-center">
              <span className="font-mono text-base font-bold text-amber-800">
                Nilai Kolam B = {currentProblem.valB}
              </span>
            </div>
          </div>
        </div>

        {/* Step A: Observation Question */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-sky-600" />
            <span>Langkah 1: Amati kondisi visual kedua kolam. Kolam mana yang memiliki jumlah air lebih banyak / posisi lebih tinggi?</span>
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSelectInitialPond('A')}
              className={`py-2 px-4 rounded-lg text-xs font-semibold border transition ${
                selectedInitialPond === 'A'
                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Kolam A ({currentProblem.valA})
            </button>
            <button
              onClick={() => handleSelectInitialPond('B')}
              className={`py-2 px-4 rounded-lg text-xs font-semibold border transition ${
                selectedInitialPond === 'B'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Kolam B ({currentProblem.valB})
            </button>
            <button
              onClick={() => handleSelectInitialPond('Sama')}
              className={`py-2 px-4 rounded-lg text-xs font-semibold border transition ${
                selectedInitialPond === 'Sama'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Keduanya Sama Persis
            </button>
          </div>
        </div>

        {/* Step B: Prove on Number Line Button */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800">
              Langkah 2: Buktikan Posisi Kedua Kolam pada Garis Bilangan
            </label>
            <button
              onClick={() => setShowProofLine(!showProofLine)}
              className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition flex items-center gap-1.5"
            >
              <span>{showProofLine ? 'Sembunyikan Garis Bilangan' : '🔍 Tampilkan Garis Bilangan'}</span>
            </button>
          </div>

          {showProofLine && (
            <div className="p-4 bg-slate-50/90 rounded-xl border border-slate-200 space-y-2 animate-in fade-in duration-300">
              <NumberLineVisualizer
                compareA={currentProblem.valA}
                compareB={currentProblem.valB}
                labelA="Kolam A"
                labelB="Kolam B"
                min={-5}
                max={5}
              />
              <p className="text-[11px] text-slate-500 italic text-center">
                Aturan Pembuktian: Bilangan yang berada lebih ke kanan selalu bernilai lebih besar.
              </p>
            </div>
          )}
        </div>

        {/* Step C: Symbol Selection */}
        <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl space-y-3">
          <label className="text-xs font-bold text-slate-800 block">
            Langkah 3: Tentukan simbol matematika yang tepat untuk hubungan kedua bilangan:
          </label>

          <div className="flex items-center justify-center gap-4 py-2 font-mono text-xl">
            <span className="font-bold text-sky-800 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
              {currentProblem.valA}
            </span>

            <div className="flex gap-2">
              {(['<', '>', '='] as const).map((sym) => (
                <button
                  key={sym}
                  onClick={() => handleVerifySymbol(sym)}
                  className={`w-12 h-10 rounded-xl font-bold flex items-center justify-center text-lg transition shadow-xs ${
                    selectedSymbol === sym
                      ? 'bg-sky-600 text-white scale-105'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>

            <span className="font-bold text-amber-800 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
              {currentProblem.valB}
            </span>
          </div>

          {/* Feedback */}
          {feedback.evaluated && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                feedback.isCorrect
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {feedback.isCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-semibold">{feedback.isCorrect ? 'Hebat Sekali!' : 'Petunjuk Berpikir:'}</p>
                <p>{feedback.message}</p>
              </div>
            </div>
          )}

          {/* Next Problem Button */}
          {feedback.isCorrect && problemIndex < PROBLEMS.length - 1 && (
            <div className="flex justify-end pt-1">
              <button
                onClick={handleNextProblem}
                className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition flex items-center gap-1.5"
              >
                <span>Lanjut ke Kasus Soal {problemIndex + 2}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Next Step Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onComplete}
          disabled={!allCompleted}
          className="py-3 px-6 rounded-xl font-bold text-white bg-sky-600 hover:bg-sky-700 active:scale-98 disabled:opacity-40 disabled:pointer-events-none shadow-sm transition flex items-center gap-2 text-sm"
        >
          <span>Lanjut ke Tahap 8: Laboratorium & Kuis Tantangan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
