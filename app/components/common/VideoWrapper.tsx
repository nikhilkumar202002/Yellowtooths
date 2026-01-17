'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { cn } from '../../lib/utils'; // Ensure this utility exists, or remove if not needed

type AnimationStyle = 
  | 'from-bottom' 
  | 'from-center' 
  | 'from-top' 
  | 'from-left' 
  | 'from-right' 
  | 'fade' 
  | 'top-in-bottom-out' 
  | 'left-in-right-out';

interface VideoWrapperProps {
  videoSrc: string;
  posterSrc?: string; // changed from thumbnailSrc to match standard video tag
  thumbnailSrc?: string; // kept for backward compatibility
  thumbnailAlt?: string;
  className?: string;
  animationStyle?: AnimationStyle;
}

const animationVariants = {
  'from-bottom': {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 },
  },
  'from-center': {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
  },
  'from-top': {
    initial: { y: '-100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '-100%', opacity: 0 },
  },
  'from-left': {
    initial: { x: '-100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
  },
  'from-right': {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  'top-in-bottom-out': {
    initial: { y: '-100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 },
  },
  'left-in-right-out': {
    initial: { x: '-100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
  },
};

export default function VideoWrapper({
  animationStyle = 'from-center',
  videoSrc,
  posterSrc,
  thumbnailSrc,
  thumbnailAlt = 'Video thumbnail',
  className,
}: VideoWrapperProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const selectedAnimation = animationVariants[animationStyle];
  
  // Handle both prop names for the image
  const imageSource = posterSrc || thumbnailSrc;

  // Helper function to check if the source is a YouTube URL
  const isYouTubeVideo = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  // Helper function to generate YouTube thumbnail URL
  const getYouTubeThumbnail = (url: string) => {
    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
    );
    return videoIdMatch
      ? `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`
      : null;
  };

  // Helper function to add autoplay to YouTube URL
  const getYouTubeAutoplayUrl = (url: string) => {
    return url.includes('?') ? `${url}&autoplay=1` : `${url}?autoplay=1`;
  };

  const finalThumbnail = isYouTubeVideo(videoSrc) && !imageSource 
    ? getYouTubeThumbnail(videoSrc) 
    : imageSource;

  return (
    <div className={cn('relative w-full', className)}>
      <div 
        className="group relative cursor-pointer overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900"
        onClick={() => setIsVideoOpen(true)}
      >
        {/* Thumbnail Image */}
        <img
          src={finalThumbnail || ''}
          alt={thumbnailAlt}
          width={1920}
          height={1080}
          className="aspect-video w-full object-cover transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-75"
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-all duration-300 group-hover:scale-110 md:h-24 md:w-24">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform duration-300 group-hover:scale-110 md:h-16 md:w-16">
              <Play className="ml-1 h-6 w-6 fill-black md:h-8 md:w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setIsVideoOpen(false)}
          >
            <motion.div
              {...selectedAnimation}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking video area
            >
              {/* Close Button */}
              <button
                className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 md:-right-12 md:top-0"
                onClick={() => setIsVideoOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-black shadow-2xl">
                {isYouTubeVideo(videoSrc) ? (
                  <iframe
                    src={getYouTubeAutoplayUrl(videoSrc)}
                    className="aspect-video w-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  ></iframe>
                ) : (
                  <video
                    src={videoSrc}
                    className="aspect-video w-full"
                    controls
                    autoPlay
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}