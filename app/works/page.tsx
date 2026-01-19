'use client';

import React, { memo, useEffect } from 'react';
import { useQueries } from '@tanstack/react-query';
import { getFeaturedWorks, getServices } from '../api/services/services';
import Error from '../components/common/Error';
import WorksPageSkeleton from '../components/common/WorksPageSkeleton'; // Assuming you have a Lenis wrapper or use the hook directly
import { useLenis as useLenisHook } from 'lenis/react';

// Section Components
import ServicesSection from '../components/WorksPage/ServicesSection';
import FeaturedWorksSection from '../components/WorksPage/FeaturedWorksSection';

const WorksPage = () => {
  const lenis = useLenisHook();

  // Scroll Reset Logic
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [lenis]);

  const queries = useQueries({
    queries: [
      {
        queryKey: ['works-page_get-services'],
        queryFn: getServices,
      },
      {
        queryKey: ['works-page_get-featured-works'],
        queryFn: getFeaturedWorks,
      },
    ],
  });

  const servicesQuery = queries[0];
  const featuredWorksQuery = queries[1];

  if (servicesQuery.isLoading || featuredWorksQuery.isLoading) {
    return <WorksPageSkeleton />;
  }

  if (servicesQuery.error || featuredWorksQuery.error) {
    return <Error />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-black pt-24 md:pt-32">
      <ServicesSection services={servicesQuery.data || []} />
      <FeaturedWorksSection featuredWorks={featuredWorksQuery.data || []} />
    </div>
  );
};

export default memo(WorksPage);