'use client';

import { useEffect, useRef } from 'react';
import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface LenisScrollProps {
  children: React.ReactNode;
}

const LenisScroll = ({ children }: LenisScrollProps) => {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    function update(time: number) {
      // time is in seconds from GSAP, Lenis expects ms
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    // Connect GSAP ticker to Lenis
    gsap.ticker.add(update);

    // Connect Lenis scroll to ScrollTrigger
    lenisRef.current?.lenis?.on('scroll', ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(update);
      lenisRef.current?.lenis?.off('scroll', ScrollTrigger.update);
    };
  }, []);

  return (
    // autoRaf={false} is crucial because we manually drive raf via gsap.ticker
    <ReactLenis root ref={lenisRef} autoRaf={false}>
      {children}
    </ReactLenis>
  );
};

export default LenisScroll;