'use client';

import React, { memo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFeaturedWorks } from '../../api/services/services';
import { cn } from '../../lib/utils';
import HorizontalInfiniteSlider from '../common/HorizontalInfiniteSlider';
import { BorderGlowCard } from '../common/BorderGlowCard';
import Loading from '../common/Loading'; // Ensure you have this

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://yt.jinskadamthodu.com/public';

// Helper to construct full image URL
const getFullImageUrl = (path: string | undefined) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('https')) return path;

  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  const cleanBase = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

  return `${cleanBase}/${cleanPath}`;
};

const ReviewCard = memo(({ image_path, name }: { image_path: string; name: string }) => {
  const fullImageUrl = getFullImageUrl(image_path);

  return (
    <BorderGlowCard
      cardBorderRadius="2xl"
      className={cn(
        'relative aspect-[16/9] h-[200px] w-[300px] md:h-[300px] md:w-[500px] lg:h-[400px] lg:w-[700px] shrink-0'
      )}
    >
      <div className="flex h-full w-full items-center justify-center p-2">
        <img
          className="h-full w-full rounded-lg object-cover"
          alt={name || 'Featured Work'}
          src={fullImageUrl}
          loading="lazy"
        />
      </div>
    </BorderGlowCard>
  );
});

ReviewCard.displayName = 'ReviewCard';

function InfiniteCarousel() {
  const { data: featuredWorks = [], isLoading, isError } = useQuery({
    queryKey: ['infinite-carousel_get-featured-works'],
    queryFn: async () => {
      console.log('Fetching Featured Works...');
      const response = await getFeaturedWorks();
      console.log('Featured Works Response:', response);
      return Array.isArray(response) ? response : [];
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // Debugging logs
  useEffect(() => {
    if (featuredWorks.length > 0) {
      console.log('Carousel Images loaded:', featuredWorks.length);
    }
  }, [featuredWorks]);

  if (isLoading) {
    return <div className="flex h-40 w-full items-center justify-center"><Loading /></div>;
  }

  if (isError) {
    return <div className="text-center text-red-500">Failed to load featured works.</div>;
  }

  if (!featuredWorks || featuredWorks.length === 0) {
    return <div className="text-center text-neutral-500">No featured works available.</div>;
  }

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-10">
      <HorizontalInfiniteSlider gap="gap-4" duration={40} vertical={false}>
        {featuredWorks.map((item: any, index: number) => (
          <ReviewCard
            key={item.id || index}
            image_path={item.image_path} // Ensure this matches API key
            name={item.name}
          />
        ))}
      </HorizontalInfiniteSlider>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-black to-transparent z-10"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-black to-transparent z-10"></div>
    </div>
  );
}

export default memo(InfiniteCarousel);