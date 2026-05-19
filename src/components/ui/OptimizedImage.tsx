import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Skeleton } from './Skeleton';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
}

export function OptimizedImage({ className, fallback, alt, ...props }: OptimizedImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const showImage = props.src && !error;

  return (
    <div className={cn("relative overflow-hidden flex items-center justify-center", className)}>
      {loading && showImage && (
        <Skeleton className="absolute inset-0" />
      )}
      {!showImage ? (
        fallback || <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-400 text-xs p-2 text-center">Image unavailable</div>
      ) : (
        <img
          {...props}
          alt={alt}
          className={cn(
            "transition-opacity duration-700 ease-in-out object-contain",
            loading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
          loading="lazy"
        />
      )}
    </div>
  );
}
