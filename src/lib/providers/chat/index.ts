import { config } from '@/config';

import { MockChatProvider } from './mock';
import type { ChatProvider } from './types';

export type { ChatProvider, ChatMessage, Unsubscribe } from './types';
export { MockChatProvider } from './mock';

// Chat is stateful (in-memory store + live subscriptions), so the mock is a
// singleton — every caller shares one instance.
let mockSingleton: MockChatProvider | undefined;

/**
 * Factory keyed by config.providers.chat. `live` (Supabase Realtime) lands in
 * Phase 3.
 */
export function getChatProvider(): ChatProvider {
  if (config.providers.chat === 'mock') {
    mockSingleton ??= new MockChatProvider();
    return mockSingleton;
  }
  throw new Error('Live ChatProvider not implemented yet (Phase 3).');
}
