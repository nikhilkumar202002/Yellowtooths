'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useQuery } from '@tanstack/react-query';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getFilmPosterDesigns, getPageHeader } from '@/api/services/services';
import Loading from '../../common/Loading';
import Error from '../../common/Error';
import { useRouter } from 'next/navigation';
import AnimatedPageWrapper from '../../common/AnimatedWrapper';
import { Input } from '../../ui/input';
import { Image, Type, Sliders, Palette, Globe, Crop, Layout, FileText } from 'lucide-react';
import Spacer from '../../common/Spacer';

gsap.registerPlugin(ScrollTrigger);

const FilmPosterDesignPage = () => {
  // Overlay to block right-click and drag
  // This covers the entire page and blocks pointer events

  // Block right-click and screenshot shortcuts
  useEffect(() => {
    const handleContextMenu = (e: Event) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block PrintScreen, Cmd+Shift+4, Cmd+Shift+3, Ctrl+Shift+S, Ctrl+P (print), Shift, Ctrl
      // On macOS, Cmd+Shift+4 and Cmd+Shift+3 are screenshot shortcuts
      if (
        e.key === 'PrintScreen' ||
        e.key === 'Shift' ||
        e.key === 'Control' ||
        // Block Cmd+Shift+4 and Cmd+Shift+3 (macOS)
        (e.metaKey && e.shiftKey && (e.key === '4' || e.key === '3')) ||
        (e.metaKey && e.shiftKey && (e.code === 'Digit4' || e.code === 'Digit3')) ||
        (e.metaKey && e.shiftKey && (e.keyCode === 52 || e.keyCode === 51)) ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') ||
        (e.ctrlKey && e.key.toLowerCase() === 'p')
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);
  // Search state to filter posters.
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const gridRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['film-poster-design-page_get-posters'],
    queryFn: () => getFilmPosterDesigns(),
  // refetchInterval removed: no auto-refresh
    placeholderData: (previousData) => previousData,
  });

  // Page header state
  const [header, setHeader] = useState<any>(null);
  const [headerLoading, setHeaderLoading] = useState(true);
  const [headerError, setHeaderError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setHeaderLoading(true);
    getPageHeader()
      .then((res) => {
        if (mounted && Array.isArray(res) && res.length > 0) {
          setHeader(res[0]);
        }
      })
      .catch(() => {
        if (mounted) setHeaderError(true);
      })
      .finally(() => {
        if (mounted) setHeaderLoading(false);
      });
    return () => { mounted = false; };
  }, []);
  // Map API data to UI fields
  const mappedData = useMemo(() =>
    data
      ? data.map((item: any) => ({
          id: item.id,
          name: item.film_name,
          type: item.type,
          position: item.position,
          year_of_release: item.year,
          language: item.language,
          genre: item.genre,
          imdb_rating: item.imdb_rating,
          trailer_link: item.trailer_link,
          main_image: item.main_image,
          images: item.images,
        }))
      : [],
    [data],
  );

  // Memoize reversed data so it's not recalculated on every render.
  const sortedData = useMemo(() => {
    if (!mappedData) return [];
    return [...mappedData].sort((a: any, b: any) => {
      const posA = parseInt(a.position) || 0;
      const posB = parseInt(b.position) || 0;
      return posA - posB; // Sort by position ascending
    });
  }, [mappedData]);

  // Filter posters based on search query and year.
  const filteredData = useMemo(() => {
    let filtered = sortedData;
    if (debouncedSearch) {
      const lowerSearch = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.name && item.name.toLowerCase().includes(lowerSearch)) ||
          (item.genre && item.genre.toLowerCase().includes(lowerSearch)),
      );
    }
    return filtered;
  }, [sortedData, debouncedSearch]);

  // Memoize the navigation handler.
  // Update: handleNavigate now takes both name and id
  const handleNavigate = useCallback(
    (name: string, id: string | number) => {
      const urlName = name ? name.toLowerCase().replace(/\s+/g, '-') : '';
      router.push(`/works/film-poster-design/${urlName}?id=${id}`);
    },
    [router],
  );

  useGSAP(
    () => {
      const grid = gridRef?.current;
      const cards = grid ? gsap.utils.toArray(grid.querySelectorAll('.poster-card')) as Element[] : [];

      if (!grid || !cards || !cards.length) return;

      gsap.set(cards, { y: 100, opacity: 0.2 });

      // Animate grid items on scroll
      cards.forEach((card, i) => {
        gsap.to(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            toggleActions: 'play none none reverse',
          },
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
          delay: i * 0.02,
        });
      });
    },
    { scope: gridRef, dependencies: [data] },
  );

  if (isLoading || (!data && isFetching)) {
    // Show a skeleton loader for fast perceived loading
    return <div className="p-8"><div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="aspect-[24/35] bg-neutral-900 rounded-xl" />
      ))}
    </div></div>;
  }

  if (error) {
    return <Error />;
  }

  return (
    <AnimatedPageWrapper duration={2} blurInitial={10}>
      <div className="min-h-screen w-full">

        {/* Hero Section: Show video or image from API if available */}
        {headerLoading ? (
          <div className="flex h-[40vh] w-full items-center justify-center bg-black text-white text-xl">Loading hero...</div>
        ) : header && header.file_path ? (
          <div className="relative h-[40vh] w-full bg-black flex items-center justify-center">
            <img
              src={header.file_path}
              alt={header.page_name}
              className="h-full w-full object-contain object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-yellow-400 text-4xl md:text-6xl font-bold uppercase text-center" style={{ fontFamily: 'Beckman Variable, sans-serif' }}>Film Poster Design</h1>
            </div>
          </div>
        ) : (
          <div className="relative h-[40vh] w-full bg-black flex items-center justify-center">
            <img
              src="/IMAGE/1680x1050.webp" // Assuming the image is in public/IMAGE/
              alt="Film Poster Design"
              className="h-full w-full object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-yellow-400 text-4xl md:text-6xl font-bold uppercase text-center" style={{ fontFamily: 'Beckman Variable, sans-serif' }}>Film Poster Design</h1>
            </div>
          </div>
        )}

        <div
          className={
            'w-full bg-gradient-to-b from-neutral-950 via-neutral-950 pb-10 md:pb-20'
          }>
          <Spacer />
        </div>

        {/* Search Bar */}
        <div className="flex items-center justify-center gap-4 px-4 pb-4">
          <Input
            className={
              'w-full rounded-2xl bg-gradient-to-t from-white/5 md:w-1/2 lg:w-1/3 lg:max-w-96'
            }
            type="text"
            value={search}
            placeholder={'Search for poster...'}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Grid Section */}
         <div
           ref={gridRef}
           className="grid cursor-pointer grid-cols-1 gap-0 p-0 font-geist-sans will-change-transform sm:grid-cols-2
             md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
           {filteredData.length ? (
             filteredData.map((item, index) => (
               <div
                 key={index}
                 onClick={() => handleNavigate(item.name, item.id)}
                 className="poster-card group relative aspect-[24/35] overflow-hidden border-0 border-white/20">
                 <div className="absolute inset-0 transition-all duration-500 hover:scale-105">
                     <img
                       src={item.main_image}
                       alt={item.name}
                       className="h-full w-full object-cover"
                       loading="lazy"
                     />
                   {/* Gradient overlay */}
                   <div
                     className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0
                       transition-opacity duration-300 group-hover:opacity-100"
                   />
                 </div>

                 {/* Info overlay */}
                 <div
                   className="absolute inset-x-0 top-0 flex items-center justify-between p-4 -translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                   {/* Genre left */}
                   {item.genre && item.genre !== 'N/A' && (
                     <h3
                       className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs text-white backdrop-blur-2xl md:text-sm lg:text-xs">
                       {item.genre}
                     </h3>
                   )}
                   {/* IMDb right */}
                   {item.imdb_rating && (
                     <h3
                       className="rounded-full border border-yellow-400 bg-yellow-900/40 px-3 py-2 text-xs text-yellow-300 backdrop-blur-2xl md:text-sm lg:text-xs flex items-center gap-1">
                       <span className="font-bold">IMDb</span>{' '}
                       <span>{item.imdb_rating}</span>
                     </h3>
                   )}
                 </div>
                 <div
                   className="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 justify-between p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                   <div className="flex gap-2">
                     {item.name && item.name !== 'N/A' && (
                       <h3
                         className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs text-white backdrop-blur-2xl md:text-sm lg:text-xs">
                         {item.name}
                       </h3>
                     )}
                     {item.type && item.type !== 'N/A' && (
                       <h3
                         className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs text-white backdrop-blur-2xl md:text-sm lg:text-xs">
                         {item.type}
                       </h3>
                     )}
                   </div>
                   <div className="flex gap-2">
                     {item.language && item.language !== 'N/A' && (
                       <h3
                         className="rounded-full border border-blue-400 bg-blue-900/40 px-3 py-2 text-xs text-blue-200 backdrop-blur-2xl md:text-sm lg:text-xs">
                         {item.language}
                       </h3>
                     )}
                     {item.year_of_release && item.year_of_release !== 'N/A' && (
                       <h3
                         className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs text-white backdrop-blur-2xl md:text-sm lg:text-xs">
                         {item.year_of_release}
                       </h3>
                     )}
                   </div>
                 </div>
               </div>
             ))
           ) : (
             <div className="col-span-full p-4 text-center text-white">No posters available.</div>
           )}
         </div>
      </div>
    </AnimatedPageWrapper>
  );
};

export default memo(FilmPosterDesignPage);
