'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from './AppProvider';
import { useState } from 'react';
import { ToastProvider } from '@/components/ui/toast-container';
import { ThemeProvider } from '@/components/themeProvider';

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
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AppProvider >
          {children}
        </AppProvider>
        <ToastProvider />
      </ThemeProvider>
    </QueryClientProvider>
  );
} 