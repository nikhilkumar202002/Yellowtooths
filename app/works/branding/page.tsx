'use client';

import { Suspense } from 'react';
import BrandingPage from '@/components/WorksPage/Innerpages/BrandingPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrandingPage />
    </Suspense>
  );
}