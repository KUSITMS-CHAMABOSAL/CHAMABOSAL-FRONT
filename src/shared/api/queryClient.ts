import { QueryClient } from "@tanstack/react-query";

import { ApiError } from "./apiError";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 4xx는 다시 보내도 결과가 같아서 재시도하지 않아요. 네트워크·5xx만 한 번 더 시도해요.
      retry: (failureCount, error) =>
        !(error instanceof ApiError && error.status < 500) && failureCount < 1,
      staleTime: 30_000,
    },
  },
});
