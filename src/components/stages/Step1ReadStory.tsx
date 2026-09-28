import React, { useState } from 'react';
import { PondIllustration } from '../PondIllustration';
import { ArrowRight, BookOpen, CheckCircle, HelpCircle, AlertCircle } from 'lucide-react';
import { playSuccess, playHint } from '../../utils/audio';

interface Step1ReadStoryProps {
  onComplete: () => void;
}

interface QuestionItem {
  id: string;
  question: string;
  options: { label: string; isCorrect: boolean }[];
  explanation: string;
}

const QUESTIONS: QuestionItem[] = [
  {
    id: 'q1',
    question: 'Apa yang terjadi jika air ditambahkan ke dalam kolam?',
    options: [
      { label: 'Jumlah air bertambah banyak dan permukaannya naik', isCorrect: true },
      { label: 'Jumlah air berkurang dan kolam menjadi kering', isCorrect: false },
      { label: 'Jumlah air tidak mengalami perubahan sama sekali', isCorrect: false },
    ],
    explanation: 'Tepat sekali! Menambahkan air ke kolam membuat volume air bertambah banyak dan permukaan air bergerak naik ke atas.',
  },
  {
    id: 'q2',
    question: 'Apa yang terjadi jika air diambil atau diciduk dari dalam kolam?',
    options: [
      { label: 'Jumlah air bertambah meluap', isCorrect: false },
      { label: 'Jumlah air berkurang dan permukaannya bergerak turun', isCorrect: true },
      { label: 'Kolam langsung penuh dengan batu', isCorrect: false },
    ],
    explanation: 'Benar! Mengambil air membuat air di kolam berkurang sehingga permukaannya turun ke bawah.',
  },
  {
    id: 'q3',
    question: 'Berapa perubahan jumlah air untuk setiap satu ember yang digunakan?',
    options: [
      { label: '1 satuan perubahan', isCorrect: true },
      { label: '10 satuan perubahan', isCorrect: false },
      { label: 'Tidak menentu jumlahnya', isCorrect: false },
    ],
    explanation: 'Bagus! Setiap satu ember mewakili tepat 1 satuan bilangan.',
  },
];

export const Step1ReadStory: React.FC<Step1ReadStoryProps> = ({ onComplete }) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});

  const handleSelectOption = (qId: string, optIndex: number, isCorrect: boolean) => {
    setAnswers((prev) => ({ ...prev, [qId]: optIndex }));
    setShowFeedback((prev) => ({ ...prev, [qId]: true }));
    if (isCorrect) {
      playSuccess();
    } else {
      playHint();
    }
  };

  const allAnswered = QUESTIONS.every((q) => answers[q.id] !== undefined);
  const allCorrect = QUESTIONS.every((q) => {
    const selectedIdx = answers[q.id];
    return selectedIdx !== undefined && q.options[selectedIdx].isCorrect;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Title */}
      <div className="border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
          <BookOpen className="w-4 h-4" />
          <span>Tahap 1: Membaca dan Memahami Situasi</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">
          Cerita Kolam Air Milik Andi
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Pahami alur situasi sebelum masuk ke simbol matematika.
        </p>
      </div>

      {/* Story & Pond Visual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Story Box */}
        <div className="md:col-span-7 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <span>📖 Cerita Kolam:</span>
          </div>

          <blockquote className="border-l-4 border-sky-500 pl-4 py-1 text-slate-700 text-sm leading-relaxed italic bg-sky-50/40 rounded-r-md">
            &ldquo;Andi memiliki sebuah kolam. Pada awalnya, jumlah air di dalam kolam berada pada posisi <strong>0 (titik acuan normal)</strong>.
            <br /><br />
            Andi dapat <strong>menambahkan air</strong> ke dalam kolam atau <strong>mengambil air</strong> dari kolam menggunakan ember.
            <br /><br />
            Setiap satu ember menunjukkan perubahan sebanyak <strong>1 satuan</strong>.&rdquo;
          </blockquote>

          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Catatan Belajar:</strong> Kita belum memerlukan simbol plus (+) atau minus (-). Perhatikan dulu bagaimana air bergerak bertambah atau berkurang!
            </span>
          </div>
        </div>

        {/* Pond at Level 0 */}
        <div className="md:col-span-5 flex flex-col items-center">
          <PondIllustration
            level={0}
            title="Kondisi Kolam Andi Saat Ini"
            subtitle="Air tepat berada pada garis acuan 0"
            size="sm"
          />
        </div>
      </div>

      {/* Comprehension Questions */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <span>Uji Pemahaman Cerita</span>
          <span className="text-xs font-normal text-slate-500">(Jawab semua pertanyaan di bawah)</span>
        </h3>

        <div className="space-y-3">
          {QUESTIONS.map((q, qIndex) => {
            const selectedIdx = answers[q.id];
            const isAnswered = selectedIdx !== undefined;
            const isCorrect = isAnswered && q.options[selectedIdx].isCorrect;

            return (
              <div
                key={q.id}
                className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {qIndex + 1}
                  </span>
                  <div className="font-semibold text-sm text-slate-800">
                    {q.question}
                  </div>
                </div>

                {/* Option Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pl-7">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedIdx === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx, opt.isCorrect)}
                        className={`py-2 px-3 text-xs text-left rounded-lg border transition ${
                          isSelected
                            ? opt.isCorrect
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold'
                              : 'bg-rose-50 border-rose-500 text-rose-800'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback callout */}
                {isAnswered && (
                  <div
                    className={`ml-7 text-xs p-2.5 rounded-lg flex items-start gap-2 ${
                      isCorrect
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold">{isCorrect ? 'Jawaban Benar!' : 'Perhatikan Kembali:'}</p>
                      <p className="mt-0.5">{q.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion & Next Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onComplete}
          disabled={!allCorrect}
          className="py-3 px-6 rounded-xl font-bold text-white bg-sky-600 hover:bg-sky-700 active:scale-98 disabled:opacity-40 disabled:pointer-events-none shadow-sm transition flex items-center gap-2 text-sm"
        >
          <span>Lanjut ke Tahap 2: Menambahkan Air</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
