import type { ProviderMode } from '@/config';

/** Discriminated result type used by every provider method. */
export type Outcome<T> =
  | { ok: true; data: T }
  | { ok: false; code: string; message: string };

export const ok = <T>(data: T): Outcome<T> => ({ ok: true, data });
export const err = (code: string, message: string): Outcome<never> => ({
  ok: false,
  code,
  message,
});

export interface BaseProvider {
  readonly mode: ProviderMode;
}

/**
 * Deterministic 32-bit FNV-1a hash. Mocks MUST be pure functions of input —
 * no Math.random / Date.now — so test fixtures stay stable and the same input
 * always yields the same output. This is the only randomness source for mocks.
 */
export function hash32(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Map a string deterministically into the [0, 1) range. */
export function hashUnit(input: string): number {
  return hash32(input) / 0xffffffff;
}

/** Deterministically pick an element of `list` keyed by `seed`. */
export function pick<T>(list: readonly T[], seed: string): T {
  return list[hash32(seed) % list.length];
}
