import { request } from './client';
import type { CommentsPage, LikePayload, Post, PostsPage, Tier } from '../types/api';

export interface FetchPostsParams {
  limit?: number;
  cursor?: string | null;
  tier?: Tier;
  simulateError?: boolean;
  signal?: AbortSignal;
}

export interface FetchCommentsParams {
  postId: string;
  limit?: number;
  cursor?: string | null;
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

  comments: ({ postId, limit = 20, cursor, signal }: FetchCommentsParams) =>
    request<CommentsPage>(`/posts/${postId}/comments`, {
      query: { limit, cursor: cursor ?? undefined },
      signal,
    }),

  createComment: (postId: string, text: string) =>
    request<{ comment: import('../types/api').Comment }>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: { text },
    }),
};
