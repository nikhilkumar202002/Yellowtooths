'use client';

import React, { memo } from 'react';
import GradientTextAnimation from '../common/GradientTextAnimation';
import Spacer from '../common/Spacer';
import InfiniteCarousel from '../common/InfiniteCarousel';

interface FeaturedWorksSectionProps {
  featuredWorks: any[];
}

const FeaturedWorksSection = ({ featuredWorks }: FeaturedWorksSectionProps) => {
  return (
    <section>
      <Spacer />
      
     <GradientTextAnimation
          textPosition={'center'}
          classname={' tracking-tighter text-h2-lg mb-4 md:mb-6'}
          blurInitial={10}
          staggerEachAmount={0.03}
          staggerType={'letter'}
          string={'Featured Works'}
          // gradient="linear-gradient(to bottom, #ff7e5f, #feb47b)"
          gradient={'linear-gradient(to bottom, #fec52d, #fec52d)'}
          
        />

      {/* <div className="mx-auto mt-6 max-w-2xl text-center text-sm text-neutral-400 md:text-lg">
        <TextAnimation
          textPosition="center"
          staggerEachAmount={0.01}
          blurInitial={5}
          staggerType="letter"
          string="A glimpse into our creative universe. From viral campaigns to cinematic masterpieces."
        />
      </div> */}

      <div className="mt-16 md:mt-24 mb-20">
        <InfiniteCarousel data={featuredWorks} />
      </div>
    </section>
  );
};

export default memo(FeaturedWorksSection);