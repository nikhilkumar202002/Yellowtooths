import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useQueries } from '@tanstack/react-query';
import { getServices, getPageHeader } from '@/api/services/services';
import FooterCallToActionButton from '@/components/common/FooterCallToActionButton';
import { Code, Globe, GlobeLock, Layers, ShoppingCart } from 'lucide-react';
import BorderGlowServiceCardGrid from '@/components/common/BorderGlowServiceCardGrid';
import BorderGlowWorkGrid from '@/components/common/BorderGlowWorkGrid';
import AnimatedWrapper from '@/components/common/AnimatedWrapper';
import Spacer from '@/components/common/Spacer';
import PageBanner from "../../../../public/IMAGES/1680x1050.webp"
import { useEffect, useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

const TechAndExpDesignPage = () => {
  // Page header state
  const [header, setHeader] = useState(null);
  const [headerLoading, setHeaderLoading] = useState(true);
  const [headerError, setHeaderError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setHeaderLoading(true);
    getPageHeader('Technology & Experience Design')
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
        queryKey: ['tech-and-exp-design-page_get-tech-and-exp-design'],
        queryFn: () => getServices().then((data) => data.data),
      },
    ],
  });
  const techAndExpDesignQuery = queries[0];
  const services = [
    {
      title: 'Web Development',
      description: 'Creating responsive and dynamic websites',
      icon: Globe,
    },
    {
      title: 'App Development',
      description: 'Building innovative mobile applications',
      icon: Code,
    },
    {
      title: 'UI/UX',
      description: 'Designing intuitive and engaging user experiences',
      icon: Layers,
    },
    {
      title: 'E-Commerce',
      description: 'Developing robust online shopping platforms',
      icon: ShoppingCart,
    },
    {
      title: 'Web Application',
      description: 'Creating powerful browser-based software solutions',
      icon: Code,
    },
    {
      title: 'Cyber Security',
      description: 'Protecting digital assets and ensuring data safety',
      icon: GlobeLock,
    },
  ];

  const techAndExpImages = techAndExpDesignQuery?.data;

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
              <h1 className="text-yellow-400 text-4xl md:text-6xl font-bold uppercase text-center" style={{ fontFamily: 'Beckman Variable, sans-serif' }}>Technology & Experience Design</h1>
            </div>
          </div>
        ) : (
          <div className="relative h-[40vh] w-full bg-black flex items-center justify-center">
            <img
              src={PageBanner.src} // Assuming the image is in public/
              alt="Technology & Experience Design"
              className="h-full w-full  object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-yellow-400 text-4xl md:text-6xl font-bold uppercase text-center" style={{ fontFamily: 'Beckman Variable, sans-serif' }}>Technology & Experience Design</h1>
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
          gridItems={techAndExpImages}
        />

        <div className={'pb-20'}>
          <FooterCallToActionButton
            enableHoverEffect={false}
            normalString={'To create effortless [BR]'}
            highlightString={'experiences'}
            buttonString={'Reach out to us'}
          />
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default TechAndExpDesignPage;
