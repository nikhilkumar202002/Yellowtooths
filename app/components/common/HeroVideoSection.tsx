import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { forwardRef, memo, useCallback, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { useAppSelector } from '@/redux/hooks';

gsap.registerPlugin(ScrollTrigger);

interface HeroVideoSectionProps {
  videoSrc?: string | null;
  imageSrc?: string | null;
  title?: string;
  heroTitleLine1?: string;
  enableLine2?: boolean;
  heroTitleLine2?: string;
}

export default function HeroVideoSection({
  videoSrc = null,
  imageSrc = null,
  title = 'Title',
  heroTitleLine1 = 'Hero Title Line 1',
  enableLine2 = false,
  heroTitleLine2 = '',
}: HeroVideoSectionProps) {
  return (
    <section>
      {/*Hero Media*/}
      <div className="absolute top-0 flex h-screen w-full items-center justify-center">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Hero background"
            className="absolute h-full w-full object-cover"
          />
        ) : (
          <video loop autoPlay muted playsInline className="absolute h-full w-full object-cover">
            <source src={videoSrc ?? ''} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        <div
          className="absolute left-5 right-auto top-24 z-40 overflow-hidden sm:left-7 sm:right-auto sm:top-[16%]
            md:left-[10%] md:right-auto">
          <TextAnimation
            clipPathBottom={0}
            blurInitial={10}
            classname={'font-bold uppercase font-beckman text-[7vw] md:text-[2vw] md:px-0'}
            string={title}
          />
        </div>

        <div>
          {/* Hero Text */}
          <TextAnimation
            textPosition={'center'}
            yPositionInitial={200}
            staggerEachAmount={0.15}
            staggerType={'word'}
            classname={
              'absolute top-10 font-beckman uppercase tracking-tight font-bold text-[8.5vw] mx-auto max-w-full text-center mix-blend-difference'
            }
            string={heroTitleLine1}
          />
          <TextAnimation
            delay={0.4}
            textPosition={'center'}
            yPositionInitial={200}
            staggerEachAmount={0.05}
            staggerType={'word'}
            classname={`absolute ${enableLine2 ? 'block' : 'hidden'} top-10 font-beckman uppercase tracking-tight font-bold text-[8.5vw] mx-auto max-w-full text-center mix-blend-difference`}
            string={heroTitleLine2}
          />
        </div>
      </div>

      {/*Placeholder*/}
      <div className="flex h-screen w-full items-center justify-center" />
    </section>
  );
}

type TextPosition = 'start' | 'center' | 'end';
type StaggerType = 'letter' | 'word';

interface TextAnimationProps {
  string?: string;
  line?: boolean;
  textPosition?: TextPosition;
  delay?: number;
  padding?: string;
  classname?: string;
  staggerType?: StaggerType;
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
    padding = 'pb-2 md:pb-5',
    classname = '',
    staggerType = 'word',
    clipPathBottom = 14,
    yPositionInitial = 0,
    yPositionEnd = 0,
    opacityInitial = 0,
    opacityEnd = 1,
    duration = 1.5,
    staggerEachAmount = 0.05,
    easeType = 'expo.out',
    lineBottom = 'bottom-1.5 md:bottom-4 lg:bottom-4',
    startAnimationOnPreloader = false,
    blurInitial = 0,
    blurEnd = 0,
    useScrollTrigger = true,
  }: TextAnimationProps) => {
    const headingRef = useRef(null);
    const headingLineRef = useRef(null);
    const lettersOrWordsRef = useRef(null);
    const isPreloaderLoaded = useAppSelector((state) => state.preloaderSlice.isPreloaderLoaded);
    const textPositions = {
      start: 'justify-start md:justify-start',
      center: 'justify-center md:justify-center',
      end: 'justify-end md:justify-end',
    };

    const splitString = useCallback((str: string, type: StaggerType = 'letter') => {
      if (type === 'word') {
        return str
          .split(' ')
          .map((segment, i) =>
            segment === '[BR]' ? <br key={`br-${i}`} /> : segment + '\u00A0',
          );
      }

      return str
        .split('[BR]')
        .flatMap((segment, segIndex, segments) => [
          ...segment
            .split(' ')
            .flatMap((word) => [...word.split(''), word.length > 0 ? '\u00A0' : '']),
          segIndex < segments.length - 1 ? <br key={`br-${segIndex}`} /> : [],
        ])
        .filter(Boolean);
    }, []);

    interface SplitStringProps {
      string: string;
      padding: string;
      clipPathBottom: number;
      staggerType: StaggerType;
    }

    const SplitString = memo(
      forwardRef<HTMLDivElement, SplitStringProps>(({ string, padding, clipPathBottom, staggerType }, ref) => (
        <div ref={ref} className="overflow-hidden">
          {splitString(string, staggerType).map((char, i) => (
            <div
              key={i}
              style={{ clipPath: `inset(0 0 ${clipPathBottom}% 0)` }}
              className={`inline-block transform-gpu ${
                typeof char === 'string'
                  ? `whitespace-pre-wrap ${padding} will-change-transform`
                  : ''
              }`}>
              {char}
            </div>
          ))}
        </div>
      )),
    );

    SplitString.displayName = 'SplitString';

    useGSAP(
      () => {
        if (!isPreloaderLoaded && startAnimationOnPreloader) return;

        const elements = lettersOrWordsRef.current?.querySelectorAll('div');
        if (!headingRef.current || !elements?.length) return;

        const timeline = gsap.timeline(
          useScrollTrigger
            ? {
                scrollTrigger: {
                  trigger: headingRef.current,
                  start: 'top bottom',
                  end: 'bottom top',
                  toggleActions: 'play none none reverse',
                },
                delay,
              }
            : { delay },
        );

        gsap.set(elements, {
          y: yPositionInitial,
          opacity: opacityInitial,
          filter: `blur(${blurInitial}px)`,
        });

        if (line) {
          gsap.set(headingLineRef.current, { width: '0%' });
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
          stagger: { each: staggerEachAmount },
          ease: easeType,
        });
      },
      { scope: headingRef, dependencies: [isPreloaderLoaded] },
    );

    return (
      <div className={`relative mx-0 my-0 overflow-hidden pt-0 md:mx-0 ${classname}`}>
        <div
          ref={headingRef}
          style={{ clipPath: `inset(0 0 ${clipPathBottom}% 0)` }}
          className={`flex items-baseline ${textPositions[textPosition]} px-0 pb-0`}>
          <SplitString
            ref={lettersOrWordsRef}
            string={string}
            clipPathBottom={clipPathBottom}
            padding={padding}
            staggerType={staggerType}
          />
        </div>
        <div className="absolute bottom-0 z-10 h-2 w-full bg-transparent" />
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

TextAnimation.displayName = 'TextAnimation';
