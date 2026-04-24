import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { postsApi } from '../api/posts';
import type { LikePayload, Post, PostsPage } from '../types/api';
import { postDetailKey } from './usePostDetail';

type FeedData = InfiniteData<PostsPage, string | null>;

interface FeedSnapshot {
  key: readonly unknown[];
  data: FeedData;
}

interface DetailSnapshot {
  key: readonly unknown[];
  data: { post: Post };
}

interface Context {
  feed: FeedSnapshot[];
  detail: DetailSnapshot[];
}

function togglePost(post: Post, patch: Partial<LikePayload>): Post {
  return {
    ...post,
    isLiked: patch.isLiked ?? !post.isLiked,
    likesCount: patch.likesCount ?? post.likesCount + (post.isLiked ? -1 : 1),
  };
}

function mapFeedPost(
  page: PostsPage,
  postId: string,
  patch: Partial<LikePayload>,
): PostsPage {
  return {
    ...page,
    posts: page.posts.map((p) => (p.id === postId ? togglePost(p, patch) : p)),
  };
}

export function useToggleLike() {
  const qc = useQueryClient();

  return useMutation<LikePayload, Error, { postId: string }, Context>({
    mutationFn: ({ postId }) => postsApi.toggleLike(postId),
    onMutate: async ({ postId }) => {
      await qc.cancelQueries({ queryKey: ['posts', 'feed'] });
      await qc.cancelQueries({ queryKey: postDetailKey(postId) });

      const feed: FeedSnapshot[] = [];
      const feedEntries = qc.getQueriesData<FeedData>({ queryKey: ['posts', 'feed'] });
      for (const [key, data] of feedEntries) {
        if (!data) continue;
        feed.push({ key, data });
        qc.setQueryData<FeedData>(key, {
          ...data,
          pages: data.pages.map((page) => mapFeedPost(page, postId, {})),
        });
      }

      const detail: DetailSnapshot[] = [];
      const detailKey = postDetailKey(postId);
      const detailData = qc.getQueryData<{ post: Post }>(detailKey);
      if (detailData) {
        detail.push({ key: detailKey, data: detailData });
        qc.setQueryData<{ post: Post }>(detailKey, {
          post: togglePost(detailData.post, {}),
        });
      }

      return { feed, detail };
    },
    onError: (_err, _vars, ctx) => {
      ctx?.feed.forEach(({ key, data }) => qc.setQueryData(key, data));
      ctx?.detail.forEach(({ key, data }) => qc.setQueryData(key, data));
    },
    onSuccess: (payload, { postId }) => {
      const feedEntries = qc.getQueriesData<FeedData>({ queryKey: ['posts', 'feed'] });
      for (const [key, data] of feedEntries) {
        if (!data) continue;
        qc.setQueryData<FeedData>(key, {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            posts: page.posts.map((p) =>
              p.id === postId
                ? { ...p, isLiked: payload.isLiked, likesCount: payload.likesCount }
                : p,
            ),
          })),
        });
      }

      qc.setQueryData<{ post: Post }>(postDetailKey(postId), (prev) =>
        prev
          ? {
              post: {
                ...prev.post,
                isLiked: payload.isLiked,
                likesCount: payload.likesCount,
              },
            }
          : prev,
      );
    },
  });
}
