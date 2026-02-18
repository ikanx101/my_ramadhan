
import React from 'react';
import { SURAHS } from '../constants';
import { QuranProgress } from '../types';

interface Props {
  progress: QuranProgress;
  onChange: (updates: Partial<QuranProgress>) => void;
  isDarkMode: boolean;
}

const QuranTracker: React.FC<Props> = ({ progress, onChange, isDarkMode }) => {
  const currentSurah = SURAHS[progress.surahIndex];

  return (
    <div className={`rounded-2xl shadow-sm border p-6 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-slate-800 border-slate-700' 
        : 'bg-slate-100 border-slate-200' // Darker shading compared to other white cards
    }`}>
      <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Progres Tilawah</h3>
      
      <div className="space-y-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Pilih Surah Terakhir</label>
          <select
            value={progress.surahIndex}
            onChange={(e) => onChange({ surahIndex: parseInt(e.target.value), ayah: 1 })}
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
              value={progress.ayah}
              onChange={(e) => onChange({ ayah: Math.min(parseInt(e.target.value) || 1, currentSurah.numberOfAyahs) })}
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

        <div className={`pt-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
           <div className="flex items-center justify-between mb-2">
             <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Perkembangan Juz (Estimasi)</span>
             <span className="text-sm font-bold text-emerald-500">
               {Math.round(((progress.surahIndex + 1) / 114) * 100)}%
             </span>
           </div>
           <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-200'}`}>
             <div 
               className="bg-emerald-500 h-2 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
               style={{ width: `${((progress.surahIndex + 1) / 114) * 100}%` }}
             ></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default QuranTracker;
