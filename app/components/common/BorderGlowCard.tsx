'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface BorderGlowCardProps {
  children: React.ReactNode;
  className?: string;
  cardColor?: string;
  borderColor?: string;
  cardBorderRadius?: string;
  // Props for backward compatibility with your Vite usage
  radialGlowSize?: number;
  gradientOpacity?: number;
}

export const BorderGlowCard = ({
  children,
  className,
  cardColor = 'bg-neutral-900',
  borderColor = 'bg-white/10',
  cardBorderRadius = '2xl',
}: BorderGlowCardProps) => {
  const radiusClass = {
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    'xl': 'rounded-xl',
    'lg': 'rounded-lg',
  }[cardBorderRadius] || 'rounded-2xl';

  return (
    <div className={cn(`relative p-[1px] overflow-hidden ${radiusClass} ${borderColor}`, className)}>
      <div className={cn(`relative h-full w-full ${radiusClass} ${cardColor} overflow-hidden`)}>
        {children}
      </div>
    </div>
  );
};

export const BorderGlowCardContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn('h-full w-full', className)}>{children}</div>;
};

export const BorderGlowCardHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  headerPadding?: string; // Kept for compatibility
}) => {
  return <div className={cn('p-6', className)}>{children}</div>;
};