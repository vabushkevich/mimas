import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { debounce } from "lodash-es";

function handleError() {
  toast.error("Something went wrong");
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 60 * 60 * 1000,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  },
  mutationCache: new MutationCache({
    onError: debounce(handleError),
  }),
  queryCache: new QueryCache({
    onError: debounce(handleError),
  }),
});
