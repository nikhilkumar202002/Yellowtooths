import { useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import GradientTextAnimation from '@/components/common/GradientTextAnimation';

interface LampLightProps {
  textLine1?: string;
  textLine2?: string;
  lampColor?: string;
  bgColor?: string;
  className?: string;
}

export function LampLight({
  textLine1 = 'Line 1',
  textLine2 = 'Line 2',
  lampColor = '#06b1ce',
  bgColor = 'bg-slate-950',
  className,
}: LampLightProps) {
  return (
    <LampContainer className={className} bgColor={bgColor} lampColor={lampColor}>
      <GradientTextAnimation
        textPosition={'center'}
        gradient="linear-gradient(to bottom, #ffffff, #8a8a8a)"
        delay={0.5}
        yPositionInitial={200}
        classname={'tracking-tight text-[5vw] md:text-[3vw] md:py-5'}
        string={textLine1}
      />
      <GradientTextAnimation
        textPosition={'center'}
        gradient="linear-gradient(to bottom, #ffffff, #8a8a8a)"
        delay={0.7}
        yPositionInitial={200}
        classname={'tracking-tight text-[8vw] md:text-[6vw] md:py-0'}
        string={textLine2}
      />
    </LampContainer>
  );
}

interface LampContainerProps {
  children: React.ReactNode;
  className?: string;
  lampColor?: string;
  bgColor?: string;
}

export const LampContainer = ({
  children,
  className,
  lampColor = '#06b1ce',
  bgColor = 'bg-slate-950',
}: LampContainerProps) => {
  const lampRef = useRef<HTMLDivElement>(null);
  const leftLampRef = useRef<HTMLDivElement>(null);
  const rightLampRef = useRef<HTMLDivElement>(null);
  const lampGlowRef = useRef<HTMLDivElement>(null);
  const lampLineRef = useRef<HTMLDivElement>(null);
  /*const lampBaseRef = useRef<HTMLDivElement>(null);*/

  useGSAP(
    () => {
      // Initial state
      gsap.set([leftLampRef.current, rightLampRef.current], {
        opacity: 0.5,
        width: window.innerWidth < 768 ? '10rem' : '15rem',
      });

      gsap.set(lampGlowRef.current, {
        width: window.innerWidth < 768 ? '4rem' : '8rem',
      });

      gsap.set(lampLineRef.current, {
        width: window.innerWidth < 768 ? '10rem' : '15rem',
      });

      // Animation timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: leftLampRef.current,
          start: 'top center',
          end: 'center top',
          toggleActions: 'play none none reverse',
        },
      });

      const finalWidth = window.innerWidth < 768 ? '16rem' : '30rem';
      const glowWidth = window.innerWidth < 768 ? '8rem' : '16rem';

      tl.to([leftLampRef.current, rightLampRef.current], {
        opacity: 1,
        width: finalWidth,
        duration: 0.8,
        ease: 'power2.inOut',
        delay: 0.3,
      })
        .to(
          lampGlowRef.current,
          {
            width: glowWidth,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          '<',
        )
        .to(
          lampLineRef.current,
          {
            width: finalWidth,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          '<',
        );
    },
    { scope: lampRef, dependencies: [] },
  );

  return (
    <div
      className={cn(
        `relative flex min-h-screen flex-col items-center justify-center overflow-hidden ${bgColor} z-0
        w-full rounded-none`,
        className,
      )}
    >
      <div
        ref={lampRef}
        className="relative isolate z-0 flex w-full flex-1 scale-y-125 items-center justify-center"
      >
        {/* Left Lamp */}
        <div
          ref={leftLampRef}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), ${lampColor}, transparent, transparent)`,
          }}
          className="bg-gradient-conic absolute inset-auto right-1/2 h-56 w-[30rem] overflow-visible text-white
            [--conic-position:from_70deg_at_center_top]"
        >
          <div
            className={`absolute left-0 w-[100%] ${bgColor} bottom-0 z-20 h-40
              [mask-image:linear-gradient(to_top,white,transparent)]`}
          />
          <div
            className={`absolute left-0 h-[100%] w-40 ${bgColor} bottom-0 z-20
              [mask-image:linear-gradient(to_right,white,transparent)]`}
          />
        </div>

        {/* Right Lamp */}
        <div
          ref={rightLampRef}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), transparent, transparent, ${lampColor})`,
          }}
          className="bg-gradient-conic absolute inset-auto left-1/2 h-56 w-[30rem] text-white
            [--conic-position:from_290deg_at_center_top]"
        >
          <div
            className={`absolute right-0 h-[100%] w-40 ${bgColor} bottom-0 z-20
              [mask-image:linear-gradient(to_left,white,transparent)]`}
          />
          <div
            className={`absolute right-0 w-[100%] ${bgColor} bottom-0 z-20 h-40
              [mask-image:linear-gradient(to_top,white,transparent)]`}
          />
        </div>

        <div
          className={`absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 ${bgColor} blur-2xl`}
        ></div>
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>

        {/* Lamp Glow */}
        <div
          style={{ backgroundColor: lampColor }}
          className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full opacity-50 blur-3xl"
        ></div>

        <div
          ref={lampGlowRef}
          style={{ backgroundColor: lampColor }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full blur-2xl"
        ></div>

        <div
          ref={lampLineRef}
          style={{ backgroundColor: lampColor }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem]"
        ></div>

        <div
          className={`absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] ${bgColor}`}
        ></div>
      </div>

      <div className="relative z-50 flex w-full -translate-y-[20rem] flex-col items-center px-5 md:-translate-y-[80%]">
        {children}
      </div>
    </div>
  );
};