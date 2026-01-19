'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface HorizontalInfiniteSliderProps {
  children: React.ReactNode;
  gap?: string;
  duration?: number;
  reverse?: boolean;
  vertical?: boolean;
  className?: string;
}

const HorizontalInfiniteSlider = ({
  children,
  gap = 'gap-4',
  duration = 40,
  reverse = false,
  vertical = false,
  className,
}: HorizontalInfiniteSliderProps) => {
  return (
    <div
      className={cn(
        'group flex overflow-hidden p-2',
        vertical ? 'flex-col h-full' : 'flex-row w-full',
        gap,
        className
      )}
    >
      <div
        className={cn(
          'flex shrink-0 justify-around',
          gap,
          vertical ? 'animate-marquee-vertical flex-col' : 'animate-marquee flex-row',
          reverse && 'direction-reverse' // Ensure your Tailwind config supports this or use style
        )}
        style={{
          animationDirection: reverse ? 'reverse' : 'normal',
          animationDuration: `${duration}s`,
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
};

export default HorizontalInfiniteSlider;