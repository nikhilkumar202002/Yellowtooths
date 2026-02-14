'use client';

import { Suspense } from 'react';
import VideoProductionPage from '@/components/WorksPage/Innerpages/VideoProductionPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VideoProductionPage />
    </Suspense>
  );
}