import React, { useState } from 'react';
import { ArrowRight, ArrowDownRight, ArrowUpRight, CheckCircle2, Shuffle, Sparkles, BookCheck } from 'lucide-react';
import { playSuccess, playHint } from '../../utils/audio';

interface Step4RelationSummaryProps {
  onComplete: () => void;
}

interface MatchChallenge {
  id: string;
  activity: string;
  effect: string;
  sign: '+' | '-';
  resultType: 'Positif' | 'Negatif';
  example: string;
}

export const Step4RelationSummary: React.FC<Step4RelationSummaryProps> = ({ onComplete }) => {
  // Mini interactive drill
  const [selectedMatch, setSelectedMatch] = useState<{
    q1Sign?: string;
    q1Type?: string;
    q2Sign?: string;
    q2Type?: string;
  }>({});

  const [drillChecked, setDrillChecked] = useState(false);
  const [drillCorrect, setDrillCorrect] = useState(false);

  const handleCheckDrill = () => {
    const isQ1Correct = selectedMatch.q1Sign === '+' && selectedMatch.q1Type === 'positif';
    const isQ2Correct = selectedMatch.q2Sign === '-' && selectedMatch.q2Type === 'negatif';
    const correct = isQ1Correct && isQ2Correct;
    setDrillCorrect(correct);
    setDrillChecked(true);

    if (correct) {
      playSuccess();
    } else {
      playHint();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Title */}
      <div className="border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
          <BookCheck className="w-4 h-4" />
          <span>Tahap 4: Hubungan Aktivitas, Tanda, dan Bilangan</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">
          Menghubungkan Perubahan Fisik dengan Simbol Matematika
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Bukan sekadar hafalan rumus! Simbol matematika tercipta dari apa yang terjadi nyata pada air kolam.
        </p>
      </div>

      {/* Conceptual Diagram Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Penambahan Air */}
        <div className="bg-sky-50/70 border border-sky-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-800 tracking-wide">
                KASUS 1: AIR DITUANGKAN KE KOLAM
              </span>
              <span className="text-lg">💧➕</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mt-2">
              Aktivitas Menambahkan Air
            </h3>

            {/* Step flow */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 bg-white/90 p-2.5 rounded-lg border border-sky-200 text-xs">
                <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <span className="text-slate-700">Air dituangkan ke dalam kolam</span>
              </div>

              <div className="flex justify-center text-sky-600">
                <ArrowDownRight className="w-4 h-4" />
              </div>

              <div className="flex items-center gap-2 bg-white/90 p-2.5 rounded-lg border border-sky-200 text-xs">
                <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <span className="text-slate-700">Permukaan air <strong>bertambah / naik</strong></span>
              </div>

              <div className="flex justify-center text-sky-600">
                <ArrowDownRight className="w-4 h-4" />
              </div>

              <div className="flex items-center gap-2 bg-white/90 p-2.5 rounded-lg border border-sky-200 text-xs">
                <span className="w-6 h-6 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center shrink-0">
                  +
                </span>
                <span className="text-slate-700">Dilambangkan dengan tanda <strong>tambah (+)</strong></span>
              </div>

              <div className="flex justify-center text-sky-600">
                <ArrowDownRight className="w-4 h-4" />
              </div>

              <div className="flex items-center gap-2 bg-sky-600 text-white p-2.5 rounded-lg text-xs font-semibold shadow-xs">
                <span>Hasil:</span>
                <span>Menghasilkan <strong>Bilangan Positif</strong></span>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-sky-200 text-center font-mono text-sm font-bold text-sky-800">
            Contoh: 0 + 4 = 4
          </div>
        </div>

        {/* Card 2: Pengurangan Air */}
        <div className="bg-rose-50/70 border border-rose-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800 tracking-wide">
                KASUS 2: AIR DICIDUK DARI KOLAM
              </span>
              <span className="text-lg">🪣➖</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mt-2">
              Aktivitas Mengambil Air
            </h3>

            {/* Step flow */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 bg-white/90 p-2.5 rounded-lg border border-rose-200 text-xs">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <span className="text-slate-700">Air diambil dari dalam kolam</span>
              </div>

              <div className="flex justify-center text-rose-600">
                <ArrowDownRight className="w-4 h-4" />
              </div>

              <div className="flex items-center gap-2 bg-white/90 p-2.5 rounded-lg border border-rose-200 text-xs">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <span className="text-slate-700">Permukaan air <strong>berkurang / turun di bawah 0</strong></span>
              </div>

              <div className="flex justify-center text-rose-600">
                <ArrowDownRight className="w-4 h-4" />
              </div>

              <div className="flex items-center gap-2 bg-white/90 p-2.5 rounded-lg border border-rose-200 text-xs">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center shrink-0">
                  -
                </span>
                <span className="text-slate-700">Dilambangkan dengan tanda <strong>kurang (-)</strong></span>
              </div>

              <div className="flex justify-center text-rose-600">
                <ArrowDownRight className="w-4 h-4" />
              </div>

              <div className="flex items-center gap-2 bg-rose-600 text-white p-2.5 rounded-lg text-xs font-semibold shadow-xs">
                <span>Hasil:</span>
                <span>Menghasilkan <strong>Bilangan Negatif</strong></span>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-rose-200 text-center font-mono text-sm font-bold text-rose-800">
            Contoh: 0 - 4 = -4
          </div>
        </div>
      </div>

      {/* Interactive Verification Drill */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Uji Konsep Hubungan Aktivitas & Simbol:</span>
        </div>

        <div className="space-y-4 text-xs">
          {/* Situation 1 */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <p className="font-semibold text-slate-800">
              Situasi A: &ldquo;Andi menuangkan 5 ember air ke dalam kolam yang awalnya berada pada posisi 0.&rdquo;
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Tanda operasi:</span>
                <select
                  value={selectedMatch.q1Sign || ''}
                  onChange={(e) => setSelectedMatch((prev) => ({ ...prev, q1Sign: e.target.value }))}
                  className="border border-slate-300 rounded-md px-2 py-1 bg-white font-bold"
                >
                  <option value="">Pilih</option>
                  <option value="+">Tambah (+)</option>
                  <option value="-">Kurang (-)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Jenis bilangan yang dihasilkan:</span>
                <select
                  value={selectedMatch.q1Type || ''}
                  onChange={(e) => setSelectedMatch((prev) => ({ ...prev, q1Type: e.target.value }))}
                  className="border border-slate-300 rounded-md px-2 py-1 bg-white font-bold"
                >
                  <option value="">Pilih</option>
                  <option value="positif">Bilangan Positif</option>
                  <option value="negatif">Bilangan Negatif</option>
                </select>
              </div>
            </div>
          </div>

          {/* Situation 2 */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <p className="font-semibold text-slate-800">
              Situasi B: &ldquo;Andi mengambil 3 ember air dari dalam kolam yang awalnya berada pada posisi 0.&rdquo;
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Tanda operasi:</span>
                <select
                  value={selectedMatch.q2Sign || ''}
                  onChange={(e) => setSelectedMatch((prev) => ({ ...prev, q2Sign: e.target.value }))}
                  className="border border-slate-300 rounded-md px-2 py-1 bg-white font-bold"
                >
                  <option value="">Pilih</option>
                  <option value="+">Tambah (+)</option>
                  <option value="-">Kurang (-)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Jenis bilangan yang dihasilkan:</span>
                <select
                  value={selectedMatch.q2Type || ''}
                  onChange={(e) => setSelectedMatch((prev) => ({ ...prev, q2Type: e.target.value }))}
                  className="border border-slate-300 rounded-md px-2 py-1 bg-white font-bold"
                >
                  <option value="">Pilih</option>
                  <option value="positif">Bilangan Positif</option>
                  <option value="negatif">Bilangan Negatif</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Check Button & Feedback */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleCheckDrill}
            className="py-2 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition"
          >
            Periksa Jawaban
          </button>

          {drillChecked && (
            <div className="text-xs">
              {drillCorrect ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Luar biasa! Kamu sudah memahami kaitan antara aktivitas kolam dan simbol matematika.
                </span>
              ) : (
                <span className="text-rose-600 font-semibold">
                  Masih ada yang belum sesuai. Ingat: menuang = bertambah (+) = positif, mengambil = berkurang (-) = negatif.
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Next Step Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onComplete}
          disabled={!drillCorrect}
          className="py-3 px-6 rounded-xl font-bold text-white bg-sky-600 hover:bg-sky-700 active:scale-98 disabled:opacity-40 disabled:pointer-events-none shadow-sm transition flex items-center gap-2 text-sm"
        >
          <span>Lanjut ke Tahap 5: Menuliskan Operasi Matematika</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
