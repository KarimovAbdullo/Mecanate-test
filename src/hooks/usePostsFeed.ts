import { useInfiniteQuery } from '@tanstack/react-query';
import { postsApi } from '../api/posts';
import type { PostsPage, Tier } from '../types/api';

interface UsePostsFeedArgs {
  tier?: Tier;
  simulateError?: boolean;
  limit?: number;
}

export const postsFeedKey = (args: UsePostsFeedArgs) =>
  ['posts', 'feed', args.tier ?? 'all', args.simulateError ?? false] as const;

export function usePostsFeed({ tier, simulateError, limit = 10 }: UsePostsFeedArgs = {}) {
  return useInfiniteQuery<PostsPage, Error>({
    queryKey: postsFeedKey({ tier, simulateError }),
    queryFn: ({ pageParam, signal }) =>
      postsApi.list({
        limit,
        cursor: (pageParam as string | null) ?? undefined,
        tier,
        simulateError,
        signal,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => (last.hasMore ? last.nextCursor : undefined),
    staleTime: 30_000,
  });
}
