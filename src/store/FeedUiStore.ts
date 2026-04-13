import { makeAutoObservable } from 'mobx';
import type { Tier } from '../types/api';

export class FeedUiStore {
  tierFilter: Tier | undefined = undefined;
  simulateError: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setTier(tier: Tier | undefined) {
    this.tierFilter = tier;
  }

  toggleSimulateError() {
    this.simulateError = !this.simulateError;
  }
}

export const feedUiStore = new FeedUiStore();
