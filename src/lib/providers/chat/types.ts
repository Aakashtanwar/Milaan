import type { BaseProvider, Outcome } from '../shared';

/**
 * Chat abstraction (Spec §2/§4.9). Live impl starts on Supabase Realtime; the
 * interface stays stable so we can move to Stream Chat if scale demands.
 */
export interface ChatMessage {
  id: string;
  matchId: string;
  senderId: string;
  body?: string;
  imagePath?: string;
  /** ISO timestamp. */
  createdAt: string;
}

export type Unsubscribe = () => void;

export interface ChatProvider extends BaseProvider {
  sendMessage(input: {
    matchId: string;
    senderId: string;
    body?: string;
    imagePath?: string;
  }): Promise<Outcome<ChatMessage>>;
  /** Subscribe to new messages for a match; returns an unsubscribe fn. */
  subscribe(input: { matchId: string }, onMessage: (m: ChatMessage) => void): Unsubscribe;
  history(input: { matchId: string; limit?: number }): Promise<Outcome<ChatMessage[]>>;
}
