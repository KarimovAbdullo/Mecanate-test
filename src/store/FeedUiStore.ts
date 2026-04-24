import { makeAutoObservable, reaction } from 'mobx';
import type { Tier } from '../types/api';

const TIER_LABELS: Record<'all' | Tier, string> = {
  all: 'Все публикации',
  free: 'Бесплатные',
  paid: 'Платные',
};

export class FeedUiStore {
  tierFilter: Tier | undefined = undefined;
  lastTierChangeAt: number = Date.now();

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.tierFilter,
      () => {
        this.lastTierChangeAt = Date.now();
      },
    );
  }

  setTier(tier: Tier | undefined) {
    this.tierFilter = tier;
  }

  clearTier() {
    this.tierFilter = undefined;
  }

  get isFiltered(): boolean {
    return this.tierFilter !== undefined;
  }

  get tierLabel(): string {
    return TIER_LABELS[this.tierFilter ?? 'all'];
  }
}

export const feedUiStore = new FeedUiStore();
