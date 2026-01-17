'use client';

import { Ripple } from '../ui/ripple';
import MorphingText from '../ui/morphing-text';

export function RippleDemo() {
  return (
    <div className="bg-background relative flex h-full w-full flex-col justify-center overflow-hidden">
      <div className="z-10 whitespace-pre-wrap text-center font-medium tracking-tighter text-white">
        <MorphingText
          className={'max-w-full text-center text-xl tracking-tighter md:text-3xl lg:text-4xl'}
          texts={[
            `Turning Stories into Art.`,
            `Brands into Icons.`,
            `Visuals into Pure Magic.`,
          ]}
        />
      </div>
      <Ripple mainCircleSize={250} mainCircleOpacity={0.6} />
    </div>
  );
}