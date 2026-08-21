import React from 'react';
import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconBg?: string;
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeType = 'positive',
  icon: Icon,
  iconBg = 'bg-agri-50 text-agri-800',
  className,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle transition-all',
        onClick && 'cursor-pointer hover:border-agri-400 hover:shadow-card',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-600 mt-1">{subtitle}</p>}
        </div>
        <div className={clsx('p-3 rounded-xl flex items-center justify-center', iconBg)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {change && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5">
          <span
            className={clsx(
              'text-xs font-semibold px-2 py-0.5 rounded-full',
              changeType === 'positive' && 'bg-emerald-50 text-emerald-700',
              changeType === 'negative' && 'bg-rose-50 text-rose-700',
              changeType === 'neutral' && 'bg-slate-100 text-slate-700'
            )}
          >
            {change}
          </span>
          <span className="text-[11px] text-slate-600">vs last 7 days</span>
        </div>
      )}
    </div>
  );
};
