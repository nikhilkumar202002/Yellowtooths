'use client';

import React, { forwardRef, memo, useEffect, useMemo, useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { cn } from '../../lib/utils';

// Helper to convert colors to RGBA
const convertToRGBA = (color: string, opacity: number) => {
  // For simplicity, assume color is hex or rgb, convert to rgba
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
  }
  return color;
};

export interface BorderGlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  cardColor?: string;
  borderColor?: string;
  gradientSize?: number;
  gradientOpacity?: number;
  gradientFrom?: string;
  gradientTo?: string;
  cardBorderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  radialGlowSize?: number;
  radialGlowOpacity?: number;
  radialGlowColor?: string;
}

const BorderGlowCard = memo(
  forwardRef<HTMLDivElement, BorderGlowCardProps>(
    (
      {
        children,
        className,
        cardColor = 'bg-gradient-to-b from-[#0a0a0a] to-[#0d0d0d]',
        borderColor = 'bg-white/10',
        gradientSize = 200,
        gradientOpacity = 1,
        gradientFrom = '#555555',
        gradientTo = '#555555',
        cardBorderRadius = 'none',
        radialGlowSize = 300,
        radialGlowOpacity = 0.1,
        radialGlowColor = '#ffffff',
        ...props
      },
      ref
    ) => {
      const cardRef = useRef<HTMLDivElement>(null);
      const mouseX = useMotionValue(-gradientSize);
      const mouseY = useMotionValue(-gradientSize);

      const cardBorderRadiusProps = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        '3xl': 'rounded-3xl',
        full: 'rounded-full',
      };

      const isTouchDevice = useMemo(() => {
        if (typeof window === 'undefined') return false;
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      }, []);

      const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const { left, top } = cardRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
      };

      const onMouseLeave = () => {
        mouseX.set(-gradientSize);
        mouseY.set(-gradientSize);
      };

      const whiteGlowX = useMotionValue(0);
      const whiteGlowY = useMotionValue(0);

      useEffect(() => {
        whiteGlowX.set(mouseX.get());
        whiteGlowY.set(mouseY.get());
        const unsubscribeX = mouseX.on('change', (latest) => whiteGlowX.set(latest));
        const unsubscribeY = mouseY.on('change', (latest) => whiteGlowY.set(latest));
        return () => {
          unsubscribeX();
          unsubscribeY();
        };
      }, [mouseX, mouseY, whiteGlowX, whiteGlowY]);

      const whiteGlowRGBA = convertToRGBA(radialGlowColor, radialGlowOpacity);

      const setRefs = (node: HTMLDivElement | null) => {
        // @ts-ignore
        cardRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          // @ts-ignore
          ref.current = node;
        }
      };

      return (
        <div
          ref={setRefs}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          className={cn(
            'relative flex flex-col border-0 border-neutral-200 text-neutral-950 shadow-sm dark:text-neutral-50',
            borderColor,
            cardBorderRadiusProps[cardBorderRadius],
            className
          )}
          {...props}
        >
          <div
            className={cn(
              'absolute inset-0 z-10 m-[1px]',
              cardColor,
              cardBorderRadiusProps[cardBorderRadius]
            )}
          />

          <motion.div
            className={`pointer-events-none absolute inset-0 z-0 ${cardBorderRadiusProps[cardBorderRadius]} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
            style={{
              background: useMotionTemplate`
                radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientFrom}, ${gradientTo}, transparent),
                radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, #ffffff, transparent)
              `,
              opacity: gradientOpacity,
            }}
          />
          <motion.div
            className={`pointer-events-none ${cardBorderRadiusProps[cardBorderRadius]} absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
            style={{
              background: useMotionTemplate`
                radial-gradient(${radialGlowSize}px circle at ${whiteGlowX}px ${whiteGlowY}px, ${whiteGlowRGBA}, transparent)
              `,
              opacity: 1,
            }}
          />
          <div className="relative z-20">{children}</div>
        </div>
      );
    }
  )
);

BorderGlowCard.displayName = 'BorderGlowCard';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  headerPadding?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
}

const BorderGlowCardHeader = memo(
  forwardRef<HTMLDivElement, HeaderProps>(({ headerPadding = 'md', className, ...props }, ref) => {
    const headerPaddingProps = {
      none: '',
      xs: 'p-2 md:p-4',
      sm: 'p-4 md:p-6',
      md: 'p-6 md:p-8',
      lg: 'p-8 md:p-12',
    };

    return (
      <div
        ref={ref}
        className={cn('flex flex-col', headerPaddingProps[headerPadding], className)}
        {...props}
      />
    );
  })
);
BorderGlowCardHeader.displayName = 'BorderGlowCardHeader';

const BorderGlowCardTitle = memo(
  forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('text-lg font-semibold leading-none tracking-tight md:text-2xl', className)}
        {...props}
      />
    );
  })
);
BorderGlowCardTitle.displayName = 'BorderGlowCardTitle';

const BorderGlowCardDescription = memo(
  forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-xs text-neutral-500 dark:text-neutral-400 md:text-sm', className)}
      {...props}
    />
  ))
);
BorderGlowCardDescription.displayName = 'BorderGlowCardDescription';

const BorderGlowCardContent = memo(
  forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-2 pt-0', className)} {...props} />
  ))
);
BorderGlowCardContent.displayName = 'BorderGlowCardContent';

const BorderGlowCardFooter = memo(
  forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  ))
);
BorderGlowCardFooter.displayName = 'BorderGlowCardFooter';

export {
  BorderGlowCard,
  BorderGlowCardHeader,
  BorderGlowCardFooter,
  BorderGlowCardTitle,
  BorderGlowCardDescription,
  BorderGlowCardContent,
};