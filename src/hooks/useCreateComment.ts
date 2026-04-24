import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { postsApi } from '../api/posts';
import type { Comment, CommentsPage, Post, PostsPage } from '../types/api';
import { commentsKey } from './useComments';
import { postDetailKey } from './usePostDetail';

type CommentsData = InfiniteData<CommentsPage, string | null>;
type FeedData = InfiniteData<PostsPage, string | null>;

function bumpCommentCount(post: Post, postId: string, delta: number): Post {
  return post.id === postId
    ? { ...post, commentsCount: post.commentsCount + delta }
    : post;
}

export function useCreateComment(postId: string) {
  const qc = useQueryClient();

  return useMutation<{ comment: Comment }, Error, { text: string }>({
    mutationFn: ({ text }) => postsApi.createComment(postId, text),
    onSuccess: ({ comment }) => {
      qc.setQueryData<CommentsData>(commentsKey(postId), (prev) => {
        if (!prev) return prev;
        const [firstPage, ...rest] = prev.pages;
        if (!firstPage) return prev;
        if (firstPage.comments.some((c) => c.id === comment.id)) return prev;
        return {
          ...prev,
          pages: [
            { ...firstPage, comments: [comment, ...firstPage.comments] },
            ...rest,
          ],
        };
      });

      qc.setQueryData<{ post: Post }>(postDetailKey(postId), (prev) =>
        prev ? { post: bumpCommentCount(prev.post, postId, 1) } : prev,
      );

      const feedEntries = qc.getQueriesData<FeedData>({ queryKey: ['posts', 'feed'] });
      for (const [key, data] of feedEntries) {
        if (!data) continue;
        qc.setQueryData<FeedData>(key, {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            posts: page.posts.map((p) => bumpCommentCount(p, postId, 1)),
          })),
        });
      }
    },
  });
}
