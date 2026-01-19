'use client';

import React, { memo } from 'react';
import { useRouter } from 'next/navigation';
import {
  BorderGlowCard,
  BorderGlowCardContent,
  BorderGlowCardHeader,
  BorderGlowCardTitle,
} from '../common/BorderGlowCard';
import AnimatedWrapper from '../common/AnimatedWrapper';
import GradientTextAnimation from '../common/GradientTextAnimation';
import TextAnimation from '../common/TextAnimation';

interface GridItemProps {
  image_path: string;
  name: string;
  icon: React.ElementType;
  description: string;
  url?: string;
  onClick?: () => void;
}

const GridItem = memo(({ image_path, name, icon: Icon, description, onClick }: GridItemProps) => (
  <BorderGlowCard 
    className="group cursor-pointer" 
    onClick={onClick} 
    cardBorderRadius="2xl"
  >
    <div>
      {/* Image Section */}
      <div className="relative m-4 flex aspect-video overflow-hidden rounded-lg transition-all duration-500 ease-in-out hover:scale-[100%] hover:cursor-pointer md:m-4">
        <div className="h-full w-full overflow-hidden rounded-lg transition-all duration-500 ease-in-out group-hover:scale-105">
          <img
            height="auto"
            width="auto"
            className="h-full w-full rounded-lg object-cover"
            src={image_path}
            alt={name}
            loading="lazy"
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute bottom-0 z-10 w-full bg-gradient-to-t from-black/80 to-transparent p-0 pt-10 text-center">
          <div className="mt-10 h-16 w-full bg-gradient-to-b from-white to-neutral-300 bg-clip-text text-center text-xl tracking-tighter text-transparent transition-transform duration-700 group-hover:scale-110 lg:text-2xl xl:text-3xl">
            {/* Placeholder for hover text effect if needed */}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <BorderGlowCardContent className="px-5 py-4">
        <div className="flex flex-col items-center gap-3">
          {/* Icon */}
          <div className="text-white">
             {Icon && <Icon size={24} />}
          </div>
          
          {/* Title */}
          <GradientTextAnimation
            padding="pb-1.5 md:pb-1.5"
            useScrollTrigger={false}
            textPosition="center"
            delay={0.5}
            staggerEachAmount={0.05}
            yPositionInitial={200}
            classname="text-xl tracking-tight font-semibold"
            string={name}
          />
        </div>

        {/* Description */}
        <div className="text-center text-lg text-neutral-400">
          <TextAnimation
            useScrollTrigger={false}
            textPosition="center"
            delay={0.5}
            staggerEachAmount={0.05}
            yPositionInitial={200}
            classname="text-base tracking-tight font-normal"
            string={description}
          />
        </div>
      </BorderGlowCardContent>
    </div>
  </BorderGlowCard>
));

GridItem.displayName = 'GridItem';

const GRID_WIDTHS: Record<string, string> = {
  'max-w-xs': 'max-w-xs',
  'max-w-sm': 'max-w-sm',
  'max-w-md': 'max-w-md',
  'max-w-lg': 'max-w-lg',
  'max-w-xl': 'max-w-xl',
  'max-w-2xl': 'max-w-2xl',
  'max-w-3xl': 'max-w-3xl',
  'max-w-4xl': 'max-w-4xl',
  'max-w-5xl': 'max-w-5xl',
  'max-w-6xl': 'max-w-6xl',
  'max-w-7xl': 'max-w-7xl',
  'max-w-full': 'max-w-full',
};

interface BorderGlowWorkGridProps {
  gridItems?: any[];
  gridTitle?: string;
  gridWidth?: string;
}

const BorderGlowWorkGrid = ({
  gridItems = [],
  gridTitle = 'Grid Title',
  gridWidth = 'max-w-7xl',
}: BorderGlowWorkGridProps) => {
  const router = useRouter();

  return (
    <div className={`container mx-auto px-4 md:px-8 ${GRID_WIDTHS[gridWidth] || 'max-w-7xl'}`}>
      <BorderGlowCard
        cardColor="bg-gradient-to-b from-[#0a0a0a] to-[#0a0a0a]"
        className="justify-center overflow-hidden"
        cardBorderRadius="3xl"
      >
        <BorderGlowCardHeader headerPadding="lg">
          <BorderGlowCardTitle className="text-4xl md:text-5xl">
            <GradientTextAnimation
              textPosition="center"
              delay={0.5}
              blurInitial={10}
              staggerType="letter"
              classname="tracking-tight font-normal"
              string={gridTitle}
            />
          </BorderGlowCardTitle>
        </BorderGlowCardHeader>
        
        <AnimatedWrapper delay={0.5} yPositionInitial={60} blurInitial={10}>
          <BorderGlowCardContent className="grid gap-2 px-2 sm:grid-cols-2">
            {gridItems?.map((item, index) => (
              <GridItem
                key={index}
                onClick={() => {
                  if (item.url) router.push(item.url);
                }}
                {...item}
              />
            ))}
          </BorderGlowCardContent>
        </AnimatedWrapper>
      </BorderGlowCard>
    </div>
  );
};

export default memo(BorderGlowWorkGrid);