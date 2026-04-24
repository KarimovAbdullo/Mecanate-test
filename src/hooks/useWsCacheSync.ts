import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { CommentsPage, Post, PostsPage, WsEvent } from '../types/api';
import { wsStore } from '../store';
import { commentsKey } from './useComments';
import { postDetailKey } from './usePostDetail';

type FeedData = InfiniteData<PostsPage, string | null>;
type CommentsData = InfiniteData<CommentsPage, string | null>;

function applyLikeToPost(post: Post, postId: string, likesCount: number): Post {
  return post.id === postId ? { ...post, likesCount } : post;
}

export function useWsCacheSync() {
  const qc = useQueryClient();

  useEffect(() => {
    wsStore.connect();

    const off = wsStore.addListener((event: WsEvent) => {
      switch (event.type) {
        case 'like_updated': {
          const { postId, likesCount } = event;

          qc.setQueryData<{ post: Post }>(postDetailKey(postId), (prev) =>
            prev ? { post: applyLikeToPost(prev.post, postId, likesCount) } : prev,
          );

          const feedEntries = qc.getQueriesData<FeedData>({ queryKey: ['posts', 'feed'] });
          for (const [key, data] of feedEntries) {
            if (!data) continue;
            qc.setQueryData<FeedData>(key, {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                posts: page.posts.map((p) => applyLikeToPost(p, postId, likesCount)),
              })),
            });
          }
          break;
        }

        case 'comment_added': {
          const { postId, comment } = event;

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
            prev
              ? {
                  post: {
                    ...prev.post,
                    commentsCount:
                      prev.post.id === postId
                        ? prev.post.commentsCount + 1
                        : prev.post.commentsCount,
                  },
                }
              : prev,
          );

          const feedEntries = qc.getQueriesData<FeedData>({ queryKey: ['posts', 'feed'] });
          for (const [key, data] of feedEntries) {
            if (!data) continue;
            qc.setQueryData<FeedData>(key, {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                posts: page.posts.map((p) =>
                  p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p,
                ),
              })),
            });
          }
          break;
        }
      }
    });

    return () => {
      off();
    };
  }, [qc]);
}
