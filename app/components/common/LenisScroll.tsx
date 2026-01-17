'use client';

import { useEffect, useRef } from 'react';
import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';

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

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    // autoRaf={false} is crucial here because we are manually driving 
    // the raf via gsap.ticker.add(update) above.
    <ReactLenis root ref={lenisRef} autoRaf={false}>
      {children}
    </ReactLenis>
  );
};

export default LenisScroll;