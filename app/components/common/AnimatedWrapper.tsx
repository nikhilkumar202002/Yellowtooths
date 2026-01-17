'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedWrapperProps {
  children: React.ReactNode;
  className?: string;
  yPositionInitial?: number;
  blurInitial?: number;
  delay?: number;
  duration?: number;
}

const AnimatedWrapper = ({
  children,
  className,
  yPositionInitial = 30,
  blurInitial = 5,
  delay = 0,
  duration = 1,
}: AnimatedWrapperProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      gsap.fromTo(
        el,
        {
          y: yPositionInitial,
          opacity: 0,
          filter: `blur(${blurInitial}px)`,
        },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: duration,
          delay: delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%', // Triggers slightly before it enters fully
            toggleActions: 'play none none reverse',
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default AnimatedWrapper;