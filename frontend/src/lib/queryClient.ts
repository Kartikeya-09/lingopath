import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 0, // Always fetch fresh data
      gcTime: 0, // Don't cache data
    },
  },
});
