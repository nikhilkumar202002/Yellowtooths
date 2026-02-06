'use client';

import React, { memo, useMemo } from 'react';
import TextAnimation from '../common/TextAnimation';
import GradientTextAnimation from '../common/GradientTextAnimation';
import BorderGlowWorkGrid from '../common/BorderGlowWorkGrid';
import Spacer from '../common/Spacer';
import { 
  Coffee, Film, Globe, LineChart, Pencil, ShoppingBag, Tag, Video 
} from 'lucide-react';

interface ServicesSectionProps {
  services: any[];
}

const ServicesSection = ({ services }: ServicesSectionProps) => {
  // Memoize services with icons to prevent re-renders
  const servicesWithIcons = useMemo(() => {
    
    const icons = [Pencil, Film, Tag, LineChart, Globe, Video, ShoppingBag, Coffee];
    
    return services
      ?.filter((service: any) => service.name !== 'Merchandising' && service.name !== 'Thinkery')
      .map((service: any, index: number) => ({
        ...service,
        icon: icons[index % icons.length],
      }));
  }, [services]);

  return (
    <section className="container mx-auto md:px-8 max-w-7xl">
      <h2 className="text-h2-sm mt-10 font-normal tracking-tighter">
        <GradientTextAnimation
        delay={0.2}
        blurInitial={10}
        yPositionInitial={200}
        staggerEachAmount={0.05}
        string={'Experience the Power of '}
        /* Sets the text to a solid white color */
        gradient={'linear-gradient(to bottom, #ffffff, #ffffff)'}
      />
       <GradientTextAnimation
          delay={0.8}
          blurInitial={10}
          classname={'px-0.5 md:px-1'}
          yPositionInitial={200}
          staggerEachAmount={0.05}
          string={'What We Create'}
          // Using the same color for both stops creates a solid fill
          gradient={'linear-gradient(to bottom, #fec52d, #fec52d)'}
        />
      </h2>

      <div className="max-w-full px-1 pt-3 text-justify font-geist-sans text-sm text-neutral-400 md:px-2 lg:text-lg">
       <TextAnimation
          delay={1.2}
          clipPathBottom={0}
          staggerEachAmount={0.01}
          blurInitial={5}
          staggerType="letter"
          string="Scroll down to see the full spectrum of our featured works that cover every aspect of your path towards excellence."
          classname="text-white" 
        />
      </div>

      <Spacer />

     <div className="text-white">
        <BorderGlowWorkGrid 
          gridTitle="Our Services" 
          gridItems={servicesWithIcons} 
        />
  </div>
    </section>
  );
};

export default memo(ServicesSection);