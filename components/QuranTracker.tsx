
import React, { useState, useEffect } from 'react';
import { SURAHS } from '../constants';
import { QuranProgress } from '../types';

interface Props {
  progress: QuranProgress;
  onChange: (updates: Partial<QuranProgress>) => void;
  isDarkMode: boolean;
}

const QuranTracker: React.FC<Props> = ({ progress, onChange, isDarkMode }) => {
  const [isPulsing, setIsPulsing] = useState(false);
  // Local state to hold temporary changes before saving
  const [localSurahIndex, setLocalSurahIndex] = useState(progress.surahIndex);
  const [localAyah, setLocalAyah] = useState(progress.ayah);

  // Sync local state if parent progress changes (e.g., on initial load or date change)
  useEffect(() => {
    setLocalSurahIndex(progress.surahIndex);
    setLocalAyah(progress.ayah);
  }, [progress]);

  const currentSurah = SURAHS[localSurahIndex];

  const handleSave = () => {
    onChange({
      surahIndex: localSurahIndex,
      ayah: localAyah
    });
    
    // Visual feedback
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 1200);
  };

  const hasChanges = localSurahIndex !== progress.surahIndex || localAyah !== progress.ayah;

  return (
    <div className={`rounded-2xl shadow-sm border p-6 transition-all duration-300 ${
      isDarkMode 
        ? 'bg-slate-800 border-slate-700' 
        : 'bg-slate-100 border-slate-200' 
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Progres Tilawah</h3>
        {isPulsing && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 animate-pulse bg-emerald-500/10 px-2 py-1 rounded">
            Berhasil Disimpan
          </span>
        )}
      </div>
      
      <div className="space-y-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Pilih Surah Terakhir</label>
          <select
            value={localSurahIndex}
            onChange={(e) => {
              setLocalSurahIndex(parseInt(e.target.value));
              setLocalAyah(1); // Reset to ayah 1 when surah changes
            }}
            className={`w-full p-3 rounded-xl border outline-none transition-all ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-700 text-white focus:ring-emerald-500' 
                : 'bg-white border-slate-200 text-slate-800 focus:ring-emerald-500'
            }`}
          >
            {SURAHS.map((surah, index) => (
              <option key={surah.number} value={index}>
                {surah.number}. {surah.name} ({surah.englishName})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Ayat Terakhir</label>
            <input
              type="number"
              min="1"
              max={currentSurah.numberOfAyahs}
              value={localAyah}
              onChange={(e) => setLocalAyah(Math.min(parseInt(e.target.value) || 1, currentSurah.numberOfAyahs))}
              className={`w-full p-3 rounded-xl border outline-none transition-all ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-700 text-white focus:ring-emerald-500' 
                  : 'bg-white border-slate-200 text-slate-800 focus:ring-emerald-500'
              }`}
            />
          </div>
          <div className={`flex flex-col justify-end pb-3 text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Total {currentSurah.numberOfAyahs} Ayat
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!hasChanges && !isPulsing}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${
            hasChanges 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600' 
              : isPulsing 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-slate-200 text-slate-400 dark:bg-slate-900 dark:text-slate-600 cursor-not-allowed'
          }`}
        >
          {isPulsing ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Tersimpan
            </>
          ) : (
            'Simpan Progres'
          )}
        </button>

        <div className={`pt-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
           <div className="flex items-center justify-between mb-2">
             <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Perkembangan Juz (Estimasi)</span>
             <span className={`text-sm font-bold transition-all duration-300 transform ${
               isPulsing ? 'text-emerald-400 scale-110' : 'text-emerald-500'
             }`}>
               {Math.round(((localSurahIndex + 1) / 114) * 100)}%
             </span>
           </div>
           <div className={`w-full rounded-full h-2 overflow-hidden ${isDarkMode ? 'bg-slate-900' : 'bg-slate-200'}`}>
             <div 
               className={`h-2 rounded-full transition-all duration-500 ${
                 isPulsing ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)]' : 'bg-emerald-500'
               }`} 
               style={{ width: `${((localSurahIndex + 1) / 114) * 100}%` }}
             ></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default QuranTracker;
