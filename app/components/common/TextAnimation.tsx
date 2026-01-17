'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useAppSelector } from '../../redux/hooks'; 
import { memo, useRef, forwardRef } from 'react';

// --- CRITICAL FIX: Only register plugin on the client ---
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
// -------------------------------------------------------

interface ContentWrapperProps {
  content: string;
  padding: string;
  staggerType: 'word' | 'letter';
}

const ContentWrapper = memo(({ content, padding, staggerType }: ContentWrapperProps) => (
  <div className="inline-block overflow-hidden pr-[0] md:pr-[0.15%]">
    {staggerType === 'word' ? (
      <div className={`inline-block transform-gpu ${padding}`}>{content}</div>
    ) : (
      Array.from(content).map((letter, i) => (
        <div key={i} className={`inline-block transform-gpu ${padding}`}>
          {letter}
        </div>
      ))
    )}
  </div>
));

ContentWrapper.displayName = 'ContentWrapper';

interface SplitContentProps {
  string: string;
  padding: string;
  staggerType: 'word' | 'letter';
  textPosition: string;
}

const SplitContent = memo(
  forwardRef<HTMLDivElement, SplitContentProps>(({ string, padding, staggerType, textPosition }, ref) => (
    <div ref={ref} className={`flex w-full flex-wrap ${textPosition} md:${textPosition}`}>
      {string.split(/(\[BR\]|\s+)/).map((segment, i) => {
        if (segment === '[BR]') return <br key={i} />;
        if (/^\s+$/.test(segment)) return <span key={i}>&nbsp;</span>;
        if (segment)
          return (
            <ContentWrapper
              key={i}
              content={segment}
              padding={padding}
              staggerType={staggerType}
            />
          );
        return null;
      })}
    </div>
  )),
);

SplitContent.displayName = 'SplitContent';

interface TextAnimationProps {
  string?: string;
  line?: boolean;
  textPosition?: 'start' | 'center' | 'end';
  delay?: number;
  padding?: string;
  classname?: string;
  staggerType?: 'word' | 'letter';
  clipPathBottom?: number;
  yPositionInitial?: number;
  yPositionEnd?: number;
  opacityInitial?: number;
  opacityEnd?: number;
  duration?: number;
  staggerEachAmount?: number;
  easeType?: string;
  lineBottom?: string;
  startAnimationOnPreloader?: boolean;
  blurInitial?: number;
  blurEnd?: number;
  useScrollTrigger?: boolean;
}

const TextAnimation = memo(
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
    lineBottom = 'bottom-0 md:bottom-0 lg:bottom-0',
    startAnimationOnPreloader = false,
    blurInitial = 0,
    blurEnd = 0,
    useScrollTrigger = true,
  }: TextAnimationProps) => {
    const textPositionProps: Record<string, string> = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
    };

    const refs = {
      heading: useRef<HTMLDivElement>(null),
      headingLine: useRef<HTMLDivElement>(null),
      content: useRef<HTMLDivElement>(null),
    };

    const isPreloaderLoaded = useAppSelector((state) => state.preloaderSlice.isPreloaderLoaded);

    useGSAP(
      () => {
        if (
          (!isPreloaderLoaded && startAnimationOnPreloader) ||
          !refs.heading.current ||
          !refs.content.current
        )
          return;

        const elements = refs.content.current.querySelectorAll('.transform-gpu');
        if (!elements.length) return;

        const initialState = {
          y: yPositionInitial,
          opacity: opacityInitial,
          filter: `blur(${blurInitial}px)`,
        };

        gsap.set(elements, initialState);
        if (line && refs.headingLine.current) gsap.set(refs.headingLine.current, { width: '0%' });

        const timeline = gsap.timeline({
          delay,
          scrollTrigger: useScrollTrigger
            ? {
                trigger: refs.heading.current,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse',
                markers: false,
              }
            : undefined,
        });

        if (line && refs.headingLine.current) {
          timeline.to(refs.headingLine.current, {
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
        className={`relative mx-0 my-0 w-full pt-0 md:mx-0 ${textPositionProps[textPosition] || 'justify-start'}
          ${classname}`}>
        <div
          ref={refs.heading}
          style={{ clipPath: `inset(0 0 ${clipPathBottom}% 0)` }}
          className={'flex items-baseline px-0 pb-0'}>
          <SplitContent
            ref={refs.content}
            string={string}
            padding={padding}
            staggerType={staggerType}
            textPosition={textPositionProps[textPosition]}
          />
        </div>
        {line && (
          <div
            ref={refs.headingLine}
            className={`absolute ${lineBottom} z-20 h-[0.05rem] bg-neutral-400`}
          />
        )}
      </div>
    );
  },
);

TextAnimation.displayName = 'TextAnimation';

export default TextAnimation;