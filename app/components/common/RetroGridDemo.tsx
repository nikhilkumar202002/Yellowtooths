'use client';

import React, { memo } from 'react';
import RetroGrid from '../../components/ui/retro-grid';
import TextAnimation from '../../components/common/TextAnimation';
import { Award, Camera, Film, Users } from 'lucide-react';
import AnimatedWrapper from '../../components/common/AnimatedWrapper';
import {
  BorderGlowCard,
  BorderGlowCardContent,
  BorderGlowCardHeader,
} from '../../components/common/BorderGlowCard';

const features = [
  {
    name: 'High-Quality Productions',
    description: 'We deliver top-notch content that exceeds industry standards.',
    icon: Camera,
  },
  {
    name: 'Creative Storytelling',
    description: 'Our team crafts compelling narratives that captivate audiences.',
    icon: Film,
  },
  {
    name: 'Experienced Team',
    description: 'Years of experience, unmatched expertise in every project.',
    icon: Users,
  },
  {
    name: 'Award-Winning',
    description: 'Our work has been recognized with numerous industry accolades.',
    icon: Award,
  },
];

const RetroGridDemo = () => {
  return (
    <div
      className="bg-background relative flex h-[100vh] w-full flex-col items-center justify-center
        overflow-hidden border-[#ffd319]/30 md:h-[100vh] md:shadow-xl lg:h-[140vh] xl:h-[100vh]"
    >
      {/* 1. Grid Background with Animation */}
      <RetroGrid angle={14} cellSize={120} opacity={0.6} darkLineColor={'yellow'} />

      <section className={'padding-primary container relative flex max-w-7xl flex-col gap-10 md:gap-0'}>
        <div className={'flex flex-col font-beckman'}>
          <TextAnimation
            classname={'text-h2-xs font-beckman font-bold uppercase text-neutral-300'}
            textPosition={'center'}
            delay={0.5}
            duration={2}
            yPositionInitial={200}
            staggerEachAmount={0.1}
            blurInitial={20}
            staggerType={'word'}
            string={'we are'}
          />

          <TextAnimation
            classname={'text-h2-xl font-beckman font-bold uppercase text-amber-400'}
            textPosition={'center'}
            delay={0.5}
            duration={2}
            yPositionInitial={200}
            staggerEachAmount={0.1}
            blurInitial={20}
            staggerType={'word'}
            string={'Yellowtooths'}
          />
        </div>

        <div className="hidden max-w-full px-0 text-2xl text-neutral-300">
          <TextAnimation
            textPosition={'center'}
            string={
              'We are a passionate team of filmmakers, storytellers, and visionaries dedicated to bringing your ideas to life on screen.'
            }
          />
        </div>

        {/* 2. Features Container (The Correct Card Design) */}
        <BorderGlowCard
          borderColor={'bg-white/10'}
          cardColor={'bg-gradient-to-b from-[#0a0a0a] to-[#0d0d0d]'}
          cardBorderRadius={'3xl'}
          className="mx-auto max-w-7xl px-0 sm:mt-20 lg:mt-24 w-full"
        >
          <BorderGlowCardContent className="grid grid-cols-1 gap-2 p-2 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <BorderGlowCard
                key={feature?.name}
                cardColor={'bg-gradient-to-b from-[#0a0a0a] to-[#0d0d0d]'}
                borderColor={'bg-white/10'}
                cardBorderRadius={'2xl'}
              >
                <BorderGlowCardHeader
                  className={'flex flex-col items-center gap-0.5 md:gap-0 text-center'}
                >
                  <AnimatedWrapper yPositionInitial={30} blurInitial={5}>
                    <feature.icon
                      className="mb-1.5 h-5 w-5 flex-none text-neutral-200"
                      aria-hidden="true"
                    />
                  </AnimatedWrapper>
                  
                  <TextAnimation
                    textPosition={'center'}
                    classname={'font-semibold text-white'}
                    staggerType={'word'}
                    staggerEachAmount={0.02}
                    yPositionInitial={100}
                    blurInitial={3}
                    delay={0.1}
                    string={feature?.name}
                  />

                  <div className="mt-1 flex text-sm text-neutral-400 md:text-base justify-center">
                    <TextAnimation
                      textPosition={'center'}
                      staggerType={'word'}
                      staggerEachAmount={0.02}
                      yPositionInitial={100}
                      blurInitial={3}
                      delay={0.3}
                      string={feature?.description}
                    />
                  </div>
                </BorderGlowCardHeader>
              </BorderGlowCard>
            ))}
          </BorderGlowCardContent>
        </BorderGlowCard>
      </section>
    </div>
  );
};

export default memo(RetroGridDemo);