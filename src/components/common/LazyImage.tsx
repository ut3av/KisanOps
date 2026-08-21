import React, { useState } from 'react';
import clsx from 'clsx';
import { ImageOff } from 'lucide-react';

export interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  fallbackSrc?: string;
  aspectRatio?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  wrapperClassName,
  fallbackSrc,
  aspectRatio,
  style,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={clsx('relative overflow-hidden bg-slate-100', wrapperClassName)}
      style={{ aspectRatio, ...style }}
    >
      {/* Shimmer skeleton placeholder before image loads */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 animate-pulse" />
      )}

      {hasError && !fallbackSrc ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-2 text-center text-xs">
          <ImageOff className="w-6 h-6 mb-1 text-slate-300" />
          <span>Image unavailable</span>
        </div>
      ) : (
        <img
          src={hasError && fallbackSrc ? fallbackSrc : src}
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
          {...props}
        />
      )}
    </div>
  );
};
