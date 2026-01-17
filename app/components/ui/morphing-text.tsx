'use client';

import { useCallback, useEffect, useRef, useMemo } from 'react';
import { cn } from '../../lib/utils';

const MORPH_TIME = 1.5;
const COOLDOWN_TIME = 0.5;

const useMorphingText = (texts: string[]) => {
  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(0);
  const timeRef = useRef(new Date());
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  const textsLength = useMemo(() => texts.length, [texts]);

  const setStyles = useCallback(
    (fraction: number) => {
      const current1 = text1Ref.current;
      const current2 = text2Ref.current;
      if (!current1 || !current2) return;

      const blur1 = Math.min(8 / (1 - fraction) - 8, 100);
      const blur2 = Math.min(8 / fraction - 8, 100);
      const opacity1 = Math.pow(1 - fraction, 0.4) * 100;
      const opacity2 = Math.pow(fraction, 0.4) * 100;

      current1.style.filter = `blur(${blur1}px)`;
      current1.style.opacity = `${opacity1}%`;
      current2.style.filter = `blur(${blur2}px)`;
      current2.style.opacity = `${opacity2}%`;

      current1.textContent = texts[textIndexRef.current % textsLength];
      current2.textContent = texts[(textIndexRef.current + 1) % textsLength];
    },
    [texts, textsLength]
  );

  const doMorph = useCallback(() => {
    morphRef.current -= cooldownRef.current;
    cooldownRef.current = 0;

    let fraction = morphRef.current / MORPH_TIME;

    if (fraction > 1) {
      cooldownRef.current = COOLDOWN_TIME;
      fraction = 1;
    }

    setStyles(fraction);

    if (fraction === 1) {
      textIndexRef.current++;
    }
  }, [setStyles]);

  const doCooldown = useCallback(() => {
    morphRef.current = 0;
    const current1 = text1Ref.current;
    const current2 = text2Ref.current;
    if (!current1 || !current2) return;

    current1.style.filter = 'none';
    current1.style.opacity = '0%';
    current2.style.filter = 'none';
    current2.style.opacity = '100%';
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      const newTime = new Date();
      const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000;
      timeRef.current = newTime;

      cooldownRef.current -= dt;

      if (cooldownRef.current <= 0) doMorph();
      else doCooldown();

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [doMorph, doCooldown]);

  return { text1Ref, text2Ref };
};

interface MorphingTextProps {
  texts: string[];
  className?: string;
}

const MorphingText = ({ texts, className }: MorphingTextProps) => {
  const { text1Ref, text2Ref } = useMorphingText(texts);

  const SvgFilter = useMemo(
    () => (
      <svg id="filters" className="fixed h-0 w-0" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="threshold">
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 255 -140" />
          </filter>
        </defs>
      </svg>
    ),
    []
  );

  return (
    <div
      className={cn(
        'absolute inset-0 mx-auto h-full w-full max-w-screen-md font-geist font-bold leading-none [filter:url(#threshold)_blur(0.1px)]',
        className
      )}
    >
      <span
        className="absolute inset-x-0 bottom-0 flex m-auto items-center justify-center h-full w-full self-center"
        ref={text1Ref}
      />
      <span
        className="absolute inset-x-0 bottom-0 flex m-auto items-center justify-center h-full w-full self-center"
        ref={text2Ref}
      />
      {SvgFilter}
    </div>
  );
};

export default MorphingText;