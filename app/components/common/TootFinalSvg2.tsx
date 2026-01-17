'use client';

import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface TootFinalSvg2Props {
  onLoaded?: () => void;
}

export function TootFinalSvg2({ onLoaded }: TootFinalSvg2Props) {
  const [svgLoaded, setSvgLoaded] = useState(false);
  const svgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSvgLoaded(true);
      if (onLoaded) onLoaded();
    }, 100);
    return () => clearTimeout(timer);
  }, [onLoaded]);

  useGSAP(
    () => {
      if (!svgLoaded) return;
      
      // Make everything visible immediately
      gsap.set('#tootMask rect', { visibility: 'visible', opacity: 1 });
      gsap.set('.letter', { visibility: 'visible', opacity: 1 }); // Force letters visible
      
      // Eye animation (Keep this if you want the eyes to move, remove if you want total static)
      gsap.set(['#eye-left', '#eye-right'], {
        x: -30,
        visibility: 'visible',
        opacity: 1,
      });
      gsap.to(['#eye-left', '#eye-right'], {
        x: 30,
        duration: 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 0.5,
      });

      // --- REMOVED THE LETTER ANIMATION BLOCK HERE ---
    },
    { scope: svgRef, dependencies: [svgLoaded] },
  );

  return (
    <div ref={svgRef} className="relative z-30">
      <svg
        className="block w-full h-auto"
        id="tootSvg"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        viewBox="0 0 511.19 252.26"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <mask id="tootMask">
            <rect width="100%" height="100%" fill="white" />
            <polygon points="219.13 252.23 255.03 190.07 290.9 252.23 219.13 252.23" />
            <path className="letter" d="M175.54,54.38c-21.81,0-39.66,7.75-53.07,23.06-13.31,15.21-20.06,35.38-20.06,59.95s6.47,45.8,19.23,60.85c12.87,15.19,31,22.88,53.9,22.88s40.37-7.62,53.44-22.66c12.96-14.9,19.54-35.44,19.54-61.08s-6.42-46.19-19.1-60.82c-12.77-14.73-30.9-22.2-53.88-22.2M203.68,178.76c-6.86,9.81-16.06,14.59-28.15,14.59-26.1,0-38.79-18.3-38.79-55.94,0-17.37,3.6-31.13,10.76-40.89,7.04-9.64,16.21-14.34,28.02-14.34,26,0,38.64,18.06,38.64,55.23,0,17.48-3.52,31.42-10.49,41.35" />
            <path className="letter" d="M97.47,187.47c-7.17,3.41-14.19,5.14-20.82,5.14-8.91,0-15.38-2.46-19.24-7.29-4.01-5.02-6.03-13.85-6.03-26.27v-74.69h55.04c2.59-4.69,5.58-9.09,9.09-13.1,7.41-8.47,16.31-14.39,26.37-18.19l.07-.07H50.91L51.42.03H18.43l-.41,52.97H0v31.41c6.17-.02,12.33-.03,18.5-.05v85.73c0,14.58,4.5,26.84,13.41,36.46,8.97,9.67,20.1,14.58,33.11,14.58,13.81,0,26.69-1.49,38.29-4.45l2.35-.59-5.05-30.11-3.14,1.49Z" />
            <path className="letter" d="M413.72,187.47c7.17,3.41,14.18,5.14,20.82,5.14,8.91,0,15.38-2.46,19.24-7.29-4.02-5.02,6.04-13.85,6.04-26.27v-74.69h-55.05c-2.59-4.69-5.57-9.09-9.09-13.1-7.41-8.47-16.31-14.39-26.37-18.19l-.07-.07h91.03L459.77.03h32.99l.4,52.97h18.03v31.43c-6.17-.02-12.33-.04-18.5-.06v85.73c0,14.58-4.51,26.84-13.42,36.46-8.96,9.67-20.1,14.58-33.11,14.58-13.81,0-26.69-1.49-38.28-4.45l-2.35-.59,5.05-30.11,3.14,1.49Z" />
            <path className="letter" d="M335.39,54.38c-21.78,0-39.61,7.75-53,23.07-13.28,15.21-20.03,35.38-20.03,59.96s6.46,45.81,19.21,60.86c12.85,15.19,30.95,22.89,53.82,22.89s40.33-7.62,53.37-22.66c12.95-14.9,19.5-35.44,19.5-61.08s-6.4-46.19-19.06-60.82c-12.76-14.73-30.86-22.2-53.8-22.2M363.49,178.76c-6.84,9.81-16.04,14.59-28.11,14.59-26.05,0-38.73-18.3-38.73-55.94,0-17.37,3.6-31.13,10.73-40.89,7.04-9.64,16.2-14.34,28-14.34,25.96,0,38.58,18.06,38.58,55.23,0,17.48-3.53,31.42-10.48,41.36" />
            <path id="eye-left"  d="M199.16,104.45c0,13.09-10.61,23.7-23.71,23.7s-23.69-10.6-23.69-23.7,10.6-23.7,23.69-23.7,23.71,10.61,23.71,23.7" />
            <path id="eye-right" d="M358.9,104.45c0,13.09-10.6,23.7-23.71,23.7s-23.69-10.6-23.69-23.7,10.61-23.7,23.69-23.7,23.71,10.61,23.71,23.7" />
          </mask>
        </defs>

        <rect width="100%" height="100%" fill="black" mask="url(#tootMask)" />
      </svg>
    </div>
  );
}