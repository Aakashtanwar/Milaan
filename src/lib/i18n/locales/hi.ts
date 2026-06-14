/** Hindi strings. Mirrors the English key structure (Spec §10). */
const hi = {
  appName: 'मिलान',
  welcome: {
    eyebrow: 'सत्यापित डेटिंग · भारत',
    heroTitle: 'असली लोग।\nसच्चे रिश्ते।',
    tagline: 'हर कोई आईडी-सत्यापित है',
    quality: 'एक बार में पाँच मैच',
    privacy: 'आपकी आईडी कभी साझा नहीं होती',
    getStarted: 'शुरू करें',
    haveAccount: 'मेरा पहले से खाता है',
  },
  auth: {
    signInTitle: 'अपना फ़ोन नंबर दर्ज करें',
    signInSubtitle: 'पहचान सत्यापित करने के लिए हम एक वन-टाइम कोड भेजेंगे।',
    continue: 'आगे बढ़ें',
    otpTitle: 'कोड दर्ज करें',
    verify: 'सत्यापित करें',
  },
  onboarding: {
    stepOf: 'चरण {{current}} / {{total}}',
    identityTitle: 'अपनी पहचान सत्यापित करें',
    identityBody:
      'डिजीलॉकर के ज़रिए सहमति-आधारित त्वरित आईडी जाँच नकली प्रोफ़ाइल को दूर रखती है। हम केवल एक मास्क किया हुआ संदर्भ रखते हैं — कभी आपका पूरा आधार या आईडी छवि नहीं।',
    livenessTitle: 'एक लाइव सेल्फ़ी लें',
    livenessBody: 'एक त्वरित लाइवनेस जाँच पुष्टि करती है कि यह सचमुच आप हैं। मिलान के बाद तस्वीरें हटा दी जाती हैं।',
    verifying: 'आपको सत्यापित किया जा रहा है…',
    photosTitle: 'अपनी तस्वीरें जोड़ें',
    photosBody: 'हर तस्वीर आपकी सत्यापित सेल्फ़ी से मिलाई जाती है, फिर स्वीकृत की जाती है।',
    profileTitle: 'अपनी प्रोफ़ाइल बनाएँ',
    finish: 'पूरा करें',
    verifiedTitle: 'आप सत्यापित हैं ✓',
    verifiedBody: 'मिलान में आपका स्वागत है। आपका डेक तैयार है।',
    startSwiping: 'स्वाइप करना शुरू करें',
  },
  tabs: { swipe: 'खोजें', matches: 'मैच', profile: 'प्रोफ़ाइल' },
  swipe: { title: 'खोजें', slots: '{{count}}/{{max}} सक्रिय मैच' },
  matches: { title: 'आपके मैच', empty: 'अभी कोई मैच नहीं — स्वाइप करते रहें!' },
  chat: { title: 'चैट' },
  profile: { title: 'प्रोफ़ाइल', signOut: 'साइन आउट' },
} as const;

export default hi;
