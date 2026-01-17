'use client';

import { useQuery } from '@tanstack/react-query';
import { getAllPosters, getServices } from '../../api/services/services'; // Added getServices
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import Loading from '../common/Loading';
import Error from '../common/Error';
import { verticalLoop } from '../../context/animations/verticalInfiniteScrollingText';

interface ColumnSpeedSettings {
  speed: number;
  reversed: boolean;
}

interface DefaultColumns {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

interface Props {
  defaultColumns?: DefaultColumns;
  columnSpeedSettings?: ColumnSpeedSettings[];
  interactionMode?: 'click' | 'hover';
}

const PosterInfinityCarousel = ({
  defaultColumns = { sm: 3, md: 3, lg: 4, xl: 5 },
  columnSpeedSettings = [
    { speed: 0.08, reversed: false },
    { speed: 0.09, reversed: true },
    { speed: 0.1, reversed: true },
    { speed: 0.12, reversed: true },
    { speed: 0.13, reversed: true },
  ],
  interactionMode = 'click',
}: Props) => {
  const [numColumns, setNumColumns] = useState(defaultColumns.sm);
  const gridRef = useRef<HTMLDivElement>(null);
  const animationsRef = useRef<gsap.core.Timeline[]>([]);
  const activeAnimationRef = useRef<gsap.core.Timeline | null>(null);

  const maxColumns = Math.max(...Object.values(defaultColumns));
  const columnRefs = useRef<Array<{ current: HTMLDivElement | null }>>(
    Array(maxColumns).fill(null).map(() => ({ current: null })),
  );

  // --- FIX: Robust Data Fetching with Fallback ---
  const {
    isLoading,
    error,
    data: featuredWorks = [],
  } = useQuery({
    queryKey: ['preloader_posters_combined'],
    queryFn: async () => {
      try {
        // Try getting specific loader images first
        const response: any = await getAllPosters();
        let data = Array.isArray(response) ? response : response?.data || [];
        
        // If empty, fallback to services images
        if (data.length === 0) {
           const services: any = await getServices();
           data = Array.isArray(services) ? services : services?.data || [];
        }
        return data;
      } catch (err) {
        console.warn("Loader images failed, fetching fallback...", err);
        const services: any = await getServices();
        return Array.isArray(services) ? services : services?.data || [];
      }
    },
    staleTime: Infinity, // Keep data cached forever for preloader
    gcTime: Infinity,
  });

  // Debounce helper
  const debounce = (fn: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const cleanupAnimations = () => {
    if (animationsRef.current.length) {
      animationsRef.current.forEach((anim) => anim.kill && anim.kill());
      animationsRef.current = [];
    }
    activeAnimationRef.current = null;
  };

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      let newNumColumns;

      if (width >= 1280) newNumColumns = defaultColumns.xl;
      else if (width >= 1024) newNumColumns = defaultColumns.lg;
      else if (width >= 768) newNumColumns = defaultColumns.md;
      else newNumColumns = defaultColumns.sm;

      if (newNumColumns !== numColumns) setNumColumns(newNumColumns);
    };

    const debouncedUpdate = debounce(updateColumns, 100);
    updateColumns();
    window.addEventListener('resize', debouncedUpdate);
    return () => window.removeEventListener('resize', debouncedUpdate);
  }, [defaultColumns, numColumns]);

  const splitWorks = useMemo(() => {
    if (!featuredWorks.length) return [];
    // Duplicate data enough times to fill columns and allow scrolling
    const safetyMultiplier = featuredWorks.length < 10 ? 4 : 1; 
    const baseData = [...featuredWorks];
    
    // Ensure we have enough items for the loop
    let extendedData = baseData;
    for(let k=0; k<safetyMultiplier; k++) {
        extendedData = [...extendedData, ...baseData];
    }

    return Array.from({ length: numColumns }, (_, i) => {
      const columnWorks = extendedData.filter((_: any, index: number) => index % numColumns === i);
      // Triplicate for infinite seamless loop
      return [...columnWorks, ...columnWorks, ...columnWorks];
    });
  }, [featuredWorks, numColumns]);

  useEffect(() => {
    return () => cleanupAnimations();
  }, []);

  useEffect(() => {
    cleanupAnimations();
    const timer = setTimeout(() => {
      if (gridRef.current) initializeAnimations();
    }, 100);
    return () => clearTimeout(timer);
  }, [numColumns, splitWorks]); // Changed dep to splitWorks to react to data load

  const initializeAnimations = () => {
    const mapSpeedToDuration = (speed: number) => 10 / speed;
    const defaultSpeed = 0.5;
    const removers: Array<() => void> = [];

    const columns = Array.from({ length: numColumns }, (_, index) => {
      const { speed = defaultSpeed, reversed = false } =
        columnSpeedSettings[index % columnSpeedSettings.length] || {};
      return {
        ref: columnRefs.current[index],
        reversed,
        duration: mapSpeedToDuration(speed),
      };
    });

    columns.forEach(({ ref, reversed, duration }) => {
      if (!ref?.current) return;

      const images = gsap.utils.toArray(ref.current.querySelectorAll('.featured-work-image'));
      if (!images.length) return;

      const animation = verticalLoop(images, {
        repeat: -1,
        duration,
        reversed,
        snap: false,
      });
      animation.play();
      animationsRef.current.push(animation);
    });

    return () => {
      removers.forEach((remove) => remove());
    };
  };

  useGSAP(() => initializeAnimations(), { scope: gridRef, dependencies: [numColumns, splitWorks] });

  // Do not return null/loading here if it's the preloader, 
  // we want to render the grid even if empty to avoid layout shifts, 
  // but if loading, maybe show skeleton? 
  // For now, let's just let it render what it has.
  
  return (
    <div className="relative z-0 flex min-h-screen flex-col overflow-hidden bg-black">
        <div ref={gridRef} className="flex w-full h-full">
          {splitWorks.map((columnWorks: any[], colIndex: number) => (
            <div
              key={`column-${colIndex}`}
              ref={(el) => { if (columnRefs.current[colIndex]) columnRefs.current[colIndex].current = el; }}
              className="mx-auto flex w-full flex-col"
            >
              {columnWorks.map((service, index) => (
                <div className="py-0" key={`image-${colIndex}-${index}`}>
                  <div className="featured-work-image h-auto w-full overflow-hidden p-1">
                    {service.image_path || service.icon_path ? (
                        <img
                        loading="eager" // Important for preloader
                        src={service.image_path || service.icon_path}
                        alt={service.name || `Poster`}
                        className="h-full w-full rounded-lg object-cover opacity-60 grayscale"
                        />
                    ) : (
                        <div className="h-40 w-full bg-neutral-800 animate-pulse rounded-lg"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
    </div>
  );
};

export default memo(PosterInfinityCarousel);