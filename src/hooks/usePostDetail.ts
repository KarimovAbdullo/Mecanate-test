import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { postsApi } from '../api/posts';
import type { Post } from '../types/api';

export const postDetailKey = (id: string) => ['posts', 'detail', id] as const;

type Options = Omit<UseQueryOptions<{ post: Post }, Error>, 'queryKey' | 'queryFn'>;

export function usePostDetail(id: string, options?: Options) {
  return useQuery<{ post: Post }, Error>({
    queryKey: postDetailKey(id),
    queryFn: ({ signal }) => postsApi.detail(id, signal),
    enabled: Boolean(id),
    staleTime: 30_000,
    ...options,
  });
}
