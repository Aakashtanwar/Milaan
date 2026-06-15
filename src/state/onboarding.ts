import { createMMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { VerifiedIdentity } from '@/lib/providers';

/**
 * Single source of truth for auth + onboarding, PERSISTED via MMKV so a user
 * who drops off mid-verification resumes at the exact step next open (Spec
 * §4.11). The route gate (src/app/index.tsx) reads `phase` + `step`.
 *
 * Tokens live in expo-secure-store, not here — onboarding progress is
 * non-sensitive. The verified-identity draft is kept only to prefill the
 * profile; nothing here is the system of record (that's Supabase, Phase 2+).
 */
export type Phase = 'signed-out' | 'onboarding' | 'verified';

/** Ordered steps of the onboarding funnel. */
export const ONBOARDING_STEPS = [
  'priming',
  'consent',
  'identity',
  'liveness',
  'verifying',
  'photos',
  'profile',
] as const;
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export interface PhotoDraft {
  uri: string;
  faceMatchScore?: number;
  status: 'verifying' | 'approved' | 'rejected';
  reason?: string;
}

export interface ProfileDraft {
  name: string;
  age: number | null;
  gender: string;
  bio: string;
  interests: string[];
  instagram: string;
  linkedin: string;
  snapchat: string;
}

const emptyProfile: ProfileDraft = {
  name: '',
  age: null,
  gender: '',
  bio: '',
  interests: [],
  instagram: '',
  linkedin: '',
  snapchat: '',
};

interface OnboardingState {
  phase: Phase;
  step: OnboardingStep;
  phone: string | null;
  identity: VerifiedIdentity | null;
  selfieTemplate: string | null;
  photos: PhotoDraft[];
  profile: ProfileDraft;

  // --- auth ---
  setPhone: (phone: string) => void;
  /** OTP verified → enter onboarding at the first step. */
  enterOnboarding: () => void;

  // --- step progress ---
  setStep: (step: OnboardingStep) => void;

  // --- verification data ---
  setIdentity: (identity: VerifiedIdentity) => void;
  setSelfieTemplate: (templateRef: string) => void;
  setPhotos: (photos: PhotoDraft[]) => void;
  updateProfile: (patch: Partial<ProfileDraft>) => void;

  /** Finish the funnel → verified, into the app. */
  finishVerification: () => void;
  /** Sign out / start over. */
  reset: () => void;
}

const storage = createMMKV({ id: 'milaan-onboarding' });
const mmkvJSON = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.remove(name),
};

export const useOnboarding = create<OnboardingState>()(
  persist(
    (set) => ({
      phase: 'signed-out',
      step: 'priming',
      phone: null,
      identity: null,
      selfieTemplate: null,
      photos: [],
      profile: emptyProfile,

      setPhone: (phone) => set({ phone }),
      enterOnboarding: () => set({ phase: 'onboarding', step: 'priming' }),

      setStep: (step) => set({ step }),

      setIdentity: (identity) =>
        set((s) => ({
          identity,
          // Prefill the profile from the verified ID — verification saves work
          // instead of only costing it (Spec §4.4).
          profile: {
            ...s.profile,
            name: identity.name,
            age: identity.age,
            gender: identity.gender,
          },
        })),
      setSelfieTemplate: (selfieTemplate) => set({ selfieTemplate }),
      setPhotos: (photos) => set({ photos }),
      updateProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),

      finishVerification: () => set({ phase: 'verified' }),
      reset: () =>
        set({
          phase: 'signed-out',
          step: 'priming',
          phone: null,
          identity: null,
          selfieTemplate: null,
          photos: [],
          profile: emptyProfile,
        }),
    }),
    {
      name: 'milaan-onboarding-v1',
      storage: createJSONStorage(() => mmkvJSON),
    },
  ),
);

/** Map an onboarding step to its route (used by the gate + step navigation). */
export function routeForStep(step: OnboardingStep): string {
  return `/(onboarding)/${step}`;
}
