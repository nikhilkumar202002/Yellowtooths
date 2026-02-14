"use client";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useQuery } from '@tanstack/react-query';
import { getServices, getPageHeader } from '@/api/services/services';
import FooterCallToActionButton from '@/components/common/FooterCallToActionButton';
import HeroVideoSection from '@/components/common/HeroVideoSection';
import { LampLight } from '@/components/common/LampLight';
import { Building2, CircleIcon, Clapperboard, Shapes } from 'lucide-react';
import BorderGlowGridCard from '@/components/common/BorderGlowServiceCardGrid';
import BorderGlowImageGridCard from '@/components/common/BorderGlowImageCardGrid';
import AnimatedWrapper from '@/components/common/AnimatedWrapper';
import lenisScrollReset from '@/hooks/lenisScrollReset';
import { useEffect } from 'react';
import WorksPageSkeleton from '@/components/common/WorksPageSkeleton';

gsap.registerPlugin(ScrollTrigger);

const VideoProductionPage = () => {
  useEffect(() => {
    return lenisScrollReset();
  }, []);

  const { data: header, isLoading: headerLoading, isError: headerError } = useQuery({
    queryKey: ['video-production-header'],
    queryFn: async () => {
      const res = await getPageHeader('Video Production');
      if (Array.isArray(res) && res.length > 0) {
        return res[0];
      }
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        return res.data[0];
      }
      return null;
    },
  });

  const {
    data: videoProductionImages,
    isLoading: imagesLoading,
    isError: imagesError,
  } = useQuery({
    queryKey: ['video-production-page_get-video-production'],
    queryFn: () => getServices('Video Production').then((data) => data.data),
  });

  const services = [
    {
      title: 'Advertisements',
      description: 'Captivating ads that leave a lasting impression',
      icon: CircleIcon,
    },
    {
      title: 'Reel Ads',
      description: 'Engaging reels that capture audience attention',
      icon: Clapperboard,
    },
    {
      title: 'Corporate Video',
      description: 'Professional videos that elevate your brand',
      icon: Building2,
    },
    {
      title: '3D/2D Animations',
      description: 'Stunning animations that bring ideas to life',
      icon: Shapes,
    },
  ];

  return (
    <AnimatedWrapper duration={2} blurInitial={10}>
      <div className="text-foreground min-h-screen w-full bg-black">
        {/* Hero Section: Show video or image from API if available */}
        {headerLoading ? (
          <div className="flex h-[40vh] w-full items-center justify-center bg-black text-white text-xl">Loading hero...</div>
        ) : headerError ? (
          <div className="flex h-[40vh] w-full items-center justify-center bg-black text-red-500 text-xl">Error loading hero content.</div>
        ) : header && header.file_path ? (
          header.file_type === '1' ? (
            <div className="relative h-[40vh] w-full bg-black flex items-center justify-center">
              <img
                src={header.file_path}
                alt={header.page_name}
                className="h-full w-full object-contain object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-yellow-400 text-4xl md:text-6xl font-bold uppercase text-center" style={{ fontFamily: 'Beckman Variable, sans-serif' }}>Video Production</h1>
              </div>
            </div>
          ) : (
            <HeroVideoSection
              title="Works"
              heroTitleLine1="Video Production"
              videoSrc={header.file_path}
            />
          )
        ) : (
          <div className="relative h-[40vh] w-full bg-black flex items-center justify-center">
            <img
              src="/1680x1050.webp" // Assuming the image is in public/
              alt="Video Production"
              className="h-full w-full  object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-yellow-400 text-4xl md:text-6xl font-bold uppercase text-center" style={{ fontFamily: 'Beckman Variable, sans-serif' }}>Video Production</h1>
            </div>
          </div>
        )}

        <section className="bg-background px-0 md:px-0">
          <LampLight
            bgColor={'bg-neutral-950'}
            lampColor={'#ffffff'}
            textLine1={'Frames so Powerful, They don’t'}
            textLine2={'Just Play. They Stay.'}
          />

          <div
            className={
              'w-full bg-gradient-to-b from-neutral-950 via-neutral-950 pb-10 md:pb-20'
            }>
            <BorderGlowGridCard
              gridWidth={'max-w-7xl'}
              gridTitle={'Services'}
              gridItems={services}
            />
          </div>
          {imagesLoading && <WorksPageSkeleton />}
          {imagesError && (
            <div className="text-center text-red-500">
              Error loading works.
            </div>
          )}
          {videoProductionImages && (
            <BorderGlowImageGridCard
              gridWidth={'max-w-7xl'}
              gridTitle={'Our Works'}
              gridItems={videoProductionImages}
            />
          )}
          <div className={'pb-20'}>
            <FooterCallToActionButton
              enableHoverEffect={false}
              normalString={'To place your brand [BR] in the '}
              highlightString={'spotlight'}
              buttonString={'Reach out to us'}
            />
          </div>
        </section>
      </div>
    </AnimatedWrapper>
  );
};

export default VideoProductionPage;
