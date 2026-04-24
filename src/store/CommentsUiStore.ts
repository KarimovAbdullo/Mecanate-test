import { makeAutoObservable, observable } from 'mobx';
import type { Comment } from '../types/api';

export type CommentsSort = 'newest' | 'oldest';

const SORT_LABELS: Record<CommentsSort, string> = {
  newest: 'Сначала новые',
  oldest: 'Сначала старые',
};

export class CommentsUiStore {
  sort: CommentsSort = 'newest';
  private likedIds = observable.set<string>();

  constructor() {
    makeAutoObservable<this, 'likedIds'>(this, {
      likedIds: false,
    });
  }

  get sortLabel(): string {
    return SORT_LABELS[this.sort];
  }

  get likedCount(): number {
    return this.likedIds.size;
  }

  toggleSort() {
    this.sort = this.sort === 'newest' ? 'oldest' : 'newest';
  }

  isLiked(commentId: string): boolean {
    return this.likedIds.has(commentId);
  }

  toggleLike(commentId: string): void {
    if (this.likedIds.has(commentId)) {
      this.likedIds.delete(commentId);
    } else {
      this.likedIds.add(commentId);
    }
  }

  sortedComments(comments: Comment[]): Comment[] {
    if (comments.length <= 1) return comments;
    if (this.sort === 'newest') return comments;
    return [...comments].reverse();
  }
}

export const commentsUiStore = new CommentsUiStore();
