
import React, { useState, useEffect, useMemo } from 'react';
import { RAMADAN_START_2026, MOCK_IMSAKIYAH_2026, SURAHS } from './constants';
import { DailyEntry, DailyPrayerTracker, PrayerStatus, QuranProgress, ImsakiyahTime } from './types';
import PrayerTracker from './components/PrayerTracker';
import QuranTracker from './components/QuranTracker';
import InfaqTracker from './components/InfaqTracker';
import HistoryModal from './components/HistoryModal';
import { getRamadanInsight } from './services/geminiService';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<Record<string, DailyEntry>>({});
  const [insight, setInsight] = useState<string>("");
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('ramadan_theme') as 'light' | 'dark') || 'light';
  });

  const locationName = "Jakarta (Jadwal Tetap)";

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('ramadan_theme', theme);
  }, [theme]);

  const trackedDate = useMemo(() => {
    const d = new Date(currentDate);
    if (d.getHours() >= 18) d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [currentDate]);

  const isNightShift = currentDate.getHours() >= 18;

  const ramadanDay = useMemo(() => {
    const startDate = new Date(RAMADAN_START_2026);
    startDate.setHours(0, 0, 0, 0);
    const diff = Math.floor((trackedDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return diff + 1;
  }, [trackedDate]);

  const isRamadan = ramadanDay >= 1 && ramadanDay <= 30;
  const dateKey = trackedDate.toISOString().split('T')[0];

  useEffect(() => {
    const saved = localStorage.getItem('ramadan_tracker_v1');
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (Object.keys(entries).length > 0) {
      localStorage.setItem('ramadan_tracker_v1', JSON.stringify(entries));
    }
  }, [entries]);

  useEffect(() => {
    const fetchInsight = async () => {
      if (isRamadan) {
        setIsLoadingInsight(true);
        const text = await getRamadanInsight(ramadanDay);
        setInsight(text);
        setIsLoadingInsight(false);
      } else {
        setInsight("Ramadhan segera tiba. Mari persiapkan diri dan hati untuk menyambut bulan penuh berkah.");
      }
    };
    fetchInsight();
  }, [ramadanDay, isRamadan]);

  const isDarkMode = theme === 'dark';

  const currentEntry: DailyEntry = entries[dateKey] || {
    date: dateKey,
    prayers: { subuh: 'none', dzuhur: 'none', ashar: 'none', maghrib: 'none', isya: 'none', tarawih: 'none' },
    quran: { surahIndex: 0, ayah: 1 },
    infaq: 0,
  };

  const updateEntry = (updates: Partial<DailyEntry>) => {
    setEntries(prev => ({
      ...prev,
      [dateKey]: { ...currentEntry, ...updates }
    }));
  };

  const handlePrayerChangeInternal = (prayer: keyof DailyPrayerTracker, status: PrayerStatus) => {
    updateEntry({ prayers: { ...currentEntry.prayers, [prayer]: status } });
  };

  const handleQuranChange = (quranUpdates: Partial<QuranProgress>) => {
    updateEntry({ quran: { ...currentEntry.quran, ...quranUpdates } });
  };

  const handleInfaqChange = (amount: number) => {
    updateEntry({ infaq: amount });
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const imsakiyahIndex = Math.max(0, Math.min(29, ramadanDay - 1));
  const imsakiyah = MOCK_IMSAKIYAH_2026[imsakiyahIndex];

  const handleExportData = () => {
    const sortedEntries = Object.values(entries).sort((a, b) => a.date.localeCompare(b.date));
    
    // Create CSV Header
    let csvContent = "Tanggal,Maghrib,Isya,Tarawih,Subuh,Dzuhur,Ashar,Surah Terakhir,Ayat,Infaq (Rp)\n";
    
    // Add Rows
    sortedEntries.forEach(entry => {
      const p = entry.prayers;
      const surah = SURAHS[entry.quran.surahIndex].name;
      const row = [
        entry.date,
        p.maghrib, p.isya, p.tarawih, p.subuh, p.dzuhur, p.ashar,
        surah,
        entry.quran.ayah,
        entry.infaq
      ].join(",");
      csvContent += row + "\n";
    });

    // Create Blob and Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Ramadhan_Tracker_2026_Export.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-500 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className={`relative overflow-hidden pt-12 pb-24 px-4 sm:px-6 transition-colors duration-500 ${isDarkMode ? 'bg-emerald-950' : 'bg-emerald-700 text-white'}`}>
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-20 -mt-20 transition-opacity ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-600/30'}`}></div>
        
        <div className="max-w-4xl mx-auto absolute top-6 right-6 z-50">
           <button 
             onClick={toggleTheme}
             className={`p-2 rounded-full backdrop-blur-md border transition-all ${
               isDarkMode ? 'bg-white/10 border-white/20 text-emerald-400 hover:bg-white/20' : 'bg-emerald-800/40 border-emerald-500/30 text-emerald-100 hover:bg-emerald-800/60'
             }`}
           >
             {isDarkMode ? (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
               </svg>
             ) : (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
               </svg>
             )}
           </button>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className={isDarkMode ? 'text-white' : ''}>
              <div className="flex items-center gap-2 mb-2">
                <p className={`font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-100'}`}>Marhaban Ya Ramadhan 1447 H</p>
                {isNightShift && (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">Malam</span>
                )}
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold font-arabic mb-4">My Ramadhan Tracker</h1>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1.5 backdrop-blur rounded-full text-lg font-bold border transition-all ${
                  isDarkMode ? 'bg-emerald-900/50 border-emerald-500/50 text-emerald-400' : 'bg-emerald-800/50 border-emerald-500/30 text-white'
                }`}>
                  {isRamadan ? `Hari ke-${ramadanDay}` : 'Segera Hadir'}
                </span>
                <span className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-emerald-100'}`}>
                  {trackedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
            
            <div className={`backdrop-blur p-4 rounded-2xl border transition-all ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/10 border-white/20'
            }`}>
              <p className={`text-xs uppercase tracking-wider mb-1 font-bold ${isDarkMode ? 'text-emerald-500' : 'text-emerald-200'}`}>
                {isRamadan ? 'Mutiara Hikmah' : 'Persiapan'}
              </p>
              {isLoadingInsight ? (
                <div className={`animate-pulse h-12 w-48 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-white/10'}`}></div>
              ) : (
                <p className={`text-sm italic leading-relaxed max-w-sm ${isDarkMode ? 'text-slate-300' : 'text-emerald-50'}`}>
                  {insight}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 -mt-12 space-y-6">
        {isNightShift && isRamadan && (
           <div className={`flex items-center gap-3 p-4 rounded-2xl border animate-fade-in ${
             isDarkMode ? 'bg-slate-800/50 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
           }`}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
               <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
             </svg>
             <span className="text-sm font-medium">Sudah memasuki waktu Maghrib, tracker beralih ke hari berikutnya.</span>
           </div>
        )}

        {isRamadan ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <PrayerTracker data={currentEntry.prayers} onChange={handlePrayerChangeInternal} times={imsakiyah} isDarkMode={isDarkMode} locationName={locationName} />
              </div>
              <div className="space-y-6">
                <QuranTracker progress={currentEntry.quran} onChange={handleQuranChange} isDarkMode={isDarkMode} />
                <InfaqTracker amount={currentEntry.infaq} onChange={handleInfaqChange} isDarkMode={isDarkMode} />
              </div>
            </div>

            <div className={`rounded-3xl p-8 border shadow-sm transition-all ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Ringkasan Amal Ramadhan</h3>
                <button 
                  onClick={() => setShowHistory(true)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 text-emerald-400 hover:bg-slate-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Lihat Riwayat & Ekspor
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-2xl text-center transition-all ${isDarkMode ? 'bg-emerald-900/20' : 'bg-emerald-50'}`}>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{Object.values(currentEntry.prayers).filter(p => p === 'jamaah').length}</p>
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-emerald-500' : 'text-emerald-600'}`}>Sholat Jamaah</p>
                </div>
                <div className={`p-4 rounded-2xl text-center transition-all ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>{currentEntry.quran.ayah}</p>
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>Ayat Dibaca</p>
                </div>
                <div className={`p-4 rounded-2xl text-center transition-all ${isDarkMode ? 'bg-amber-900/20' : 'bg-amber-50'}`}>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>Rp {currentEntry.infaq.toLocaleString('id-ID')}</p>
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-amber-500' : 'text-amber-600'}`}>Total Infaq</p>
                </div>
                <div className={`p-4 rounded-2xl text-center transition-all ${isDarkMode ? 'bg-rose-900/20' : 'bg-rose-50'}`}>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-rose-400' : 'text-rose-700'}`}>{Math.max(0, 30 - ramadanDay)}</p>
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-rose-500' : 'text-rose-600'}`}>Hari Tersisa</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className={`rounded-3xl p-12 text-center border shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
             <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Ramadhan Belum Dimulai</h2>
             <p className={`max-w-md mx-auto mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Tracker ini akan otomatis aktif pada tanggal 18 Februari 2026 pukul 18.00 WIB. Mari persiapkan diri sebaik mungkin!</p>
             <div className="flex justify-center gap-4">
                <div className={`px-6 py-3 rounded-2xl ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                   <p className="text-2xl font-bold text-emerald-500">{Math.abs(ramadanDay)}</p>
                   <p className="text-[10px] uppercase font-bold text-slate-500">Hari Menuju Ramadhan</p>
                </div>
             </div>
          </div>
        )}
      </main>

      <HistoryModal 
        isOpen={showHistory} 
        onClose={() => setShowHistory(false)} 
        entries={entries} 
        ramadanDay={ramadanDay} 
        isDarkMode={isDarkMode} 
        onExport={handleExportData}
      />

      <footer className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
        <p className={`text-xs font-medium transition-colors duration-300 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Dibuat oleh <a href="https://ikanx101.com/" target="_blank" rel="noopener noreferrer" className={`underline underline-offset-2 transition-colors ${isDarkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'}`}>ikanx101.com</a>
        </p>
      </footer>
    </div>
  );
};

export default App;
