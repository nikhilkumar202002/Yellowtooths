'use client';

import React, { useRef, useMemo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register Plugin safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Step {
  title: string;
  description: string;
}

interface StepBlocksProps {
  steps?: Step[]; // Made optional to support your previous props style if needed
  // Supporting the specific props from your old file for backward compatibility
  textTopLeft?: string;
  textTopRight?: string;
  textBottomLeft?: string;
  textBottomRight?: string;
}

const StepBlocks = ({
  steps: propSteps,
  textTopLeft = 'Discovery',
  textTopRight = 'Strategy',
  textBottomLeft = 'Execution',
  textBottomRight = 'Launch',
}: StepBlocksProps) => {
  const stepSectionRef = useRef<HTMLDivElement>(null);

  // Normalize data: If 'steps' array is passed (new way), use it. Otherwise use individual props (old way).
  const displayData = useMemo(() => {
    if (propSteps && propSteps.length >= 4) {
      return [
        { left: propSteps[0].title, right: propSteps[1].title, variant: 'full' },
        { left: propSteps[2].title, right: propSteps[3].title, variant: 'partial' },
      ];
    }
    return [
      { left: textTopLeft, right: textTopRight, variant: 'full' },
      { left: textBottomLeft, right: textBottomRight, variant: 'partial' },
    ];
  }, [propSteps, textTopLeft, textTopRight, textBottomLeft, textBottomRight]);

  useGSAP(
    () => {
      const stepSection = stepSectionRef.current;
      if (!stepSection) return;

      const leftDivs = gsap.utils.toArray('.step-left');
      const rightDivs = gsap.utils.toArray('.step-right');

      gsap.set(leftDivs, { x: -1000 });
      gsap.set(rightDivs, { x: 1000 });

      const stepsTl = gsap.timeline({
        scrollTrigger: {
          trigger: stepSection,
          start: 'top bottom',
          end: 'bottom top',
          toggleActions: 'play none none reverse',
        },
      });

      stepsTl
        .to(leftDivs, {
          ease: 'expo.out',
          stagger: { each: 0.2, from: 'end' },
          x: 0,
          duration: 1.5,
        })
        .to(
          rightDivs,
          {
            ease: 'expo.out',
            stagger: { each: 0.2, from: 'end' },
            x: 0,
            duration: 1.5,
          },
          '-=1.5',
        );
    },
    { scope: stepSectionRef }
  );

  return (
    <section ref={stepSectionRef} className="flex w-full flex-col overflow-x-hidden py-10">
      {displayData.map(({ left, right, variant }, index) => (
        <div
          key={index}
          className={`flex w-full justify-between ${variant === 'partial' ? 'gap-4 md:gap-28' : ''}`}
        >
          {/* LEFT BLOCK */}
          <div
            className={`step-left flex h-[6vh] items-center justify-end border-b-[0.15rem] border-white/20 
            ${index === 0 ? 'bg-transparent text-white' : 'bg-transparent text-white/60'} 
            pr-4 text-right text-xs md:h-20 md:px-10 md:text-2xl font-beckman uppercase tracking-wider
            ${variant === 'full' ? 'w-[28%]' : 'w-[50%]'} 
            ${variant === 'full' ? 'md:w-[20vw]' : 'md:w-[30vw]'}`}
          >
            {left}
          </div>

          {/* RIGHT BLOCK */}
          <div
            className={`step-right flex h-[6vh] items-center justify-start border-b-[0.15rem] border-white/20 
            ${index === 0 ? 'bg-transparent text-white' : 'bg-transparent text-white/60'} 
            pl-4 text-left text-xs md:h-20 md:px-10 md:text-2xl font-beckman uppercase tracking-wider
            ${variant === 'full' ? 'w-[28%]' : 'w-[50%]'} 
            ${variant === 'full' ? 'md:w-[20vw]' : 'md:w-[30vw]'}`}
          >
            {right}
          </div>
        </div>
      ))}
    </section>
  );
};

export default StepBlocks;