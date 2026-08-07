import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        if (error?.response?.status) {
          const status = error.response.status
          if ([400, 401, 403, 404].includes(status)) {
            return false
          }
        }
        return failureCount < 3
      },
      staleTime: 1000 * 60 * 5,
    },
  },
})
