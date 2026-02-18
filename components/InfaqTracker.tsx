
import React, { useState, useEffect } from 'react';

interface Props {
  amount: number;
  onChange: (value: number) => void;
  isDarkMode: boolean;
}

const InfaqTracker: React.FC<Props> = ({ amount, onChange, isDarkMode }) => {
  const [localAmount, setLocalAmount] = useState(amount);
  const [isSaved, setIsSaved] = useState(false);
  const presets = [10000, 25000, 50000, 100000];

  // Sync with prop when it changes (e.g., date change)
  useEffect(() => {
    setLocalAmount(amount);
  }, [amount]);

  const handleSave = () => {
    onChange(localAmount);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 1500);
  };

  const hasChanges = localAmount !== amount;

  return (
    <div className={`rounded-2xl shadow-sm border p-6 transition-all duration-300 ${
      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Infaq Hari Ini</h3>
        {isSaved && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 animate-pulse bg-emerald-500/10 px-2 py-1 rounded">
            Tersimpan
          </span>
        )}
      </div>
      
      <div className="space-y-6">
        <div className="relative">
          <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Rp</span>
          <input
            type="number"
            value={localAmount === 0 ? '' : localAmount}
            onChange={(e) => setLocalAmount(parseInt(e.target.value) || 0)}
            placeholder="0"
            className={`w-full pl-12 pr-4 py-4 rounded-2xl border text-2xl font-bold outline-none transition-all ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-700 text-white focus:ring-emerald-500' 
                : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-emerald-500'
            } ${isSaved ? 'border-emerald-500' : ''}`}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => setLocalAmount(prev => prev + p)}
              className={`py-2 px-1 rounded-xl border text-xs font-bold transition-all transform active:scale-95 ${
                isDarkMode 
                  ? 'bg-emerald-900/30 border-emerald-800 text-emerald-400 hover:bg-emerald-900/50' 
                  : 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              +{p.toLocaleString('id-ID')}
            </button>
          ))}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!hasChanges && !isSaved}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${
            hasChanges 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600' 
              : isSaved 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-600 cursor-not-allowed'
          }`}
        >
          {isSaved ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Tersimpan
            </>
          ) : (
            'Simpan Infaq'
          )}
        </button>
        
        <button
          onClick={() => setLocalAmount(0)}
          className={`w-full text-xs transition-colors ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Mulai Ulang Input
        </button>
      </div>
    </div>
  );
};

export default InfaqTracker;
