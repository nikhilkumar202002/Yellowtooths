'use client';

import React, { useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface VideoWrapperProps {
  videoSrc: string;
  posterSrc?: string;
}

const VideoWrapper = ({ videoSrc, posterSrc }: VideoWrapperProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-neutral-900">
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        className="h-full w-full object-cover"
        playsInline
        onClick={togglePlay}
        onEnded={() => setIsPlaying(false)}
      />
      
      {/* Play/Pause Button Overlay */}
      <button
        onClick={togglePlay}
        className={`absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-110 ${
          isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
        }`}
      >
        {isPlaying ? (
          <Pause className="h-8 w-8 fill-white text-white" />
        ) : (
          <Play className="ml-1 h-8 w-8 fill-white text-white" />
        )}
      </button>
    </div>
  );
};

export default VideoWrapper;