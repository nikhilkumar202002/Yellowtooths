'use client';

import React, { memo, useRef, useEffect, useState } from 'react';
import { logVisit } from './lib/logVisit';
import Loading from './components/common/Loading';
import Error from './components/common/Error';
import { useQueries } from '@tanstack/react-query';
import { getClients, getServices } from './api/services/services';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from 'next/navigation';
import { setIsTilesFlipped } from './redux/animation/flipboardSlice';
import { useAppDispatch } from './redux/hooks'; 
import { homeContent } from './data/homeContent';

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
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    logVisit();
    
    if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
    }
    
    const rafId = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(rafId);
  }, []);

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

  // Refs
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const videoBannerRef = useRef<HTMLDivElement>(null);
  const zoomTextRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const servicesWrapperRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const servicesSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (pathname === '/' && isMounted) {
      dispatch(setIsTilesFlipped(false));
    }
  }, [pathname, dispatch, isMounted]);

  // 1. Initial Fade In
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
    const servicesSection = servicesSectionRef.current;

    // --- INITIAL STATES ---
    if (videoBanner) {
        gsap.set(videoBanner, { position: 'absolute', zIndex: '3', opacity: '1' });
    }
    if (servicesWrapper) {
        gsap.set(servicesWrapper, { position: 'relative', zIndex: '1', opacity: '0' });
    }

    // --- VIDEO ZOOM LOGIC ---
    if (zoomText && zoomO && videoBanner && servicesSection) {
      const setZoomTextScale = gsap.quickSetter(zoomText, 'scale');
      const setZoomOScale = gsap.quickSetter(zoomO as Element, 'scale');
      const setVideoOpacity = gsap.quickSetter(videoBanner, 'opacity');
      const setServicesOpacity = servicesWrapper
        ? gsap.quickSetter(servicesWrapper, 'opacity')
        : null;
      const setServicesScale = servicesWrapper
        ? gsap.quickSetter(servicesWrapper, 'scale')
        : null;

      gsap.to(zoomO, {
        scrollTrigger: {
          trigger: videoBanner,
          pin: true,
          start: 'top top',
          end: 'bottom top',
          scrub: 2, 
          
          onEnter: () => dispatch(setIsTilesFlipped(true)),
          
          onLeaveBack: () => {
            dispatch(setIsTilesFlipped(false));
            // DO NOT call ScrollTrigger.refresh() here. It causes the jump/render issue.
            if (videoBanner) {
               gsap.set(videoBanner, { position: 'absolute', zIndex: '3', opacity: '1' });
            }
          },

          // FIX: Use standard snap logic. Removed conflicting lenis.scrollTo
          snap: 1,

          onUpdate: (self) => {
            const progress = self.progress;
            const scale = progress > 0 ? gsap.utils.mapRange(0, 1, 1, 10)(progress) : 1;
            const videoOpacity = 1 - progress;
            const servicesOpacity = Math.min(1, progress);
            const servicesScale = Math.min(1, progress);

            setZoomTextScale(scale);
            setZoomOScale(scale);
            setVideoOpacity(videoOpacity);

            if (setServicesOpacity && setServicesScale) {
              setServicesOpacity(servicesOpacity);
              setServicesScale(servicesScale);
            }
          },
        },
      });
    }

    // --- SERVICES LAYER LOGIC ---
    if (servicesWrapper) {
       const scrollEnd = window.innerWidth <= 768 ? 'bottom 100%' : 'bottom 50%';
       let didRaiseZIndex = false;
       
       gsap.to(servicesWrapper, {
         opacity: '100%',
         scrollTrigger: {
           trigger: servicesWrapper,
           start: 'top top',
           end: scrollEnd,
           pin: true,
           scrub: 2,
           onUpdate: (self) => {
             // Logic to swap Z-Index so cards become clickable/viewable
             if (self.progress >= 0.8 && !didRaiseZIndex) {
                gsap.set(servicesWrapper, { zIndex: 3 });
                didRaiseZIndex = true;
             }
           },
           onLeaveBack: () => {
             didRaiseZIndex = false;
             // Reset video banner on scroll back up
             if (videoBanner) {
                gsap.set(videoBanner, { position: 'absolute', zIndex: '3', opacity: '1' });
             }
             gsap.set(servicesWrapper, { zIndex: 1 });
           }
         }
       });
    }

  }, { scope: mainContainerRef, dependencies: [clientsQuery.data, servicesQuery.data, isMounted] });

  // 3. Simple Cards Stagger
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

  if (!isMounted || clientsQuery.isLoading || servicesQuery.isLoading) return <Loading />;
  if (clientsQuery.error || servicesQuery.error) return <Error />;

  return (
    <div ref={mainContainerRef} className="flex min-h-screen w-full flex-col overflow-x-hidden">
      
      <PosterInfinityCarousel />

      <div className={'relative flex h-screen'}>
        <RippleDemo texts={homeContent.rippleTexts} />
      </div>

      <section ref={servicesSectionRef} className="relative">
        <HeroVideoBanner 
          ref={videoBannerRef} 
          zoomTextRef={zoomTextRef} 
          videoRef={videoRef}
          zoomText={homeContent.heroZoom}
        />

        <ServicesShowcase 
          ref={servicesWrapperRef}
          services={servicesQuery.data || []}
          cardsContainerRef={cardsContainerRef}
          cardsRef={cardsRef}
          bannerLines={homeContent.services.bannerLines}
          sectionTitle={homeContent.services.sectionTitle}
          sectionSubtitle={homeContent.services.sectionSubtitle}
        />
      </section>

      <ClientsMarquee clients={clientsQuery.data || []} title={homeContent.clients.title} />

      <CollaborationStory lines={homeContent.collaboration.lines} />

      <section className="relative flex items-center justify-center px-4 pb-20">
        <FooterCallToActionButton 
          normalString={homeContent.footerCta.normal} 
          highlightString={homeContent.footerCta.highlight} 
          buttonString={homeContent.footerCta.button} 
        />
      </section>
    </div>
  );
};

export default memo(HomePage);