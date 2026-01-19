'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import {
  BorderGlowCard,
  BorderGlowCardContent,
  BorderGlowCardHeader,
  BorderGlowCardTitle,
} from '../../components/common/BorderGlowCard';
import AnimatedWrapper from '../../components/common/AnimatedWrapper';
import GradientTextAnimation from '../../components/common/GradientTextAnimation';
import { LucideIcon } from 'lucide-react';

interface ContactItem {
  icon: LucideIcon;
  title: string;
  content: string;
  link?: string;
}

interface BorderGlowContactCardProps {
  gridTitle?: string;
  gridItems: ContactItem[];
  gridWidth?: string;
}

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

interface GridItemProps extends ContactItem {
  index: number;
  className?: string;
}

const GridItem = memo(({ index, icon: Icon, title, content, link, className }: GridItemProps) => {
  // Use Link for Next.js optimization
  const Component = link ? Link : 'div';
  const props = link ? { href: link, target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    // @ts-ignore
    <Component {...props} className={className}>
      <BorderGlowCard
        cardColor="bg-gradient-to-b from-[#0f0f0f] to-[#121212]"
        cardBorderRadius="2xl"
        className="h-full"
      >
        <BorderGlowCardHeader className="flex flex-col items-center justify-center p-6">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="rounded-full border border-white/20 bg-neutral-800 p-2 outline outline-1 outline-white/15">
              <Icon
                className="h-5 w-5 text-neutral-200 transition-transform duration-700 ease-in-out group-hover:rotate-[360deg]"
              />
            </div>
            <BorderGlowCardTitle className="text-sm font-normal text-neutral-300 md:text-sm">
              {title}
            </BorderGlowCardTitle>
          </div>
          <p
            className={`text-neutral-100 ${index === 2 ? 'px-12' : 'px-2'} text-center text-sm md:text-base mt-2`}
          >
            {content}
          </p>
        </BorderGlowCardHeader>

        {/* Embedded Google Maps Section (Only for Index 2) */}
        {index === 2 && (
          <div className="flex justify-center p-2 pt-0">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.053358352618!2d76.3262613757969!3d10.012443272815197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080c500473531b%3A0x6295521746961445!2sYellowTooth%20Advertising%20Agency!5e0!3m2!1sen!2sin!4v1716300000000!5m2!1sen!2sin"
              width="100%"
              height="260"
              style={{ border: 0, borderRadius: '10px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="opacity-80 grayscale invert filter transition-all duration-500 hover:filter-none"
            />
          </div>
        )}
      </BorderGlowCard>
    </Component>
  );
});

GridItem.displayName = 'GridItem';

const BorderGlowContactCard = ({
  gridItems = [],
  gridTitle = 'Grid Title',
  gridWidth = 'max-w-6xl',
}: BorderGlowContactCardProps) => {
  return (
    <div className={`container mx-auto ${GRID_WIDTHS[gridWidth] || 'max-w-6xl'}`}>
      <BorderGlowCard
        cardColor="bg-gradient-to-b from-[#0a0a0a] to-[#0a0a0a]"
        className="justify-center"
        cardBorderRadius="3xl"
      >
        <BorderGlowCardHeader headerPadding="lg">
          <BorderGlowCardTitle className="text-4xl md:text-5xl">
            <GradientTextAnimation
              textPosition="center"
              delay={0.5}
              yPositionInitial={100}
              blurInitial={10}
              classname="tracking-tight font-normal"
              string={gridTitle}
            />
          </BorderGlowCardTitle>
        </BorderGlowCardHeader>
        
        <AnimatedWrapper delay={0.5} yPositionInitial={60} blurInitial={10}>
          <BorderGlowCardContent className="grid grid-cols-1 gap-2 overflow-hidden px-2 sm:grid-cols-2">
            {gridItems.map((service, index) => (
              <GridItem
                key={index}
                index={index}
                className={`group cursor-pointer ${index === 2 ? 'col-span-1 sm:col-span-2' : ''}`}
                {...service}
              />
            ))}
          </BorderGlowCardContent>
        </AnimatedWrapper>
      </BorderGlowCard>
    </div>
  );
};

export default memo(BorderGlowContactCard);