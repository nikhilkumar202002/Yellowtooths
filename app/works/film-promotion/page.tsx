'use client';

import { Suspense } from 'react';
import FilmPromotionPage from '@/components/WorksPage/Innerpages/FilmPromotionPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FilmPromotionPage />
    </Suspense>
  );
}