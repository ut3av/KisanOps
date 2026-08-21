import React from 'react';
import { Sprout } from 'lucide-react';

export interface KisanLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  variant?: 'brand' | 'light' | 'dark';
  text?: string;
  subtext?: string;
  fullScreen?: boolean;
  className?: string;
}

export const KisanLoader: React.FC<KisanLoaderProps> = ({
  size = 'md',
  variant = 'brand',
  text,
  subtext,
  fullScreen = false,
  className = ''
}) => {
  // Determine pixel size
  let pixelSize = 60;
  let sizeClass = 'loader-md';

  if (typeof size === 'number') {
    pixelSize = size;
    sizeClass = '';
  } else {
    switch (size) {
      case 'sm':
        pixelSize = 36;
        sizeClass = 'loader-sm';
        break;
      case 'md':
        pixelSize = 60;
        sizeClass = 'loader-md';
        break;
      case 'lg':
        pixelSize = 80;
        sizeClass = '';
        break;
      case 'xl':
        pixelSize = 100;
        sizeClass = '';
        break;
    }
  }

  const variantClass = variant === 'light' ? 'loader-light' : 'loader';

  const loaderElement = (
    <div
      className={`loader ${variantClass} ${sizeClass} ${className}`}
      style={pixelSize ? ({ '--loader-size': `${pixelSize}px` } as React.CSSProperties) : undefined}
      aria-label="Loading..."
      role="status"
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F5FAED]/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
        <div className="p-8 rounded-3xl bg-white/90 border border-stone-200/80 shadow-2xl flex flex-col items-center text-center space-y-4 max-w-sm w-full relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-radial from-[#9dc84d]/20 to-transparent blur-xl pointer-events-none" />

          <div className="relative z-10">{loaderElement}</div>

          <div className="relative z-10 space-y-1">
            <div className="flex items-center justify-center gap-1.5 font-bold text-sm text-[#1c1d1f]">
              <img
                src="/images/yukti-logo-transparent.png"
                alt="Yukti"
                className="w-4 h-4 object-contain"
              />
              <span className="font-typewriter font-bold tracking-tight">Yukti</span>
              <span className="text-[10px] text-[#7aa32c] font-sans font-extrabold uppercase">Intelligence</span>
            </div>
            {text && (
              <div className="text-xs font-bold text-stone-800 tracking-tight">
                {text}
              </div>
            )}
            {subtext && (
              <div className="text-[11px] text-stone-500 font-medium">
                {subtext}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (text || subtext) {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-2.5 p-4">
        {loaderElement}
        {text && <div className="text-xs font-bold text-stone-800">{text}</div>}
        {subtext && <div className="text-[10px] text-stone-500">{subtext}</div>}
      </div>
    );
  }

  return loaderElement;
};

export default KisanLoader;
