'use client';

import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';

interface FooterCallToActionProps {
  normalString: string;
  highlightString: string;
  buttonString: string;
  fontWeight?: string;
}

const FooterCallToActionButton = ({
  normalString,
  highlightString,
  buttonString,
  fontWeight = 'font-bold',
}: FooterCallToActionProps) => {
  const router = useRouter();
  const [isTouch, setIsTouch] = useState(false);
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleTouchStart = () => {
    setIsTouch(true);
  };

  const handleButtonClick = () => {
    if (isTouch) {
      setTimeout(() => {
        router.push('/contact');
      }, 600);
    } else {
      router.push('/contact');
    }
  };

  const parseStringWithBreaks = (text: string) => {
    return text.split('[BR]').map((segment, index) => (
      <span key={index}>
        {segment}
        {index !== text.split('[BR]').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div ref={ref} className="container mx-auto mt-16 max-w-full text-center">
      <p
        className={`mb-6 text-4xl font-normal tracking-tighter transition-colors duration-500 ease-in-out
          md:text-7xl ${hover ? 'text-white' : 'text-neutral-500'}`}>
        {parseStringWithBreaks(normalString)}
        <span
          className={`transition-colors duration-500 ease-in-out ${hover ? 'text-amber-400' : 'text-white'}`}>
          {highlightString}
        </span>
      </p>
      <div>
        <div className="relative select-none" onTouchStart={handleTouchStart}>
          <Button
            size="lg"
            className="absolute -z-10 -translate-x-0 translate-y-1.5 rounded-full border bg-white p-7 text-transparent
              dark:bg-neutral-800 hover:dark:bg-neutral-800 md:-translate-x-0 md:translate-y-2 md:p-8">
            <p
              className={`${hover ? `${fontWeight}` : `${fontWeight}`} text-sm uppercase tracking-tight md:text-xl`}>
              {buttonString}
            </p>
          </Button>

          <Button
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={handleButtonClick}
            size="lg"
            className={`text-primary-foreground rounded-full border p-7 tracking-tight transition-all duration-500
              ease-in-out hover:-translate-x-0 hover:translate-y-1.5 hover:border-amber-400 dark:bg-white
              dark:hover:bg-amber-400 md:p-8 md:hover:-translate-x-0 md:hover:translate-y-2`}>
            <p
              className={`text-sm uppercase tracking-tight transition-all duration-500 ease-in-out md:text-xl ${
                hover ? `${fontWeight}` : `${fontWeight}` }`}>
              {buttonString}
            </p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FooterCallToActionButton;