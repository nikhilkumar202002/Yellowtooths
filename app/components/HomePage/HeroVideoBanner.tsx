'use client';

import React, { forwardRef } from 'react';

interface HeroVideoBannerProps {
  zoomTextRef: React.RefObject<HTMLDivElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  zoomText?: {
    line1: string;
    line2Prefix: string;
    line2Highlight: string;
    line2Suffix: string;
    line3: string;
  };
}

const HeroVideoBanner = forwardRef<HTMLDivElement, HeroVideoBannerProps>(
  (
    {
      zoomTextRef,
      videoRef,
      zoomText = {
        line1: 'zoom',
        line2Prefix: 'int',
        line2Highlight: 'o',
        line2Suffix: ' the',
        line3: 'extraordinary',
      },
    },
    ref,
  ) => {
    return (
      <div ref={ref} className="z-30 will-change-transform">
        <div className="relative top-0 flex h-screen w-screen items-center justify-center">
          <div className="pointer-events-none absolute inset-0 z-50 bg-gradient-to-b from-black via-transparent via-20%"></div>
          <video
            ref={videoRef}
            loop
            autoPlay
            muted
            playsInline
            className="absolute h-full w-full object-cover"
          >
            <source src="/VIDEOS/MainVideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="absolute h-screen max-w-full overflow-hidden text-center">
            <div className="relative h-screen w-screen">
              <div className="sticky top-0 h-screen">
                <div className="flex h-full w-full items-center justify-center">
                  <div className="relative w-fit">
                    <div
                      ref={zoomTextRef}
                      // UPDATED: Increased text size to text-[14vw] and lg:text-[10rem]
                      className="text-center font-ppmori text-[14vw] font-bold tracking-tighter lg:text-[10rem]"
                    >
                      <div>
                        <p className="mr-[0vw] tracking-tighter lg:mr-[0vw]">{zoomText.line1}</p>
                        <p className="ml-[2.6vw] tracking-tighter lg:ml-[2vw]">
                          {zoomText.line2Prefix}
                          <span className="zoom-o font-ppmori font-bold">
                            {zoomText.line2Highlight}
                          </span>
                          {zoomText.line2Suffix}
                        </p>
                        <p className="ml-[5vw] tracking-tighter lg:ml-[2vw]">
                          {zoomText.line3}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

HeroVideoBanner.displayName = 'HeroVideoBanner';
export default HeroVideoBanner;