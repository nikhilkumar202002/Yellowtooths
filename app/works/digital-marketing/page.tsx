'use client';

import { Suspense } from 'react';
import DigitalMarketingPage from '@/components/WorksPage/Innerpages/DigitalMarketingPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DigitalMarketingPage />
    </Suspense>
  );
}