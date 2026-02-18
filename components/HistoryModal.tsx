
import React from 'react';
import { DailyEntry, DailyPrayerTracker, Surah } from '../types';
import { SURAHS } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  entries: Record<string, DailyEntry>;
  ramadanDay: number;
  isDarkMode: boolean;
  onExport: () => void;
}

const HistoryModal: React.FC<Props> = ({ isOpen, onClose, entries, ramadanDay, isDarkMode, onExport }) => {
  if (!isOpen) return null;

  // Generate list of days from 1 to current ramadanDay
  const historyList = Array.from({ length: Math.max(0, ramadanDay) }, (_, i) => {
    const day = i + 1;
    // We need to find the entry. Since dateKey is ISO date, we might need a better way if users skip days.
    // But for this app, we'll look through all entries and find ones that match the Ramadan logic
    // Simplified: just filter and sort entries that exist
    return Object.values(entries).sort((a, b) => b.date.localeCompare(a.date));
  })[0] || [];

  const getPrayerSummary = (prayers: DailyPrayerTracker) => {
    const total = Object.values(prayers).filter(p => p !== 'none').length;
    const jamaah = Object.values(prayers).filter(p => p === 'jamaah').length;
    return `${jamaah}/${total} Jamaah`;
  };

  const getQuranSummary = (surahIdx: number, ayah: number) => {
    const surah = SURAHS[surahIdx];
    return `${surah.name} : ${ayah}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col transition-all transform animate-scale-in ${
        isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Riwayat Ibadah</h2>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Pantau perkembangan amal harian Anda</p>
          </div>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {historyList.length === 0 ? (
            <div className="text-center py-20">
              <p className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>Belum ada data tercatat.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`text-xs uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    <th className="pb-4 px-2 font-bold">Tanggal</th>
                    <th className="pb-4 px-2 font-bold">Sholat (Jamaah)</th>
                    <th className="pb-4 px-2 font-bold">Tilawah Terakhir</th>
                    <th className="pb-4 px-2 font-bold text-right">Infaq</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-100'}`}>
                  {historyList.map((entry) => (
                    <tr key={entry.date} className={`group transition-colors ${isDarkMode ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'}`}>
                      <td className={`py-4 px-2 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {new Date(entry.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="py-4 px-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                          isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {getPrayerSummary(entry.prayers)}
                        </span>
                      </td>
                      <td className={`py-4 px-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {getQuranSummary(entry.quran.surahIndex, entry.quran.ayah)}
                      </td>
                      <td className={`py-4 px-2 text-sm font-bold text-right ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                        Rp {entry.infaq.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className={`p-6 border-t flex flex-col sm:flex-row gap-4 items-center justify-between ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50'}`}>
          <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Total Data: {historyList.length} hari tersimpan secara lokal.
          </p>
          <div className="flex gap-3 w-full sm:w-auto">
             <button
                onClick={onExport}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-900/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Ekspor ke Excel (CSV)
              </button>
              <button
                onClick={onClose}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-sm border transition-all ${
                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Tutup
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
