'use client';

import React, { forwardRef, useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import TextAnimation from '../common/TextAnimation';
import { useRouter } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '../../lib/utils';

interface ServicesShowcaseProps {
  services: any[];
  cardsContainerRef: React.RefObject<HTMLDivElement | null>;
  cardsRef: React.MutableRefObject<(HTMLDivElement | null)[]>;
  className?: string;
  style?: React.CSSProperties;
}

const ServicesShowcase = forwardRef<HTMLDivElement, ServicesShowcaseProps>(
  ({ services, cardsContainerRef, cardsRef, className, style }, ref) => {
    const router = useRouter();
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [mounted, setMounted] = useState(false);
    
    const modalContainerRef = useRef<HTMLDivElement | null>(null);
    const activeAnimationRef = useRef<gsap.core.Tween | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useGSAP(() => {
        if (modalContainerRef.current) {
            gsap.set(modalContainerRef.current, { xPercent: -50, yPercent: -50 });
        }
    }, { scope: modalContainerRef, dependencies: [mounted] });

    const moveModalTo = useCallback((x: number, y: number, duration: number = 0.8) => {
        if (modalContainerRef.current) {
            if (activeAnimationRef.current) activeAnimationRef.current.kill();
            activeAnimationRef.current = gsap.to(modalContainerRef.current, {
                x: x, y: y, duration: duration, ease: "power3.out", overwrite: "auto"
            });
        }
    }, []);

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (isHovering && mounted) moveModalTo(e.clientX, e.clientY, 0.8);
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isHovering, moveModalTo, mounted]);

    return (
      <div ref={ref} className={cn("services-wrapper relative w-full flex-col", className)} style={style}>
          {/* Floating Image (Portal) */}
          {mounted && createPortal(
            <div
                ref={modalContainerRef}
                className={`pointer-events-none fixed left-0 top-0 z-[9999] overflow-hidden rounded-lg bg-neutral-900 shadow-2xl transition-opacity duration-300
                h-[280px] w-[220px] md:h-[360px] md:w-[280px] border border-white/10
                ${isHovering ? 'opacity-100' : 'opacity-0'}`}
            >
                <div
                className="relative h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
                style={{ transform: `translateY(-${currentImageIndex * 100}%)` }}
                >
                {services.map((service, index) => (
                    <div key={`modal-img-${index}`} className="relative h-full w-full bg-neutral-800">
                    <img src={service.image_path} alt={service.name} className="h-full w-full object-cover" loading="eager" />
                    </div>
                ))}
                </div>
            </div>,
            document.body
          )}

          <section className="flex flex-col w-full">
            {/* Banner Image */}
            <div className={'relative h-[50vh] md:h-screen w-full'}>
                <img
                className={'absolute inset-0 h-full w-full rounded-lg object-cover p-0 md:rounded-3xl md:p-2'}
                src="/IMAGES/services-image.webp"
                alt="Services Banner Image"
                />
                <div className={'flex h-full flex-col justify-end py-[4%] pr-[5%] font-semibold'}>
                <TextAnimation textPosition={'end'} classname={'text-h2-sm'} clipPathBottom={0} yPositionInitial={200} staggerEachAmount={0.05} staggerType={'word'} string={'Think.'} />
                <TextAnimation textPosition={'end'} classname={'text-h2-sm'} clipPathBottom={0} yPositionInitial={200} staggerEachAmount={0.05} staggerType={'word'} string={'Create.'} />
                <TextAnimation textPosition={'end'} classname={'text-h2-sm'} clipPathBottom={0} yPositionInitial={200} staggerEachAmount={0.05} staggerType={'word'} string={'Dominate.'} />
                </div>
            </div>

            {/* List */}
            <div className="flex flex-col w-full mt-10 md:mt-20">
                <div className="flex flex-col items-center justify-center px-[5%] py-[5%] md:px-[5%] md:py-[3%]">
                <TextAnimation textPosition='center' classname={'tracking-tight text-h2-lg'} yPositionInitial={200} delay={0.8} duration={2} staggerEachAmount={0.1} staggerType={'word'} string={'Services'} />
                <TextAnimation textPosition='center' classname={'text-sm mt-4 md:mt-4 pl-0.5 md:pl-1 text-neutral-300 container max-w-2xl md:text-lg text-center mx-auto'} delay={1} duration={2} staggerEachAmount={0.05} staggerType={'word'} string={'Why go elsewhere? All your creative, strategic and marketing needs are right here, under one roof.'} />
                </div>

                <div ref={cardsContainerRef} className="flex flex-col w-full px-[5%] pb-[8%] md:px-[5%] md:py-[4%]">
                {services.map((service, index) => (
                    <div
                    key={service.id}
                    ref={(el) => { if (cardsRef.current) cardsRef.current[index] = el; }}
                    onMouseEnter={(e) => { setCurrentImageIndex(index); setIsHovering(true); moveModalTo(e.clientX, e.clientY, 0.1); }}
                    onMouseLeave={() => setIsHovering(false)}
                    onClick={() => router.push(`/works/${service.url}`)}
                    className="group relative flex h-[20vh] w-full cursor-pointer items-center justify-between border-t border-neutral-800 bg-transparent px-2 py-4 transition-all duration-300 last:border-b hover:border-white/20 md:h-[28vh] md:px-6"
                    >
                    <div className="relative z-10 flex w-full items-center justify-between gap-4">
                        <div className="flex items-center gap-6 md:gap-16">
                        <span className="font-beckman text-3xl text-neutral-600 transition-colors duration-300 group-hover:text-white md:text-6xl">{(index + 1).toString().padStart(2, '0')}</span>
                        <div className="flex flex-col gap-2 transition-transform duration-300 group-hover:translate-x-4">
                            <h3 className="font-ppmori text-xl font-semibold uppercase leading-none tracking-tight text-white md:text-5xl">{service.name}</h3>
                            <p className="line-clamp-1 hidden max-w-md text-sm font-light text-neutral-400 transition-colors duration-300 group-hover:text-white/90 md:block md:text-lg">{service.short_description}</p>
                        </div>
                        </div>
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-transparent transition-all duration-300 group-hover:bg-white group-hover:text-black md:h-20 md:w-20"><ArrowUpRight className="h-6 w-6 transition-transform duration-500 group-hover:rotate-45 md:h-10 md:w-10" /></div>
                    </div>
                    </div>
                ))}
                </div>
            </div>  
          </section>
      </div>
    );
  }
);

ServicesShowcase.displayName = 'ServicesShowcase';
export default ServicesShowcase;