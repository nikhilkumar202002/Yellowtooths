'use client';

import { logVisit } from '../../../lib/logVisit';
import { memo, useEffect, useMemo, useState } from 'react';
import gsap from 'gsap';
import { useSearchParams } from 'next/navigation';
import { getFilmPosterDesignById } from '../../../api/services/services';
import Loading from '../../common/Loading';
import Error from '../../common/Error';
import TextAnimation from '../../common/TextAnimation';
import VideoWrapper from '../../common/VideoWrapper';
import AnimatedWrapper from '../../common/AnimatedWrapper';
import GradientTextAnimation from '../../common/GradientTextAnimation';
import { ExternalLink } from 'lucide-react';

interface MediaItem {
  id: string;
  image_path?: string;
  isTrailer?: boolean;
  type?: string;
  link?: string;
}

interface Group {
  wide: MediaItem | null;
  verticals: MediaItem[];
}

const DesktopGrid = memo(({ items, trailerLink, trailerOption }: { items: any[], trailerLink?: string, trailerOption?: string }) => {
  const [imageRatios, setImageRatios] = useState<Record<string, number>>({});
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const mediaItems = trailerLink
    ? [
        ...items,
        {
          id: 'trailer', // unique identifier for trailer
          isTrailer: true,
          type: trailerOption,
          link: trailerLink,
        },
      ]
    : [...items];

  // Load image ratios asynchronously
  useEffect(() => {
    const loadImageRatios = async () => {
      const ratios: Record<string, number> = {};
      await Promise.all(
        items.map(
          (item) =>
            new Promise<void>((resolve) => {
              const img = new Image();
              img.onload = () => {
                ratios[item.id] = img.height / img.width;
                resolve();
              };
              img.onerror = () => {
                ratios[item.id] = 1; // default ratio on error
                resolve();
              };
              img.src = item.image_path;
            }),
        ),
      );
      setImageRatios(ratios);
    };
    loadImageRatios();
  }, [items]);

  // Memoize grouping logic so it's only recalculated when dependencies change
  const groups = useMemo(() => {
    if (!items || items.length === 0 || Object.keys(imageRatios).length === 0) return [];

    const wideImages = items.filter((item) => (imageRatios[item.id] || 0.7) < 0.8);
    const verticalImages = items.filter((item) => (imageRatios[item.id] || 0.7) > 1.2);
    const normalImages = items.filter(
      (item) => (imageRatios[item.id] || 0.7) >= 0.8 && (imageRatios[item.id] || 0.7) <= 1.2,
    );

    const verticalImagesCopy = [...verticalImages];
    const newGroups: Group[] = [];

    // 1. Group each wide image with up to 3 vertical images
    wideImages.forEach((wideItem) => {
      const assignedVerticals = verticalImagesCopy.splice(0, 3);
      newGroups.push({
        wide: wideItem,
        verticals: assignedVerticals,
      });
    });

    if (trailerLink) {
      const trailerGroup: Group = {
        wide: { id: 'trailer', isTrailer: true, type: trailerOption, link: trailerLink },
        verticals: [],
      };
      newGroups.splice(0, 0, trailerGroup);
    }

    // 3. Group remaining vertical and normal images in sets of 3
    const remainingItems = [...verticalImagesCopy, ...normalImages];
    let i = 0;
    while (i < remainingItems.length) {
      const groupItems = remainingItems.slice(i, i + 3);
      newGroups.push({
        wide: null,
        verticals: groupItems,
      });
      i += 3;
    }

    // 4. Balance groups: if the last group has exactly 1 vertical image, borrow one from a group with 3
    const lastGroup = newGroups[newGroups.length - 1];
    if (lastGroup && lastGroup.verticals.length === 1) {
      for (let j = newGroups.length - 2; j >= 0; j--) {
        const donorGroup = newGroups[j];
        if (donorGroup.verticals.length === 3) {
          const movedItem = donorGroup.verticals.pop()!;
          lastGroup.verticals.push(movedItem);
          break;
        }
      }
    }

    return newGroups;
  }, [items, imageRatios, trailerLink, trailerOption]);

  return (
    <>
      <AnimatedWrapper useScrollTrigger={false} yPositionInitial={200} blurInitial={50}>
        <div className="flex flex-col gap-4">
          {groups.map((group, index) => (
            <div key={index} className="flex flex-col gap-4">
              {/* Render wide image (or trailer) */}
              {group.wide && !group.wide.isTrailer && (
                <div className="w-full">
                  <div className="overflow-hidden rounded-md">
                    <div
                      className="relative w-full"
                      style={{
                        paddingTop: `${((imageRatios[group.wide.id] || 0.7)) * 100}%`,
                      }}>
                      <img
                        src={group.wide.image_path || '/placeholder.svg'}
                        alt={`Poster ${group.wide.id}`}
                        className="absolute left-0 top-0 h-full w-full object-cover transition-transform duration-500
                          hover:scale-105"
                        loading="lazy"
                        onLoad={() => setLoadedImages(prev => new Set(prev).add(group.wide!.id))}
                      />
                      {!loadedImages.has(group.wide!.id) && (
                        <div className="absolute left-0 top-0 h-full w-full bg-neutral-800 animate-pulse rounded-md" />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Render trailer */}
              {group.wide?.isTrailer && (
                <div className="w-full">
                  {group.wide.type === 'link' ? (
                    <VideoWrapper
                      className="block"
                      animationStyle="from-center"
                      videoSrc={group.wide.link || ''}
                      thumbnailSrc=""
                      thumbnailAlt="Hero Video"
                    />
                  ) : (
                    <div className="relative w-full">
                      <video
                        src={group.wide.link || ''}
                        controls
                        className="absolute left-0 top-0 h-full w-full rounded-md object-cover"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Render vertical images */}
              {group.verticals.length > 0 && (
                <div
                  className={`grid ${
                  group.verticals.length === 1
                      ? 'grid-cols-1'
                      : group.verticals.length === 2
                        ? 'grid-cols-2'
                        : 'grid-cols-3'
                  } gap-4`}>
                  {group.verticals.map((item) => (
                    <div
                      key={item.id}
                      className="w-full">
                      <div className="overflow-hidden rounded-md">
                        <div
                          className="relative w-full"
                          style={{ paddingTop: `${((imageRatios[item.id] || 0.7)) * 100}%` }}>
                          <img
                            src={item.image_path || '/placeholder.svg'}
                            alt={`Poster ${item.id}`}
                            className="absolute left-0 top-0 h-full w-full object-cover transition-transform duration-500
                              hover:scale-105"
                            loading="lazy"
                            onLoad={() => setLoadedImages(prev => new Set(prev).add(item.id))}
                          />
                          {!loadedImages.has(item.id) && (
                            <div className="absolute left-0 top-0 h-full w-full bg-neutral-800 animate-pulse rounded-md" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </AnimatedWrapper>

    </>
  );
});
DesktopGrid.displayName = 'DesktopGrid';

const MobileGrid = memo(({ items, trailerLink, trailerOption }: { items: any[], trailerLink?: string, trailerOption?: string }) => {
  const [imageRatios, setImageRatios] = useState<Record<string, number>>({});
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const mediaItems = trailerLink
    ? [
        {
          id: 'trailer',
          isTrailer: true,
          type: trailerOption,
          link: trailerLink,
        },
        ...items.map((item) => ({
          ...item,
          ratio: imageRatios[item.id] || 0.7,
        })),
      ]
    : [
        ...items.map((item) => ({
          ...item,
          ratio: imageRatios[item.id] || 0.7,
        })),
      ];

  // Load image ratios asynchronously
  useEffect(() => {
    const loadImageRatios = async () => {
      const ratios: Record<string, number> = {};
      await Promise.all(
        items.map(
          (item) =>
            new Promise<void>((resolve) => {
              const img = new Image();
              img.onload = () => {
                ratios[item.id] = img.height / img.width;
                resolve();
              };
              img.onerror = () => {
                ratios[item.id] = 1;
                resolve();
              };
              img.src = item.image_path;
            }),
        ),
      );
      setImageRatios(ratios);
    };
    loadImageRatios();
  }, [items]);

  // Memoize mobile posts calculation
  const mobilePosts = useMemo(() => {
    if (!items || items.length === 0 || Object.keys(imageRatios).length === 0) return [];

    const posts = [];
    if (trailerLink) {
      posts.push({
        isTrailer: true,
        type: trailerOption,
        link: trailerLink,
      });
    }
    posts.push(
      ...items.map((item) => ({
        ...item,
        ratio: imageRatios[item.id] || 0.7,
      })),
    );
    return posts;
  }, [items, imageRatios, trailerLink, trailerOption]);

  return (
    <>
      <AnimatedWrapper useScrollTrigger={false} yPositionInitial={200} blurInitial={50}>
        <div className="flex flex-col gap-2">
          {mobilePosts.map((post, index) => {
            if (post.isTrailer) {
              return (
                <div
                  key={index}
                  className="w-full">
                  {post.type === 'link' ? (
                    <VideoWrapper
                      className="block"
                      animationStyle="from-center"
                      videoSrc={post.link}
                      thumbnailSrc=""
                      thumbnailAlt="Hero Video"
                    />
                  ) : (
                    <div className="relative w-full">
                      <video
                        src={post.link}
                        controls
                        className="absolute left-0 top-0 h-full w-full rounded-md object-cover"
                      />
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div
                key={post.id}
                className="w-full">
                <div className="overflow-hidden rounded-md">
                  <div
                    className="relative w-full"
                    style={{ paddingTop: `${(post.ratio || 0.7) * 100}%` }}>
                    <img
                      src={post.image_path || '/placeholder.svg'}
                      alt={`Poster ${post.id}`}
                      className="absolute left-0 top-0 h-full w-full object-cover transition-transform duration-500
                        hover:scale-105"
                      loading="lazy"
                      onLoad={() => setLoadedImages(prev => new Set(prev).add(post.id))}
                    />
                    {!loadedImages.has(post.id) && (
                      <div className="absolute left-0 top-0 h-full w-full bg-neutral-800 animate-pulse rounded-md" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AnimatedWrapper>

    </>
  );
});
MobileGrid.displayName = 'MobileGrid';

const FilmPosterDetailPage = () => {
  // Scroll to top on mount (when navigating to this page)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get id from query string
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  // State for single poster detail
  const [singlePoster, setSinglePoster] = useState<any>(null);
  const [singlePosterLoading, setSinglePosterLoading] = useState(false);
  const [singlePosterError, setSinglePosterError] = useState(false);

  useEffect(() => {
    if (id) {
      // Log the visit (only once per page load)
      logVisit();
      setSinglePosterLoading(true);
      getFilmPosterDesignById(id)
        .then((data) => {
          // Map file_path to image_path for each image
          const mapped = {
            ...data,
            images: Array.isArray(data.images)
              ? data.images.map((img: any) => ({ ...img, image_path: img.file_path }))
              : [],
          };
          setSinglePoster(mapped);
          setSinglePosterError(false);
        })
        .catch(() => setSinglePosterError(true))
        .finally(() => setSinglePosterLoading(false));
    }
  }, [id]);

  let itemDetail = id && singlePoster ? singlePoster : null;


  // Fast loading: show skeleton loader for initial and single poster loading
  if (id && singlePosterLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-16 w-2/3 bg-neutral-900 rounded-xl mb-6" />
          <div className="h-6 w-full bg-neutral-900 rounded mb-6" />
          <div className="aspect-video w-full bg-neutral-900 rounded-xl mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[24/35] bg-neutral-900 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (id && singlePosterError) return <Error />;

  return (
    <div className="padding-primary min-h-screen w-full pt-4 md:pt-10">
      <div className="container mx-auto mb-4 mt-20 max-w-7xl">

        <GradientTextAnimation
          delay={0.5}
          yPositionInitial={200}
          classname={'text-white text-[8vw] md:text-[5vw] md:px-0'}
          string={itemDetail?.film_name}
        />

        {/* Description after title */}
        {itemDetail?.description && (
          <div className="mb-6 mt-2 w-full">
            <TextAnimation
              blurInitial={10}
              classname={'text-base md:text-lg text-neutral-300 w-full'}
              staggerEachAmount={0.01}
              staggerType={'letter'}
              string={itemDetail.description}
            />
          </div>
        )}

        {/* External Links */}
        {(itemDetail?.wikipedia_link || itemDetail?.imdb_link || itemDetail?.imdb_rating || itemDetail?.behance_link) && (
          <div className="mb-6 mt-2 flex flex-wrap gap-4">
            {itemDetail.wikipedia_link && (
              <a
                href={itemDetail.wikipedia_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="text-sm font-medium">Wikipedia</span>
              </a>
            )}
            {itemDetail.imdb_link && (
              <a
                href={itemDetail.imdb_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors duration-200"
              >
                <ExternalLink className="h-4 w-4" />
                <svg
                  width="40"
                  height="20"
                  viewBox="0 0 40 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-yellow-500"
                >
                  <rect width="40" height="20" rx="2" fill="currentColor" />
                  <text
                    x="20"
                    y="13"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="bold"
                    fill="black"
                  >
                    IMDb
                  </text>
                </svg>
                {itemDetail.imdb_rating && (
                  <span className="text-sm font-bold">{itemDetail.imdb_rating}</span>
                )}
              </a>
            )}
            {itemDetail.behance_link && (
              <a
                href={itemDetail.behance_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors duration-200"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="text-sm font-medium">Behance</span>
              </a>
            )}
          </div>
        )}
        <div className="my-8">
          <div className="hidden md:block">
            <DesktopGrid
              trailerOption={'link'}
              trailerLink={itemDetail?.trailer_link}
              items={itemDetail?.images || []}
            />
          </div>
          <div className="block md:hidden">
            <MobileGrid
              trailerOption={'link'}
              trailerLink={itemDetail?.trailer_link}
              items={itemDetail?.images || []}
            />
          </div>
        </div>
        

      </div>
    </div>
  );
};
export default memo(FilmPosterDetailPage);
