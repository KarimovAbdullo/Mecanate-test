import { useInfiniteQuery } from '@tanstack/react-query';
import { postsApi } from '../api/posts';
import type { CommentsPage } from '../types/api';

export const commentsKey = (postId: string) => ['posts', 'comments', postId] as const;

export function useComments(postId: string, limit = 20) {
  return useInfiniteQuery<CommentsPage, Error>({
    queryKey: commentsKey(postId),
    queryFn: ({ pageParam, signal }) =>
      postsApi.comments({
        postId,
        limit,
        cursor: (pageParam as string | null) ?? undefined,
        signal,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => (last.hasMore ? last.nextCursor : undefined),
    enabled: Boolean(postId),
    staleTime: 30_000,
  });
}
