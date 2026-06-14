import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database } from './database.types';

/**
 * Supabase client. URL + anon (publishable) key come from EXPO_PUBLIC_* env so
 * the same code points at the local stack in dev and a hosted project later
 * (Spec §12: secrets via env, never in the repo).
 *
 * In Phase 0 the session is mocked (see @/state/session) and this client is not
 * yet exercised for auth — it exists so Phase 1 can wire phone/OTP against it.
 */
const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

/**
 * expo-secure-store auth adapter for native. NOTE: SecureStore values are
 * capped at ~2KB; Phase 1 will chunk large sessions or switch storage. On web,
 * SecureStore is unavailable, so we fall back to in-memory (undefined storage).
 */
const secureStorageAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase: SupabaseClient<Database> = createClient<Database>(url, anonKey, {
  auth: {
    storage: Platform.OS === 'web' ? undefined : secureStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
