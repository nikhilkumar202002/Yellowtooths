'use client';

import { memo, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Simple media query hook
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = React.useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);
  return matches;
};

import React from 'react';

interface FloatingCardsCarouselProps {
  images: { id?: string | number; image_path: string }[];
}

const FloatingCardsCarousel = ({ images }: FloatingCardsCarouselProps) => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentImageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nextImageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardIndices = useRef<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const isMdOrLarger = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    const initialCount = isMdOrLarger ? 3 : 1;
    cardIndices.current = Array.from({ length: initialCount }, (_, i) => i + initialCount);
  }, [isMdOrLarger, images.length]);

  useEffect(() => {
    if (!images || images?.length < 1) return;

    const visibleCardsCount = isMdOrLarger ? 3 : 1;
    if (images?.length < visibleCardsCount) return;

    const currentCards = cardRefs.current.slice(0, visibleCardsCount);
    const currentImages = currentImageRefs.current.slice(0, visibleCardsCount);
    const nextImages = nextImageRefs.current.slice(0, visibleCardsCount);

    currentCards.forEach((card, index) => {
      if (card && images[index]) {
        gsap.set(currentImages[index], {
          backgroundImage: `url(${images[index].image_path})`,
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          opacity: 1,
          zIndex: 1,
        });
        gsap.set(nextImages[index], {
          backgroundImage: `url(${images[index].image_path})`,
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          opacity: 0,
          zIndex: 2,
        });
      }
    });

    const cycleImages = () => {
      if (images.length < visibleCardsCount) return;
      const tl = gsap.timeline();

      currentCards.forEach((card, i) => {
        const currentImage = currentImages[i];
        const nextImage = nextImages[i];

        const nextIndex = cardIndices.current[i] % images.length;
        const nextImageData = images[nextIndex];
        cardIndices.current[i] += 1;

        gsap.set(nextImage, {
          backgroundImage: `url(${nextImageData.image_path})`,
          backgroundSize: 'contain',
          opacity: 0,
        });

        tl.to(nextImage, { opacity: 1, duration: 0.5, ease: 'power2.out' }, i * 0.1)
          .to(currentImage, { opacity: 0, duration: 0.5, ease: 'power2.out' }, i * 0.1);

        tl.set(currentImage, {
          backgroundImage: `url(${nextImageData.image_path})`,
          backgroundSize: 'contain',
          opacity: 1,
        }, i * 0.1 + 0.5).set(nextImage, { opacity: 0 }, i * 0.1 + 0.5);
      });
    };

    intervalRef.current = setInterval(cycleImages, 2500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [images, isMdOrLarger]);

  useGSAP(() => {
    const visibleCardsCount = isMdOrLarger ? 3 : 1;
    const currentCards = cardRefs.current.slice(0, visibleCardsCount);

    currentCards.forEach((card, index) => {
      if (card) {
        gsap.to(card, {
          y: -(window.innerHeight * 0.05) * (index + 1),
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    });
  }, { scope: cardRefs, dependencies: [isMdOrLarger] });

  const positionClasses = isMdOrLarger 
    ? [
      'absolute h-auto aspect-video left-[10%] top-[20%] w-[80%] md:left-[10%] md:top-[35%] md:w-[35%] lg:left-[10%] lg:top-[35%] lg:w-[35%]',
      'absolute h-auto aspect-video left-[10%] top-[40%] w-[80%] md:left-[50%] md:top-[42%] md:w-[35%] lg:left-[50%] lg:top-[50%] lg:w-[35%]',
      'absolute h-auto aspect-video left-[10%] top-[55%] w-[80%] md:left-[30%] md:top-[20%] md:w-[40%] lg:left-[30%] lg:top-[20%] lg:w-[40%]',
    ] 
    : ['relative h-auto aspect-video w-full'];

  const visibleCardsCount = isMdOrLarger ? 3 : 1;

  return (
    <div className="relative aspect-video h-48 w-full sm:h-64 md:h-[calc(100vh-10rem)]">
      {positionClasses.slice(0, visibleCardsCount).map((positionClass, index) => {
        const img = images[index];
        if (!img) return null;
        return (
          <div
            key={index}
            ref={(el) => { cardRefs.current[index] = el; }}
            className={`${positionClass} cursor-pointer overflow-hidden rounded-xl shadow-lg`}
            style={{ willChange: 'transform' }}
          >
            <div
              className="absolute inset-0 bg-contain bg-center bg-no-repeat"
              ref={(el) => { currentImageRefs.current[index] = el; }}
              style={{ backgroundImage: `url(${img.image_path})`, opacity: 1 }}
            />
            <div
              className="absolute inset-0 bg-contain bg-center bg-no-repeat"
              ref={(el) => { nextImageRefs.current[index] = el; }}
              style={{ backgroundImage: `url(${img.image_path})`, opacity: 0 }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default memo(FloatingCardsCarousel);