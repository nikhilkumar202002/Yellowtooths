'use client';

import React, { forwardRef } from 'react';
import TextAnimation from '../common/TextAnimation';
import { Card, CardContent, CardHeader } from '../ui/card';
import { useRouter } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';

interface ServicesShowcaseProps {
  services: any[];
  cardsContainerRef: React.RefObject<HTMLDivElement>;
  cardsRef: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

const ServicesShowcase = forwardRef<HTMLDivElement, ServicesShowcaseProps>(
  ({ services, cardsContainerRef, cardsRef }, ref) => {
    const router = useRouter();

    return (
      <div
        ref={ref}
        className="services-wrapper relative min-h-screen w-full flex-col px-1 py-2 will-change-transform md:px-0 md:py-0"
      >
        <section className="grid-cols-2">
          {/* Main Service Image */}
          <div className={'relative h-[calc(100vh-1rem)] md:h-screen'}>
            <img
              className={'absolute inset-0 h-full w-full rounded-lg object-cover p-0 md:rounded-3xl md:p-2'}
              src="/IMAGES/services-image.webp"
              alt="Services Banner Image"
              loading="lazy"
              decoding="async"
            />
            <div className={'flex h-full flex-col justify-end py-[4%] pr-[5%] font-semibold'}>
              <TextAnimation textPosition={'end'} classname={'text-h2-sm'} clipPathBottom={0} yPositionInitial={200} staggerEachAmount={0.05} staggerType={'word'} string={'Think.'} />
              <TextAnimation textPosition={'end'} classname={'text-h2-sm'} clipPathBottom={0} yPositionInitial={200} staggerEachAmount={0.05} staggerType={'word'} string={'Create.'} />
              <TextAnimation textPosition={'end'} classname={'text-h2-sm'} clipPathBottom={0} yPositionInitial={200} staggerEachAmount={0.05} staggerType={'word'} string={'Dominate.'} />
            </div>
          </div>

          {/* Service Description & Cards */}
        <div className="flex flex-col w-full">
            
            {/* Top Section: Text (Centered) */}
            <div className="flex flex-col items-center justify-center px-[5%] py-[5%] md:px-[5%] md:py-[3%]">
              <TextAnimation 
                textPosition='center'
                classname={'tracking-tight text-h2-lg'} 
                yPositionInitial={200} 
                delay={0.8} 
                duration={2} 
                staggerEachAmount={0.1} 
                staggerType={'word'} 
                string={'Services'} 
              />
              <TextAnimation 
                textPosition='center'
                classname={'text-sm mt-4 md:mt-4 pl-0.5 md:pl-1 text-neutral-300 container max-w-2xl md:text-lg text-center mx-auto'} 
                delay={1} 
                duration={2} 
                staggerEachAmount={0.05} 
                staggerType={'word'} 
                string={'Why go elsewhere? All your creative, strategic and marketing needs are right here, under one roof.'} 
              />
            </div>

            {/* Bottom Section: Full Width Cards */}
            <div ref={cardsContainerRef} className="flex flex-col w-full px-[5%] pb-[8%] md:px-[5%] md:py-[4%]">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  ref={(el) => { if (cardsRef.current) cardsRef.current[index] = el; }}
                  onClick={() => router.push(`/works/${service.url}`)}
                  // Updated height: h-[20vh] (mobile) and md:h-[28vh] (desktop)
                  className="group relative flex h-[20vh] w-full cursor-pointer items-center justify-between overflow-hidden border-t border-neutral-800 bg-transparent px-2 py-4 transition-all duration-500 last:border-b hover:border-transparent md:h-[28vh] md:px-6"
                >
                  {/* --- Hover Image Background --- */}
                  <div className="absolute inset-0 z-0 h-full w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute inset-0 z-10 bg-black/40" />
                    <img
                      src={service.image_path}
                      alt={service.name}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>

                  {/* --- Content Container --- */}
                  <div className="relative z-20 flex w-full items-center justify-between gap-4">
                    
                    {/* Left Side: Number & Text */}
                    <div className="flex items-center gap-6 md:gap-16">
                      {/* Updated Number Size: text-3xl (mobile) and md:text-6xl (desktop) */}
                      <span className="font-beckman text-3xl text-neutral-600 transition-colors duration-300 group-hover:text-white/80 md:text-6xl">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>

                      <div className="flex flex-col gap-2 transition-transform duration-300 group-hover:translate-x-4">
                        <h3 className="font-ppmori text-xl font-semibold uppercase leading-none tracking-tight text-white md:text-5xl">
                          {service.name}
                        </h3>
                        <p className="line-clamp-1 hidden max-w-md text-sm font-light text-neutral-400 transition-colors duration-300 group-hover:text-white/90 md:block md:text-lg">
                          {service.short_description || "Crafting unique digital experiences for your brand."}
                        </p>
                      </div>
                    </div>

                    {/* Right Side: Arrow */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-transparent transition-all duration-300 group-hover:bg-white group-hover:text-black md:h-20 md:w-20">
                      <ArrowUpRight className="h-6 w-6 transition-transform duration-500 group-hover:rotate-45 md:h-10 md:w-10" />
                    </div>
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