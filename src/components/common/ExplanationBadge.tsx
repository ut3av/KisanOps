import React, { useState } from 'react';
import { HelpCircle, ChevronDown, CheckCircle, Info } from 'lucide-react';
import clsx from 'clsx';

interface ExplanationBadgeProps {
  title: string;
  badgeText: string;
  badgeColor?: 'emerald' | 'blue' | 'amber' | 'purple';
  reasons: string[];
  breakdownItems?: Array<{ label: string; value: string | number; description?: string }>;
  defaultOpen?: boolean;
}

export const ExplanationBadge: React.FC<ExplanationBadgeProps> = ({
  title,
  badgeText,
  badgeColor = 'emerald',
  reasons,
  breakdownItems,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const colorStyles = {
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
    blue: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
    amber: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
    purple: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
  };

  return (
    <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-subtle transition-all">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              'inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors',
              colorStyles[badgeColor]
            )}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            {badgeText}
          </span>
          <span className="text-xs font-medium text-slate-700">{title}</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
          <span>{isOpen ? 'Hide breakdown' : 'Why this score?'}</span>
          <ChevronDown
            className={clsx('w-4 h-4 text-slate-400 transition-transform', isOpen && 'transform rotate-180')}
          />
        </div>
      </button>

      {isOpen && (
        <div className="p-3.5 bg-slate-50/80 border-t border-slate-200/80 text-xs space-y-2.5">
          {reasons.length > 0 && (
            <div className="space-y-1.5">
              <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-agri-700" />
                <span>Transparent Matching Rationale:</span>
              </div>
              <ul className="space-y-1 pl-1 text-slate-600">
                {reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-snug">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{reason.replace(/^✓\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {breakdownItems && breakdownItems.length > 0 && (
            <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {breakdownItems.map((item, idx) => (
                <div key={idx} className="bg-white p-2 rounded-lg border border-slate-200/70">
                  <div className="text-[10px] text-slate-500 font-medium">{item.label}</div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">{item.value}</div>
                  {item.description && <div className="text-[9px] text-slate-400 mt-0.5">{item.description}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
