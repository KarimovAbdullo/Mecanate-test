import { request } from './client';
import type { CommentsPage, LikePayload, Post, PostsPage, Tier } from '../types/api';

export interface FetchPostsParams {
  limit?: number;
  cursor?: string | null;
  tier?: Tier;
  simulateError?: boolean;
  signal?: AbortSignal;
}

export const postsApi = {
  list: ({ limit = 10, cursor, tier, simulateError, signal }: FetchPostsParams = {}) =>
    request<PostsPage>('/posts', {
      query: { limit, cursor: cursor ?? undefined, tier, simulate_error: simulateError },
      signal,
    }),

  detail: (id: string, signal?: AbortSignal) =>
    request<{ post: Post }>(`/posts/${id}`, { signal }),

  toggleLike: (id: string) =>
    request<LikePayload>(`/posts/${id}/like`, { method: 'POST' }),

  comments: (id: string, cursor?: string | null, limit = 20) =>
    request<CommentsPage>(`/posts/${id}/comments`, {
      query: { limit, cursor: cursor ?? undefined },
    }),
};
