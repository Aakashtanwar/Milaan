/** English strings (source of truth for keys). */
const en = {
  appName: 'Milaan',
  welcome: {
    tagline: 'Everyone here is real and verified',
    quality: 'Quality over quantity — 5 matches at a time',
    privacy: 'Your data is protected. Your ID is never shared with matches.',
    getStarted: 'Get started',
  },
  auth: {
    signInTitle: 'Enter your phone number',
    signInSubtitle: 'We’ll send a one-time code to verify it’s you.',
    continue: 'Continue',
    otpTitle: 'Enter the code',
    verify: 'Verify',
  },
  onboarding: {
    stepOf: 'Step {{current}} of {{total}}',
    identityTitle: 'Verify your identity',
    identityBody:
      'A quick, consented ID check via DigiLocker keeps fake profiles out. We only keep a masked reference — never your full Aadhaar or ID image.',
    livenessTitle: 'Take a live selfie',
    livenessBody: 'A quick liveness check confirms it’s really you. Photos are discarded after matching.',
    verifying: 'Verifying you…',
    photosTitle: 'Add your photos',
    photosBody: 'Each photo is checked against your verified selfie, then approved.',
    profileTitle: 'Set up your profile',
    finish: 'Finish',
    verifiedTitle: 'You’re verified ✓',
    verifiedBody: 'Welcome to Milaan. Your deck is ready.',
    startSwiping: 'Start swiping',
  },
  tabs: { swipe: 'Discover', matches: 'Matches', profile: 'Profile' },
  swipe: { title: 'Discover', slots: '{{count}}/{{max}} active matches' },
  matches: { title: 'Your matches', empty: 'No matches yet — keep swiping!' },
  chat: { title: 'Chat' },
  profile: { title: 'Profile', signOut: 'Sign out' },
} as const;

export default en;
