import React, { useState } from 'react';
import {
  Tractor,
  Layers,
  Wrench,
  Droplets,
  CloudRain,
  Radio,
  Cpu,
  Sparkles,
  Cog,
  LucideIcon
} from 'lucide-react';
import clsx from 'clsx';
import { MachineCategory } from '../../types';

interface MachineThumbnailProps {
  src?: string;
  alt: string;
  category?: MachineCategory | string;
  className?: string;
  containerClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCategoryBadge?: boolean;
}

const CATEGORY_CONFIG: Record<
  string,
  {
    icon: LucideIcon;
    bgColor: string;
    iconColor: string;
    label: string;
    gradient: string;
  }
> = {
  HARVESTER: {
    icon: Cpu,
    bgColor: 'bg-amber-100',
    iconColor: 'text-amber-700',
    label: 'Harvester',
    gradient: 'from-amber-600/20 via-amber-500/10 to-amber-700/30',
  },
  TRACTOR: {
    icon: Tractor,
    bgColor: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    label: 'Tractor',
    gradient: 'from-emerald-600/20 via-emerald-500/10 to-agri-700/30',
  },
  ROTAVATOR: {
    icon: Cog,
    bgColor: 'bg-teal-100',
    iconColor: 'text-teal-700',
    label: 'Rotavator',
    gradient: 'from-teal-600/20 via-teal-500/10 to-teal-700/30',
  },
  SEEDER: {
    icon: Layers,
    bgColor: 'bg-lime-100',
    iconColor: 'text-lime-700',
    label: 'Seeder',
    gradient: 'from-lime-600/20 via-lime-500/10 to-lime-700/30',
  },
  SPRAYER: {
    icon: Droplets,
    bgColor: 'bg-sky-100',
    iconColor: 'text-sky-700',
    label: 'Sprayer',
    gradient: 'from-sky-600/20 via-sky-500/10 to-sky-700/30',
  },
  DRONE: {
    icon: Radio,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-700',
    label: 'Agri Drone',
    gradient: 'from-purple-600/20 via-purple-500/10 to-purple-700/30',
  },
  DEFAULT: {
    icon: Tractor,
    bgColor: 'bg-slate-100',
    iconColor: 'text-slate-700',
    label: 'Machinery',
    gradient: 'from-slate-600/20 via-slate-500/10 to-slate-700/30',
  },
};

export const MachineThumbnail: React.FC<MachineThumbnailProps> = ({
  src,
  alt,
  category = 'TRACTOR',
  className,
  containerClassName,
  size = 'md',
  showCategoryBadge = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const catKey = (category || 'DEFAULT').toUpperCase();
  const config = CATEGORY_CONFIG[catKey] || CATEGORY_CONFIG.DEFAULT;
  const CategoryIcon = config.icon;

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg text-xs',
    md: 'w-10 h-10 rounded-xl text-sm',
    lg: 'w-16 h-16 rounded-2xl text-base',
    xl: 'w-24 h-24 rounded-2xl text-lg',
    full: 'w-full h-full rounded-2xl',
  };

  const isFullContainer = size === 'full';
  const showFallback = !src || hasError;

  return (
    <div
      className={clsx(
        'relative overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0 flex items-center justify-center select-none shadow-2xs',
        !isFullContainer && sizeClasses[size],
        containerClassName
      )}
    >
      {/* Fallback Display if Image Fails or is Empty */}
      {showFallback ? (
        <div
          className={clsx(
            'w-full h-full flex flex-col items-center justify-center bg-gradient-to-br transition-all',
            config.gradient,
            config.bgColor
          )}
        >
          <CategoryIcon
            className={clsx(
              'shrink-0 drop-shadow-2xs transition-transform hover:scale-110',
              config.iconColor,
              size === 'sm' && 'w-4 h-4',
              size === 'md' && 'w-5 h-5',
              size === 'lg' && 'w-7 h-7',
              size === 'xl' && 'w-9 h-9',
              size === 'full' && 'w-12 h-12'
            )}
          />
          {size === 'full' && (
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mt-2">
              {config.label} Asset
            </span>
          )}
        </div>
      ) : (
        <>
          {/* Shimmer Placeholder before load */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
          )}

          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={clsx(
              'w-full h-full object-cover transition-opacity duration-300 ease-out',
              isLoaded ? 'opacity-100' : 'opacity-0',
              className
            )}
          />
        </>
      )}

      {/* Optional Top Badge for Category */}
      {showCategoryBadge && (
        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
          <CategoryIcon className="w-3 h-3 text-emerald-400 shrink-0" />
          <span>{config.label}</span>
        </div>
      )}
    </div>
  );
};
