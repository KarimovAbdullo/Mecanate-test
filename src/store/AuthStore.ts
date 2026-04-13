import { makeAutoObservable } from 'mobx';

const DEFAULT_DEV_TOKEN = '550e8400-e29b-41d4-a716-446655440000';

export class AuthStore {
  token: string = process.env.EXPO_PUBLIC_AUTH_TOKEN ?? DEFAULT_DEV_TOKEN;

  constructor() {
    makeAutoObservable(this);
  }

  setToken(token: string) {
    this.token = token;
  }
}

export const authStore = new AuthStore();
