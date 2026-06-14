/**
 * Provider registry — the single import surface for the four external-service
 * abstractions (Spec §2). Each is reached through a typed interface with a
 * deterministic mock; `PROVIDER_MODE` (per service) selects mock vs live.
 */
export * from './shared';
export { getIdentityProvider } from './identity';
export { getBiometricProvider } from './biometric';
export { getModerationProvider } from './moderation';
export { getChatProvider } from './chat';

export type { IdentityProvider, VerifiedIdentity } from './identity';
export type {
  BiometricProvider,
  FaceCompareResult,
  LivenessResult,
  LivenessSession,
} from './biometric';
export type { ModerationProvider, ModerationResult, ModerationDecision } from './moderation';
export type { ChatProvider, ChatMessage, Unsubscribe } from './chat';
