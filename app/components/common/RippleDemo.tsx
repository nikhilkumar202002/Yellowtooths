'use client';

import { Ripple } from '../ui/ripple';
import MorphingText from '../ui/morphing-text';

interface RippleDemoProps {
  texts?: string[];
}

export function RippleDemo({ texts = [] }: RippleDemoProps) {
  const safeTexts = texts.length ? texts : [' '];
  return (
    <div className="bg-background relative flex h-full w-full flex-col justify-center overflow-hidden">
      <div className="z-10 whitespace-pre-wrap text-center font-medium tracking-tighter text-white">
        <MorphingText
          className={'max-w-full text-center text-xl tracking-tighter md:text-3xl lg:text-4xl'}
          texts={safeTexts}
        />
      </div>
      <Ripple mainCircleSize={250} mainCircleOpacity={0.6} />
    </div>
  );
}