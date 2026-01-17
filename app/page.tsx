'use client';

import React, { memo, useRef, useEffect, useState } from 'react';
import { logVisit } from './lib/logVisit';
import Loading from './components/common/Loading';
import { useLenis } from 'lenis/react';
import Error from './components/common/Error';
import { useQueries } from '@tanstack/react-query';
import { getClients, getServices } from './api/services/services';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from 'next/navigation';
import { setIsTilesFlipped } from './redux/animation/flipboardSlice';
import { useAppDispatch } from './redux/hooks'; 

// Components
import FooterCallToActionButton from './components/common/FooterCallToActionButton';
import PosterInfinityCarousel from './components/common/PosterInfinityCarousel';
import { RippleDemo } from './components/common/RippleDemo';
import HeroVideoBanner from './components/HomePage/HeroVideoBanner';
import ServicesShowcase from './components/HomePage/ServicesShowcase';
import ClientsMarquee from './components/HomePage/ClientsMarquee';
import CollaborationStory from './components/HomePage/CollaborationStory';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const HomePage = () => {
  const lenis = useLenis();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    logVisit();
    
    // Ensure we start at the top
    if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
    }
    
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Data Fetching
  const queries = useQueries({
    queries: [
      {
        queryKey: ['home-page_get-clients'],
        queryFn: getClients,
        staleTime: 5 * 60 * 1000, 
        refetchOnWindowFocus: false,
        enabled: isMounted,
      },
      {
        queryKey: ['home-page_get-services'],
        queryFn: getServices,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: isMounted,
      },
    ],
  });

  const clientsQuery = queries[0];
  const servicesQuery = queries[1];

  // Refs for GSAP Orchestration
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const videoBannerRef = useRef<HTMLDivElement>(null);
  const zoomTextRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const servicesWrapperRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Sections Refs (for triggers)
  const servicesSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (pathname === '/' && isMounted) {
      dispatch(setIsTilesFlipped(false));
    }
  }, [pathname, dispatch, isMounted]);

  // 1. Fade In Main Container
  useGSAP(() => {
    if (!isMounted || !mainContainerRef.current) return;
    gsap.to(mainContainerRef.current, { opacity: 1, duration: 1.5, ease: 'expo.in' });
  }, { scope: mainContainerRef, dependencies: [isMounted] });

  // 2. Main Scroll Animation (Video Zoom -> Services)
  useGSAP(() => {
    if (!isMounted) return;
    
    const videoBanner = videoBannerRef.current;
    const servicesWrapper = servicesWrapperRef.current;
    const zoomText = zoomTextRef.current;
    const zoomO = zoomText?.querySelector('.zoom-o');

    if (videoBanner) gsap.set(videoBanner, { position: 'absolute', zIndex: '3', opacity: '1' });
    if (servicesWrapper) gsap.set(servicesWrapper, { position: 'relative', zIndex: '1', opacity: '0' });

    if (zoomText && zoomO && videoBanner) {
      gsap.to(zoomO, {
        scrollTrigger: {
          trigger: videoBanner,
          pin: true,
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
          // Removed the aggressive snap logic here to prevent jump to services
          onEnter: () => dispatch(setIsTilesFlipped(true)),
          onLeaveBack: () => {
            dispatch(setIsTilesFlipped(false));
            gsap.set(videoBanner, { position: 'absolute', zIndex: '3', opacity: '1' });
          },
          onUpdate: (self) => {
            const progress = self.progress;
            const scale = progress > 0 ? gsap.utils.mapRange(0, 1, 1, 10)(progress) : 1;
            
            gsap.set(zoomText, { scale: scale });
            gsap.set(zoomO, { scale: scale });
            
            // Fading out video, fading in services
            gsap.set(videoBanner, { opacity: 1 - progress });
            
            if (servicesWrapper) {
              gsap.set(servicesWrapper, {
                opacity: Math.min(1, progress),
                scale: Math.min(1, progress),
                transformOrigin: 'center center',
              });
            }
          },
        },
      });
    }

    // Scroll Logic for Services Wrapper Layering
    if (servicesWrapper) {
       const scrollEnd = window.innerWidth <= 768 ? 'bottom 100%' : 'bottom 50%';
       
       gsap.to(servicesWrapper, {
         opacity: '100%',
         scrollTrigger: {
           trigger: servicesWrapper,
           start: 'top top',
           end: scrollEnd,
           pin: true,
           scrub: 2,
           onUpdate: (self) => {
             if (self.progress >= 0.8) gsap.set(servicesWrapper, { zIndex: 3 });
           },
           onLeaveBack: () => {
             if (videoBanner) gsap.set(videoBanner, { position: 'absolute', zIndex: '3', opacity: '1' });
           }
         }
       });
    }
  }, { scope: mainContainerRef, dependencies: [clientsQuery.data, servicesQuery.data, lenis, isMounted] });

  // 3. Cards Stagger Animation
  useGSAP(() => {
    if (!isMounted) return;
    const validCards = cardsRef.current.filter(Boolean);
    const cards = gsap.utils.toArray(validCards);
    if (!cards.length) return;

    gsap.set(cards, { y: '0', x: '200', opacity: 0 });

    gsap.to(cards, {
      x: 0, y: 0, opacity: 1, duration: 1.2,
      stagger: { each: 0.1 },
      ease: 'expo.out',
      scrollTrigger: {
        trigger: cards[0] as Element,
        start: 'top bottom',
        end: 'bottom top',
        toggleActions: 'play none none reverse',
      },
    });
  }, { scope: cardsContainerRef, dependencies: [clientsQuery.data, servicesQuery.data, isMounted] });

  // Render logic
  if (!isMounted || clientsQuery.isLoading || servicesQuery.isLoading) return <Loading />;
  if (clientsQuery.error || servicesQuery.error) return <Error />;

  return (
    <div ref={mainContainerRef} className="flex min-h-screen w-full flex-col overflow-x-hidden">
      
      {/* 1. Infinite Poster Carousel */}
      <PosterInfinityCarousel />

      {/* 2. Ripple Text Demo */}
      <div className={'relative flex h-screen'}>
        <RippleDemo />
      </div>

      {/* 3. Main Interaction Section (Video Zoom + Services) */}
      <section ref={servicesSectionRef} className="relative">
        <HeroVideoBanner 
            ref={videoBannerRef} 
            zoomTextRef={zoomTextRef} 
            videoRef={videoRef} 
        />

        <ServicesShowcase 
            ref={servicesWrapperRef}
            services={servicesQuery.data || []}
            cardsContainerRef={cardsContainerRef}
            cardsRef={cardsRef}
        />
      </section>

      {/* 4. Clients Marquee */}
      <ClientsMarquee clients={clientsQuery.data || []} />

      {/* 5. Bottom Story */}
      <CollaborationStory />

      {/* 6. Footer CTA */}
      <section className="relative flex items-center justify-center px-4 pb-20">
        <FooterCallToActionButton 
            normalString={'Partner with us to [BR] Create something [BR]'} 
            highlightString={'Unforgettable.'} 
            buttonString={'Reach out to us'} 
        />
      </section>
    </div>
  );
};

export default memo(HomePage);