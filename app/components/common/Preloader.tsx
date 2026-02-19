'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import gsap from 'gsap';
import { setIsPreloaderLoaded } from '../../redux/animation/preloaderSlice';
import { TootFinalSvg2 } from './TootFinalSvg2';
import PreloaderPosterInfinityCarousel from './PreloaderPosterInfinityCarousel';
import { useGSAP } from '@gsap/react';

interface PreloaderProps {
  waveDirection?: 'top' | 'bottom';
}

function Preloader({ waveDirection = 'top' }: PreloaderProps) {
  const isFromTop = waveDirection === 'top';
  
  const isPreloaderLoaded = useAppSelector((state) => state.preloaderSlice.isPreloaderLoaded);
  const dispatch = useAppDispatch();
  
  const [progress, setProgress] = useState(0);
  const [svgIsLoaded, setSvgIsLoaded] = useState(false);
  const fillerRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const lastReportedProgressRef = useRef<number>(0);

  useEffect(() => {
    if (!isPreloaderLoaded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isPreloaderLoaded]);

  useEffect(() => {
    if (!isPreloaderLoaded) {
      const safetyTimer = setTimeout(() => {
        document.body.style.overflow = 'auto';
        dispatch(setIsPreloaderLoaded(true));
      }, 8000); // Increased safety timer to 8 seconds to match slower animation
      return () => clearTimeout(safetyTimer);
    }
  }, [isPreloaderLoaded, dispatch]);

  useGSAP(
    () => {
      if (!svgIsLoaded) return;
      
      const progressObj = { value: 0 };

      if (fillerRef.current) {
        gsap.set(fillerRef.current, {
          height: '0%',
          autoAlpha: 1,
          top: isFromTop ? '0%' : 'auto',
          bottom: isFromTop ? 'auto' : '0%',
        });
      }

      const tl = gsap.timeline({
        onUpdate: () => {
          const roundedProgress = Math.floor(progressObj.value);
          if (roundedProgress !== lastReportedProgressRef.current) {
            lastReportedProgressRef.current = roundedProgress;
            setProgress(roundedProgress);
          }
          if (fillerRef.current) {
            gsap.set(fillerRef.current, { 
              height: `${progressObj.value}%`, 
              [isFromTop ? 'top' : 'bottom']: '0%' 
            });
          }
        },
        onComplete: () => {
          document.body.style.overflow = 'auto';
          dispatch(setIsPreloaderLoaded(true));
        },
      });

      // --- FIX: Increased durations for slower preloader ---
      tl.to(progressObj, { value: 25, duration: 1.5, ease: 'power2.in' }) 
        .to(progressObj, { value: 65, duration: 2.0, ease: 'power1.inOut' }) 
        .to(progressObj, { value: 85, duration: 1.5, ease: 'power2.out' }) 
        .to(progressObj, { value: 120, duration: 1.2, ease: 'expo.in' });

      return () => {
        if (tl) tl.kill();
      };
    },
    { scope: mainContainerRef, dependencies: [dispatch, svgIsLoaded, isFromTop] }
  );

  if (isPreloaderLoaded) return null;

  return (
    <div
      ref={mainContainerRef}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black ${progress >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-700`}
    >
      <div className="relative h-auto w-[50vw] max-w-[600px] min-w-[280px] overflow-hidden border-2 border-black">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <PreloaderPosterInfinityCarousel />
        </div>
        <div className="absolute inset-0 z-10 bg-amber-400/20" />
        <div
          ref={fillerRef}
          className="wave-filler absolute inset-0 z-20 bg-amber-500/80"
          style={{ transform: isFromTop ? 'rotate(180deg)' : 'none' }} 
        />
        <div className="relative z-30 scale-[1.02]">
          <TootFinalSvg2 onLoaded={() => setSvgIsLoaded(true)} />
        </div>
      </div>
    </div>
  );
}

export default Preloader;