import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface Props {
  onClose: () => void;
  onComplete: (otp: string) => void;
  summary: {
    hours: number;
    fuel: number;
    acres: number;
  };
}

export const JobCompletionModal: React.FC<Props> = ({ onClose, onComplete, summary }) => {
  const [otp, setOtp] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" /> Job Summary
          </h2>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6 text-center">
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-xl font-bold text-slate-800 dark:text-white">{summary.hours.toFixed(1)}</div>
            <div className="text-xs text-slate-500">Hours</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-xl font-bold text-slate-800 dark:text-white">{summary.fuel.toFixed(1)}</div>
            <div className="text-xs text-slate-500">Liters</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-xl font-bold text-slate-800 dark:text-white">{summary.acres.toFixed(1)}</div>
            <div className="text-xs text-slate-500">Acres</div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Farmer OTP Confirmation
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 4-digit OTP"
            className="w-full text-center text-2xl tracking-widest p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-emerald-500 outline-none"
            maxLength={4}
          />
        </div>

        <button
          onClick={() => onComplete(otp)}
          disabled={otp.length < 4}
          className="w-full h-14 bg-emerald-600 disabled:bg-slate-300 disabled:text-slate-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <ShieldCheck className="w-6 h-6" />
          Complete & Generate Invoice
        </button>
      </div>
    </div>
  );
};
