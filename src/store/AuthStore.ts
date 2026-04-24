import { makeAutoObservable } from 'mobx';

const DEFAULT_DEV_TOKEN = '550e8400-e29b-41d4-a716-446655440000';

export interface AuthUser {
  id: string;
  displayName: string;
}

export class AuthStore {
  token: string = process.env.EXPO_PUBLIC_AUTH_TOKEN ?? DEFAULT_DEV_TOKEN;
  user: AuthUser | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setToken(token: string) {
    this.token = token;
  }

  setUser(user: AuthUser | null) {
    this.user = user;
  }

  logout() {
    this.token = '';
    this.user = null;
  }

  get isAuthenticated(): boolean {
    return this.token.length > 0;
  }

  get authorizationHeader(): string {
    return `Bearer ${this.token}`;
  }
}

export const authStore = new AuthStore();
