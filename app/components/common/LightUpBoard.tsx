'use client';

import React, { forwardRef, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Utility to split string
function splitString(str: string, type: 'word' | 'letter' = 'letter') {
  if (type === 'word') {
    return str.split(' ').map((segment, i) => {
      if (segment === '[BR]') return <br key={`br-${i}`} />;
      return segment + '\u00A0';
    });
  }
  const segments = str.split('[BR]');
  const output: (string | React.ReactElement)[] = [];
  segments.forEach((segment, segIndex) => {
    const words = segment.split(' ');
    words.forEach((word) => {
      word.split('').forEach((char) => output.push(char));
      if (word.length > 0) output.push('\u00A0');
    });
    if (segIndex < segments.length - 1) output.push(<br key={`br-${segIndex}`} />);
  });
  return output;
}

const SplitStringBlock = forwardRef<HTMLDivElement, any>(({ text, padding, staggerType, clipPathBottom }, ref) => {
  const items = splitString(text, staggerType);
  return (
    <div ref={ref} className="overflow-hidden">
      {items.map((char, i) => (
        <div
          key={i}
          className={
            typeof char === 'string' && char.trim() === ''
              ? 'inline-block transform-gpu whitespace-pre'
              : typeof char === 'string'
              ? `inline-block transform-gpu ${padding} will-change-transform`
              : ''
          }
          style={{ clipPath: `inset(0 0 ${clipPathBottom}% 0)` }}
        >
          {char === '\u00A0' ? ' ' : char}
        </div>
      ))}
    </div>
  );
});
SplitStringBlock.displayName = 'SplitStringBlock';

const AnimatedLine = ({
  text,
  line = false,
  delay = 0,
  padding = 'pb-1',
  headingTextPosition = 'start',
  className = '',
  staggerType = 'word',
  clipPathBottom = 14,
  yPositionInitial = 0,
  yPositionEnd = 0,
  opacityInitial = 0,
  opacityEnd = 1,
  duration = 1.5,
  staggerEachAmount = 0.05,
  easeType = 'expo.out',
  blurInitial = 0,
  blurEnd = 0,
}: any) => {
  const headingTextPositions: any = {
    start: 'justify-start md:justify-start',
    center: 'justify-center md:justify-center',
    end: 'justify-end md:justify-end',
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const containerEl = containerRef.current;
    const lineEl = lineRef.current;
    const letters = textBlockRef.current?.querySelectorAll('div');

    if (!containerEl || !letters?.length) return;

    gsap.set(letters, {
      y: yPositionInitial,
      opacity: opacityInitial,
      filter: `blur(${blurInitial}px)`,
    });
    gsap.set(lineEl, { width: 0 });

    if (line) {
      gsap.to(lineEl, {
        width: '100%',
        duration: 1.5,
        ease: 'power2.out',
        delay,
      });
    }

    gsap.timeline({
      scrollTrigger: {
        trigger: containerEl,
        start: 'top bottom',
        end: 'bottom top',
        toggleActions: 'play none none reverse',
      },
    }).to(letters, {
      delay: delay,
      y: yPositionEnd,
      opacity: opacityEnd,
      filter: `blur(${blurEnd}px)`,
      duration,
      stagger: { each: staggerEachAmount },
      ease: easeType,
    });
  }, { scope: containerRef });

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ paddingTop: 0 }}>
      <div
        ref={containerRef}
        style={{ clipPath: `inset(0 0 ${clipPathBottom}% 0)` }}
        className={`flex items-center ${headingTextPositions[headingTextPosition]} pb-0`}
      >
        <SplitStringBlock
          ref={textBlockRef}
          padding={padding}
          text={text}
          staggerType={staggerType}
          clipPathBottom={clipPathBottom}
        />
      </div>
      <div className="absolute bottom-0 z-10 h-2 w-full bg-transparent" />
      <div ref={lineRef} className={`absolute bottom-3 z-20 h-[0.05rem] bg-neutral-400 ${line ? 'block' : 'hidden'}`} />
    </div>
  );
};

const LightUpBoard = ({
  padding = 'py-10 md:py-20',
  headingTextPosition = 'start',
  contentTextPosition = 'start',
  headingLines = [],
  contentLines = [],
  backgroundColor = '#fec52d',
  textColor = 'black',
}: any) => {
  const contentTextPositions: any = {
    start: 'text-start self-start',
    center: 'text-center self-center',
    end: 'text-end self-end',
  };
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = sectionRef.current;
    if (!el) return;
    gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 50%',
        end: 'bottom top',
        toggleActions: 'play none none reverse',
      },
    }).to(el, { backgroundColor, color: textColor, duration: 0.5 });
  }, { scope: sectionRef });

  return (
    <div ref={sectionRef} className={`relative ${padding} flex flex-col`}>
      <h4 className="mb-4 flex flex-col px-4 text-[2.5rem] tracking-tight md:text-6xl xl:text-9xl">
        {headingLines.map((lineProps: any, idx: number) => (
          <AnimatedLine headingTextPosition={headingTextPosition} key={idx} {...lineProps} />
        ))}
      </h4>
      <div className={`text-md flex max-w-6xl flex-col ${contentTextPositions[contentTextPosition]} px-4 text-neutral-600 md:px-8 md:text-xl lg:text-xl`}>
        {contentLines.map((lineProps: any, idx: number) => (
          <AnimatedLine contentTextPosition={contentTextPosition} key={idx} {...lineProps} />
        ))}
      </div>
    </div>
  );
};

export default LightUpBoard;