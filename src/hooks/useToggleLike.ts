import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { postsApi } from '../api/posts';
import type { LikePayload, PostsPage } from '../types/api';

type FeedData = InfiniteData<PostsPage, string | null>;

interface Snapshot {
  key: readonly unknown[];
  data: FeedData;
}

function mapPost(page: PostsPage, postId: string, patch: Partial<LikePayload>): PostsPage {
  return {
    ...page,
    posts: page.posts.map((p) =>
      p.id === postId
        ? {
            ...p,
            isLiked: patch.isLiked ?? !p.isLiked,
            likesCount:
              patch.likesCount ?? p.likesCount + (p.isLiked ? -1 : 1),
          }
        : p,
    ),
  };
}

export function useToggleLike() {
  const qc = useQueryClient();

  return useMutation<LikePayload, Error, { postId: string }, { snapshots: Snapshot[] }>({
    mutationFn: ({ postId }) => postsApi.toggleLike(postId),
    onMutate: async ({ postId }) => {
      await qc.cancelQueries({ queryKey: ['posts', 'feed'] });
      const entries = qc.getQueriesData<FeedData>({ queryKey: ['posts', 'feed'] });
      const snapshots: Snapshot[] = [];

      for (const [key, data] of entries) {
        if (!data) continue;
        snapshots.push({ key, data });
        qc.setQueryData<FeedData>(key, {
          ...data,
          pages: data.pages.map((page) => mapPost(page, postId, {})),
        });
      }

      return { snapshots };
    },
    onError: (_err, _vars, context) => {
      context?.snapshots.forEach(({ key, data }) => qc.setQueryData(key, data));
    },
    onSuccess: (payload, { postId }) => {
      const entries = qc.getQueriesData<FeedData>({ queryKey: ['posts', 'feed'] });
      for (const [key, data] of entries) {
        if (!data) continue;
        qc.setQueryData<FeedData>(key, {
          ...data,
          pages: data.pages.map((page) => mapPost(page, postId, payload)),
        });
      }
    },
  });
}
