'use client';

import React, { memo, useRef, forwardRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useSelector } from 'react-redux';

// Ensure ScrollTrigger is registered
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ContentWrapperProps {
  content: string;
  padding?: string;
  gradient?: string;
  clipPathBottom?: number;
  staggerType?: 'word' | 'letter';
}

const ContentWrapper = memo(({ content, padding, gradient, clipPathBottom, staggerType }: ContentWrapperProps) => (
  <div className="inline-block overflow-hidden pr-[0] md:pr-[0]">
    {staggerType === 'word' ? (
      <div
        className={`inline-block transform-gpu ${padding}`}
        style={{
          clipPath: `inset(0 0 ${clipPathBottom}% 0)`,
          background: gradient || 'none',
          WebkitBackgroundClip: gradient ? 'text' : 'unset',
          WebkitTextFillColor: gradient ? 'transparent' : 'unset',
        }}
      >
        {content}
      </div>
    ) : (
      Array.from(content).map((letter, i) => (
        <div
          key={i}
          className={`inline-block transform-gpu ${padding}`}
          style={{
            clipPath: `inset(0 0 ${clipPathBottom}% 0)`,
            background: gradient || 'none',
            WebkitBackgroundClip: gradient ? 'text' : 'unset',
            WebkitTextFillColor: gradient ? 'transparent' : 'unset',
          }}
        >
          {letter}
        </div>
      ))
    )}
  </div>
));

ContentWrapper.displayName = 'ContentWrapper';

const SplitContent = memo(
  forwardRef<HTMLDivElement, any>(
    ({ string, padding, staggerType, textPosition, gradient, clipPathBottom }, ref) => (
      <div ref={ref} className={`flex w-full flex-wrap ${textPosition} md:${textPosition}`}>
        {string.split(/(\[BR\]|\s+)/).map((segment: string, i: number) => {
          if (segment === '[BR]') return <br key={i} />;
          if (/^\s+$/.test(segment)) return <span key={i}>&nbsp;</span>;
          if (segment)
            return (
              <ContentWrapper
                key={i}
                content={segment}
                gradient={gradient}
                clipPathBottom={clipPathBottom}
                padding={padding}
                staggerType={staggerType}
              />
            );
          return null;
        })}
      </div>
    ),
  ),
);

SplitContent.displayName = 'SplitContent';

const GradientTextAnimation = memo(
  ({
    string = '',
    line = false,
    textPosition = 'start',
    delay = 0,
    padding = 'pb-0.5 md:pb-1',
    classname = '',
    staggerType = 'word',
    clipPathBottom = 0,
    yPositionInitial = 0,
    yPositionEnd = 0,
    opacityInitial = 0,
    opacityEnd = 1,
    duration = 1.5,
    staggerEachAmount = 0.05,
    easeType = 'expo.out',
    lineBottom = 'bottom-1.5 md:bottom-0.5 lg:bottom-0.5',
    startAnimationOnPreloader = false,
    blurInitial = 0,
    blurEnd = 0,
    useScrollTrigger = true,
    gradient = 'linear-gradient(to bottom, #ffffff, #8a8a8a)',
  }: any) => {
    const textPositionProps: any = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
    };

    const headingRef = useRef<HTMLDivElement>(null);
    const headingLineRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Assuming your Redux store is typed, otherwise use any
    const isPreloaderLoaded = useSelector((state: any) => state.preloaderSlice?.isPreloaderLoaded ?? true);

    useGSAP(
      () => {
        if (
          (!isPreloaderLoaded && startAnimationOnPreloader) ||
          !headingRef.current ||
          !contentRef.current
        )
          return;

        const elements = contentRef.current.querySelectorAll('.transform-gpu');
        if (!elements.length) return;

        const initialState = {
          y: yPositionInitial,
          opacity: opacityInitial,
          filter: `blur(${blurInitial}px)`,
        };

        gsap.set(elements, initialState);
        if (line && headingLineRef.current) gsap.set(headingLineRef.current, { width: '0%' });

        const timeline = gsap.timeline({
          delay,
          scrollTrigger: useScrollTrigger
            ? {
                trigger: headingRef.current,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse',
                markers: false,
              }
            : undefined,
        });

        if (line && headingLineRef.current) {
          timeline.to(headingLineRef.current, {
            width: '100%',
            duration: 1.5,
            ease: 'power2.out',
          });
        }

        timeline.to(elements, {
          y: yPositionEnd,
          opacity: opacityEnd,
          filter: `blur(${blurEnd}px)`,
          duration,
          ease: easeType,
          stagger: { each: staggerEachAmount, from: 'start' },
        });
      },
      { dependencies: [isPreloaderLoaded] },
    );

    return (
      <div
        className={`relative mx-0 my-0 flex w-full flex-col pt-0 md:mx-0 ${
          textPositionProps[textPosition] || 'justify-start'
        } ${classname}`}
      >
        <div
          ref={headingRef}
          style={{ clipPath: `inset(0 0 ${clipPathBottom}% 0)` }}
          className={'flex px-0 pb-0'}
        >
          <SplitContent
            textPosition={textPositionProps[textPosition]}
            ref={contentRef}
            string={string}
            gradient={gradient}
            clipPathBottom={clipPathBottom}
            padding={padding}
            staggerType={staggerType}
          />
        </div>
        {line && (
          <div
            ref={headingLineRef}
            className={`absolute ${lineBottom} z-20 h-[0.05rem] bg-neutral-400 lg:bottom-3`}
          />
        )}
      </div>
    );
  },
);

GradientTextAnimation.displayName = 'GradientTextAnimation';

export default GradientTextAnimation;