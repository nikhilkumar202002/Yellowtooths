'use client';

import { useQuery } from '@tanstack/react-query';
import { getAllPosters } from '../../api/services/services';
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
  defaultColumns = {
    sm: 3,
    md: 3,
    lg: 4,
    xl: 5,
  },
  // 1. INCREASED SPEED: Values bumped up for faster scrolling
  columnSpeedSettings = [
    { speed: 0.08, reversed: false },
    { speed: 0.1, reversed: true },
    { speed: 0.07, reversed: true },
    { speed: 0.09, reversed: true },
    { speed: 0.08, reversed: true },
  ],
  interactionMode = 'click',
}: Props) => {
  const [numColumns, setNumColumns] = useState(defaultColumns.sm);
  const gridRef = useRef<HTMLDivElement>(null);
  const animationsRef = useRef<gsap.core.Timeline[]>([]);
  const activeAnimationRef = useRef<gsap.core.Timeline | null>(null);

  const maxColumns = Math.max(...Object.values(defaultColumns));
  
  const columnRefs = useRef<Array<{ current: HTMLDivElement | null }>>(
    Array(maxColumns)
      .fill(null)
      .map(() => ({ current: null })),
  );

  const {
    isLoading,
    error,
    data: featuredWorks = [],
  } = useQuery({
    queryKey: ['home-page-2_get-posters'],
    queryFn: async () => {
      const response: any = await getAllPosters();
      return Array.isArray(response) ? response : response?.data || [];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const debounce = (fn: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const cleanupAnimations = () => {
    if (animationsRef.current.length) {
      animationsRef.current.forEach((anim) => {
        if (anim) {
            anim.pause();
            anim.kill();
        }
      });
      animationsRef.current = [];
    }
    activeAnimationRef.current = null;
  };

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      let newNumColumns;

      if (width >= 1280) {
        newNumColumns = defaultColumns.xl;
      } else if (width >= 1024) {
        newNumColumns = defaultColumns.lg;
      } else if (width >= 768) {
        newNumColumns = defaultColumns.md;
      } else {
        newNumColumns = defaultColumns.sm;
      }

      if (newNumColumns !== numColumns) {
        setNumColumns(newNumColumns);
      }
    };

    const debouncedUpdate = debounce(updateColumns, 100);
    updateColumns();
    window.addEventListener('resize', debouncedUpdate);
    return () => window.removeEventListener('resize', debouncedUpdate);
  }, [defaultColumns, numColumns]);

  const splitWorks = useMemo(() => {
    if (!featuredWorks.length) return [];

    return Array.from({ length: numColumns }, (_, i) => {
      const columnWorks = featuredWorks.filter((_: any, index: number) => index % numColumns === i);
      return [...columnWorks, ...columnWorks, ...columnWorks, ...columnWorks];
    });
  }, [featuredWorks, numColumns]);

  useEffect(() => {
    return () => cleanupAnimations();
  }, []);

  useEffect(() => {
    cleanupAnimations();

    const timer = setTimeout(() => {
      if (gridRef.current) {
        initializeAnimations();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [numColumns, featuredWorks]);

  const initializeAnimations = () => {
    const mapSpeedToDuration = (speed: number) => 20 / (speed || 0.05);
    const defaultSpeed = 0.05;
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
      
      if (!images.length || images.length < 3) return;

      const animation = verticalLoop(images, {
        repeat: -1,
        duration,
        reversed,
        snap: false,
        paddingBottom: 20,
      });

      if (animation) {
          animation.play();
          animationsRef.current.push(animation);
      }

      if (interactionMode === 'click') {
        const clickHandler = () => {
          if (activeAnimationRef.current && activeAnimationRef.current !== animation) {
            activeAnimationRef.current.play();
          }
          if (animation.isActive()) {
            animation.pause();
            activeAnimationRef.current = animation;
          } else {
            animation.play();
            activeAnimationRef.current = null;
          }
        };
        ref.current.addEventListener('click', clickHandler);
        removers.push(() => ref.current?.removeEventListener('click', clickHandler));
      } else if (interactionMode === 'hover') {
        const mouseEnterHandler = () => animation.pause();
        const mouseLeaveHandler = () => animation.play();
        ref.current.addEventListener('mouseenter', mouseEnterHandler);
        ref.current.addEventListener('mouseleave', mouseLeaveHandler);
        removers.push(() => {
          ref.current?.removeEventListener('mouseenter', mouseEnterHandler);
          ref.current?.removeEventListener('mouseleave', mouseLeaveHandler);
        });
      }
    });

    return () => {
      removers.forEach((remove) => remove());
    };
  };

  useGSAP(
    () => {
      return initializeAnimations();
    },
    { scope: gridRef, dependencies: [numColumns, featuredWorks] },
  );

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="relative z-0 flex min-h-[150vh] flex-col overflow-hidden bg-black">
      <section className="mx-1 h-[90vh] rounded-xl md:mx-4">
        <div
          className={
            'pointer-events-none absolute inset-0 z-50 bg-gradient-to-t from-black via-transparent via-50%'
          }></div>

        <div ref={gridRef} className="flex w-full">
          {splitWorks.map((columnWorks: any[], colIndex: number) => (
            <div
              key={`column-${colIndex}-${numColumns}`}
              ref={(el) => {
                if (columnRefs.current[colIndex]) {
                  columnRefs.current[colIndex].current = el;
                }
              }}
              className="mx-auto flex w-fit flex-col">
              {columnWorks.map((service, index) => (
                <div className="py-0" key={`image-${colIndex}-${index}`}>
                  {/* 2. REDUCED GAP: Changed padding to 'md:p-2' (was 'md:p-4 lg:p-5') */}
                  <div className="featured-work-image h-auto w-full overflow-hidden p-1 will-change-transform md:p-3">
                    <img
                      loading="lazy"
                      src={service.image_path}
                      alt={service.name || `Poster ${index + 1}`}
                      className="h-full w-full rounded-lg object-cover transition-transform duration-500 will-change-transform
                        hover:scale-105 lg:rounded-xl"
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default memo(PosterInfinityCarousel);