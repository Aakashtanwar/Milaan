import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en';
import hi from './locales/hi';

/**
 * i18n bootstrap. English + Hindi ship at launch (Spec §10); the structure lets
 * more languages drop in by adding a locale file. Components must never hardcode
 * user-facing strings — always go through t().
 */
export const defaultNS = 'common';

void i18n.use(initReactI18next).init({
  resources: { en: { common: en }, hi: { common: hi } },
  lng: 'en',
  fallbackLng: 'en',
  defaultNS,
  interpolation: { escapeValue: false },
});

export default i18n;
