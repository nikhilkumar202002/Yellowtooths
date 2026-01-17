'use client'; 

import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '../redux/store'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LenisScroll from '../components/common/LenisScroll'; 
import { DarkModeProvider } from '../context/animations/DarkModeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  // Use useState to ensure QueryClient is unique per request on the client
  // but stable across re-renders
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <DarkModeProvider>
          <LenisScroll>
            {children}
          </LenisScroll>
        </DarkModeProvider>
      </QueryClientProvider>
    </Provider>
  );
}