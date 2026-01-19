'use client';

import React from 'react';
import { Skeleton } from '../ui/skeleton';

export default function WorksPageSkeleton() {
  return (
    <div
      className="bg-background padding-primary container mx-auto min-h-screen max-w-7xl pt-24 text-neutral-100 md:pt-40"
    >
      {/* Header */}
      <div className="mb-12 flex items-center justify-between sm:mb-14">
        <Skeleton className="h-6 w-32 bg-neutral-800 sm:h-8 md:h-10" />
      </div>

      {/* Main Heading */}
      <div className="mb-20 max-w-4xl sm:mb-16 md:mb-36 lg:mb-14">
        <Skeleton className="mb-2 h-8 w-3/4 bg-neutral-800 sm:h-10 md:mb-2 md:h-14 lg:h-20" />
        <Skeleton className="mb-4 h-8 w-2/3 bg-neutral-800 sm:h-10 md:mb-7 md:h-14 md:w-60 lg:h-20" />
        <Skeleton className="mb-1 h-3 w-[90%] bg-neutral-800 sm:h-3 md:h-4" />
        <Skeleton className="h-3 w-[90%] bg-neutral-800 sm:hidden sm:h-3 md:h-4" />
      </div>

      {/* Two Column Layout */}
      <div className="mt-8 grid gap-6 sm:mt-7 md:grid-cols-1">
        <div className="grid gap-2 md:grid-cols-3">
          <Skeleton className="mb-4 aspect-square w-full bg-neutral-800" />
          <Skeleton className="mb-4 aspect-square w-full bg-neutral-800" />
          <Skeleton className="mb-4 aspect-square w-full bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}