'use client';

import React, { forwardRef } from 'react';
import TextAnimation from '../common/TextAnimation';
import { Card, CardContent, CardHeader } from '../ui/card';
import { useRouter } from 'next/navigation';

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
          <div className={'grid grid-cols-1 md:grid-cols-2'}>
            <div className={'px-[5%] py-[7%] md:px-[10%] md:py-[4%]'}>
              <TextAnimation classname={'tracking-tight text-h2-lg'} yPositionInitial={200} delay={0.8} duration={2} staggerEachAmount={0.1} staggerType={'word'} string={'Services'} />
              <TextAnimation classname={'text-sm mt-4 md:mt-4 pl-0.5 md:pl-1 text-neutral-300 container max-w-2xl md:text-lg'} delay={1} duration={2} staggerEachAmount={0.05} staggerType={'word'} string={'Why go elsewhere? All your creative, strategic and marketing needs are right here, under one roof.'} />
            </div>

            <div ref={cardsContainerRef} className="flex flex-col gap-2 px-[5%] pb-[8%] md:gap-2 md:px-[10%] md:py-[4%]">
              {services.map((service, index) => (
                <Card
                  key={service.id}
                  ref={(el) => { if (cardsRef.current) cardsRef.current[index] = el; }}
                  onClick={() => router.push(`/works/${service.url}`)}
                  className="group relative h-[9vh] cursor-pointer overflow-hidden border-none dark:bg-neutral-950 md:h-[10vh]"
                >
                  <CardHeader className="group h-full p-3 transition-all duration-300 ease-in-out hover:bg-white hover:text-black">
                    <div className="flex h-full gap-4 md:gap-8">
                      <div className="aspect-square h-full w-auto">
                        <img className="h-full w-full rounded-md object-cover" src={service.icon_path} alt={service.name} />
                      </div>
                      <p className="z-20 flex h-full origin-left items-center justify-start tracking-tight transition-transform duration-500 ease-in-out group-hover:scale-[110%] sm:text-lg md:text-lg lg:text-xl xl:text-2xl">
                        {service.name}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <img src={service.image_path} className="absolute top-0 hidden h-full w-full object-cover opacity-80 duration-300 group-hover:scale-105" alt={service.name} />
                  </CardContent>
                </Card>
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