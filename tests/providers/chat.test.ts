import { beforeEach, describe, expect, it } from 'vitest';

import { MockChatProvider } from '@/lib/providers/chat';

const provider = new MockChatProvider();

beforeEach(() => provider.__reset());

describe('MockChatProvider', () => {
  it('delivers sent messages to subscribers in realtime', async () => {
    const received: string[] = [];
    const unsub = provider.subscribe({ matchId: 'm1' }, (m) => received.push(m.body ?? ''));
    await provider.sendMessage({ matchId: 'm1', senderId: 'u1', body: 'hi' });
    await provider.sendMessage({ matchId: 'm1', senderId: 'u2', body: 'hello' });
    unsub();
    await provider.sendMessage({ matchId: 'm1', senderId: 'u1', body: 'after-unsub' });
    expect(received).toEqual(['hi', 'hello']);
  });

  it('assigns deterministic sequential ids and a seeded clock', async () => {
    const a = await provider.sendMessage({ matchId: 'm1', senderId: 'u1', body: 'one' });
    const b = await provider.sendMessage({ matchId: 'm1', senderId: 'u1', body: 'two' });
    if (a.ok && b.ok) {
      expect(a.data.id).toBe('msg-1');
      expect(b.data.id).toBe('msg-2');
      expect(new Date(b.data.createdAt).getTime()).toBeGreaterThan(
        new Date(a.data.createdAt).getTime(),
      );
    }
  });

  it('history is scoped per match and respects limit', async () => {
    await provider.sendMessage({ matchId: 'm1', senderId: 'u1', body: '1' });
    await provider.sendMessage({ matchId: 'm1', senderId: 'u1', body: '2' });
    await provider.sendMessage({ matchId: 'm2', senderId: 'u1', body: 'other' });
    const h1 = await provider.history({ matchId: 'm1' });
    const limited = await provider.history({ matchId: 'm1', limit: 1 });
    if (h1.ok) expect(h1.data).toHaveLength(2);
    if (limited.ok) expect(limited.data[0].body).toBe('2');
  });
});
