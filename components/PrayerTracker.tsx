
import React from 'react';
import { DailyPrayerTracker, PrayerStatus, ImsakiyahTime } from '../types';

interface Props {
  data: DailyPrayerTracker;
  onChange: (key: keyof DailyPrayerTracker, status: PrayerStatus) => void;
  times: ImsakiyahTime;
  isDarkMode: boolean;
  locationName: string;
  isLoading?: boolean;
}

const PrayerTracker: React.FC<Props> = ({ data, onChange, times, isDarkMode, locationName, isLoading }) => {
  const prayers: { id: keyof DailyPrayerTracker; label: string; time: string }[] = [
    { id: 'subuh', label: 'Subuh', time: times.subuh },
    { id: 'dzuhur', label: 'Dzuhur', time: times.dzuhur },
    { id: 'ashar', label: 'Ashar', time: times.ashar },
    { id: 'maghrib', label: 'Maghrib', time: times.maghrib },
    { id: 'isya', label: 'Isya', time: times.isya },
    { id: 'tarawih', label: 'Tarawih', time: '19:45' },
  ];

  const getStatusColor = (status: PrayerStatus) => {
    switch (status) {
      case 'jamaah': return 'bg-emerald-500 text-white';
      case 'sendiri': return 'bg-blue-500 text-white';
      case 'missed': return 'bg-rose-500 text-white';
      default: return isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <div className={`rounded-2xl shadow-sm border p-6 transition-colors duration-300 relative ${
      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
    }`}>
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-2xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      )}
      
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between">
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Jadwal Sholat & Tracker</h3>
          <div className={`text-sm font-medium px-3 py-1 rounded-full border ${
            isDarkMode 
              ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800/50' 
              : 'bg-emerald-50 text-emerald-700 border-emerald-100'
          }`}>
            Imsak: {times.imsak}
          </div>
        </div>
        <div className={`text-[10px] font-medium uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          {locationName} (Kemenag RI)
        </div>
      </div>
      
      <div className="space-y-4">
        {prayers.map((prayer) => (
          <div key={prayer.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-colors ${
            isDarkMode 
              ? 'bg-slate-900/50 border-slate-700 hover:border-emerald-500/50' 
              : 'bg-slate-50/50 border-slate-100 hover:border-emerald-200'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 flex items-center justify-center rounded-lg shadow-sm font-bold ${
                isDarkMode ? 'bg-slate-800 text-emerald-400' : 'bg-white text-emerald-600'
              }`}>
                {prayer.time}
              </div>
              <div>
                <p className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{prayer.label}</p>
                <p className={`text-xs capitalize ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{data[prayer.id] || 'Belum diisi'}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {(['jamaah', 'sendiri', 'missed'] as PrayerStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => onChange(prayer.id, data[prayer.id] === status ? 'none' : status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all transform active:scale-95 ${
                    data[prayer.id] === status ? getStatusColor(status) : 
                    isDarkMode 
                      ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {status === 'jamaah' ? 'Jamaah' : status === 'sendiri' ? 'Munfarid' : 'Lewat'}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrayerTracker;
