import { makeAutoObservable, reaction } from 'mobx';
import { WS_BASE_URL } from '../api/client';
import type { WsEvent } from '../types/api';
import { authStore } from './AuthStore';

export type WsStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';

type Listener = (event: WsEvent) => void;

const RECONNECT_BASE_DELAY_MS = 1_000;
const RECONNECT_MAX_DELAY_MS = 15_000;

export class WsStore {
  status: WsStatus = 'idle';
  lastEventAt: number | null = null;
  lastEventType: WsEvent['type'] | null = null;
  reconnectAttempts: number = 0;
  private ws: WebSocket | null = null;
  private listeners: Set<Listener> = new Set();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private manualClose: boolean = false;

  constructor() {
    makeAutoObservable<this, 'ws' | 'listeners' | 'reconnectTimer' | 'manualClose'>(
      this,
      {
        ws: false,
        listeners: false,
        reconnectTimer: false,
        manualClose: false,
      },
    );

    reaction(
      () => authStore.token,
      (token) => {
        if (!token) {
          this.disconnect();
        } else if (this.status !== 'idle') {
          this.reconnectNow();
        }
      },
    );
  }

  get isConnected(): boolean {
    return this.status === 'connected';
  }

  get isReconnecting(): boolean {
    return this.status === 'connecting' && this.reconnectAttempts > 0;
  }

  addListener(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  connect() {
    if (!authStore.token) return;
    if (this.ws && this.ws.readyState <= WebSocket.OPEN) return;
    this.manualClose = false;
    this.openSocket();
  }

  disconnect() {
    this.manualClose = true;
    this.clearReconnectTimer();
    this.reconnectAttempts = 0;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.status = 'idle';
  }

  private reconnectNow() {
    this.disconnect();
    this.manualClose = false;
    this.openSocket();
  }

  private openSocket() {
    const url = `${WS_BASE_URL}/ws?token=${encodeURIComponent(authStore.token)}`;
    this.status = 'connecting';
    const socket = new WebSocket(url);
    this.ws = socket;

    socket.onopen = () => {
      this.setStatus('connected');
      this.reconnectAttempts = 0;
    };

    socket.onmessage = (msg) => {
      this.handleRawMessage(msg.data);
    };

    socket.onerror = () => {
      this.setStatus('error');
    };

    socket.onclose = () => {
      this.ws = null;
      if (this.manualClose) {
        this.setStatus('idle');
        return;
      }
      this.setStatus('disconnected');
      this.scheduleReconnect();
    };
  }

  private handleRawMessage(raw: unknown) {
    if (typeof raw !== 'string') return;
    let parsed: WsEvent | null = null;
    try {
      parsed = JSON.parse(raw) as WsEvent;
    } catch {
      return;
    }
    if (!parsed || typeof parsed.type !== 'string') return;

    this.lastEventAt = Date.now();
    this.lastEventType = parsed.type;

    if (parsed.type === 'ping') return;
    for (const listener of this.listeners) listener(parsed);
  }

  private scheduleReconnect() {
    this.clearReconnectTimer();
    const attempt = this.reconnectAttempts + 1;
    const delay = Math.min(
      RECONNECT_BASE_DELAY_MS * 2 ** (attempt - 1),
      RECONNECT_MAX_DELAY_MS,
    );
    this.reconnectAttempts = attempt;
    this.reconnectTimer = setTimeout(() => {
      if (this.manualClose) return;
      this.openSocket();
    }, delay);
  }

  private clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private setStatus(next: WsStatus) {
    this.status = next;
  }
}

export const wsStore = new WsStore();
