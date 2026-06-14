import { ok } from '../shared';
import type { ChatMessage, ChatProvider, Unsubscribe } from './types';

/**
 * Deterministic in-memory mock chat. Messages get sequential ids and a seeded
 * monotonic clock (no Date.now), so a run is fully reproducible. `__reset()`
 * clears state between tests.
 */
export class MockChatProvider implements ChatProvider {
  readonly mode = 'mock' as const;

  private store = new Map<string, ChatMessage[]>();
  private subscribers = new Map<string, Set<(m: ChatMessage) => void>>();
  private seq = 0;

  /** Test hook: wipe all state. */
  __reset() {
    this.store.clear();
    this.subscribers.clear();
    this.seq = 0;
  }

  async sendMessage(input: {
    matchId: string;
    senderId: string;
    body?: string;
    imagePath?: string;
  }) {
    this.seq += 1;
    const message: ChatMessage = {
      id: `msg-${this.seq}`,
      matchId: input.matchId,
      senderId: input.senderId,
      body: input.body,
      imagePath: input.imagePath,
      // Seeded monotonic clock: 1s per message from a fixed epoch.
      createdAt: new Date(1735689600000 + this.seq * 1000).toISOString(),
    };
    const list = this.store.get(input.matchId) ?? [];
    list.push(message);
    this.store.set(input.matchId, list);

    this.subscribers.get(input.matchId)?.forEach((cb) => cb(message));
    return ok(message);
  }

  subscribe({ matchId }: { matchId: string }, onMessage: (m: ChatMessage) => void): Unsubscribe {
    const set = this.subscribers.get(matchId) ?? new Set();
    set.add(onMessage);
    this.subscribers.set(matchId, set);
    return () => {
      this.subscribers.get(matchId)?.delete(onMessage);
    };
  }

  async history({ matchId, limit }: { matchId: string; limit?: number }) {
    const list = this.store.get(matchId) ?? [];
    return ok(limit ? list.slice(-limit) : [...list]);
  }
}
