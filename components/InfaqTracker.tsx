
import React from 'react';

interface Props {
  amount: number;
  onChange: (value: number) => void;
  isDarkMode: boolean;
}

const InfaqTracker: React.FC<Props> = ({ amount, onChange, isDarkMode }) => {
  const presets = [10000, 25000, 50000, 100000];

  return (
    <div className={`rounded-2xl shadow-sm border p-6 transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
    }`}>
      <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Infaq Hari Ini</h3>
      
      <div className="space-y-6">
        <div className="relative">
          <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Rp</span>
          <input
            type="number"
            value={amount === 0 ? '' : amount}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            placeholder="0"
            className={`w-full pl-12 pr-4 py-4 rounded-2xl border text-2xl font-bold outline-none transition-all ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-700 text-white focus:ring-emerald-500' 
                : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-emerald-500'
            }`}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => onChange(amount + p)}
              className={`py-2 px-1 rounded-xl border text-xs font-bold transition-colors ${
                isDarkMode 
                  ? 'bg-emerald-900/30 border-emerald-800 text-emerald-400 hover:bg-emerald-900/50' 
                  : 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              +{p.toLocaleString('id-ID')}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => onChange(0)}
          className={`w-full text-xs transition-colors ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Reset Infaq
        </button>
      </div>
    </div>
  );
};

export default InfaqTracker;
