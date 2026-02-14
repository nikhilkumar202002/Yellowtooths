'use client';

import { Suspense } from 'react';
import TechAndExpDesignPage from '@/components/WorksPage/Innerpages/TechExperienceDesignPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TechAndExpDesignPage />
    </Suspense>
  );
}