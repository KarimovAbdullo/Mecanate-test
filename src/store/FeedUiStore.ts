import { makeAutoObservable, reaction } from 'mobx';
import type { Post, Tier } from '../types/api';

const TIER_LABELS: Record<'all' | Tier, string> = {
  all: 'Все публикации',
  free: 'Бесплатные',
  paid: 'Платные',
};

export class FeedUiStore {
  tierFilter: Tier | undefined = undefined;
  searchQuery: string = '';
  showLikedOnly: boolean = false;
  lastFilterChangeAt: number = Date.now();

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => [this.tierFilter, this.searchQuery, this.showLikedOnly] as const,
      () => {
        this.lastFilterChangeAt = Date.now();
      },
    );
  }

  setTier(tier: Tier | undefined) {
    this.tierFilter = tier;
  }

  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  toggleLikedOnly() {
    this.showLikedOnly = !this.showLikedOnly;
  }

  clearFilters() {
    this.tierFilter = undefined;
    this.searchQuery = '';
    this.showLikedOnly = false;
  }

  get isFiltered(): boolean {
    return (
      this.tierFilter !== undefined ||
      this.searchQuery.trim().length > 0 ||
      this.showLikedOnly
    );
  }

  get activeFiltersCount(): number {
    let count = 0;
    if (this.tierFilter !== undefined) count += 1;
    if (this.searchQuery.trim().length > 0) count += 1;
    if (this.showLikedOnly) count += 1;
    return count;
  }

  get tierLabel(): string {
    return TIER_LABELS[this.tierFilter ?? 'all'];
  }

  get normalizedQuery(): string {
    return this.searchQuery.trim().toLowerCase();
  }

  applyClientFilters(posts: Post[]): Post[] {
    const query = this.normalizedQuery;
    const likedOnly = this.showLikedOnly;
    if (!query && !likedOnly) return posts;

    return posts.filter((post) => {
      if (likedOnly && !post.isLiked) return false;
      if (!query) return true;
      const haystack = `${post.title} ${post.preview} ${post.body} ${post.author.displayName}`.toLowerCase();
      return haystack.includes(query);
    });
  }
}

export const feedUiStore = new FeedUiStore();
