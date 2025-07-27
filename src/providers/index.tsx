'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from './AppProvider';
import { useState } from 'react';
import { ToastProvider } from '@/components/ui/toast-container';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider >
        {children}
      </AppProvider>
      <ToastProvider />
    </QueryClientProvider>
  );
} 