import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useQueries } from '@tanstack/react-query';
import { getServices, getPageHeader } from '@/api/v1/services/services';
import FooterCallToActionButton from '@/components/common/FooterCallToActionButton';
import {
  ClipboardCheck,
  Lightbulb,
  MessageSquare,
  Palette,
  Rocket,
  Settings,
  Tag,
} from 'lucide-react';
import BorderGlowServiceCardGrid from '@/components/common/BorderGlowServiceCardGrid';
import BorderGlowWorkGrid from '@/components/common/BorderGlowWorkGrid';
import AnimatedWrapper from '@/components/common/AnimatedWrapper';
import Spacer from '@/components/common/Spacer';
import { memo, useEffect, useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

const BrandingPage = () => {
  useEffect(() => {
    return lenisScrollReset();
  }, []);

  // Page header state
  const [header, setHeader] = useState(null);
  const [headerLoading, setHeaderLoading] = useState(true);
  const [headerError, setHeaderError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setHeaderLoading(true);
    getPageHeader('Branding')
      .then((res) => {
        if (mounted && Array.isArray(res) && res.length > 0) {
          setHeader(res[0]);
        }
      })
      .catch(() => {
        if (mounted) setHeaderError(true);
      })
      .finally(() => {
        if (mounted) setHeaderLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const queries = useQueries({
    queries: [
      {
        queryKey: ['branding-page_get-branding'],
        queryFn: () => getServices().then((data) => data.data),
      },
    ],
  });
  const brandingQuery = queries[0];
  const services = [
    {
      title: 'Brand Name',
      description: 'Crafting unique and memorable brand names',
      icon: Tag,
    },
    {
      title: 'Brand Visual Identity',
      description: 'Designing cohesive visual elements for your brand',
      icon: Palette,
    },
    {
      title: 'Brand Strategy',
      description: 'Developing comprehensive brand positioning and direction',
      icon: Lightbulb,
    },
    {
      title: 'Brand Launch',
      description: 'Orchestrating impactful brand introductions to the market',
      icon: Rocket,
    },
    {
      title: 'Brand Communication',
      description: 'Creating consistent and effective brand messaging',
      icon: MessageSquare,
    },
    {
      title: 'Brand Management',
      description: 'Ongoing stewardship and evolution of your brand',
      icon: Settings,
    },
    {
      title: 'Brand Audit',
      description: 'Comprehensive analysis and evaluation of your brand',
      icon: ClipboardCheck,
    },
  ];

  const brandingImages = brandingQuery?.data;

  return (
    <AnimatedWrapper duration={2} blurInitial={10}>
      <div className="text-foreground min-h-screen w-full bg-black">
        {/* Hero Section: Show video or image from API if available */}
        {headerLoading ? (
          <div className="flex h-[40vh] w-full items-center justify-center bg-black text-white text-xl">Loading hero...</div>
        ) : header && header.file_path ? (
          <div className="relative h-[40vh] w-full bg-black flex items-center justify-center">
            <img
              src={header.file_path}
              alt={header.page_name}
              className="h-full w-full object-contain object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-yellow-400 text-4xl md:text-6xl font-bold uppercase text-center" style={{ fontFamily: 'Beckman Variable, sans-serif' }}>Branding</h1>
            </div>
          </div>
        ) : (
          <div className="relative h-[40vh] w-full bg-black flex items-center justify-center">
            <img
              src="/1680x1050.webp" // Assuming the image is in public/
              alt="Branding"
              className="h-full w-full  object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-yellow-400 text-4xl md:text-6xl font-bold uppercase text-center" style={{ fontFamily: 'Beckman Variable, sans-serif' }}>Branding</h1>
            </div>
          </div>
        )}

        <div
          className={
            'w-full bg-gradient-to-b from-neutral-950 via-neutral-950 pb-10 md:pb-20'
          }>
          <Spacer />
          <BorderGlowServiceCardGrid
            gridWidth={'max-w-7xl'}
            gridTitle={'Services'}
            gridItems={services}
          />
        </div>

        <BorderGlowWorkGrid
          gridWidth={'max-w-7xl'}
          gridTitle={'Our Works'}
          gridItems={brandingImages}
        />

        <div className={'pb-20'}>
          <FooterCallToActionButton
            normalString={'To put your brand [BR] among the '}
            highlightString={'Elites'}
            buttonString={'Reach out to us'}
          />
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default memo(BrandingPage);
