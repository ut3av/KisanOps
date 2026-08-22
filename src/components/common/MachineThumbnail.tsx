import React from 'react';
import {
  Car,
  CarFront,
  Truck,
  Tractor,
  LucideIcon
} from 'lucide-react';
import clsx from 'clsx';
import { MachineCategory } from '../../types';

interface MachineThumbnailProps {
  src?: string;
  alt?: string;
  category?: MachineCategory | string;
  className?: string;
  containerClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCategoryBadge?: boolean;
}

const VEHICLE_CONFIG: Record<
  string,
  {
    icon: LucideIcon;
    bgGradient: string;
    iconColor: string;
    badgeBg: string;
    badgeText: string;
    label: string;
  }
> = {
  HARVESTER: {
    icon: Truck,
    bgGradient: 'from-amber-600/20 via-amber-500/10 to-amber-700/30 bg-amber-50/80 border-amber-200/80',
    iconColor: 'text-amber-700',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    label: 'Harvester Unit',
  },
  TRACTOR: {
    icon: Tractor,
    bgGradient: 'from-emerald-600/20 via-emerald-500/10 to-agri-700/30 bg-emerald-50/80 border-emerald-200/80',
    iconColor: 'text-emerald-700',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    label: 'Heavy Tractor',
  },
  ROTAVATOR: {
    icon: CarFront,
    bgGradient: 'from-teal-600/20 via-teal-500/10 to-teal-700/30 bg-teal-50/80 border-teal-200/80',
    iconColor: 'text-teal-700',
    badgeBg: 'bg-teal-100',
    badgeText: 'text-teal-800',
    label: 'Rotary Tiller',
  },
  SEEDER: {
    icon: Car,
    bgGradient: 'from-lime-600/20 via-lime-500/10 to-lime-700/30 bg-lime-50/80 border-lime-200/80',
    iconColor: 'text-lime-700',
    badgeBg: 'bg-lime-100',
    badgeText: 'text-lime-800',
    label: 'Seeder Vehicle',
  },
  SPRAYER: {
    icon: Truck,
    bgGradient: 'from-sky-600/20 via-sky-500/10 to-sky-700/30 bg-sky-50/80 border-sky-200/80',
    iconColor: 'text-sky-700',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-800',
    label: 'Sprayer Truck',
  },
  DEFAULT: {
    icon: CarFront,
    bgGradient: 'from-slate-600/20 via-slate-500/10 to-slate-700/30 bg-slate-50/80 border-slate-200/80',
    iconColor: 'text-slate-700',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-800',
    label: 'Fleet Vehicle',
  },
};

export const MachineThumbnail: React.FC<MachineThumbnailProps> = ({
  category = 'TRACTOR',
  className,
  containerClassName,
  size = 'md',
  showCategoryBadge = false,
}) => {
  const catKey = (category || 'DEFAULT').toUpperCase();
  const config = VEHICLE_CONFIG[catKey] || VEHICLE_CONFIG.DEFAULT;
  const VehicleIcon = config.icon;

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-16 h-16 rounded-2xl',
    xl: 'w-24 h-24 rounded-2xl',
    full: 'w-full h-full rounded-2xl',
  };

  const isFullContainer = size === 'full';

  return (
    <div
      className={clsx(
        'relative overflow-hidden border shrink-0 flex flex-col items-center justify-center select-none shadow-2xs bg-gradient-to-br transition-all',
        config.bgGradient,
        !isFullContainer && sizeClasses[size],
        containerClassName
      )}
    >
      <VehicleIcon
        className={clsx(
          'shrink-0 drop-shadow-2xs transition-transform duration-300 hover:scale-110',
          config.iconColor,
          size === 'sm' && 'w-4 h-4',
          size === 'md' && 'w-5 h-5',
          size === 'lg' && 'w-8 h-8',
          size === 'xl' && 'w-10 h-10',
          size === 'full' && 'w-14 h-14 my-auto',
          className
        )}
      />

      {isFullContainer && (
        <div className="mt-auto pb-4 flex flex-col items-center gap-1">
          <span className={clsx('text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs', config.badgeBg, config.badgeText)}>
            {config.label}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            CHC Certified Telematics Vehicle
          </span>
        </div>
      )}

      {showCategoryBadge && !isFullContainer && (
        <div className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.2 rounded flex items-center gap-1 shadow-2xs">
          <VehicleIcon className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
          <span>{config.label}</span>
        </div>
      )}
    </div>
  );
};
