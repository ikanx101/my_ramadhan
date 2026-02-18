
import React, { useState, useEffect, useMemo } from 'react';
import { RAMADAN_START_2026, MOCK_IMSAKIYAH_2026 } from './constants';
import { DailyEntry, DailyPrayerTracker, PrayerStatus, QuranProgress, ImsakiyahTime } from './types';
import PrayerTracker from './components/PrayerTracker';
import QuranTracker from './components/QuranTracker';
import InfaqTracker from './components/InfaqTracker';
import { getRamadanInsight } from './services/geminiService';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<Record<string, DailyEntry>>({});
  const [insight, setInsight] = useState<string>("");
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('ramadan_theme') as 'light' | 'dark') || 'light';
  });

  // Fixed location for static behavior
  const locationName = "Jakarta (Jadwal Tetap)";

  // Auto-date update logic
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (now.getDate() !== currentDate.getDate()) {
        setCurrentDate(now);
      }
    }, 60000);
    return () => clearInterval(timer);
  }, [currentDate]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('ramadan_theme', theme);
  }, [theme]);

  // Ramadan Context Logic
  const ramadanDay = useMemo(() => {
    const diff = Math.floor((currentDate.getTime() - RAMADAN_START_2026.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, Math.min(30, diff + 1));
  }, [currentDate]);

  const dateKey = currentDate.toISOString().split('T')[0];

  // Load persistence
  useEffect(() => {
    const saved = localStorage.getItem('ramadan_tracker_v1');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  // Save persistence
  useEffect(() => {
    if (Object.keys(entries).length > 0) {
      localStorage.setItem('ramadan_tracker_v1', JSON.stringify(entries));
    }
  }, [entries]);

  // Get Static Insight on day change
  useEffect(() => {
    const fetchInsight = async () => {
      setIsLoadingInsight(true);
      const text = await getRamadanInsight(ramadanDay);
      setInsight(text);
      setIsLoadingInsight(false);
    };
    fetchInsight();
  }, [ramadanDay]);

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
    updateEntry({
      prayers: { ...currentEntry.prayers, [prayer]: status }
    });
  };

  const handleQuranChange = (quranUpdates: Partial<QuranProgress>) => {
    updateEntry({
      quran: { ...currentEntry.quran, ...quranUpdates }
    });
  };

  const handleInfaqChange = (amount: number) => {
    updateEntry({ infaq: amount });
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Always use fixed mock data for 2026 to ensure zero API dependency
  const imsakiyah = MOCK_IMSAKIYAH_2026[ramadanDay - 1];

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-500 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Header Section */}
      <div className={`relative overflow-hidden pt-12 pb-24 px-4 sm:px-6 transition-colors duration-500 ${isDarkMode ? 'bg-emerald-950' : 'bg-emerald-700 text-white'}`}>
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-20 -mt-20 transition-opacity ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-600/30'}`}></div>
        
        {/* Theme Toggle Button */}
        <div className="max-w-4xl mx-auto absolute top-6 right-6 z-50">
           <button 
             onClick={toggleTheme}
             className={`p-2 rounded-full backdrop-blur-md border transition-all ${
               isDarkMode 
                 ? 'bg-white/10 border-white/20 text-emerald-400 hover:bg-white/20' 
                 : 'bg-emerald-800/40 border-emerald-500/30 text-emerald-100 hover:bg-emerald-800/60'
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
              <p className={`font-medium mb-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-100'}`}>Marhaban Ya Ramadhan 1447 H</p>
              <h1 className="text-4xl sm:text-5xl font-bold font-arabic mb-4">My Ramadhan Tracker</h1>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1.5 backdrop-blur rounded-full text-lg font-bold border transition-all ${
                  isDarkMode 
                    ? 'bg-emerald-900/50 border-emerald-500/50 text-emerald-400' 
                    : 'bg-emerald-800/50 border-emerald-500/30 text-white'
                }`}>
                  Hari ke-{ramadanDay}
                </span>
                <span className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-emerald-100'}`}>
                  {currentDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
            
            <div className={`backdrop-blur p-4 rounded-2xl border transition-all ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/10 border-white/20'
            }`}>
              <p className={`text-xs uppercase tracking-wider mb-1 font-bold ${isDarkMode ? 'text-emerald-500' : 'text-emerald-200'}`}>Mutiara Hikmah</p>
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

      {/* Main Content Dashboard */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 -mt-12 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <PrayerTracker 
              data={currentEntry.prayers} 
              onChange={handlePrayerChangeInternal} 
              times={imsakiyah}
              isDarkMode={isDarkMode}
              locationName={locationName}
            />
          </div>

          <div className="space-y-6">
            <QuranTracker 
              progress={currentEntry.quran} 
              onChange={handleQuranChange} 
              isDarkMode={isDarkMode}
            />
            <InfaqTracker 
              amount={currentEntry.infaq} 
              onChange={handleInfaqChange} 
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* Weekly Stats Summary */}
        <div className={`rounded-3xl p-8 border shadow-sm transition-all ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
        }`}>
          <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Ringkasan Amal Ramadhan</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-2xl text-center transition-all ${isDarkMode ? 'bg-emerald-900/20' : 'bg-emerald-50'}`}>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                {Object.values(currentEntry.prayers).filter(p => p === 'jamaah').length}
              </p>
              <p className={`text-xs font-medium ${isDarkMode ? 'text-emerald-500' : 'text-emerald-600'}`}>Sholat Jamaah</p>
            </div>
            <div className={`p-4 rounded-2xl text-center transition-all ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                {currentEntry.quran.ayah}
              </p>
              <p className={`text-xs font-medium ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>Ayat Dibaca</p>
            </div>
            <div className={`p-4 rounded-2xl text-center transition-all ${isDarkMode ? 'bg-amber-900/20' : 'bg-amber-50'}`}>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                Rp {currentEntry.infaq.toLocaleString('id-ID')}
              </p>
              <p className={`text-xs font-medium ${isDarkMode ? 'text-amber-500' : 'text-amber-600'}`}>Total Infaq</p>
            </div>
            <div className={`p-4 rounded-2xl text-center transition-all ${isDarkMode ? 'bg-rose-900/20' : 'bg-rose-50'}`}>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-rose-400' : 'text-rose-700'}`}>
                {30 - ramadanDay}
              </p>
              <p className={`text-xs font-medium ${isDarkMode ? 'text-rose-500' : 'text-rose-600'}`}>Hari Tersisa</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Attribution */}
      <footer className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
        <p className={`text-xs font-medium transition-colors duration-300 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Dibuat oleh <a href="https://ikanx101.com/" target="_blank" rel="noopener noreferrer" className={`underline underline-offset-2 transition-colors ${isDarkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'}`}>ikanx101.com</a>
        </p>
      </footer>
    </div>
  );
};

export default App;
