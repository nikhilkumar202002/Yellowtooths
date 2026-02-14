import React, { memo } from 'react';
import {
  BorderGlowCard,
  BorderGlowCardContent,
  BorderGlowCardHeader,
  BorderGlowCardTitle,
} from '@/components/common/BorderGlowCard';
import AnimatedWrapper from '@/components/common/AnimatedWrapper';
import GradientTextAnimation from '@/components/common/GradientTextAnimation';

interface GridItemProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const GRID_WIDTHS = {
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

const GridItem = React.memo(({ icon: Icon, title, description }: GridItemProps) => (
  <BorderGlowCard
    cardColor="bg-gradient-to-b from-[#090909] to-[#121212]"
    cardBorderRadius="2xl">
    <BorderGlowCardHeader className="flex flex-col items-center justify-center gap-3">
      <div className="bg-primary/10 rounded-full pt-0 md:pt-1.5">
        <Icon className="text-primary h-5 w-5" />
      </div>
      <div className={'text-center'}>
        <BorderGlowCardTitle className="font-normal md:text-xl">{title}</BorderGlowCardTitle>
        <p className="text-sm text-neutral-300">{description}</p>
      </div>
    </BorderGlowCardHeader>
  </BorderGlowCard>
));

GridItem.displayName = 'GridItem';

interface BorderGlowServiceCardGridProps {
  gridItems?: GridItemProps[];
  gridTitle?: string;
  gridWidth?: keyof typeof GRID_WIDTHS;
}

const BorderGlowServiceCardGrid = ({
  gridItems = [],
  gridTitle = 'Grid Title',
  gridWidth = 'max-w-7xl',
}: BorderGlowServiceCardGridProps) => (
  <div className={`container mx-auto ${GRID_WIDTHS[gridWidth]} px-2 md:px-4`}>
    <BorderGlowCard
      cardColor="bg-gradient-to-b from-[#0a0a0a] to-[#0a0a0a]"
      className="justify-center"
      cardBorderRadius="3xl">
      <BorderGlowCardHeader headerPadding={'lg'}>
        <BorderGlowCardTitle className={'text-center text-4xl md:text-center md:text-5xl'}>
          <GradientTextAnimation
            textPosition={'center'}
            delay={0.5}
            blurInitial={10}
            staggerType={'letter'}
            classname="tracking-tight font-normal"
            string={gridTitle}
          />
        </BorderGlowCardTitle>
      </BorderGlowCardHeader>
      <AnimatedWrapper delay={0.5} yPositionInitial={60} blurInitial={10}>
        <BorderGlowCardContent className="grid gap-2 overflow-hidden px-2 sm:grid-cols-2">
          {gridItems.map((service, index) => (
            <GridItem key={index} {...service} />
          ))}
        </BorderGlowCardContent>
      </AnimatedWrapper>
    </BorderGlowCard>
  </div>
);

export default memo(BorderGlowServiceCardGrid);
